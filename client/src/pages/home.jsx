// React and Basic import
import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import axios from "axios";

// React MUI import
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Checkbox from '@mui/material/Checkbox';
import CircularProgress from '@material-ui/core/CircularProgress';
import Container from '@mui/material/Container';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Toolbar from '@mui/material/Toolbar';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

// CSS
import useStyles from '../css/style';
import { darkTheme } from '../css/theme.jsx';

//other func & components
import RViewerJS from 'viewerjs-react'
import defaultImage from '../images/defaultImage.jpeg'
import NavBar from '../components/navBar.jsx';
import SettingDrawer from '../components/settingDrawer.jsx';
import LabelDrawer from '../components/labelDrawer.jsx';

//Icon import
import UploadIcon from '@mui/icons-material/Upload';
import SendIcon from '@mui/icons-material/Send';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import ImageIcon from '@mui/icons-material/Image';
import HideImageIcon from '@mui/icons-material/HideImage';
import MenuIcon from '@mui/icons-material/Menu';
import ClearIcon from '@mui/icons-material/Clear';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

//api
import { server, django, file_url } from '../api.js'


//Main
export function Home() {
  const classes = useStyles();

  // Dialogs
  const [chatDialogs, setChatDialogs] = useState([{ role: 'assistant' }]);
  const helloText = "Hello!這裡是TY的Thangka Inpaint DEMO."

  // params
  const [inputText, setInput] = useState("");
  const [enterPrompt, setEnterPrompt] = useState("");

  useEffect(() => {
  }, [chatDialogs]);

  const handleNewDialog = (args) => {
    setChatDialogs([...chatDialogs, args])
  }

  //Drawer
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [labelDrawerOpen, setLabelDrawerOpen] = useState(false);


  const AIDialog = (item, key) => (
    <Box key={key} display="flex" flexDirection="row" sx={{ mt: 1,p:0 }}>
      <Avatar sx={{ bgcolor: 'purple', width: 56, height: 56, ml: 1, mr: 1 }}>TY</Avatar>
      <Card variant="outlined"
            className={classes.columnCenter}
            sx={{ maxWidth: 360, p:1}}>
          <Typography>{key<1 ? helloText : item.content}</Typography>
      </Card>
      <AlwaysScrollToView />
    </Box>
  )

  const outputDialog = (item, key) => (
    <Box key={key} display="flex" flexDirection="row" sx={{ mt: 1 }}>
      <Avatar sx={{ bgcolor: 'purple', width: 56, height: 56, ml: 1, mr: 1 }}>M</Avatar>
      <Card sx={{ p: 1, mr: 1 }}>
        <Box><RViewerJS ><img src={"data:image/png;base64," + item.src} /></RViewerJS></Box>
        <Typography variant="body2" color="text.secondary">
          模式：{item.generateType}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          生成模型：{item.SDMvalue}
        </Typography>
        {item.prompt ?
          <Typography variant="body2" color="text.secondary">
            prompt：{item.prompt}
          </Typography> : null
        }
      </Card>
    </Box>
  )

  const generatingDialog = (key) => (
    <Box key={key} display="flex" flexDirection="row" sx={{ mt: 1, mb: 1 }}>
      <Avatar sx={{ bgcolor: 'purple', width: 56, height: 56, ml: 1, mr: 1 }}>M</Avatar>
      <Card sx={{ p: 1, mr: 1 }} className={classes.columnCenter}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Generating...
        </Typography>
        <CircularProgress color="secondary" />
      </Card>
    </Box>
  )

  const userDialog = (item, key) => (
    <Box key={key} display="flex" flexDirection="row" justifyContent="right" sx={{ mt: 1, mr: 1 }}>
      <Card variant="outlined"
            className={classes.columnCenter}
            sx={{ maxWidth: 360, p:1, mr:1}}>
          <Typography>{item.content}</Typography>
      </Card>
      <Avatar sx={{ bgcolor: '#296bae', width: 56, height: 56 }}>U</Avatar>
      <AlwaysScrollToView />
    </Box>
  )


  const showDialog = (chatDialogs) => {
    let dialogs = []
    for (let idx in chatDialogs) {
      if (chatDialogs[idx].role === 'assistant') {
        dialogs.push(AIDialog(chatDialogs[idx], idx))
      } else if (chatDialogs[idx].role === 'user') {
        dialogs.push(userDialog(chatDialogs[idx], idx))
      } else if (chatDialogs[idx].type === 'generating') {
        dialogs.push(generatingDialog(idx))
      } else if (chatDialogs[idx].type === 'output') {
        dialogs.push(outputDialog(chatDialogs[idx], idx))
      } 
    }
    return dialogs
  }

  const AlwaysScrollToView = () => {
    const elementRef = useRef();
    useEffect(() => elementRef.current?.scrollIntoView());
    return <div ref={elementRef} />;
  };


  return (
    <Box className={classes.root}>
      <CssBaseline />
      <NavBar
        inputText={inputText} setInput={setInput}
        setEnterPrompt={setEnterPrompt}
        chatDialogs={chatDialogs} setChatDialogs={setChatDialogs}
        drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} setLabelOpen={setLabelDrawerOpen}/>
      <SettingDrawer open={drawerOpen}
        handleNewDialog={handleNewDialog}
        enterPrompt={enterPrompt}
      />
      <LabelDrawer open={labelDrawerOpen} setLabelOpen={setLabelDrawerOpen}/>
      <Container disableGutters maxWidth={false} sx={{ m: 0, pb: 10, overflow: 'auto', height: '100vh' }} >
        {showDialog(chatDialogs)}
        <AlwaysScrollToView />
      </Container>
    </Box>
  )
}

