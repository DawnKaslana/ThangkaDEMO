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


//api
import { server, django, file_url } from '../api.js'
import ReactMarkdown from 'react-markdown'

// cookie
const cookies = new Cookies();

// pre-data
const helloText = "Hello!這裡是TY的Thangka Inpaint DEMO."
const preNegativePrompt = "bad,ugly,disfigured,blurry,watermark,normal quality,jpeg artifacts,low quality,worst quality,cropped,low res"


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

  // message input
  const [inputText, setInput] = useState('');

  // generate params
  const [prompt, setPrompt] = useState('')
  const [negativePrompt, setNegativePrompt] = useState(preNegativePrompt);
  const [type, setType] = useState('text2img')
  const [model, setModel] = useState('SD21')
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
  const [CNImgSrc, setCNImgSrc] = useState(null);
  const [outputSrc, setOutputSrc] = useState(null);

  // 讀取後端的模型狀態
  const getPipeType = () => {
    django({ url: '/getPipeType/', method: 'get'})
    .then(res => {
      console.log(res.data)
      setType(res.data.type) 
      setModel(res.data.model)
      setLoraList(res.data.loraList)
      setCNList(res.data.cnList)
    })
    .catch((err)=>setGenerateState(false))
  }

  useEffect(() => {
    getPipeType()
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

    if (args.command){
      setMessages([...messages.slice(0, -1)])
    }
    if (['inpaint','text2img','img2img'].includes(args.command)) {
      generateHandler(args)
    } else if (args.command === 'changeParams') {
      changeParams(args.params)
    } else if (args.command === 'optimizePrompt') {
      console.log('optimizePrompt')
    }
  }

  const changeParams = (params) => {
    if (params.prompt) setPrompt(params.prompt)
    if (params.steps) setSteps(params.steps)
    if (params.noiseRatio) setNoiseRatio(params.noiseRatio)
  }

  const generateHandler = (args) => {
    if (args.prompt) setPrompt(args.prompt)
    if (CNModel !== 'None' && !selectedCNImg){
      setInputError(true)
      setErrorMsg("請輸入控制圖像。")
      return
    }

    //if selectedCNImg =  'generated'

    let generateFunc

    if (type === 'inpaint'){
      if (selectedImg && selectedMask) {
        generateFunc = inpaintGenerate
      } else {
        setInputError(true)
        if (!selectedImg) setErrorMsg("請輸入待修復圖像。")
        if (selectedImg && !selectedMask) setErrorMsg("請輸入遮罩圖像。")
        return
      }
    } else if (type === 'text2img') {
      if (args.prompt || prompt){
        generateFunc = text2imgGenerate
      } else {
        setInputError(true)
        setErrorMsg("請輸入prompt。")
        return
      }
    } else if (type === 'img2img') {
      if (selectedImg) {
        generateFunc = img2imgGenerate
      } else {
        setInputError(true)
        setErrorMsg("請輸入圖像。")
        return
      }
    }

    const formData = new FormData();
    formData.append('prompt', args.prompt?args.prompt:prompt);
    formData.append('negativePrompt', negativePrompt);
    formData.append('image', selectedImg);
    formData.append('mask', selectedMask);
    formData.append('CNImg', selectedCNImg);
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
          console.log(selectedImg.name.slice(0, -4) + "_output.png")
          django({
            url: '/getImg/', method: 'get', params: {
              imageName: selectedImg.name.slice(0, -4) + "_output.png",
              path:'output'
            }
          }).then(res => {
            setOutputSrc(res.data.img)
            handleNewDialog({ type: 'output', src: res.data.img,
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
          console.log(filename + ".png")
          django({
            url: '/getImg/', method: 'get', params: {
              imageName: filename + ".png",
              path:'output'
            }
          }).then(res => {
            setOutputSrc(res.data.img)
            handleNewDialog({ type: 'output', src: res.data.img,
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
          console.log(selectedImg.name.slice(0, -4) + "_output.png")
          django({
            url: '/getImg/', method: 'get', params: {
              imageName: selectedImg.name.slice(0, -4) + "_output.png",
              path:'output'
            }
          }).then(res => {
            setOutputSrc(res.data.img)
            handleNewDialog({ type: 'output', src: res.data.img,
              pramas: formData})
            setGenerateState(false)
          })
        }
      }).catch((err)=>setGenerateState(false))
  }

  const edgeGenerate = (imgforGCN) => {
    console.log('IsUploadCN:false')
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
            console.log(image.name.slice(0, -4) + "_edge.png")
            django({
              url: '/getImg/', method: 'get', params: {
                imageName: image.name.slice(0, -4) + "_edge.png",
                path: 'edge_output'
              }
            }).then(res => {
              setCNImgSrc("data:image/png;base64," + res.data.img)
              setSelectedCNImg('generated')
              setGenerateState(false)
            })
          }
        }).catch((err)=>setGenerateState(false))
    } else {
      setInputError(true)
      setErrorMsg("請輸入原始圖像。")
    }
  }

  //when change model or generate type
  const handleChange = (newType, newModel) => {
    setModel(newModel)
    setLoading(true)
    setSelectedMask(undefined)
    setSelectedCNImg(undefined)
    setCNImgSrc(null)
    const formData = new FormData();
    formData.append('type', newType);
    formData.append('model', newModel);
    django({ url: '/changePipe/', method: 'post', data: formData })
      .then(res => {
        if (res.data.msg === "successed") {
          getPipeType()
          setLoading(false)
        }
      }).catch((err)=>setGenerateState(false))
  }


  //Drawer
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [labelDrawerOpen, setLabelDrawerOpen] = useState(false);
  const [isNegativeLabel, setIsNegativeLabel] = useState(0);

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
        drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen}/>
      <SettingDrawer open={drawerOpen}
        generateHandler={generateHandler}
        edgeGenerate = {edgeGenerate}
        handleChange = {handleChange}
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
        CNImgSrc={CNImgSrc} setCNImgSrc={setCNImgSrc}
        logout={logout}
      />
      <LabelDrawer open={labelDrawerOpen} setLabelOpen={setLabelDrawerOpen} 
        isNegativeLabel={isNegativeLabel} prompt={prompt} setPrompt={setPrompt}
        negativePrompt={negativePrompt} setNegativePrompt={setNegativePrompt}
        userId={userId}/>
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

