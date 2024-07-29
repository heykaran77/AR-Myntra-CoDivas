from fastapi import FastAPI, File, UploadFile, HTTPException
from pathlib import Path
import sqlite3
import os
from rag import get_images_using_llm, viton_api
from recommendation import get_top_products
from fastapi.middleware.cors import CORSMiddleware
import asyncio


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

UPLOAD_DIR = "./backend/uploaded_user_images"
Path(UPLOAD_DIR).mkdir(parents=True, exist_ok=True)

@app.post("/get_images")
def get_images(search: dict):
    query = search["query"]
    print(query)
    images, categories = get_images_using_llm(query)
    image_1 = images[0]
    print(image_1)
    category_1= categories[0]
    print(category_1)
    
    final_image = viton_api(image_1, category_1) # along with these parameters, we can also pass the user image
    
    try:
        image_2 = images[1]
        category_2 = categories[1]
        final_image = viton_api(image_2, category_2, final_image)
        
    except:
        pass
    
    return {"images": f"{final_image}"}


@app.post("/get_recommendations")
async def get_recommendations(data: dict):
    name = data["name"]
    product_id = data["product_id"]
    main_category = data["main_category"]
    subcategory = data["subcategory"]
    target_audience = data["target_audience"]

    if main_category == "Top Wear":
        recommended_category = "Bottom Wear"
        
    elif main_category == "Bottom Wear":
        recommended_category = "Top Wear"
        
    elif main_category == "Dress (Full Length)":
        recommended_category = "Dress (Full Length)"
        
    trendy_products = get_top_products(recommended_category, target_audience)
    
    seasonal_top_product = trendy_products["seasonal_top_products"][0]
    fashion_trend_product = trendy_products["fashion_trend_products"][0]
    
    tasks = []

    if seasonal_top_product["main_category"] == "Top Wear":
        tasks.append(asyncio.to_thread(viton_api, seasonal_top_product["img"], "Upper-body"))
    elif seasonal_top_product["main_category"] == "Bottom Wear":
        tasks.append(asyncio.to_thread(viton_api, seasonal_top_product["img"], "Lower-body"))
    elif seasonal_top_product["main_category"] == "Dress (Full Length)":
        tasks.append(asyncio.to_thread(viton_api, seasonal_top_product["img"], "Dress"))
        
    if fashion_trend_product["main_category"] == "Top Wear":
        tasks.append(asyncio.to_thread(viton_api, fashion_trend_product["img"], "Upper-body"))
    elif fashion_trend_product["main_category"] == "Bottom Wear":
        tasks.append(asyncio.to_thread(viton_api, fashion_trend_product["img"], "Lower-body"))
    elif fashion_trend_product["main_category"] == "Dress (Full Length)":
        tasks.append(asyncio.to_thread(viton_api, fashion_trend_product["img"], "Dress"))
    
    results = await asyncio.gather(*tasks)
    
    fitted_seasonal_top_product, fitted_fashion_trend_product = results

    trendy_products["seasonal_top_products"][0]["fitted_img"] = fitted_seasonal_top_product
    trendy_products["fashion_trend_products"][0]["fitted_img"] = fitted_fashion_trend_product
    
    return trendy_products


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
        conn = sqlite3.connect("./backend/sqlite_database/myntra.db")
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