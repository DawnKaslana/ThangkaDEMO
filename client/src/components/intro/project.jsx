import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { Router, Routes ,Route, Link } from 'react-router-dom';

import imgP1 from '../../images/baymax/home.png'
import imgP2 from '../../images/cards/002.jpeg'
import imgP3 from '../../images/cards/003.jpeg'

const projectData = [{title:'Baymax', intro:'00001', image:imgP1, link:'/baymax'},
  {title:'002', intro:'00001', image:imgP2, link: '/covid19'},
  {title:'003', intro:'00001', image:imgP3}];

export function ProjectCard() {
    return (
      <Container sx={{mb:5}}>
      <Typography variant="h5" color='darkred' align='center' sx={{mb:2}}>PROJECT</Typography>
      <Box display='flex' justifyContent='center'>
      {projectData.map((data, i)=>(
        <Card sx={{ minWidth: '30vw', mr:1, ml:1 }} key={i}>
          <CardMedia
            component="img"
            height="140"
            image={data.image}
            alt="project001"
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {data.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {data.intro}
            </Typography>
          </CardContent>
          <CardActions>
            <Link to={data.link?data.link: '/'}><Button size="small">Learn More</Button></Link>
          </CardActions>
        </Card>
      ))}
    </Box>
    </Container>
    );
  }