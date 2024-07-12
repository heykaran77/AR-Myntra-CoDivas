import React from 'react'
import { Box } from '@mui/system';
import { AppBar } from '@mui/material';

const Main = () => {
  return (
    <Box>
        <Box sx={{ flexGrow: 1 }}>
            <AppBar  className='bg-blue-100 h-14' sx={{backgroundColor:'rgb(219 234 254 / var(--tw-bg-opacity))'}}>               
            </AppBar>
        </Box>
        <Box sx={{display:'flex',flexDirection:'row'}}>
            <Box className='bg-blue-100' sx={{width:'20vw',minHeight:'calc(100vh - 3.5rem)'}}>
                
            </Box>
            <Box className='min-h-full'>

            </Box>

        </Box>
    </Box>
  )
}

export default Main
