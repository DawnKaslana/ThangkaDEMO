import React, { useState, useEffect } from 'react';
import axios from "axios";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { theme } from '../css/theme';

import normal from '../images/baymax/big-baymax-normal.png'
import sad from '../images/baymax/big-baymax-sad.png'
import angry from '../images/baymax/big-baymax-angry.png'
import happy from '../images/baymax/big-baymax-happy.png'
import drunk from '../images/baymax/big-baymax-drunk.png'
import satisfy from '../images/baymax/big-baymax-satisfy.png'

let api_url = 'http://localhost:3001';
let api_url_python = 'http://localhost:4000';

axios.defaults.xsrfCookieName = 'csrftoken';
// 名稱請與儲存在 cookies 相同，axios 預設是 'XSRF-TOKEN'
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
// 這一個主要是請求時，會帶在 header 的名稱，建議與後端溝通，有些後端接收是接收 XSRF-TOKEN
//axios 預設是 'X-XSRF-TOKEN'
axios.defaults.withCredentials = true

export function Baymax() {
    const [input, setInput] = useState('');
    const [result, setResult] = useState('');
    const [exp, setExp] = useState(normal);

    const class_dict = {'sadness':sad , 'joy': happy, 'fear': drunk, 'anger':angry, 'love':satisfy, 'surprise':normal}

    const callPython = () => {
        if(input){
            const formData = new FormData();
            formData.append('text', input);

            axios.post(api_url_python+'/text_emotion/', formData)
            .then((res) => {
                setResult(res.data.msg)
                setExp(class_dict[res.data.msg])
            })
        }
    }

    return( 
    <Box
    sx={{
        display: 'flex',
        justifyContent: 'center',
        flexDirection:'column',
        height:'100vh'
    }}>
        <Typography variant='h2' color='darkred' sx={{position: 'absolute', top: '10%'}}>{result}</Typography>
        <img src={exp} position="relative"/>
        
        <Box display='flex'>
            <TextField fullWidth
            input={input}
            onChange={(e)=>setInput(e.target.value)}
            variant="outlined"
            size='small'
            focused
            />
            <Button variant="contained" onClick={callPython}>classfication</Button>
        </Box>
    </Box>
    )
}