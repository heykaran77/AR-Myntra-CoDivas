import React, { createContext, useState } from 'react';

export const ImageContext = createContext();

export const ImageProvider = ({ children }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [responseImages, setResponseImages] = useState([]);
  const [image,uploadImage] = useState(null);
  const [file,setFile] = useState(null);
  const [data,setData] = useState([]);

  return (
    <ImageContext.Provider value={{ selectedImage, setSelectedImage, responseImages, setResponseImages,image,uploadImage , file,setFile,data,setData}}>
      {children}
    </ImageContext.Provider>
  );
};
