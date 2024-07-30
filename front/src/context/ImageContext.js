import React, { createContext, useState } from 'react';

export const ImageContext = createContext();

export const ImageProvider = ({ children }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [responseImages, setResponseImages] = useState([
    '/1st.jpeg',
    '/2nd.jpeg',
    '/3rd.jpeg',
    '/4th.jpeg',
    '/5th.jpeg',
    
  ]);
  
  const [image,uploadImage] = useState(null);
  const [file,setFile] = useState(null);
  const [data,setData] = useState([
    // {
    //   id:1,
    //   brand: "Brand A",
    //   title: "Product A",
    //   price: 1000,
    //   off_price: 1200,
    //   discount: 20,
    //   images: { image1: "https://via.placeholder.com/150" },
    //   sizes: ["S", "M", "L"],
    //   mouse: false
    // },
    // {
    //   id: 2,
    //   brand: "Brand B",
    //   title: "Product B",
    //   price: 1500,
    //   off_price: 1800,
    //   discount: 15,
    //   images: { image1: "https://via.placeholder.com/150" },
    //   sizes: ["M", "L"],
    //   mouse: false
    // },
    // Add more sample data as needed
  ]);


  return (
    <ImageContext.Provider value={{ selectedImage, setSelectedImage, responseImages, setResponseImages,image,uploadImage , file,setFile,data,setData}}>
      {children}
    </ImageContext.Provider>
  );
};
