// Basic
import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';

// MUI Component
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import Box from '@mui/material/Box';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@mui/material/Typography';

// MUI Icon
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';


export default function LabelDrawer({open, setLabelOpen}) {

  return (
        <React.Fragment>
          <Drawer anchor={'top'} open={open} onClose={()=>setLabelOpen(false)}>
            <Box sx={{height:'30vh', backgroundColor:'#212121'}}>
                





                
            </Box>
          </Drawer>
        </React.Fragment>
  );
}