// React and Basic import
import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';

// React MUI import
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import CssBaseline from '@material-ui/core/CssBaseline';
import Card from '@mui/material/Card';
import CircularProgress from '@material-ui/core/CircularProgress';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';

// Icon import
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';
import ImageIcon from '@mui/icons-material/Image';
import Filter1Icon from '@mui/icons-material/Filter1';
import Filter2Icon from '@mui/icons-material/Filter2';
import Filter3Icon from '@mui/icons-material/Filter3';
import Filter4Icon from '@mui/icons-material/Filter4';

// CSS
import useStyles from '../css/style';
import { darkTheme } from '../css/theme.jsx';

//other func & components
import RViewerJS from 'viewerjs-react'
import Viewer from 'viewerjs';
import ReactMarkdown from 'react-markdown'
import defaultImage from '../images/defaultImage.jpeg'
import NavBar from '../components/navBar.jsx';
import SettingDrawer from '../components/settingDrawer.jsx';
import LabelDrawer from '../components/labelDrawer.jsx';
import loadImg from '../images/purpleLoader-crop.gif'

//api
import { server, django, file_url } from '../api.js'

// Test params
const isTest = false;


// cookie
const cookies = new Cookies();

// pre-data
const helloText = "Hello!这里是TY的Thangka Inpaint DEMO."
const preNegativePrompt = "bad,ugly,disfigured,blurry,watermark,normal quality,jpeg artifacts,low quality,worst quality,cropped,low res"


const getRandomSeed = () => {
  return parseInt(Math.random()*(1000000000-1)+1)
}

