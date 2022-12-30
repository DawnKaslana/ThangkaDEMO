import React, { useState, useEffect } from 'react';
import introBg from '../../images/bg.jpeg'
import Box from '@mui/material/Box';

export function Visual() {
    return( 
    <Box>
        <img src={introBg} alt="introBg" style={{width: '100%'}}/>
    </Box>
    )
}