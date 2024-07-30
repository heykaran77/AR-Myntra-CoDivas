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

  const [intial,setInitial] = useState('')
  const [original,setOriginal] = useState({
    brand:'roadster',name:'hi',price:
    '100',
    discount:1,
    img: '/1st.jpeg'
  }
  )
  const [recommended,setRecommended] = useState([{fitted_img: '/2nd.jpeg',brand:'roadster',name:'hi',price:
    '100',
    discount:1,
    img: '/3rd.jpeg'
  },{fitted_img: '/3rd.jpeg',brand:'roadster',name:'hi',price:
    '100',
    discount:1,
    img: '/4th.jpeg'
  },
  {fitted_img: '/4th.jpeg',brand:'roadster',name:'hi',price:
    '100',
    discount:1,
    img: '/5th.jpeg'
  }])
  const [showNext,setShowNext] = useState(false)
  const [current,setCurrent] = useState('/1st.jpeg')
  const [details,setDetails] = useState([])
  
  const [image,uploadImage] = useState(null);
  const [file,setFile] = useState(null);
  const [data,setData] = useState([]);
  
  


  return (
    <ImageContext.Provider value={{ selectedImage, setSelectedImage, responseImages, setResponseImages,image,uploadImage , file,setFile,data,setData,
      intial,setInitial,original,setOriginal,recommended,setRecommended,showNext,setShowNext,current,setCurrent,details,setDetails
    }}>
      {children}
    </ImageContext.Provider>
  );
};
