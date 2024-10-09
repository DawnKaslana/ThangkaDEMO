// React and Basic import
import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';

// MUI import
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import List from '@material-ui/core/List';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import Slider from '@mui/material/Slider';
import Tab from '@material-ui/core/Tab';
import TabContext from '@material-ui/lab/TabContext';
import TabList from '@material-ui/lab/TabList';
import TabPanel from '@material-ui/lab/TabPanel';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import PropTypes from 'prop-types';
import LinearProgress from '@mui/material/LinearProgress';
import Alert from '@mui/material/Alert'; // 增加Alert组件

//Icon import
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import HelpIcon from '@mui/icons-material/Help';
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
import AddIcon from '@mui/icons-material/Add';

// other func
import RViewerJS from 'viewerjs-react'
import LinearWithValueLabelProgress from './progress.jsx'

// CSS
import useStyles from '../css/style';

//api
import { server, django, file_url } from '../api.js'

const modelList = [
  { value: "CNI", label: "ControlNet Inpaint 2", type: ["inpaint"] },
  { value: "SDI2", label: "Stable Diffusion Inpaint 2", type: ["inpaint"] },
  { value: "SD21", label: "Stable Diffusion 2.1", type: ["inpaint", "text2img"] },
  { value: "SD15", label: "Stable Diffusion 1.5", type: ["inpaint", "text2img"] },
]

const loraList = [
    { value: 'Lora1', label: 'Lora1' },
    { value: 'Lora2', label: 'Lora2' },
]


