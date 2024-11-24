// React and Basic import
import * as React from 'react';
import { useState, useEffect, useRef, forwardRef } from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme, createTheme, ThemeProvider } from '@material-ui/core/styles';

// MUI import
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Checkbox from '@mui/material/Checkbox';
import List from '@material-ui/core/List';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItem from '@material-ui/core/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import Slider from '@mui/material/Slider';
import Tab from '@material-ui/core/Tab';
import TabContext from '@material-ui/lab/TabContext';
import TabList from '@material-ui/lab/TabList';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import PropTypes from 'prop-types';
import LinearProgress from '@mui/material/LinearProgress';
import Alert from '@mui/material/Alert';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';


//Icon import
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AddIcon from '@mui/icons-material/Add';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import AutoModeIcon from '@mui/icons-material/AutoMode';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import HelpIcon from '@mui/icons-material/Help';
import UploadIcon from '@mui/icons-material/Upload';
import SendIcon from '@mui/icons-material/Send';
import ImageIcon from '@mui/icons-material/Image';
import HideImageIcon from '@mui/icons-material/HideImage';
import MenuIcon from '@mui/icons-material/Menu';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import SaveIcon from '@mui/icons-material/Save';
import ClearIcon from '@mui/icons-material/Clear';
import BrokenImageIcon from '@mui/icons-material/BrokenImage';
import FontDownloadIcon from '@mui/icons-material/FontDownload';
import CollectionsIcon from '@mui/icons-material/Collections';
import CasinoOutlinedIcon from '@mui/icons-material/CasinoOutlined';
import CloseIcon from '@mui/icons-material/Close';
import CollectionsBookmarkIcon from '@mui/icons-material/CollectionsBookmark';
import TranslateIcon from '@mui/icons-material/Translate';
import GTranslateIcon from '@mui/icons-material/GTranslate';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';


// other func
import RViewerJS from 'viewerjs-react'
import LinearWithValueLabelProgress from './progress.jsx'

// CSS
import useStyles from '../css/style';

//api
import { server, django, file_url } from '../api.js'

const modelList = [
  { value: "SDI2", label: "Stable Diffusion Inpaint 2", type: ["inpaint"] },
  { value: "CNI", label: "ControlNet Inpaint 2", type: ["inpaint"] },
  { value: "SD21", label: "Stable Diffusion 2.1", type: ["text2img", "img2img"] },
  { value: "SD15", label: "Stable Diffusion 1.5", type: ["text2img", "img2img"] },
]
const inpaintList = ["SDI2", "CNI"]
const SDList = ["SD15", "SD21"]

const languages = [{title:'中文',value:'chs'},{title:'English',value:'eng'}]

const listTheme = createTheme({
  overrides: {
    MuiListItem: {
      root: {
        "&$selected": {
          backgroundColor: "#6A0D70",
          "&:hover": {
            backgroundColor: "#6A0D70",
          },
        },
      },
      button: {
        "&:hover": {
          backgroundColor: "rgba(231, 50, 140, 0.3)",
        },
      },
    },
  },
});


