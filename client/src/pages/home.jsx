// React and Basic import
import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';

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
import loadImg from '../images/purpleLoader-crop.gif'

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
import ReactMarkdown from 'react-markdown'

// cookie
const cookies = new Cookies();


//Main
export function Home() {
  const classes = useStyles();

  // login setting
  const navigate = useNavigate();
  const [userId, setUserId] = useState(cookies.get('user_id'));
  const [userName, setUserName] = useState(cookies.get('user_name'));

  useEffect(() => {
    if (!userId) navigate('/login');
  }, []);


  const logout = () => {
    cookies.remove('user_id', { path: '/' });
    cookies.remove('user_name', { path: '/' });
    navigate('/login');
  }

  // Dialogs
  const [chatDialogs, setChatDialogs] = useState([{role: "assistant"}]);
  const [messages, setMessages] = useState([])
  const helloText = "Hello!這裡是TY的Thangka Inpaint DEMO."

  // params
  const [inputText, setInput] = useState("");

  // generate params
  const [prompt, setPrompt] = useState('purple lotus')
  const [negative, setNegative] = useState('');
  const [type, setType] = useState('')
  const [model, setModel] = useState('')
  const [loraModel, setLoraModel] = useState('')
  const [imageCount, setImageCount] = useState(1)
  const [steps, setSteps] = useState(10)
  const [noiseRatio, setNoiseRatio] = useState(1)
  const [randomSeed, setRandomSeed] = useState(Math.random())
  const [promptWeight, setPromptWeight] = useState(0.7)
  
  // control pramas
  const [loading, setLoading] = useState(false);
  const [generateState, setGenerateState] = useState(false)
  const [selectedImg, setSelectedImg] = useState(null);
  const [selectedMask, setSelectedMask] = useState(null);

  // 讀取後端的模型狀態
  useEffect(() => {
    django({ url: '/getPipeType/', method: 'get'})
    .then(res => {
      console.log(res.data)
      setType(res.data.type)
      setModel(res.data.model)
      console.log(randomSeed)
    })
    .catch((err)=>setGenerateState(false))
  }, []);

  const [inputError, setInputError] = useState(false);
  const [result, setResult] = useState('');
  const [outputSrc, setOutputSrc] = useState(null);


  const handleNewDialog = (args) => {
    setChatDialogs([...chatDialogs, args])
  }

  const deleteDialogs = () => {
    setChatDialogs([{ role: 'assistant'}])
    setMessages([])
  }

  const handleMessages = (args) => {
    if (args.content) {
      setMessages([...messages, args])
      let list = chatDialogs
      list.push(args)
      setChatDialogs(list)
    } else {
      let list = chatDialogs
      setChatDialogs(list)
    }
    if (args.command) {
      console.log(args.command)
      generateHandler(args.command)
    }
  }

  const generateHandler = () => {
    if (type == 'inpaint'){
      inpaintGenerate()
    } else if (type == 'text2img'){
      text2imgGenerate()
    }
  }

  const inpaintGenerate = () => {
    const formData = new FormData();
    if (selectedImg && selectedMask && type && model) {
      handleNewDialog({ type: 'generating' })
      setInputError(false)
      setGenerateState(true)
      formData.append('prompt', prompt);
      formData.append('image', selectedImg);
      formData.append('mask', selectedMask);
      formData.append('steps', steps);
      formData.append('type', type);
      formData.append('SDModel', model);

      django({ url: '/generate/', method: 'post', data: formData })
        .then(res => {
          setResult(res.data.msg);
          if (res.data.msg === "successed") {
            console.log(selectedImg.name.slice(0, -4) + "_output.png")
            django({
              url: '/getImg/', method: 'get', params: {
                imageName: selectedImg.name.slice(0, -4) + "_output.png"
              }
            }).then(res => {
              setOutputSrc(res.data.img)
              handleNewDialog({ type: 'output', gType:type, model, prompt: prompt, src: res.data.img })
              setGenerateState(false)
            })
          }
        }).catch((err)=>setGenerateState(false))

    } else {
      setInputError(true)
    }
  }

  const text2imgGenerate = () => {
    const formData = new FormData();
    if (prompt) {
      handleNewDialog({ type: 'generating' })
      setInputError(false)
      setGenerateState(true)
      let filename = userId + "_text2img_" + new Date().getTime()
      formData.append('filename', filename);
      formData.append('steps', steps);
      formData.append('type', type);
      formData.append('SDModel', model);

      django({ url: '/generate/', method: 'post', data: formData })
        .then(res => {
          setResult(res.data.msg);
          if (res.data.msg === "successed") {
            console.log(filename + ".png")
            django({
              url: '/getImg/', method: 'get', params: {
                imageName: filename + ".png"
              }
            }).then(res => {
              setOutputSrc(res.data.img)
              handleNewDialog({ type: 'output', gType:type, model, prompt: prompt, src: res.data.img })
              setGenerateState(false)
            })
          }
        }).catch((err)=>setGenerateState(false))

    } else {
      setInputError(true)
    }
  }


  //Drawer
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [labelDrawerOpen, setLabelDrawerOpen] = useState(false);

  const AIAvatar = () => (
    <Avatar sx={{bgcolor: 'purple', width: 56, height: 56, ml: 1, mr: 1}}>TY</Avatar>
  )
  const AIDialog = (item, key) => (
    <Box key={key} display="flex" flexDirection="row" sx={{ mt: 1,p:0 }}>
      <AIAvatar/>
      <Card variant="outlined"
            className={classes.flexColCenter}
            sx={{ maxWidth: '50vw', pr:1, pl: 1}}>
        <ReactMarkdown className={classes.reactMarkDown}>{key<1 ? helloText : item.content}</ReactMarkdown>
      </Card>
      <AlwaysScrollToView />
    </Box>
  )

  const outputDialog = (item, key) => (
    <Box key={key} display="flex" flexDirection="row" sx={{ mt: 1 }}>
      <AIAvatar/>
      <Card sx={{ p: 1, mr: 1 }}>
        <Box><RViewerJS ><img src={"data:image/png;base64," + item.src} /></RViewerJS></Box>
        <Typography variant="body2" color="text.secondary">
          模式：{item.gType}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          生成模型：{item.model}
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
      <AIAvatar/>
      <Card sx={{ p: 1, mr: 1 }} className={classes.flexColCenter}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Generating...
        </Typography>
        <CircularProgress color="secondary" />
      </Card>
    </Box>
  )

  const speakDialog = (key) => (
    <Box key={key} display="flex" flexDirection="row" sx={{ mt: 1,p:0 }}>
      <AIAvatar/>
      <Card variant="outlined"
          className={classes.flexColCenter}
          sx={{ maxWidth: '50vw', p:1}}>
          <img src={loadImg} width="80px" alt="load gif"/>
      </Card>
    </Box>
  )

  const userDialog = (item, key) => (
    <Box key={key} display="flex" flexDirection="row" justifyContent="right" sx={{ mt: 1, mr: 1 }}>
      <Card variant="outlined"
            className={classes.flexColCenter}
            sx={{ maxWidth: '50vw', p:1, mr:1}}>
          <Typography>{item.content}</Typography>
      </Card>
      <Avatar sx={{bgcolor: '#296bae', width: 56, height: 56}}>U</Avatar>
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
      } else if (chatDialogs[idx].type === 'speak') {
        dialogs.push(speakDialog(idx))
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
        messages={messages} handleNewDialog={handleNewDialog}
        handleMessages={handleMessages} deleteDialogs={deleteDialogs}
        drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} setLabelOpen={setLabelDrawerOpen}/>
      <SettingDrawer open={drawerOpen}
        handleNewDialog={handleNewDialog}
        generateHandler={generateHandler}
        prompt={prompt} setPrompt={setPrompt}
        negative={negative} setNegative={setNegative}
        type={type} setType={setType}
        model={model} setModel={setModel}
        loraModel={loraModel} setLoraModel={setLoraModel}
        imageCount={imageCount} setImageCount={setImageCount}
        steps={steps} setSteps={setSteps}
        noiseRatio={noiseRatio} setNoiseRatio={setNoiseRatio}
        randomSeed={randomSeed} setRandomSeed={setRandomSeed}
        promptWeight={promptWeight} setPromptWeight={setPromptWeight}
        loading={loading} setLoading={setLoading}
        generateState={generateState} setGenerateState={setGenerateState}
        selectedImg={selectedImg} setSelectedImg={setSelectedImg}
        selectedMask={selectedMask} setSelectedMask={setSelectedMask}
      />
      <LabelDrawer open={labelDrawerOpen} setLabelOpen={setLabelDrawerOpen}/>
      <Container disableGutters maxWidth={false} sx={{ m: 0, pb: 10, overflow: 'auto', height: '100vh' }} >
        {showDialog(chatDialogs)}
        <AlwaysScrollToView />
      </Container>
    </Box>
  )
}