const SettingDrawer = ({ open, handleNewDialog, generateHandler, logout,
  prompt, setPrompt,
  negative, setNegative,
  type, setType,
  model, setModel,
  loraModel, setLoraModel,
  imageCount, setImageCount,
  steps, setSteps,
  loading, setLoading,
  generateState, setGenerateState,
  selectedImg, setSelectedImg,
  selectedMask, setSelectedMask,
  noiseRatio, setNoiseRatio,
  randomSeed, setRandomSeed,
  promptWeight, setPromptWeight

}) => {
  const theme = useTheme();
  const classes = useStyles();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  // img Src
  const [imageSrc, setImageSrc] = useState(null);
  const [maskSrc, setMaskSrc] = useState(null);
  const inputImgRef = useRef();
  const inputMaskRef = useRef();

  const handleOnClickImgUpload = () => { inputImgRef.current.click(); };
  const handleOnClickMaskUpload = () => { inputMaskRef.current.click(); };
  const selectImgHandler = (event) => {
    setSelectedImg(event.target.files[0]);
    preview(event, "img");
  };
  const selectMaskHandler = (event) => {
    setSelectedMask(event.target.files[0]);
    preview(event, "mask");
  };


  const preview = (event, type) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.addEventListener("load", function () {
      // convert image file to base64 string
     type === "img"?setImageSrc(reader.result):setMaskSrc(reader.result)
    }, false);

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (option, changeValue) => {
    setLoading(true)
    const formData = new FormData();
    formData.append('type', option == "type"?changeValue : type);
    formData.append('model', option == "model"?changeValue : model);
    django({ url: '/changePipe/', method: 'post', data: formData })
        .then(res => {
          if (res.data.msg === "successed") {
            setLoading(false)
          }
        }).catch((err)=>setGenerateState(false))
  }

  const handleChangeType = (event, value) => {
    if (value !== type){
      setType(value);
      handleChange("type", value)
    }
  };

  const handleChangeModel = (modelValue) => {
    if (modelValue !== model){
      setModel(modelValue)
      handleChange("model", modelValue)
    }
  }


  const Options = () => {
    return(
      <Box sx={{p:2}}>
        {/* <Button size="large" sx={{width:"100%"}} variant="contained"
        onClick={generateHandler}
        >
          Generate
        </Button> */}
        <Box className={classes.flexColCenter} sx={{mb:1}}>
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
            startIcon={<SendIcon />}
            onClick={generateHandler}
          >
            Generate
          </Button>
        </Box>

        <Typography variant="h6">选择生成模型</Typography>
        <Select value={model} onChange={(e)=>handleChangeModel(e.target.value)} fullWidth>
          {modelList.map((option) => (
            option.type.includes(type)?
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>:null
          ))}
        </Select>

        {/* 微調模型选择 */}
        <Typography variant="h6" mt={2}>微調模型选择</Typography>
        <Select value={loraModel} onChange={(e) => setLoraModel(e.target.value)} fullWidth>
          {loraList.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      
        {/* 上傳图片 */}
        { type === 'text2img'? null: <Box className={classes.flexRow}>
        <Typography variant="h6">上傳图片</Typography>
          <IconButton edge="start" sx={{ mr: 2}} onClick={handleOnClickImgUpload}>
            <AddIcon/>
          </IconButton>
        </Box>}
        { type === 'text2img'? null: <Box
          sx={{
            width: "100%",
            height: "200px",
            border: "1px dashed gray",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 2,
          }}
        >
          <input style={{ display: 'none' }}
            ref={inputImgRef}
            type="file" accept="image/*"
            onChange={selectImgHandler} />
          {!imageSrc?
            <IconButton edge="start" sx={{ mr: 2}} onClick={handleOnClickImgUpload}>
              <AddIcon fontSize="large" />
            </IconButton>:
            <RViewerJS><img height="200px" src={imageSrc} /></RViewerJS>
            
          }
        </Box>}

        {/* 上傳Mask */}
        { type === 'inpaint'? <Box className={classes.flexRow}>
          <Typography variant="h6">上傳遮罩</Typography>
          <IconButton edge="start"sx={{ mr: 2}}
            onClick={handleOnClickMaskUpload}><AddIcon/></IconButton>
          </Box>: null}
        { type === 'inpaint'? <Box
          sx={{
            width: "100%",
            height: "200px",
            border: "1px dashed gray",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 2,
          }}
        >
          <input style={{ display: 'none' }}
            ref={inputMaskRef}
            type="file" accept="image/*"
            onChange={selectMaskHandler} />
          {!maskSrc?
            <IconButton edge="start" sx={{ mr: 2}} onClick={handleOnClickMaskUpload}>
              <AddIcon fontSize="large" />
            </IconButton>:
            <RViewerJS><img height="200px" src={maskSrc} /></RViewerJS>
          }
        </Box>:null}


        <Typography variant="h6">渲染步数</Typography>
        <Select value={steps} onChange={(e) => setSteps(e.target.value)}>
          {[10, 20, 30, 40, 50].map((option) => (
            <MenuItem key={option} value={option}>
              {option} 步
            </MenuItem>
          ))}
        </Select>

        <Typography variant="h6">生成张数</Typography>
        <Select value={imageCount} onChange={(e) => setImageCount(e.target.value)}>
          {[1, 2, 3, 4].map((option) => (
            <MenuItem key={option} value={option}>
              {option} 张
            </MenuItem>
          ))}
        </Select>

        {/* 噪声比例 */}
        <Typography variant="h6" gutterBottom mt={2}>噪声比例</Typography>
        <Slider
          value={noiseRatio}
          min={0}
          max={1}
          step={0.01}
          onChange={(e, newValue) => setNoiseRatio(newValue)}
          valueLabelDisplay="auto"
          sx={{
            color: '#800080', // 改成紫色
          }}
        />
        <Typography variant="body2">当前噪声比例: {noiseRatio}</Typography>

        {/* 随机种子 */}
        <Typography variant="h6" gutterBottom mt={2}>随机种子</Typography>
        <Slider
          value={randomSeed}
          min={1}
          max={100}
          step={1}
          onChange={(e, newValue) => setRandomSeed(newValue)}
          valueLabelDisplay="auto"
          sx={{
            color: '#800080', // 改成紫色
          }}
        />
        <Typography variant="body2">当前随机种子: {randomSeed}</Typography>

        {/* 提示权重 */}
        <Typography variant="h6" gutterBottom mt={2}>提示权重</Typography>
        <Slider
          value={promptWeight}
          min={0.1}
          max={1}
          step={0.05}
          onChange={(e, newValue) => setPromptWeight(newValue)}
          valueLabelDisplay="auto"
          sx={{
            color: '#800080', // 改成紫色
          }}
        />
        <Typography variant="body2">当前提示权重: {promptWeight}</Typography>


        {/* 新增的Prompt和Negative输入框 */}
        <Typography variant="h6" gutterBottom mt={2}>Prompt</Typography>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          style={{ width: '100%', padding: '10px', marginBottom: '15px' }}
        />

        <Typography variant="h6" gutterBottom>Negative Prompt</Typography>
        <input
          type="text"
          value={negative}
          onChange={(e) => setNegative(e.target.value)}
          style={{ width: '100%', padding: '10px', marginBottom: '15px' }}
        />

      </Box>
    )
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
      {/* Use for control load Model */}
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

      {!open ? <List>
        {['change type', 'change model', 'generate', 'change OO'].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon sx={{ pl: .5 }}>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List> : null}

      {/* 更改生成模式Tab */}
      {open ? 
      <TabContext value={type}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChangeType} aria-label="generate type tabs">
            <Tab label="inpaint" value="inpaint" />
            <Tab label="text2img" value="text2img" />
            <Tab label="img2img" value="img2img" />
          </TabList>
        </Box>
      </TabContext> : null}

      {
        open? Options() : null
      }

      <Box sx={{ flexGrow: 1 }} />
      <Divider />
      <List>
        <ListItem button onClick={logout}>
          <ListItemIcon sx={{ pl: .5 }}><ExitToAppIcon /></ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </ListItem>
        {/* <ListItem button>
                <ListItemIcon><HelpIcon/></ListItemIcon>
                <ListItemText>Help</ListItemText>
            </ListItem> */}
      </List>
      <Box sx={{ mb: 9 }} />
    </Drawer>
  )
}

export default SettingDrawer