const SettingDrawer = ({ open, generateHandler, edgeGenerate, logout,
  prompt, setPrompt, setLabelOpen, setIsNegativeLabel,
  negativePrompt, setNegativePrompt,
  type, setType,
  model, setModel,
  loraModel, setLoraModel, loraList,
  CNModel, setCNModel, CNList,
  imageCount, setImageCount,
  steps, setSteps,
  loading, setLoading,
  generateState, setGenerateState,
  setSelectedImg, setSelectedMask, setSelectedCNImg,
  noiseRatio, setNoiseRatio,
  randomSeed, setRandomSeed, getRandomSeed,
  promptWeight, setPromptWeight,
}) => {
  const theme = useTheme();
  const classes = useStyles();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  // img Src
  const [imageSrc, setImageSrc] = useState(null);
  const [maskSrc, setMaskSrc] = useState(null);
  const [CNImgSrc, setCNImgSrc] = useState(null);
  const inputImgRef = useRef();
  const inputMaskRef = useRef();
  const inputCNRef = useRef();

  // control Help
  const [helpOpen, setHelpOpen] = useState(false)

  const handleOnClickImgUpload = () => { inputImgRef.current.click(); };
  const handleOnClickMaskUpload = () => { inputMaskRef.current.click(); };
  const handleOnClickCNUpload = () => { inputCNRef.current.click(); };
  const selectImgHandler = (event, type) => {
    if (type === "img") {
      setSelectedImg(event.target.files[0]);
    } else if (type === "mask") {
      setSelectedMask(event.target.files[0]);
      preview(event, "mask");
    } else if (type === "cn") {
      setSelectedCNImg(event.target.files[0]);
    }
    preview(event, type);
  };

  const clearImg = (type) => {
    if (type === "img") {
      setImageSrc(null)
      setSelectedImg(undefined)
      inputImgRef.current.value = ''
    } else if (type === "mask") {
      setMaskSrc(null)
      setSelectedMask(undefined)
      inputMaskRef.current.value = ''
    } else if (type === "cn") {
      setCNImgSrc(null)
      setSelectedCNImg(undefined)
      inputCNRef.current.value = ''
    }
  }

  const preview = (event, type) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.addEventListener("load", function () {
      // convert image file to base64 string
      if(type === "img") setImageSrc(reader.result)
      else if(type === "mask") setMaskSrc(reader.result)
      else if(type === "cn") setCNImgSrc(reader.result)
    }, false);

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (newType, newModel) => {
    setModel(newModel)
    setLoading(true)
    const formData = new FormData();
    formData.append('type', newType);
    formData.append('model', newModel);
    django({ url: '/changePipe/', method: 'post', data: formData })
        .then(res => {
          if (res.data.msg === "successed") {
            setLoading(false)
          }
        }).catch((err)=>setGenerateState(false))
  }

  const handleChangeType = (e, typeValue) => {
    if (typeValue !== type){
      setType(typeValue);
      let newModel = model
      if (typeValue == "inpaint" && !inpaintList.includes(model)){
        newModel = 'SDI2'
      } else if (typeValue != "inpaint" && inpaintList.includes(model)){
        newModel = 'SD21'
      }
      
      handleChange(typeValue, newModel)
    }
  };

  const handleChangeModel = (modelValue) => {
    if (modelValue !== model){
      setModel(modelValue)
      handleChange(type, modelValue)
    }
  }

  const handleChangeLora = (value) =>  setLoraModel(value)
  const handleChangeCN = (value) =>   setCNModel(value)

  const handleChangeSteps = (value) =>{
    //設置上限
    value <= 200 ? setSteps(value) : setSteps(200)
  }

  const Options = () => {
    return(
      <Box sx={{p:2}}>
        <Box className={classes.flexCol+" "+classes.flexCenter} sx={{mb:1}}>
          <Button
            size="large"
            sx={{
              width: '95%',
              backgroundColor: '#800080', // 改成紫色
              color: 'white',
              fontSize: '1.2rem',
              padding: '12px 0',
              borderRadius: '10px',
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
              transition: 'transform 0.3s ease',
              '&:hover': {
                backgroundColor: '#6a0dad',
                transform: 'scale(1.05)',
              },
            }}
            variant="contained"
            // startIcon={<SendIcon />}
            onClick={generateHandler}
            disabled={generateState}
          >
            Generate
          </Button>
        </Box>

        <Typography variant="h6">选择生成模型</Typography>
        <Select value={model} onChange={(e)=>handleChangeModel(e.target.value)}
                fullWidth color="secondary">
          {modelList.map((option) => (
            option.type.includes(type)?
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>:null
          ))}
        </Select>

        {/* 微調模型选择 */}
        <Typography variant="h6" mt={2}>微調模型选择</Typography>
        <Select value={loraModel} onChange={(e)=>handleChangeLora(e.target.value)}
                fullWidth color="secondary">
            <MenuItem key={0} value={'None'}>
              None
            </MenuItem>
          {loraList?.map((item,idx) => (
            <MenuItem key={idx+1} value={item}>
              {item}
            </MenuItem>
          ))}
        </Select>

        {/* 是否使用邊緣模型(controlNet canny 2) */}
        <Typography variant="h6" mt={2}>控制模型选择</Typography>
        <Select value={CNModel} onChange={(e)=>handleChangeCN(e.target.value)}
                fullWidth color="secondary">
            <MenuItem key={0} value={'None'}>
              None
            </MenuItem>
          {CNList?.map((item,idx) => (
            <MenuItem key={idx+1} value={item}>
              {item}
            </MenuItem>
          ))}
        </Select>

        {/* 上傳图片 */}
        { type === 'text2img'? null: 
          <Typography variant="h6" mt={2}>上傳图片</Typography>}
        { type === 'text2img'? null: <Box className={classes.imgBox}>
          <input style={{ display: 'none' }}
            ref={inputImgRef}
            type="file" accept="image/*"
            onChange={(e)=>selectImgHandler(e,"img")} />
          {imageSrc?
          <Box sx={{position:"absolute"}}>
            <RViewerJS sx={{position:"absolute"}}><img height="200px" src={imageSrc} /></RViewerJS>
          </Box>: null}
          {!imageSrc?
          <IconButton onClick={handleOnClickImgUpload}>
            <AddIcon fontSize="large" />
          </IconButton> :
          <Box className={classes.flexCol} sx={{marginLeft:"auto", marginBottom:"auto"}}>
            <IconButton sx={{}} onClick={()=>clearImg("img")}>
              <ClearIcon/>
            </IconButton>
            <IconButton sx={{}} onClick={handleOnClickImgUpload}>
              <AddBoxOutlinedIcon />
            </IconButton>
          </Box>}
        </Box>}

        {/* 上傳Mask */}
        { type === 'inpaint'? 
          <Typography variant="h6" mt={1}>上傳遮罩</Typography>: null}
        { type === 'inpaint'? <Box className={classes.imgBox}>
          <input style={{ display: 'none' }}
            ref={inputMaskRef}
            type="file" accept="image/*"
            onChange={(e)=>selectImgHandler(e,"mask")} />
          {maskSrc?
          <Box sx={{position:"absolute"}}>
            <RViewerJS sx={{position:"absolute"}}><img height="200px" src={maskSrc} /></RViewerJS>
          </Box>: null}
          {!maskSrc?
          <IconButton onClick={handleOnClickMaskUpload}>
            <AddIcon fontSize="large" />
          </IconButton> :
          <Box className={classes.flexCol} sx={{marginLeft:"auto", marginBottom:"auto"}}>
            <IconButton sx={{}} onClick={()=>clearImg("mask")}>
              <ClearIcon/>
            </IconButton>
            <IconButton sx={{}} onClick={handleOnClickMaskUpload}>
              <AddBoxOutlinedIcon />
            </IconButton>
          </Box>}



        </Box>:null}

        {/* 上傳CNimg */}
        { CNModel === 'None'? null:
          <Box className={classes.flexRow}>
          <Typography variant="h6" mt={1}>上傳控制图片</Typography>
            <Box sx={{flexGrow:1}}/>
            <IconButton sx={{ml: 1}} onClick={edgeGenerate}>
              <AutoModeIcon/>
            </IconButton>
          </Box>}
        { CNModel === 'None'? null: <Box className={classes.imgBox}>
          <input style={{ display: 'none' }}
            ref={inputCNRef}
            type="file" accept="image/*"
            onChange={(e)=>selectImgHandler(e,"cn")} />
          {CNImgSrc?
          <Box sx={{position:"absolute"}}>
            <RViewerJS sx={{position:"absolute"}}><img height="200px" src={CNImgSrc} /></RViewerJS>
          </Box>: null}
          {!CNImgSrc?
            <IconButton onClick={handleOnClickCNUpload}>
              <AddIcon fontSize="large" />
            </IconButton> :
            <Box className={classes.flexCol} sx={{marginLeft:"auto", marginBottom:"auto"}}>
              <IconButton sx={{}} onClick={()=>clearImg("cn")}>
                <ClearIcon/>
              </IconButton>
              <IconButton sx={{}} onClick={handleOnClickCNUpload}>
                <AddBoxOutlinedIcon />
              </IconButton>
            </Box>}
        </Box>}


        <Box className={classes.flexRow} sx={{justifyContent:'space-between', mt:2}}>
          <Box sx={{width:'25%'}}>
            <Typography variant="h6" >渲染步数</Typography>
            <TextField
              color="secondary"
              type="number"
              value={steps}
              InputProps={{ inputProps: { min: 1, max:200} }}
              onChange={(e) => handleChangeSteps(e.target.value)}
            />
          </Box>
          <Box sx={{width:'20%'}}>
            <Typography variant="h6" >生成张数</Typography>
            <Select color="secondary" value={imageCount} onChange={(e) => setImageCount(e.target.value)}>
              {[1, 2, 3, 4].map((option) => (
                <MenuItem key={option} value={option}>
                  {option} 张
                </MenuItem>
              ))}
            </Select>
          </Box>

          {/* 隨機種子 */}
          <Box sx={{width:'45%'}}>
            <Box className={classes.flexRow}>
              <Typography variant="h6" >随机种子</Typography>
              <Box sx={{flexGrow:1}}/>
              <IconButton sx={{p:0}} onClick={()=>setRandomSeed(getRandomSeed())}>
                <CasinoOutlinedIcon />
              </IconButton>
            </Box>
            <TextField
              type="number"
              color="secondary"
              value={randomSeed}
              InputProps={{ inputProps: { min: -1} }}
              onChange={(e) => setRandomSeed(e.target.value)}
            />
          </Box>
        </Box>

        {/* 噪声比例 */}
        <Typography variant="h6" gutterBottom mt={2}>重繪幅度</Typography>
        <Slider
          value={noiseRatio}
          min={0}
          max={1}
          step={0.01}
          onChange={(e, newValue) => setNoiseRatio(newValue)}
          valueLabelDisplay="auto"
          sx={{color: '#800080'}}
        />
        <Typography variant="body2">当前噪声比例: {noiseRatio}</Typography>

        {/* 提示权重 */}
        <Typography variant="h6" gutterBottom mt={2}>提示权重</Typography>
        <Slider
          value={promptWeight}
          min={1}
          max={30}
          step={1}
          onChange={(e, newValue) => setPromptWeight(newValue)}
          valueLabelDisplay="auto"
          sx={{color: '#800080'}}
        />
        <Typography variant="body2" mb={2}>当前提示权重: {promptWeight}</Typography>

        {/* Prompt和NegativePrompt输入框 */}
        <Box className={classes.flexRow} sx={{justifyContent:"space-between"}}>
          <Typography variant="h6" gutterBottom >Prompt</Typography>
          {/* 翻譯按鈕 */}
          <IconButton sx={{p:0,ml:1}} edge="start" color="inherit"
            onClick={(e)=>handleTranslateClick(e, 0)}>
            <GTranslateIcon />
          </IconButton>
          <Box sx={{flexGrow:1}}/>
          {/* 打開Prompt label標籤欄 */}
          <Tooltip title={<h4>Prompt label</h4>} placement="top" arrow>
          <IconButton sx={{p:0}} edge="start" color="inherit"
          onClick={()=>{setLabelOpen(true);setIsNegativeLabel(0)}} >
              <CollectionsBookmarkIcon />
          </IconButton>
          </Tooltip>
        </Box>
        <textarea
          type="text"
          rows="3"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          style={{ width: '100%', padding: '10px', marginBottom: '15px' }}
        />
        <Box className={classes.flexRow}>
          <Typography variant="h6" gutterBottom>Negative Prompt</Typography>
          {/* 翻譯按鈕 */}
          <IconButton sx={{p:0,ml:1}} edge="start" color="inherit"
            onClick={(e)=>handleTranslateClick(e, 1)}>
            <GTranslateIcon />
          </IconButton>
          <Box sx={{flexGrow:1}}/>
          {/* 打開Negative label標籤欄 */}
          <Tooltip title={<h4>Negative label</h4>} placement="top" arrow>
          <IconButton sx={{p:0}} edge="start" color="inherit"
          onClick={()=>{setLabelOpen(true);setIsNegativeLabel(1)}} >
              <CollectionsBookmarkIcon />
          </IconButton>
          </Tooltip>
        </Box>
        <textarea
          type="text"
          rows="3"
          value={negativePrompt}
          onChange={(e) => setNegativePrompt(e.target.value)}
          style={{ width: '100%', padding: '10px', marginBottom: '15px' }}
        />

      </Box>
    )
  }

  const HelpDialog = () => (
    <Dialog
    onClose={()=>setHelpOpen(false)}
    aria-labelledby="customized-dialog-title"
    open={helpOpen}
    >
      <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
        Help Document
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={()=>setHelpOpen(false)}
        sx={(theme) => ({
          position: 'absolute',
          right: 8,
          top: 8,
          color: theme.palette.grey[500],
        })}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent dividers>
        <Typography gutterBottom>
        a thangka of Sitting Avalokiteshvara,four-armd, best quality ,masterpiece, Exquisite painting
        </Typography>
        <Typography gutterBottom>
        a thangka of knowledge wheel,gold wheel in exquisite patterned drop shape,on a dark pink utpala flower with cloud-shaped petals around bushy jagged dark green leaves,above is a part of classic Lotus Terrace,leftside is green leave,behind is blue sea with waves,Exquisite painting,MianTang style,dim colors,
        </Typography>
        <Typography gutterBottom>
        Ekadasamukha head, consists of white and green and red faces, bright colors, wear golden Tiara, top is a small red Buddha head with black hair, exquisite Mandorla, MianTang style, Thousand-armed, background is clouds on gray blue sky
        </Typography>
      </DialogContent>
    </Dialog>
  )


  const [anchorEl, setAnchorEl] = useState(null);
  const [languageNMenu, setLanguageNMenu] = useState(0);
  const languageMenuOpen = Boolean(anchorEl);
  const handleTranslateClick = (event,negative) => {
    console.log(negative)
    setAnchorEl(event.currentTarget);
    setLanguageNMenu(negative)
  };
  const handleTranslateClose = () => setAnchorEl(null);

  const translate = (lang) => {
    let text = languageNMenu? negativePrompt: prompt
    if (text) {
      const formData = new FormData();
      formData.append('text', text);
      formData.append('lang', lang);
      django({ url: '/translate/', method: 'post', data: formData })
      .then(res=>{
        languageNMenu? setNegativePrompt(res.data.text): setPrompt(res.data.text)
      })
    }
    handleTranslateClose()
  }


  return (
    
    <Drawer
      variant="permanent"
      className={clsx(classes.drawer, {
        [classes.drawerOpen]: open,
        [classes.drawerClose]: !open,
      })}
      classes={{
        paper: clsx({
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        }),
      }}
    >
      
      <ThemeProvider theme={listTheme}>
      
      {/* control loading model */}
      <Dialog
        fullScreen={fullScreen}
        fullWidth
        open={loading}
        maxWidth={'sm'}
        >
        <DialogTitle>
          {"Loading Model......"}
        </DialogTitle>
        <DialogContent>
          <LinearWithValueLabelProgress maxValue={1000}/>
        </DialogContent>
      </Dialog>

      {/* Warning: findDOMNode is deprecated and will be removed in the next major release. (because Tooltip) */}
      {!open ? <List>
        <Tooltip title={<h3>inpaint model</h3>} placement="right" arrow>
        <ListItem button selected={type === 'inpaint'} onClick={(e)=>handleChangeType(e,'inpaint')}>
          {type === 'inpaint'?
          <ListItemIcon sx={{ pl: .5, color:"white" }}><BrokenImageIcon /></ListItemIcon>:
          <ListItemIcon sx={{ pl: .5 }}><BrokenImageIcon /></ListItemIcon>}
          <ListItemText>inpaint</ListItemText>
        </ListItem>
        </Tooltip>
        <Tooltip title={<h3>text2img model</h3>} placement="right" arrow>
        <ListItem button selected={type === 'text2img'} onClick={(e)=>handleChangeType(e,'text2img')}>
        {type === 'text2img'?
          <ListItemIcon sx={{ pl: .5, color:"white" }}><FontDownloadIcon /></ListItemIcon>:
          <ListItemIcon sx={{ pl: .5 }}><FontDownloadIcon /></ListItemIcon>}
          <ListItemText>text2img</ListItemText>
        </ListItem>
        </Tooltip>
        <Tooltip title={<h3>img2img model</h3>} placement="right" arrow>
        <ListItem button selected={type === 'img2img'} onClick={(e)=>handleChangeType(e, 'img2img')}>
        {type === 'img2img'?
          <ListItemIcon sx={{ pl: .5, color:"white" }}><CollectionsIcon /></ListItemIcon>:
          <ListItemIcon sx={{ pl: .5 }}><CollectionsIcon /></ListItemIcon>}
          <ListItemText>img2img</ListItemText>
        </ListItem>
        </Tooltip>
      </List> : null}

      {/* 更改生成模式Tab */}
      {open ? 
      <TabContext value={type? type : 'text2img'} >
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChangeType} aria-label="generate type tabs" >
            <Tab label="inpaint" value="inpaint"  />
            <Tab label="text2img" value="text2img" />
            <Tab label="img2img" value="img2img" />
          </TabList>
        </Box>
      </TabContext> : null}

      {
        open? Options() : null
      }

      <Menu
        id="LanguageMenu"
        anchorEl={anchorEl}
        open={languageMenuOpen}
        onClose={handleTranslateClose}
        slotProps={{
          paper: {
            style: {
              width: '20ch',
            },
          },
        }}
      >
        {languages.map((option,idx) => (
          <MenuItem key={idx} onClick={()=>translate(option.value)}>
            {option.title}
          </MenuItem>
        ))}
      </Menu>

      <Box sx={{ flexGrow: 1 }} />
      <Divider />
      <List>
        <Tooltip title={<h3>Logout</h3>} placement="right" arrow>
          <ListItem button onClick={logout}>
            <ListItemIcon sx={{ pl: .5 }}>
              <ExitToAppIcon />
            </ListItemIcon>
            <ListItemText>Logout</ListItemText>
          </ListItem>
        </Tooltip>
        <Tooltip title={<h3>Help</h3>} placement="right" arrow>
        <ListItem button onClick={()=>setHelpOpen(true)}>
          <ListItemIcon sx={{ pl: .5 }}><HelpIcon/></ListItemIcon>
          <ListItemText>Help</ListItemText>
        </ListItem>
        </Tooltip>
      </List>
      
      {
        open? <Box sx={{ mb: 9 }}/> : <Box sx={{ mb: 9 }} />
      }
      </ThemeProvider>
      <HelpDialog/>
    </Drawer>
    
  )
}

export default SettingDrawer