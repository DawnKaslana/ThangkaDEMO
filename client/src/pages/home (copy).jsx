import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';

import axios from "axios";

import UploadIcon from '@mui/icons-material/Upload';

import defaultImage from '../images/defaultImage.jpeg'

let api_url = 'http://localhost:3001';
let api_url_python = 'http://localhost:4000';

axios.defaults.xsrfCookieName = 'csrftoken';
// 名稱請與儲存在 cookies 相同，axios 預設是 'XSRF-TOKEN'
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
// 這一個主要是請求時，會帶在 header 的名稱，建議與後端溝通，有些後端接收是接收 XSRF-TOKEN
//axios 預設是 'X-XSRF-TOKEN'
axios.defaults.withCredentials = true

export function Home() {
    const [selectedImg, setSelectImg] = useState(null);
    const [selectedMask, setSelectedMask] = useState(null);
    const [prompt, setPrompt] = useState(null);
    const [steps, setSteps] = useState(20);

    const inputImgRef = useRef();
    const inputMaskRef = useRef();

    const [imageSrc, setImageSrc] = useState(defaultImage);
    const [maskSrc, setMaskSrc] = useState(defaultImage);

    const [result, setResult] = useState('');
    const [outputSrc, setOutputSrc] = useState(null);

    const [inpaintState, setInpaintState] = useState(false)

    const selectImgHandler = (event) => {
        setSelectImg(event.target.files[0]);
        preview(event, "img");
    };

    const selectMaskHandler = (event) => {
      setSelectedMask(event.target.files[0]);
      preview(event, "mask");
    };


    const handleOnClickImgUpload = () => {
        inputImgRef.current.click();
    };
    const handleOnClickMaskUpload = () => {
      inputMaskRef.current.click();
  };

    const preview = (event, type) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.addEventListener("load", function () {
        // convert image file to base64 string
        if (type==="img"){setImageSrc(reader.result)}
        else {setMaskSrc(reader.result)}
        }, false);

        if (file) {
        reader.readAsDataURL(file);
        }
    };

    const uploadHandler = () => {
        const formData = new FormData();
        if (selectedImg && selectedMask) {
        formData.append('image', selectedImg);
        formData.append('mask', selectedMask);
        formData.append('steps', steps); 
        formData.append('type', 'inpaint'); 
        if(prompt) formData.append('prompt', prompt);
        // setInpaintState(!inpaintState)

        axios.post(api_url_python+'/uploadImg/', formData)
        .then(res => {
            setResult(res.data.msg);
            console.log(res.data)
            if (res.data.msg == "inpainted"){
              console.log(selectedImg.name.slice(0,-4)+"_output.png")
              axios.get(api_url_python+'/getImg/', {params: {
                imageName:selectedImg.name.slice(0,-4)+"_output.png"
            }}).then(res => {
              console.log(res)
              setOutputSrc(res.data.img)
              setInpaintState(false)
            })
        } else {
            alert('未上傳完整文件')
            setInpaintState(false)
        }})
      }
    }
      

    const callPython = () => {
      axios.get(api_url_python+'/test/')
      .then((res) => {
        console.log(res.data)
      })
  }
    
    return (

        <Box display='flex' flexDirection='column' sx={{m:5}}>
          <Box display='flex' sx={{mb:2}}>
            <TextField
              label="prompt"
              placeholder=""
              multiline
              minRows={4}
              fullWidth
              onChange={(e)=>setPrompt(e.target.value)}
            />
            <Button variant="contained" onClick={callPython} sx={{m:2}}>TEST</Button>
            <Button variant="contained" onClick={uploadHandler} disabled={inpaintState} sx={{ml:2}}>Generate</Button>
          </Box>
          <TextField
              label="steps"
              placeholder="20"
              fullWidth
              onChange={(e)=>setSteps(e.target.value)}
              sx={{mb:1}} 
            />
            <Box sx={{mb:2}} display='flex' flexDirection='row'>
              <Box display='flex' justifyContent='center' flexDirection='column'>
                <Box sx={{mb:2}} ><img src={imageSrc} width='512px' height="512px"/></Box>
                <Box ><img src={maskSrc} width='512px' height="512px"/></Box>
              </Box>
              <Box display='flex' justifyContent='center' alignItems='center' sx={{ml:2}} width="100%">
                <Box sx={{border:"black 5px solid", display:'flex', alignItems:'center'}} width="100%" height="100%">
                  <img src={"data:image/png;base64,"+outputSrc}
                  style={{flex:1, height: '100%'}}/>
                </Box>
              </Box>
            </Box>
            <Box>
            <input style={{ display: 'none' }}
                ref={inputImgRef}
                type="file" accept="image/*"
                onChange={selectImgHandler}/>
                <Button variant="contained" startIcon={<UploadIcon />} onClick={handleOnClickImgUpload} sx={{mr:2}}>pick image</Button>
            <input style={{ display: 'none' }}
                ref={inputMaskRef}
                type="file" accept="image/*"
                onChange={selectMaskHandler}/>
                <Button variant="contained" startIcon={<UploadIcon />} onClick={handleOnClickMaskUpload} sx={{mr:2}}>pick mask</Button>
            </Box>        
        </Box>

    )
}