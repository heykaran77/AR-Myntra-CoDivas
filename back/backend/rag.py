import pandas as pd
import chromadb
import chromadb.utils.embedding_functions as embedding_functions
from langchain_google_genai import ChatGoogleGenerativeAI
from gradio_client import Client, handle_file
import aiohttp
import base64
import os
from dotenv import load_dotenv

load_dotenv()

os.environ["GOOGLE_API_KEY"] = os.environ["GEMINI_API_KEY"]

llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash")

CHROMADB_PATH = "./back/backend/chromadb_database"

chromadb_client = chromadb.PersistentClient(path=CHROMADB_PATH)
embedding_function = embedding_functions.SentenceTransformerEmbeddingFunction(model_name="thenlper/gte-base")

collection = chromadb_client.get_or_create_collection(name="myntra_data", embedding_function=embedding_function) # If not specified, by default uses the embedding function "all-MiniLM-L6-v2"
    

def get_data_from_db(clothing_item):
    result = collection.query(query_texts=clothing_item, n_results=1, include=["documents", "metadatas"])
    
    return {
        "clothing_item_found": result["documents"],
        "image": result["metadatas"][0][0]["img"],
        "main_category": result["metadatas"][0][0]["main_category"]
    }


def get_images_using_llm(query):
    
    prompt = f"""
    You are a clothing store helper bot. You have to figure out what clothing items the user wants to wear. The user has said: "{query}". Please output the clothing items that the user wants to wear in the following format:
    "item1, item2, item3, ..."
    """
    
    response = llm.invoke(prompt)
    final_response = response.content.split(" \n")
    items = final_response[0].split(", ")
    
    print(items)
    print(response.content)
    
    images = []
    categories = []
    for item in items:
        result = get_data_from_db(item)
        images.append(result["image"])
        category = result["main_category"]
        
        if category == "Top Wear":
            category = "Upper-body"
        elif category == "Bottom Wear":
            category = "Lower-body"
        elif category == "Dress (Full Length)":
            category = "Dress"
        else:
            category = None
        
        categories.append(category)
        
    # print(images)
    return images, categories


def ootdiffusion_model(garment_img, clothing_category, person_img = 'https://levihsu-ootdiffusion.hf.space/file=/tmp/gradio/aa9673ab8fa122b9c5cdccf326e5f6fc244bc89b/model_8.png'):
    client = Client("levihsu/OOTDiffusion")
    
    result = client.predict(
        vton_img=handle_file(person_img),
        garm_img=handle_file(garment_img),
        category=clothing_category,
        n_samples=1,
        n_steps=20,
        image_scale=2,
        seed=-1,
        api_name="/process_dc"
    )
    
    final_image = result[0]["image"]
    print(final_image)
    
    return final_image


async def to_b64(img_url: str) -> str:
    async with aiohttp.ClientSession() as session:
        async with session.get(img_url) as response:
            data = await response.read()
            return base64.b64encode(data).decode('utf-8')

def local_image_to_base64(image_path: str) -> str:
    with open(image_path, "rb") as image_file:
        base64_encoded = base64.b64encode(image_file.read()).decode('utf-8')
    return base64_encoded


async def segmind_diffusion(cloth_image_url: str, model_image_url: str = 'https://levihsu-ootdiffusion.hf.space/file=/tmp/gradio/aa9673ab8fa122b9c5cdccf326e5f6fc244bc89b/model_8.png', cloth_image_path: str = None, model_image_path: str = None, clothing_category: str = None):
    api_key = os.getenv("SEGMIND_API_KEY")
    url = "https://api.segmind.com/v1/try-on-diffusion"

    # Get model image base64
    model_image_b64 = await to_b64(model_image_url) if model_image_url else local_image_to_base64(model_image_path)

    # Get cloth image base64
    cloth_image_b64 = await to_b64(cloth_image_url) if cloth_image_url else local_image_to_base64(cloth_image_path)

    data = {
        "model_image": model_image_b64,
        "cloth_image": cloth_image_b64,
        "category": clothing_category,
        "num_inference_steps": 35,
        "guidance_scale": 2,
        "seed": 12467,
        "base64": False
    }

    headers = {
        'x-api-key': api_key,
        'Content-Type': 'application/json'
    }

    async with aiohttp.ClientSession() as session:
        async with session.post(url, json=data, headers=headers) as response:
            if response.status == 200:
                image_data = await response.read()
                print(image_data)
                print("###################")
                img_path = f"./back/Virtual Try-On/{cloth_image_url.split('/')[-1]}.png"
                with open(img_path, "wb") as image_file:
                    image_file.write(image_data)
                return image_data
            else:
                error_message = await response.text()
                return {"error": response.status, "message": error_message}


async def viton_model(cloth_image: str, cloth_category: str, person_image: str = 'https://levihsu-ootdiffusion.hf.space/file=/tmp/gradio/aa9673ab8fa122b9c5cdccf326e5f6fc244bc89b/model_8.png', cloth_image_path: str = None, person_image_path: str = None, model: str = "1"):
    
    if model == "1":
        result = ootdiffusion_model(cloth_image, cloth_category, person_image)
    elif model == "2":
        if cloth_category == "Upper-body":
            cloth_category = "Upper body"
        elif cloth_category == "Lower-body":
            cloth_category = "Lower body"
        print(cloth_category)
        result = await segmind_diffusion(cloth_image_url=cloth_image, model_image_url=person_image, clothing_category=cloth_category, cloth_image_path=cloth_image_path, model_image_path=person_image_path)
    
    return result