from fastapi import FastAPI, File, UploadFile, HTTPException
from pathlib import Path
import sqlite3
import os
from rag import get_images_using_llm, viton_model
from recommendation import get_top_products
from typing import List
from fastapi.middleware.cors import CORSMiddleware
import asyncio
import base64


app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["Authorization", "Content-Type"],
)

UPLOAD_DIR = "./back/backend/uploaded_user_images"
SQLITE_DB_PATH = "./back/backend/sqlite_database/myntra.db"
Path(UPLOAD_DIR).mkdir(parents=True, exist_ok=True)

user_preferences = {"positive": {}, "negative": {}}
visited_items = set()

@app.post("/get_images")
async def get_images(search: dict):
    query = search["query"]
    print(query)
    images, categories = get_images_using_llm(query)
    image_1 = images[0]
    print(image_1)
    category_1= categories[0]
    print(category_1)
    
    final_image = await viton_model(image_1, category_1) # along with these parameters, we can also pass the user image
    
    try:
        image_2 = images[1]
        category_2 = categories[1]
        final_image = await viton_model(image_2, category_2, final_image)
        
    except:
        pass
    
    return {"images": f"{final_image}"}
# C:\Users\shrey\Desktop\college\myntra\Myntra-CoDivas\back\backend\output\6814_extracted.png
async def get_fitted_images(images):
    tasks = []
    for image in images:
        if image["main_category"] == "Top Wear":
            print(image['extract_images'])
            image_path = os.path.join("back", "backend", "output", image['extract_images'])
            tasks.append(viton_model(image_path, "Upper-body"))
        elif image["main_category"] == "Bottom Wear":
            print(image['extract_images'])
            image_path = os.path.join("back", "backend", "output", image['extract_images'])
            tasks.append(viton_model(image_path, "Lower-body"))
        elif image["main_category"] == "Dress (Full Length)":
            print(image['extract_images'])
            image_path = os.path.join("back", "backend", "output", image['extract_images'])
            tasks.append(viton_model(image_path, "Dress"))
                
    results = await asyncio.gather(*tasks)
    
    encoded_images = [base64.b64encode(image).decode('utf-8') for image in results]
    return {"images": encoded_images}

@app.post("/get_recommendations")
async def get_recommendations(data: dict):
    main_category = data["main_category"]
    target_audience = data["target_audience"]

    if main_category == "Top Wear":
        recommended_category = "Bottom Wear"
        
    elif main_category == "Bottom Wear":
        recommended_category = "Top Wear"
        
    elif main_category == "Dress (Full Length)":
        recommended_category = "Dress (Full Length)"
        
    trendy_products = get_top_products(recommended_category, target_audience)
    
    seasonal_top_products = trendy_products["seasonal_top_products"][0:3]
    fashion_trend_products = trendy_products["fashion_trend_products"][0:3]
    
    # Filter out products that have been visited
    filtered_products = [product for product in fashion_trend_products if "img" in product]
    
    # Update visited items
    visited_items.update([product["img"] for product in filtered_products])
    
    def adjust_weights():
        weights = {}
        for subcat, count in user_preferences["positive"].items():
            weights[subcat] = weights.get(subcat, 1) + count  # Increase weight for positive feedback
        
        for subcat, count in user_preferences["negative"].items():
            weights[subcat] = weights.get(subcat, 1) - count  # Decrease weight for negative feedback
        
        # Ensure no negative weights
        for subcat in weights:
            if weights[subcat] < 0:
                weights[subcat] = 0

        return weights
    # Adjust weights based on feedback
    weights = adjust_weights()
    
    # Apply weights to filter and sort the products
    def weighted_sort(product):
        subcat = product.get("subcategory", "")
        return weights.get(subcat, 1)
    
    # Sort and slice the lists
    # seasonal_top_products = sorted(seasonal_top_products, key=weighted_sort, reverse=True)[0]
    fashion_trend_products = sorted(filtered_products, key=weighted_sort, reverse=True)[:3]
    print("fashion: ",len(fashion_trend_products))
    # Verify the data passed to get_fitted_images
    if any(not isinstance(product, dict) for product in fashion_trend_products):
        return {"error": "Invalid data format: Each item in 'fashion_trend_products' should be a dictionary"}
    
    # Get fitted images
    fitted_images = await get_fitted_images(fashion_trend_products)

    return {"fitted_images": fitted_images}


@app.post("/feedback")
async def feedback(positive_feedback: List[str], negative_feedback: List[str]):
    for subcat in positive_feedback:
        user_preferences["positive"][subcat] = user_preferences["positive"].get(subcat, 0) + 1
    
    for subcat in negative_feedback:
        user_preferences["negative"][subcat] = user_preferences["negative"].get(subcat, 0) + 1
    
    return {"message": "Feedback received", "user_preferences": user_preferences}


@app.post("/take_user_image")
async def get_user_image(file: UploadFile = File(...)):
    """Endpoint to upload an image and save it to the local folder"""
    try:
        # Ensure the uploaded file is an image
        if file.content_type not in ["image/jpeg", "image/png", "image/gif"]:
            raise HTTPException(status_code=400, detail="Unsupported file type.")

        # Define the path where the image will be saved
        image_path = os.path.join(UPLOAD_DIR, file.filename)

        # Write the uploaded file to the specified path
        with open(image_path, "wb") as buffer:
            buffer.write(await file.read())

        return {"filename": file.filename, "path": image_path}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error uploading image: {str(e)}")


@app.get("/get_myntra_data")
def get_myntra_data():
    try:
        conn = sqlite3.connect(SQLITE_DB_PATH)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM products")
        rows = cursor.fetchall()
        conn.close()

        # Convert rows to list of dicts
        data = [dict(row) for row in rows[:30]]
        return data

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching data: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)