import React, { useState } from 'react'
import { Box } from '@mui/system';
import { AppBar, Grid, Typography } from '@mui/material';
// import LocationOnIcon from '@mui/icons-material/LocationOn';
import { Button, Card } from 'flowbite-react';
import './Main.css'
import x from './test.jpg'
import Filter from './Filter';
import {useNavigate} from 'react-router-dom'

const Main = () => {
    const [loading,setLoading] = useState(true)
    const navigate = useNavigate()
    const [data,setData] = useState([])
    

    const handleSubmit = () => 
    {
        console.log('hii')
        navigate('/visualise')

    }


  return (
    <Grid container>
        <Grid item xs={12} className='h-10'>
            <AppBar  className='bg-blue-100 h-14' sx={{backgroundColor:'rgb(219 234 254 / var(--tw-bg-opacity))'}}>               
            </AppBar>
        </Grid>
        <Grid item xs={12}>
            <Box display='flex' flexDirection='row'>
                <Box className='border-r-2 border-gray-300 p-3 pt-3' sx={{ width:'20vw', minHeight:'92.75vh', display:'flex', justifyContent:'center' }} >
                    <Filter/>
                    
                </Box>
                <Box display='flex' justifyContent='center' alignItems='center' className='w-full'>
                    
                    {
                        !loading && 
                            <Box>
                            <div class="three-body">
                            <div class="three-body__dot"></div>
                            <div class="three-body__dot"></div>
                            <div class="three-body__dot"></div>
                            </div>
                            </Box>
                        
                    }
                    {
                        loading &&
                        <Grid container spacing={3} sx={{marginTop:'1em', marginRight:'2em'}}>
                            <Grid item xs={12} lg={3} md={3} >
                                                <Card className="w-full ml-10" imgSrc={x}>
                                                <div className="flex items-center justify-between">

                                                    
                                                    
                    <span className="text-xl font-bold text-gray-900 dark:text-white">$599</span>
                    <a
                    href="#"
                    onClick = {handleSubmit}
                    className="rounded-lg bg-cyan-700 px-5 py-2.5 text-center text-xs font-medium text-white hover:bg-cyan-800 focus:outline-none focus:ring-4 focus:ring-cyan-300 dark:bg-cyan-600 dark:hover:bg-cyan-700 dark:focus:ring-cyan-800"
                    style={{
                        backgroundColor: '#02003E'
                    }}
                    >
                    Visualise
                    </a>
                </div>
                                    </Card>
                                </Grid>

                                


                        </Grid>
                    }
                    
                </Box>

            </Box>
        </Grid>
    </Grid>
  )
}

export default Main
