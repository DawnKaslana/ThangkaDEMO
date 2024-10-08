// React and Basic import
import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Cookies from 'universal-cookie';

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

// CSS
import useStyles from '../css/style';

//api
import { server, django, file_url } from '../api.js'

// cookie
const cookies = new Cookies();

const SettingDrawer = ({ open, enterPrompt, handleNewDialog }) => {
  const theme = useTheme();
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

  // generate params
  const [type, setType] = useState('inpaint')
  const [model, setModel] = useState('CNI')
  const [imageCount, setImageCount] = useState(1)
  const [steps, setSteps] = useState(10)
  const [progress, setProgress] = useState(false);
  const [generateState, setGenerateState] = useState(false)
  const [selectedImg, setSelectedImg] = useState(null);
  const [selectedMask, setSelectedMask] = useState(null);
  const [inputError, setInputError] = useState(false);

  // img Src
  const [imageSrc, setImageSrc] = useState(null);
  const [maskSrc, setMaskSrc] = useState(null);
  const [result, setResult] = useState('');
  const [outputSrc, setOutputSrc] = useState(null);
  const inputImgRef = useRef();
  const inputMaskRef = useRef();

  const handleChange = (event, value) => {
    setType(value);
  };

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

  const generateHandler = () => {
    const formData = new FormData();
    if (selectedImg && selectedMask && type && model) {
      handleNewDialog({ type: 'generating' })
      setInputError(false)
      setGenerateState(true)
      formData.append('image', selectedImg);
      formData.append('mask', selectedMask);
      formData.append('steps', steps);
      formData.append('type', type);
      formData.append('SDModel', model);

      if (enterPrompt) formData.append('prompt', enterPrompt);

      django({ url: '/generate/', method: 'post', data: formData })
        .then(res => {
          setResult(res.data.msg);
          if (res.data.msg === "inpainted") {
            console.log(selectedImg.name.slice(0, -4) + "_output.png")
            django({
              url: '/getImg/', method: 'get', params: {
                imageName: selectedImg.name.slice(0, -4) + "_output.png"
              }
            }).then(res => {
              setOutputSrc(res.data.img)
              handleNewDialog({ type: 'output', gType:type, model, prompt: enterPrompt, src: res.data.img })
              setGenerateState(false)
            })
          }
        }).catch((err)=>setGenerateState(false))

    } else {
      setInputError(true)
    }
  }


  const Options = () => {
    return(
      <Box sx={{p:2}}>
        <Button size="large" sx={{width:"100%"}} variant="contained" onClick={generateHandler}>
          Generate
        </Button>

        <Typography variant="h6">选择生成模型</Typography>
        <Select value={model} onChange={(e) => setModel(e.target.value)}>
          {[
            { value: "SDI2", label: "Stable Diffusion Inpaint 2" },
            { value: "SD2", label: "Stable Diffusion 2" },
            { value: "CNI", label: "ControlNet Inpaint 2" },
            { value: "LORA", label: "LORA 模型" },
          ].map((option) => (
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

        {/* 
        以生成類別type去判斷要顯示哪些選項（改tab的時候會改type）
        你看一下網路上那些文章 哪些是常用選項 不用太多 現在兩個有點少就是了
        選項下面給一個大大的生成按鈕 呼叫uploadhanlder func
        這裡要幫我檢查他有沒有輸入圖片 沒有的話要給一個警告
        就是檢查他是不是該輸入的都輸了
        MUI的alert bar很好看 上面一條紅色的那個
        */}



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
          <TabList onChange={handleChange} aria-label="generate type tabs">
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