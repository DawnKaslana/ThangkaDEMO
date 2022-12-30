import React from 'react';
import Box from '@mui/material/Box';
import { ResponsiveAppBar } from 'components';
import { Visual } from 'components';
import { About } from 'components';
import { ProjectCard } from 'components';
import { Test } from 'components';

import { useState, useEffect } from 'react';
import axios from 'axios';

//let api_url = 'http://localhost:3001';
export function Home() {
    // Connect Mysql Test
    // useEffect(() => {
      // axios.get(api_url+"/")
      // .then((res) => {
      //   console.log(res.data)
      // })
    // });
  
    return (
      <Box>
        <ResponsiveAppBar />
        <Visual />
        <About />
        <ProjectCard />
        <Test/>
      </Box>
    );
}