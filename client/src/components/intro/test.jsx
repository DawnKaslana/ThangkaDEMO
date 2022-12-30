import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import axios from "axios";

import UploadIcon from '@mui/icons-material/Upload';

import defaultImage from '../../images/defaultImage.jpeg'

let api_url = 'http://localhost:3001';
let api_url_python = 'http://localhost:4000';

axios.defaults.xsrfCookieName = 'csrftoken';
// 名稱請與儲存在 cookies 相同，axios 預設是 'XSRF-TOKEN'
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
// 這一個主要是請求時，會帶在 header 的名稱，建議與後端溝通，有些後端接收是接收 XSRF-TOKEN
//axios 預設是 'X-XSRF-TOKEN'
axios.defaults.withCredentials = true

export function Test() {
    const [selectedFile, setSelectFile] = useState(null);
    const inputFileRef = useRef();
    const [imageSrc, setImageSrc] = useState(defaultImage);
    const [result, setResult] = useState('');

    const selectFileHandler = (event) => {
        setSelectFile(event.target.files[0]);
        preview(event);
    };

    const handleOnClickUpload = () => {
        inputFileRef.current.click();
    };

    const preview = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.addEventListener("load", function () {
        // convert image file to base64 string
        setImageSrc(reader.result)
        }, false);

        if (file) {
        reader.readAsDataURL(file);
        }
    };

    const uploadHandler = () => {
        if (selectedFile) {
        const formData = new FormData();
        formData.append('image', selectedFile);

        axios.post(api_url_python+'/upload/', formData )
        .then(res => {
            setResult(res.data.msg);
        })
        } else {
            alert('沒有文件')
        }
    }
    
    const callPython = () => {
        axios.get(api_url_python+'/test/')
        .then((res) => {
          console.log(res.data)
        })
    }

    return (
        <Box display='flex' alignItems='center' flexDirection='column' sx={{m:5}}>
            <Typography variant='h5' color='darkred'>TEST</Typography>
            <Button variant="contained" onClick={callPython} sx={{m:2}}>TEST</Button>
            <Box sx={{mb:2}} display='flex' justifyContent='center' flexDirection='column'>
                <img src={imageSrc} width='300px'/>
                <Typography variant='h5' color='darkred' align='center'>Output:{result}</Typography>
            </Box>
            <Box>
            <input style={{ display: 'none' }}
                ref={inputFileRef}
                type="file" accept="image/*"
                onChange={selectFileHandler}/>
                <Button variant="contained" onClick={handleOnClickUpload} sx={{mr:2}}>pick image</Button>
                <Button variant="contained" startIcon={<UploadIcon />} onClick={uploadHandler} >predict</Button>
            </Box>        
        </Box>
    )
}