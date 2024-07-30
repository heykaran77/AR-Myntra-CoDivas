import { AppBar, Grid, TextField, Typography } from '@mui/material'
import React from 'react'
import { Box } from '@mui/system';
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";

// import { Button } from 'flowbite-react';
import { Button, Card } from 'flowbite-react';
import { MainDiv, CardDiv, DescDiv ,CountryDiv , BundlesDiv ,SizeDiv ,ContainerDiv , TopDiv} from "../components/cards/cardItems";
import {
  DetailsMainDiv,
  ImageContainer,
  Img,
  ImgDiv,
  SubDetailsDiv,
  WishDiv,
  SizesDIv,
  BagDiv,
  RatingDiv,
  TryONDiv
} from "../components/Details/detailStyled2";


import { useState } from 'react';
import { ImageContext } from '../context/ImageContext';
import { useEffect, useContext } from 'react';
import axios from 'axios'
import x from './rag.jpeg'
import SearchIcon from "@mui/icons-material/Search";

const linkStyle = {
  textDecoration: "none",
  padding: "5px",
  color: "black",
};

const Visualise = () => {
  const { responseImages,setResponseImages } = useContext(ImageContext);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedbackArray, setFeedbackArray] = useState([]);
  const [search,setSearch] = useState(null);
  

  const handleClick = (feedback) => {
    if (currentIndex < responseImages.length) {
      const currentImage = responseImages[currentIndex];
      const newFeedback = `${currentImage} ${feedback}`;
      setFeedbackArray([...feedbackArray, newFeedback]);
      setCurrentIndex(currentIndex + 1);
    }
    else{
        axios.post('http://localhost:8000/submit-feedback', { feedback: feedbackArray })
        .then(response => {
          console.log('Feedback submitted:', response.data);
          setResponseImages(response.data.images); 
          setFeedbackArray([]);
          setCurrentIndex(0);
        })
        .catch(error => {
          console.error('Error submitting feedback:', error);
        });
    }
  };

  const currentImage = responseImages[currentIndex];
  console.log(currentImage)

  const handleSearch = (event) =>
  {
    event.preventDefault();
    axios.post('http://localhost:8000/get_images', { search:search })
        .then(response => {
          console.log('Feedback submitted:', response.data);
          setResponseImages(response.data.images); 
          setFeedbackArray([]);
          setCurrentIndex(0);
        })
        .catch(error => {
          console.error('Error submitting feedback:', error);
        });   

  }

  const handleChange = (e) =>
  {
      setSearch(e.target.value)
  }

  return (
    
    <Grid container className='h-screen'>
      <Grid item xs={12}>
        <AppBar className='bg-blue-100 h-14' sx={{ backgroundColor: '#e7396a' }}>
          <form className="flex items-center max-w-sm mx-auto mt-1 mb-1">
            <div className="relative w-full">
              <input
                type="text"
                id="simple-search"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-4 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Search ..."
                required
                onChange={handleChange}
              />
            </div>
            <button
              type="submit"
              onClick = {handleSearch}
              className="p-2.5 ms-6 text-sm font-medium text-white rounded-lg border-none focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              {/* <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
              </svg>
              <span className="sr-only">Search</span> */}
              <SearchIcon/>
            </button>
          </form>
        </AppBar>
      </Grid>

      <Grid item xs={12}>
        <Grid container className='p-10 mt-14'>
          <Grid item xs={8}>
            <Grid container>
            <Grid item lg={3.5} md={3.5} sm={4} xs={4} className='flex justify-center items-center'>
            <button onClick={() => handleClick('Negative')}>
              <svg className="h-16 w-16 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            </button>
          </Grid>

          <Grid item lg={5} md={5} sm={8} xs={8} className='bg-blue-100 flex justify-center items-center' sx={{ height: '80vh', borderRadius: '1em' }}>
  {currentImage ? (
    <img src={currentImage} alt="Current" className="w-full h-full object-cover" style={{ borderRadius: '1em' }} />
  ) : (
    <p>Loading...</p>
  )}
