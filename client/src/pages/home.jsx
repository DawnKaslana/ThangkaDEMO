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
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

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

const helloText = "Hello!這裡是TY的Thangka Inpaint DEMO."
const preNegative = "bad,ugly,disfigured,blurry,watermark,normal quality,jpeg artifacts,low quality,worst quality,cropped,low res"


const getRandomSeed = () => {
  return parseInt(Math.random()*(1000000000-1)+1)
}

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
  const [messages, setMessages] = useState([])
  const [chatDialogs, setChatDialogs] = useState([{type:'msg', role: "assistant", content:helloText}]);

  // params
  const [inputText, setInput] = useState("");

  // generate params
  const [prompt, setPrompt] = useState('')
  const [negativePrompt, setNegativePrompt] = useState(preNegative);
  const [type, setType] = useState('inpaint')
  const [model, setModel] = useState('SDI2')
  const [loraModel, setLoraModel] = useState('None')
  const [loraList, setLoraList] = useState([])
  const [imageCount, setImageCount] = useState(1)
  const [steps, setSteps] = useState(30)
  const [noiseRatio, setNoiseRatio] = useState(0.5)
  const [randomSeed, setRandomSeed] = useState(-1)
  const [promptWeight, setPromptWeight] = useState(7.5)
  
  // imgSrc pramas
  const [selectedImg, setSelectedImg] = useState(null);
  const [selectedMask, setSelectedMask] = useState(null);
  const [result, setResult] = useState('');
  const [outputSrc, setOutputSrc] = useState(null);

  // 讀取後端的模型狀態
  useEffect(() => {
    django({ url: '/getPipeType/', method: 'get'})
    .then(res => {
      console.log(res.data)
      setType(res.data.type) 
      setModel(res.data.model)
      setLoraList(res.data.loraList)
    })
    .catch((err)=>setGenerateState(false))
  }, []);

  useEffect(() => {
  }, [chatDialogs]);

  // control pramas
  const [loading, setLoading] = useState(false);
  const [generateState, setGenerateState] = useState(false)
  const [inputError, setInputError] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  const handleNewDialog = (args) => {
    setChatDialogs([...chatDialogs, args])
  }

  const deleteDialogs = () => {
    setChatDialogs([{ type: 'msg', role: 'assistant', content:helloText}])
    setMessages([])
  }

  const revokeDialogs = () => {
    if(messages.length>=1){
      if (chatDialogs.slice(-1)[0].role === "assistant"){
        setMessages([...messages.slice(0,-2)])
        setChatDialogs([...chatDialogs.slice(0,-2)])
      } else {
        setMessages([...messages.slice(0,-1)])
        setChatDialogs([...chatDialogs.slice(0,-1)])
      }
    }
  }

  const regenerateDialogs = () => {
    if(messages.length>=1){
      if (chatDialogs.slice(-1)[0].role === "assistant"){

        setChatDialogs([...chatDialogs.slice(0, -1), { type: 'load', class: 'speak' }])

        //傳入刪掉百度回覆的訊息列表
        let messagesList = messages.slice(0, -1)
        const formData = new FormData();
        formData.append('messages', JSON.stringify(messagesList));

        django({ url: '/chat/', method: 'post', data: formData })
        .then(res=>{
            console.log(res.data)
            handleMessages(res.data, true)
        })
      } 
    }
  }
  

  const handleMessages = (args, rm) => {
    if (args.content) {
      let chatList
      if (rm) {
        setMessages([...messages.slice(0, -1), args])
        chatList = chatDialogs.slice(0, -1)
        args["type"] = "msg"
        chatList.push(args)
      } else {
        setMessages([...messages, args])
        chatList = chatDialogs
        args["type"] = "msg"
        chatList.push(args)
      }
      setChatDialogs(chatList)
    } else {
      let list = chatDialogs
      setChatDialogs(list)
    }
    if (args.command === ('inpaint' || 'text2img' || 'img2img')) {
      generateHandler(args)
    } else if (args.command === 'changeParams') {
      changeParams(args.params)
    }
  }

  const changeParams = (params) => {
    console.log(params)
    if (params.prompt) setPrompt(params.prompt)
    if (params.steps) setSteps(params.steps)
    if (params.noiseRatio) setNoiseRatio(params.noiseRatio)
  }

  const generateHandler = (args) => {
    if (args.prompt)setPrompt(args.prompt)
    const formData = new FormData();
    formData.append('prompt', args.prompt?args.prompt:prompt);
    formData.append('negativePrompt', negativePrompt);
    formData.append('image', selectedImg);
    formData.append('mask', selectedMask);
    formData.append('steps', steps);
    formData.append('seed', randomSeed<0?getRandomSeed():randomSeed);
    formData.append('strength', noiseRatio);
    formData.append('guidance', promptWeight);
    formData.append('imageCount', imageCount);
    formData.append('type', type);
    formData.append('SDModel', model);
    formData.append('loraModelName', loraModel);
    
    if (type == 'inpaint'){
      inpaintGenerate(formData)
    } else if (type == 'text2img'){
      text2imgGenerate(formData)
    } else if (type == 'img2img'){
      img2imgGenerate(formData)
    }
  }

  const inpaintGenerate = (formData) => {
    if (formData.get('selectedImg') && formData.get('selectedMask')) {
      handleNewDialog({ type: 'load', class: 'generating' })
      setInputError(false)
      setGenerateState(true)

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
              handleNewDialog({ type: 'output', src: res.data.img,
                pramas: formData})
              setGenerateState(false)
            })
          }
        }).catch((err)=>setGenerateState(false))

    } else {
      setInputError(true)
      if (!selectedImg) setErrorMsg("請輸入待修復圖像。")
      if (selectedImg && !selectedMask) setErrorMsg("請輸入遮罩圖像。")
    }
  }

  const text2imgGenerate = (formData) => {

    if (formData.get('prompt')) {
      handleNewDialog({ type: 'load', class: 'generating' })
      setInputError(false)
      setGenerateState(true)
      let filename = userId + "_text2img_" + new Date().getTime()
      formData.append('filename', filename);

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
              handleNewDialog({ type: 'output', src: res.data.img,
                pramas: formData})
              setGenerateState(false)
            })
          }
        }).catch((err)=>setGenerateState(false))

    } else {
      setInputError(true)
      setErrorMsg("請輸入prompt。")
    }
  }

  const img2imgGenerate = (formData) => {

    if (formData.get('selectedImg')) {
      handleNewDialog({ type: 'load', class: 'generating' })
      setInputError(false)
      setGenerateState(true)

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
              handleNewDialog({ type: 'output', src: res.data.img,
                pramas: formData})
              setGenerateState(false)
            })
          }
        }).catch((err)=>setGenerateState(false))

    } else {
      setInputError(true)
      setErrorMsg("請輸入圖像。")
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
        <Box sx={{maxWidth:'500px'}}>
          <Box className={classes.flexRow}>
            <Typography variant="body2" sx={{mr:1}} color="text.secondary">
              模式：{item.pramas.get('type')}
            </Typography>
            <Typography variant="body2" sx={{mr:1}} color="text.secondary">
              生成模型：{item.pramas.get('SDModel')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              微調模型：{item.pramas.get('loraModelName')}
            </Typography>
          </Box>
          <Box className={classes.flexRow}>
            <Typography variant="body2" sx={{mr:1}} color="text.secondary">
              生成步數：{item.pramas.get('steps')}
            </Typography>
            <Typography variant="body2" sx={{mr:1}} color="text.secondary">
              雜訊強度：{item.pramas.get('strength')}
            </Typography>
            <Typography variant="body2" sx={{mr:1}} color="text.secondary">
              文本權重：{item.pramas.get('guidance')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              隨機種子：{item.pramas.get('seed')}
            </Typography>
          </Box>
          {item.pramas.get('prompt') ?
            <Typography variant="body2" color="text.secondary">
              prompt：{item.pramas.get('prompt')}
            </Typography> : null
          }
          {item.pramas.get('negativePrompt') ?
            <Typography variant="body2" color="text.secondary">
              negative prompt：{item.pramas.get('negativePrompt')}
            </Typography> : null
          }
        </Box>
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
      <Avatar sx={{bgcolor: '#296bae', width: 56, height: 56}}>{userName.slice(0,2)}</Avatar>
      <AlwaysScrollToView />
    </Box>
  )
  

  const showDialog = (chatDialogs) => {
    let dialogs = []
    for (let idx in chatDialogs) {
      if (chatDialogs[idx].type === 'msg'){
        chatDialogs[idx].role === 'assistant'?
        dialogs.push(AIDialog(chatDialogs[idx], idx)):
        dialogs.push(userDialog(chatDialogs[idx], idx))
      } else if (chatDialogs[idx].type === 'load') {
        chatDialogs[idx].class==="generating"?
        dialogs.push(generatingDialog(idx)):
        dialogs.push(speakDialog(idx))
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
        revokeDialogs={revokeDialogs} regenerateDialogs={regenerateDialogs}
        drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} setLabelOpen={setLabelDrawerOpen}/>
      <SettingDrawer open={drawerOpen}
        handleNewDialog={handleNewDialog}
        generateHandler={generateHandler}
        prompt={prompt} setPrompt={setPrompt}
        negativePrompt={negativePrompt} setNegativePrompt={setNegativePrompt}
        type={type} setType={setType} 
        model={model} setModel={setModel}
        loraModel={loraModel} setLoraModel={setLoraModel} loraList={loraList}
        imageCount={imageCount} setImageCount={setImageCount}
        steps={steps} setSteps={setSteps}
        noiseRatio={noiseRatio} setNoiseRatio={setNoiseRatio}
        randomSeed={randomSeed} setRandomSeed={setRandomSeed} getRandomSeed={getRandomSeed}
        promptWeight={promptWeight} setPromptWeight={setPromptWeight}
        loading={loading} setLoading={setLoading}
        generateState={generateState} setGenerateState={setGenerateState}
        selectedImg={selectedImg} setSelectedImg={setSelectedImg}
        selectedMask={selectedMask} setSelectedMask={setSelectedMask}
        logout={logout}
      />
      <LabelDrawer open={labelDrawerOpen} setLabelOpen={setLabelDrawerOpen}/>
      <Container disableGutters maxWidth={false} sx={{ m: 0, pb: 10, overflow: 'auto', height: '100vh' }} >
      <Snackbar 
        open={inputError}
        sx={{ width: "80%" }}
        anchorOrigin={{ vertical:'top', horizontal:'center' }}
        autoHideDuration={1800}
        onClose={()=>setInputError(false)}>
        <Alert severity="error" sx={{ width: '100%' }}>
          {errorMsg}
        </Alert>
      </Snackbar>
        {showDialog(chatDialogs)}
        <AlwaysScrollToView />
      </Container>
    </Box>
  )
}

