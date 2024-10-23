// Basic
import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useWindowSize } from "@uidotdev/usehooks";

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
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TabContext from '@material-ui/lab/TabContext';
import TabList from '@material-ui/lab/TabList';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

//api
import { server } from '../api.js'

export default function LabelDrawer({open, setLabelOpen}) {
  const size = useWindowSize();
  const [classTab, setClassTab] = useState('1');
  const [labelList, setLabelList] = useState([]);
  const [classList, setClassList] = useState(['1111']);

  useEffect(() => {
    server({url:'/getClassList'}).then((res) => {
      setClassList(res.data)
    })
    server({url:'/getLabelList'}).then((res) => {
      console.log(res.data)
      setLabelList(res.data)
    })
  }, [])

  const handleChange = (event, newValue) => {
    setClassTab(newValue.toString());
  };


  return (
        <React.Fragment>
          <Drawer anchor={'right'} open={open} onClose={()=>setLabelOpen(false)}>
            <Box width="74vw" height="100vh"
              sx={{ 
                backgroundColor:'#212121',
                width:`${size.width-480}px`,
                }}>
            <TabContext value={classTab? classTab : `1`} >
              <Box sx={{ borderBottom: 1, borderColor: 'purple',color:'black', backgroundColor:'lightpink'}}>
                <TabList onChange={handleChange} aria-label="label class tabs" >
                {classList?.map((item, idx)=>(
                  <Tab key={idx}
                  label={item['value']}
                  value={item['id']? item['id'].toString() : 0}
                  sx={{ fontWeight:'bold' }}/>
                  )
                )}
                </TabList>
              </Box>
            </TabContext>
            
            <TableContainer >
              <Table sx={{ color:'white' }} aria-label="label table">
                <TableBody sx={{ color:'white' }}>
                  {labelList?.map((row, idx) => {
                    return (
                    <TableRow key={idx}>
                      {
                        row.map((item, idx)=>(
                          classTab === item['class'] ?
                          <TableCell key={item['id']} align="center" sx={{ color:'white' }}>{item['value']}
                          </TableCell> : null
                        ))
                      }
                    </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </TableContainer>

            </Box>
          </Drawer>
        </React.Fragment>
  );
}