const RVJSoptions = {
  viewed() {
    this.viewer.zoomTo(1.8);
  },
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

  // message input
  const [inputText, setInput] = useState('');

  // generate params
  const [prompt, setPrompt] = useState('')
  const [negativePrompt, setNegativePrompt] = useState(preNegativePrompt);
  const [type, setType] = useState('inpaint')
  const [model, setModel] = useState('SDI2')
  const [loraModel, setLoraModel] = useState('None')
  const [loraList, setLoraList] = useState([])
  const [CNList, setCNList] = useState([])
  const [CNModel, setCNModel] = useState('None')
  const [imageCount, setImageCount] = useState(1)
  const [steps, setSteps] = useState(30)
  const [noiseRatio, setNoiseRatio] = useState(0.5)
  const [randomSeed, setRandomSeed] = useState(-1)
  const [promptWeight, setPromptWeight] = useState(7.5)
  
  // imgSrc pramas
  const [selectedImg, setSelectedImg] = useState(undefined);
  const [selectedMask, setSelectedMask] = useState(undefined);
  const [selectedCNImg, setSelectedCNImg] = useState(undefined);
  const [selectedImgGCN, setSelectedImgGCN] = useState(undefined);
  const [outputImgName, setOutputImgName] = useState(null);
  const [outputImgs, setOutputImgs] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [CNImgSrc, setCNImgSrc] = useState(null);

  // control pramas
  const [loading, setLoading] = useState(false);
  const [scrolling, setScrolling] = useState(true);
  const [generateState, setGenerateState] = useState(true)
  const [inputError, setInputError] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const [errorState, setErrorState] = useState(true)
  
  // 读取后端的模型状态
  const getPipeType = () => {
    django({ url: '/getPipeType/', method: 'get'})
    .then(res => {
      console.log(res.data)
      setType(res.data.type) 
      setModel(res.data.model)
      setCNModel(res.data.cnModel?res.data.cnModel:'None')
      setLoraList(res.data.loraList)
      setCNList(res.data.cnList)
      if (!isTest) setErrorState(false)
      setGenerateState(false)
    })
    .catch((err)=>{
      if (!isTest) {
        setInputError(true)
        setErrorMsg('后端连接错误')
        setErrorState(true)
      }
      setGenerateState(true)
    })
  }

  useEffect(() => {
    getPipeType()
  }, []);

  useEffect(() => {
  }, [chatDialogs]);


  // 对话相关功能: handleNewDialog, deleteDialogs, revokeDialogs, regenerateDialog
  const handleNewDialog = (args) => {
    setScrolling(true);
    setChatDialogs([...chatDialogs, args])
  }

  const deleteDialogs = () => {
    if (errorState) return
    setChatDialogs([{ type: 'msg', role: 'assistant', content:helloText}])
    setMessages([])
  }

  const revokeDialogs = () => {
    if (errorState) return
    if (messages.length>=1) {
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
    if (errorState) return
    if (messages.length>=1) {
      if (chatDialogs.slice(-1)[0].role === "assistant"){

        setChatDialogs([...chatDialogs.slice(0, -1), { type: 'load', class: 'speak' }])

        //传入删掉百度回复的讯息列表
        let messagesList = messages.slice(0, -1)
        const formData = new FormData();
        formData.append('messages', JSON.stringify(messagesList));

        django({ url: '/chat/', method: 'post', data: formData })
        .then(res=>{
            handleMessages(res.data, true)
        })
      } 
    }
  }
  

  // 处理聊天消息
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

    if (args.command){
      setMessages([...messages.slice(0, -1)])
    }
    if (['inpaint','text2img','img2img'].includes(args.command)) {
      generateHandler(args)
    } else if (args.command === 'changeParamsAndGenerate') {
      changeParamsAndGenerate(args.params)
    } else if (args.command === 'optimizePrompt') {
      optimizePrompt()
    }
  }

  // 对话回传操作: changeParamsAndGenerate, optimizePrompt
  const changeParamsAndGenerate = (params) => {
    console.log('changeParamsAndGenerate')
    console.log(params)
    if (params.prompt) setPrompt(params.prompt)
    if (params.negativePrompt) setPrompt(params.negativePrompt)
    if (params.steps) setSteps(params.steps)
    if (params.noiseRatio) setNoiseRatio(params.noiseRatio)
    if (params.promptWeight) setPromptWeight(params.promptWeight)
    if (params.imageCount) setImageCount(params.imageCount)
    if (params.generate) generateHandler(params)
  }

  const optimizePrompt = (isClick) => {
    if (prompt) {
      setGenerateState(true)
      const formData = new FormData();
      formData.append('text', prompt);
      django({ url: '/refine/', method: 'post', data: formData })
      .then(res=>{
        if (!isClick){
          handleMessages(res.data)
        } else {
          setPrompt(res.data.params.prompt)
        }
          setGenerateState(false)
      })
    } else {
      if (!isClick){
        handleMessages({
          "role": "assistant",
          "content": "请输入prompt。",
        })
      }
    }
  }

  // 生成功能: generateHandler, inpaintGenerate, text2imgGenerate, img2imgGenerate, edgeGenerate
  const generateHandler = (args) => {
    if (args.prompt) setPrompt(args.prompt)
    if (CNModel !== 'None' && !selectedCNImg){
      setInputError(true)
      setErrorMsg("请输入控制图像。")
      return
    }

    let generateFunc

    if (type === 'inpaint'){
      if (selectedImg && selectedMask) {
        generateFunc = inpaintGenerate
      } else {
        setInputError(true)
        if (!selectedImg) setErrorMsg("请输入待修復图像。")
        if (selectedImg && !selectedMask) setErrorMsg("请输入遮罩图像。")
        return
      }
    } else if (type === 'text2img') {
      if (args.prompt || prompt){
        generateFunc = text2imgGenerate
      } else {
        setInputError(true)
        setErrorMsg("请输入prompt。")
        return
      }
    } else if (type === 'img2img') {
      if (selectedImg) {
        generateFunc = img2imgGenerate
      } else {
        setInputError(true)
        setErrorMsg("请输入图像。")
        return
      }
    }

    const formData = new FormData();
    formData.append('prompt', args.prompt?args.prompt:prompt);
    formData.append('negativePrompt', negativePrompt);

    //if selectedCNImg = 'generated' 就不用送边缘图，送档名，让Djangle直接读edgeDir
    if (selectedCNImg?.generated) {
      formData.append('isGCN', true);
      formData.append('CNImage', selectedCNImg.generated);
    } else {
      formData.append('CNImage', selectedCNImg);
    }

    if (selectedImg?.generated) {
      formData.append('isGIM', true);
      formData.append('image', selectedImg.generated);
    } else {
      formData.append('image', selectedImg);
    }

    formData.append('mask', selectedMask);
    formData.append('steps', steps);
    formData.append('seed', randomSeed<0?getRandomSeed():randomSeed);
    formData.append('strength', noiseRatio);
    formData.append('guidance', promptWeight);
    formData.append('imageCount', imageCount);
    formData.append('type', type);
    formData.append('SDModel', model);
    formData.append('loraModelName', loraModel);
    formData.append('CNModelName', CNModel);
    
    handleNewDialog({ type: 'load', class: 'generating' })
    setInputError(false)
    setGenerateState(true)
    generateFunc(formData)
  }

  const inpaintGenerate = (formData) => {
    django({ url: '/generate/', method: 'post', data: formData })
      .then(res => {
        if (res.data.msg === "successed") {
          let outputName = res.data.outputName
          django({
            url: '/getImg/', method: 'get', params: {
              imageName: outputName,
              imageCount: imageCount,
              path:'output'
            }
          }).then(res => {
            handleNewDialog({ type: 'output', 
              src: res.data.img, 
              filename: outputName,
              pramas: formData})
            setGenerateState(false)
          })
        }
      }).catch((err)=>setGenerateState(false))
  }

  const text2imgGenerate = (formData) => {
    let filename = userId + "_text2img_" + new Date().getTime()
    formData.append('filename', filename);

    django({ url: '/generate/', method: 'post', data: formData })
      .then(res => {
        if (res.data.msg === "successed") {
          let outputName = res.data.outputName
          django({
            url: '/getImg/', method: 'get', params: {
              imageName: filename,
              imageCount: imageCount,
              path:'output'
            }
          }).then(res => {
            handleNewDialog({ type: 'output', 
              src: res.data.img, 
              filename: outputName,
              pramas: formData})
            setGenerateState(false)
          })
        }
      }).catch((err)=>setGenerateState(false))
  }

  const img2imgGenerate = (formData) => {
    django({ url: '/generate/', method: 'post', data: formData })
      .then(res => {
        if (res.data.msg === "successed") {
          let outputName = res.data.outputName
          console.log(res.data.outputName)
          django({
            url: '/getImg/', method: 'get', params: {
              imageName: outputName,
              imageCount: imageCount,
              path:'output'
            }
          }).then(res => {
            handleNewDialog({ type: 'output', 
              src: res.data.img, 
              filename: outputName,
              pramas: formData})
            setGenerateState(false)
          })
        }
      }).catch((err)=>setGenerateState(false))
  }

  const edgeGenerate = (imgforGCN) => {
    let image
    if (type !== "inpaint" && imgforGCN) image = imgforGCN
    else image = selectedImg
    if (image) {
      const formData = new FormData();
      formData.append('image', image);
      formData.append('mask', selectedMask);

      setGenerateState(true)

      django({ url: '/edgeInpaint/', method: 'post', data: formData })
        .then(res => {
          if (res.data.msg === "successed") {
            let filename = image.name.slice(0, -4) + "_edge.png"
            django({
              url: '/getImg/', method: 'get', params: {
                imageName: filename,
                path: 'edge'
              }
            }).then(res => {
              setCNImgSrc("data:image/png;base64," + res.data.img[0])
              setSelectedCNImg({'generated':filename})
              setGenerateState(false)
            })
          }
        }).catch((err)=>{
          console.log(err)
          setGenerateState(false)
      })
    } else {
      setInputError(true)
      setErrorMsg("请输入原始图像。")
    }
  }

  // handleSendImgtoInput
  const sendImgtoSrc = (imgSrc, idx, filename) => {
    setImageSrc("data:image/png;base64,"+imgSrc)
    console.log(filename+"_"+idx+".png")
    setSelectedImg({'generated':filename+"_"+idx+".png"})
    handleSendImgMenuClose()
  }

  const [anchorEl, setAnchorEl] = useState(null);
  const [sendImgMenuOpen, setSendImgMenuOpen] = useState(false);
  const handleSendImgMenuClose = () => {
    setSendImgMenuOpen(false);
  }

  const handleSendImg = (event,images, filename) => {
    setScrolling(false)
    setOutputImgs(images)
    setOutputImgName(filename)
    if (images.length === 1) sendImgtoSrc(images[0], 0, filename)
    else {
      setSendImgMenuOpen(true)
      setAnchorEl(event.currentTarget);
    }
  }

  //when change model or generate type
  const handleChange = (newType, newModel, newCNModel) => {
    setModel(newModel)
    setLoading(true)
    const formData = new FormData();
    formData.append('type', newType);
    formData.append('model', newModel);
    formData.append('cnModel', newCNModel);
    django({ url: '/changePipe/', method: 'post', data: formData })
      .then(res => {
        if (res.data.msg === "successed") {
          getPipeType()
          setLoading(false)
        }
      }).catch((err)=>setGenerateState(false))
  }


  //Control Drawers
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [labelDrawerOpen, setLabelDrawerOpen] = useState(false);
  const [isNegativeLabel, setIsNegativeLabel] = useState(0);


  // 对话框元件: AIAvatar, AIDialog, outputDialog, generatingDialog, speakDialog, userDialog, showDialog
  const AIAvatar = () => (
    <Avatar sx={{bgcolor: 'purple', width: 56, height: 56, ml: 1, mr: 1}}>TY</Avatar>
  )
  const AIDialog = (item, key) => (
    <Box key={key} display="flex" flexDirection="row" sx={{ mt: 1,p:0 }}>
      <AIAvatar/>
      <Card variant="outlined"
            className={classes.flexCol+" "+classes.flexCenter}
            sx={{ maxWidth: '50vw', pr:1, pl: 1}}>
        <ReactMarkdown className={classes.reactMarkDown}>{key<1 ? helloText : item.content}</ReactMarkdown>
      </Card>
    </Box>
  )

  const outputDialog = (item, key) => (
    <Box key={key} display="flex" flexDirection="row" sx={{ mt: 1 }}>
      <AIAvatar/>
      <Card sx={{ p: 1, mr: 1}}>
        <Box sx={{height:item.src.length < 3 ? '512px': '1024px'}}>
          {/* <RViewerJS options={{minWidth:512, movable:false, scalable:false}}> */}
          <RViewerJS options={RVJSoptions} >
            <Box className={classes.flexRow}>
              {item.src[0]? <img id="images" src={"data:image/png;base64," + item.src[0]}/> : null}
              {item.src[1]? <img src={"data:image/png;base64," + item.src[1]}/> : null}
            </Box> 
            <Box className={classes.flexRow}>
              {item.src[2]? <img src={"data:image/png;base64," + item.src[2]}/> : null}
              {item.src[3]? <img src={"data:image/png;base64," + item.src[3]}/> : null}
            </Box> 
          </RViewerJS>
        </Box>

        <Box sx={{maxWidth:item.src.length < 2 ? '512px': '1024px'}}>
          <Box className={classes.flexRow}>
            <Typography variant="body2" sx={{mr:1}} color="text.secondary">
              模式：{item.pramas.get('type')}
            </Typography>
            <Typography variant="body2" sx={{mr:1}} color="text.secondary">
              生成模型：{item.pramas.get('SDModel')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              微调模型：{item.pramas.get('loraModelName')}
            </Typography>
            { type !== 'text2img'?
            <Tooltip title={<h3>Send image to input</h3>} placement="top" arrow>
              <IconButton sx={{p:0, marginLeft:"auto", marginBottom:"auto"}} edge="start" color="inherit"
                onClick={(e)=>handleSendImg(e,item.src, item.filename)}>
                <DoubleArrowIcon sx={{color: '#6A0DA0', transform: 'rotate(180deg)',}}/>
                <ImageIcon sx={{color: '#6A0DA0'}}/>
              </IconButton>
            </Tooltip> : null
            }
          </Box>
          <Box className={classes.flexRow}>
            <Typography variant="body2" sx={{mr:1}} color="text.secondary">
              生成步数：{item.pramas.get('steps')}
            </Typography>
            <Typography variant="body2" sx={{mr:1}} color="text.secondary">
              杂讯强度：{item.pramas.get('strength')}
            </Typography>
            <Typography variant="body2" sx={{mr:1}} color="text.secondary">
              文本权重：{item.pramas.get('guidance')}
            </Typography>
            {/* if count > 1要多一行 */}
            <Typography variant="body2" color="text.secondary">
              随机种子：{item.pramas.get('seed')}
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
      <Card sx={{ p: 1, mr: 1 }} className={classes.flexCol+" "+classes.flexCenter}>
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
          className={classes.flexCol+" "+classes.flexCenter}
          sx={{ maxWidth: '50vw', p:1}}>
          <img src={loadImg} width="80px" alt="load gif"/>
      </Card>
    </Box>
  )
  
  const userDialog = (item, key) => (
    <Box key={key} display="flex" flexDirection="row" justifyContent="right" sx={{ mt: 1, mr: 1 }}>
      <Card variant="outlined"
            className={classes.flexCol+" "+classes.flexCenter}
            sx={{ maxWidth: '50vw', p:1, mr:1}}>
          <Typography>{item.content}</Typography>
      </Card>
      <Avatar sx={{bgcolor: '#296bae', width: 56, height: 56}}>{userName.slice(0,2)}</Avatar>
    </Box>
  )
  
  // 控制对话列表显示: showDialog, AlwaysScrollToView
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
    if (scrolling) return <div ref={elementRef} />;
  };


  return (
    <Box className={classes.root}>
      <CssBaseline />

      <NavBar
        inputText={inputText} setInput={setInput} errorState={errorState}
        messages={messages} handleNewDialog={handleNewDialog}
        handleMessages={handleMessages} deleteDialogs={deleteDialogs}
        revokeDialogs={revokeDialogs} regenerateDialogs={regenerateDialogs}
        drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen}/>
      <SettingDrawer open={drawerOpen}
        generateHandler={generateHandler}
        edgeGenerate = {edgeGenerate}
        handleChange = {handleChange}
        optimizePrompt = {optimizePrompt}
        prompt={prompt} setPrompt={setPrompt}
        setLabelOpen={setLabelDrawerOpen} setIsNegativeLabel={setIsNegativeLabel}
        negativePrompt={negativePrompt} setNegativePrompt={setNegativePrompt} 
        type={type} setType={setType} 
        model={model} setModel={setModel}
        loraModel={loraModel} setLoraModel={setLoraModel} loraList={loraList}
        CNModel={CNModel} setCNModel={setCNModel} CNList={CNList}
        imageCount={imageCount} setImageCount={setImageCount}
        steps={steps} setSteps={setSteps}
        noiseRatio={noiseRatio} setNoiseRatio={setNoiseRatio}
        randomSeed={randomSeed} setRandomSeed={setRandomSeed} getRandomSeed={getRandomSeed}
        promptWeight={promptWeight} setPromptWeight={setPromptWeight}
        loading={loading} generateState={generateState} 
        setSelectedImg={setSelectedImg} setSelectedMask={setSelectedMask} setSelectedCNImg={setSelectedCNImg}
        setSelectedImgGCN={setSelectedImgGCN} 
        imageSrc={imageSrc} setImageSrc={setImageSrc}
        CNImgSrc={CNImgSrc} setCNImgSrc={setCNImgSrc}
        setErrorMsg={setErrorMsg} setInputError={setInputError}
        logout={logout}
      />
      <LabelDrawer open={labelDrawerOpen} setLabelOpen={setLabelDrawerOpen} 
        isNegativeLabel={isNegativeLabel} prompt={prompt} setPrompt={setPrompt}
        negativePrompt={negativePrompt} setNegativePrompt={setNegativePrompt}
        userId={userId}/>
      <Container disableGutters maxWidth={false} sx={{ m: 0, pb: 10, overflow: 'auto', height: '100vh' }} >
      <Menu
        anchorEl={anchorEl}
        id="send-img-to-input-menu"
        open={sendImgMenuOpen}
        onClose={handleSendImgMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
      {outputImgs?.map((imgSrc,idx)=>
        <MenuItem key={idx} onClick={()=>sendImgtoSrc(imgSrc, idx, outputImgName)}>
            {idx === 0? <Filter1Icon fontSize="small" /> :null}
            {idx === 1? <Filter2Icon fontSize="small" /> :null}
            {idx === 2? <Filter3Icon fontSize="small" /> :null}
            {idx === 3? <Filter4Icon fontSize="small" /> :null}
        </MenuItem>
        )
      }
      </Menu>
      <Snackbar 
        open={inputError}
        sx={{ width: "80%" }}
        anchorOrigin={{ vertical:'top', horizontal:'center' }}
        autoHideDuration={errorState? null:1800}
        onClose={()=>errorState? null:setInputError(false)}>
        <Alert severity="error" sx={{ width: '100%' }}>
          {errorMsg}
        </Alert>
      </Snackbar>
        {showDialog(chatDialogs)}
        <AlwaysScrollToView/>
      </Container>
    </Box>
  )
}