</Grid>

          <Grid item lg={3.5} md={3.5} sm={4} xs={4} className='flex justify-center items-center'>
            <button onClick={() => handleClick('Positive')}>
              <svg className="h-16 w-16 text-green-500" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" />
                <circle cx="12" cy="12" r="9" />
                <path d="M9 12l2 2l4 -4" />
              </svg>
            </button>
          </Grid>
            </Grid>
          </Grid>
          <Grid item xs={4}>
            <div style={{display:'flex' , alignItems:'center',flexDirection:'column'}}>
              <Typography style={linkStyle}>ITEMS IN THE IMAGE</Typography>
            <div style={{display:'flex' , justifyContent:'center',flexDirection:'row',marginTop:'1em'}}>

              <MainDiv
                  // onMouseEnter={() => {
                  //   handleEnter(ele);
                  // }}
                  // onMouseLeave={() => {
                  //   handleLeave(ele);
                  // }}
                  // onClick={()=>{handleMove(ele)}}
                >
                  <CardDiv >
                    <img
                      // src={`${}`}
                      style={{ width: "100%", height: "100%" }}
                    ></img>
                  </CardDiv>

                    <DescDiv >
                      <div
                        style={{
                          overflow: "hidden",
                          height: "35px",
                          margin: "-10px 8px",
                          textAlign: "left",
                        }}
                      >
                        <p style={{ fontWeight: "bold", fontSize: "12px" }}>
                          {/* {ele.seller} */}
                          road
                        </p>
                      </div>
                      <div
                        style={{
                          overflow: "hidden",
                          height: "32px",
                          margin: "-15px 8px",
                          textAlign: "left",
                        }}
                      >
                        <p
                          style={{
                            textTransform: "capitalize",
                            fontSize: "12px",
                          }}
                        >
                          {/* {ele.name} */}
                          hi
                        </p>
                      </div>



                      <div
                        style={{
                          display: "flex",
                          justifyContent: "left",
                          margin: "auto 8px",
                          gap: "20px",
                          marginBottom:'1em'
                        }}
                      >
                        <p
                          style={{ fontSize: "12px", fontWeight: "bold" }}
                        >
                          {/* {`Rs ${ele.price}`} */}
                          400
                        </p>
                        <p
                          style={{
                            fontSize: "12px",
                            textDecorationLine: "line-through",
                          }}
                        >
                          {/* {ele.off_price ? `Rs ${ele.off_price}` : "NA"} */}
                          500
                        </p>
                        <p style={{ fontSize: "12px", color: "orange" }}>
                          {/* {ele.discount ? `(${ele.discount}% OFF)` : "NA"}
                           */}
                           10
                          
                        </p>
                      </div>
                      <BagDiv
                      
                    >
                      <ShoppingBagIcon />
                      <a>
                      <p>
                        <b>ADD TO CART</b>
                      </p>
                      </a>
                      
                    </BagDiv>

                    </DescDiv>
                  
                </MainDiv>

                <MainDiv
                  // onMouseEnter={() => {
                  //   handleEnter(ele);
                  // }}
                  // onMouseLeave={() => {
                  //   handleLeave(ele);
                  // }}
                  // onClick={()=>{handleMove(ele)}}
                  style={{marginLeft:'3em'}}
                >
                  <CardDiv >
                    <img
                      // src={`${}`}
                      style={{ width: "100%", height: "100%" }}
                    ></img>
                  </CardDiv>

                    <DescDiv >
                      <div
                        style={{
                          overflow: "hidden",
                          height: "35px",
                          margin: "-10px 8px",
                          textAlign: "left",
                        }}
                      >
                        <p style={{ fontWeight: "bold", fontSize: "12px" }}>
                          {/* {ele.seller} */}
                          road
                        </p>
                      </div>
                      <div
                        style={{
                          overflow: "hidden",
                          height: "32px",
                          margin: "-15px 8px",
                          textAlign: "left",
                        }}
                      >
                        <p
                          style={{
                            textTransform: "capitalize",
                            fontSize: "12px",
                          }}
                        >
                          {/* {ele.name} */}
                          hi
                        </p>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          justifyContent: "left",
                          margin: "auto 8px",
                          gap: "20px",
                          marginBottom:'1em'
                        }}
                      >
                        <p
                          style={{ fontSize: "12px", fontWeight: "bold" }}
                        >
                          {/* {`Rs ${ele.price}`} */}
                          400
                        </p>
                        <p
                          style={{
                            fontSize: "12px",
                            textDecorationLine: "line-through",
                          }}
                        >
                          {/* {ele.off_price ? `Rs ${ele.off_price}` : "NA"} */}
                          500
                        </p>
                        <p style={{ fontSize: "12px", color: "orange" }}>
                          {/* {ele.discount ? `(${ele.discount}% OFF)` : "NA"}
                           */}
                           10
                          
                        </p>
                      </div>
                      <BagDiv
                      
                    >
                      <ShoppingBagIcon />
                      <a>
                      <p>
                        <b>ADD TO CART</b>
                      </p>
                      </a>
                      
                    </BagDiv>
                    </DescDiv>
                  
                </MainDiv>
                </div>
            </div>
            
            

          
          </Grid>

        </Grid>
      </Grid>
    </Grid>
  );
};

export default Visualise;



