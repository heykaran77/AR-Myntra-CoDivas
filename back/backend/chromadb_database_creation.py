import pandas as pd
import chromadb
import chromadb.utils.embedding_functions as embedding_functions

chromadb_client = chromadb.PersistentClient(path="./backend/chromadb_database")
embedding_function = embedding_functions.SentenceTransformerEmbeddingFunction(model_name="thenlper/gte-base")

collection = chromadb_client.get_or_create_collection(name="myntra_data", embedding_function=embedding_function) # If not specified, by default uses the embedding function "all-MiniLM-L6-v2"

def add_data_to_db():
    
    def get_data_from_csv():
        df = pd.read_csv("products_final_data.csv")
        
        new_df = df[["name", "main_category", "subcategory", "img"]]
        
        return new_df

    data = get_data_from_csv()
    for index, row in data.iterrows():
        name = row["name"]
        main_category = row["main_category"]
        subcategory = row["subcategory"]
        img = row["img"]
        
        collection.add(
            documents=name,
            metadatas={"main_category": main_category, "subcategory": subcategory, "img": img},
            ids=[str(index)]
        )
        
add_data_to_db()