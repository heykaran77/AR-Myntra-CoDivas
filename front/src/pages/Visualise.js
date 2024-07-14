import { AppBar, Grid, TextField } from '@mui/material'
import React from 'react'
import { Box } from '@mui/system';
import { Button } from 'flowbite-react';

import { useState } from 'react';



const Visualise = () => {
    
    const handleClick = () =>
    {
        
        console.log('it works')
    }

  return (
    <Grid container className='h-screen'>
        
        <Grid item xs={12}>
            <AppBar className='bg-blue-100 h-14' sx={{backgroundColor:'rgb(219 234 254 / var(--tw-bg-opacity))'}}>

                <form class="flex items-center max-w-md mx-auto mt-1 mb-1 ">   
                    <div class="relative w-full">
                        <input type="text" id="simple-search"  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 " placeholder="Search ..." required />
                    </div>
                    <button type="submit" class="p-2.5 ms-6 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                        <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                        </svg>
                        <span class="sr-only">Search</span>
                    </button>
                </form>
            </AppBar>
            
        </Grid>

        
        <Grid item xs={12}>
    <Grid container className='p-10 mt-14'>
        {/* Left grid item */}
        <Grid item lg={4.5} md={4.5} sm={4} xs={4} className='flex justify-center items-center'>
            <button onClick={handleClick}>
                
                <svg class="h-16 w-16 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="15" y1="9" x2="9" y2="15" />
                    <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
            </button>
            

        </Grid>

        {/* Middle grid item */}
        <Grid item lg={3} md={3} sm={8} xs={8} className='bg-blue-100 flex justify-center items-center' sx={{height:'80vh', borderRadius:'1em'}}>
            {/* <img src={x}>
            </img> */}
        </Grid>

        {/* Right grid item */}
        <Grid item lg={4.5} md={4.5} sm={4} xs={4} className='flex justify-center items-center'>
            <button>
                <svg class="h-16 w-16 text-green-500" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z"/>
                    <circle cx="12" cy="12" r="9" />
                    <path d="M9 12l2 2l4 -4" />
                </svg>
            </button>
        </Grid>
    </Grid>
</Grid>

    </Grid>
  )
}

export default Visualise

