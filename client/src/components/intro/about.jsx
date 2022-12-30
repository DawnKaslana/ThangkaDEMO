import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ScienceRoundedIcon from '@mui/icons-material/ScienceRounded';
import EmojiObjectsOutlinedIcon from '@mui/icons-material/EmojiObjectsOutlined';

export function About() {
    return( 
    <Box margin='10'
        display='flex'
        flexDirection='column'
        justifyContent='center'
        alignItems='center'>
        <Typography variant='h5' color='darkred'>ABOUT</Typography>
        <Typography variant='h2'>More About Me</Typography>
        <Typography variant='h6' display='flex' alignItems='center'>現居四川省成都市的四川大學人工智能系研究生<ScienceRoundedIcon/>Tian Yi</Typography>
        <Typography variant='h6' display='flex' alignItems='center'>喜歡學習但是更喜歡自己建立想做的東西<EmojiObjectsOutlinedIcon/></Typography>
        <Divider variant="middle" sx={{margin:5, width: '50%'}}/>
    </Box>
    )
}