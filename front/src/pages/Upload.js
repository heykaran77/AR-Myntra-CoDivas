import { Button } from '@mui/base';
import { Grid, Paper, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React, { useState } from 'react';
import { FileUploader } from "react-drag-drop-files";
import './Upload.css';

const fileTypes = ["JPG", "PNG"];

const Upload = () => {
    const [file, setFile] = useState(null);
    const [image, setImage] = useState(null);

    const handleChange = (file) => {
        setFile(file);

        const reader = new FileReader();
        reader.onload = (e) => {
            setImage(e.target.result);
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = () => {
        console.log('Submitting the file:', file);
        const formData = new FormData();
        formData.append('file', file);
        
        
    };

    return (
        <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} className='bg-blue-100 min-h-screen'>
            <Paper elevation={3} style={{ width: '50vw', padding: '2em', borderRadius: '2em', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                <FileUploader handleChange={handleChange} name="file" types={fileTypes} multiple={false}>
                    <Box>
                        {file ? (
                            <Box style={{ width: 'calc(50vw - 4em)', height: 'calc(50vh - 4em)', outline: '2px dashed gray', borderRadius: '2em', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                {image && <img src={image} alt="Preview" style={{ marginTop: 10,maxHeight: 300 }} />}
                            </Box>
                        ) : (
                            <Box style={{ width: 'calc(50vw - 4em)', height: 'calc(50vh - 4em)', outline: '2px dashed gray', borderRadius: '2em', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="rgb(30,144,255)" className="size-20">
                                    <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z" clipRule="evenodd" />
                                </svg>
                                <Typography variant='h4' sx={{ fontWeight: 'bold', marginTop: '0.5em' }}>
                                    Drop your image here, or <span style={{ color: 'rgb(30,144,255)' }}>Browse</span>
                                </Typography>
                                <Typography className='text-gray-400' sx={{ fontSize: '1em', marginTop: '1em' }}>
                                    Supports JPEG, PNG
                                </Typography>
                            </Box>
                        )}
                    </Box>
                </FileUploader>
                {file && (
                    <Button className='upload' onClick={handleSubmit}>
                        Next
                    </Button>
                )}
            </Paper>
        </Box>
    );
};

export default Upload;
