// React and Basic import
import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';
import axios from "axios";

// React MUI import
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
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

//other func
import RViewerJS from 'viewerjs-react'
import defaultImage from '../images/defaultImage.jpeg'

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
import SettingsIcon from '@mui/icons-material/Settings';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

//api
import { server, django, file_url } from '../api.js'

//cookie
const cookies = new Cookies();


//Main
export function Home() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(cookies.get('user_id'));
  const [userName, setUserName] = useState(cookies.get('user_name'));

  const [SDMvalue, setSDMvalue] = useState('SDI2');
  const [SDMname, setSDMname] = useState('SDI2');
  const [maskImgValue, setMaskImgValue] = useState(false);
  const [progress, setProgress] = useState(false);
  const [selectedImg, setSelectedImg] = useState(null);
  const [selectedMask, setSelectedMask] = useState(null);
  const [imageSrc, setImageSrc] = useState(defaultImage);
  const [maskSrc, setMaskSrc] = useState(defaultImage);
  const [result, setResult] = useState('');
  const [outputSrc, setOutputSrc] = useState(null);

  const [optionLevel, setOptionLevel] = useState(1);
  const [generateType, setGenerateType] = useState(null)
  const [prompt, setPrompt] = useState("");
  const [enterPrompt, setEnterPrompt] = useState(false);
  const [steps, setSteps] = useState(10);

  const [chatDialogs, setChatDialogs] = useState([{ type: 'option' }]);

  useEffect(() => {
    if (!userId) navigate('/login');
  }, [chatDialogs]);

  const handleNewDialog = (args) => {
    let newList = chatDialogs
    newList.pop()
    newList.push(args)
    newList.push({ type: 'option' })
    setChatDialogs(newList);
  }

  const preview = (event, type) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.addEventListener("load", function () {
      // convert image file to base64 string
      if (type === "img") {
        setImageSrc(reader.result)
        handleNewDialog({ type: 'image', filename: file.name, src: reader.result })
      }
      else {
        setMaskSrc(reader.result)
        handleNewDialog({ type: 'mask', filename: file.name, src: reader.result })
      }
    }, false);

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const [generateState, setGenerateState] = useState(false)
  const [inputError, setInputError] = useState(false)

  const uploadHandler = () => {
    const formData = new FormData();
    if (selectedImg && selectedMask && generateType && SDMvalue) {
      setChatDialogs([...chatDialogs, { type: 'generating' }])
      setInputError(false)
      setGenerateState(true)
      formData.append('image', selectedImg);
      formData.append('mask', selectedMask);
      formData.append('steps', steps);
      formData.append('type', generateType);
      formData.append('maskImg', maskImgValue);
      formData.append('SDModel', SDMvalue);

      if (enterPrompt) formData.append('prompt', enterPrompt);

      django({ url: '/uploadImg/', method: 'post', data: formData })
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
              handleNewDialog({ type: 'output', generateType, SDMvalue, prompt: enterPrompt, src: res.data.img })
              setGenerateState(false)
            })
          }
        })

    } else {
      setInputError(true)
    }
  }


  const handleOptionChange = (value) => {
    if (parseInt(value) === -1) {
      setOptionLevel(optionLevel - 1)
    } else {
      let level = parseInt(value.split('-')[0]) + 1
      setOptionLevel(level)
      if (level === 2) {
        let chooseType = parseInt(value.split('-')[1])

        switch (chooseType) {
          case 1:
            setGenerateType('Text-to-Image')
            break;
          case 2:
            setGenerateType('Image-to-Image')
            break
          case 3:
            setGenerateType('Image Inpaint')
            break;
          default:
            alert("Sorry, we don't have this option");
        }
      } else if (level === 3) {
        let SDM = parseInt(value.split('-')[1])

        switch (SDM) {
          case 1:
            setSDMvalue('SD2')
            setSDMname('Stable Diffusion 2')
            break;
          case 2:
            setSDMvalue('SDI2')
            setSDMname('Stable Diffusion Inpaint 2')
            break
          case 3:
            setSDMvalue('CN2')
            setSDMname('ControlNet Inpaint 2')
            break;
          default:
            alert("Sorry, we don't have this option");
        }
      }
    }
  }

  const optionDialog = (key) => (
    <Box key={key} display="flex" flexDirection="row" sx={{ mt: 1 }}>
      <Avatar sx={{ bgcolor: 'purple', width: 56, height: 56, ml: 1, mr: 1 }}>M</Avatar>
      <Card variant="outlined" sx={{ maxWidth: 360 }}>
        <Box sx={{ p: 2 }}>
          <Typography variant="h5" component="div">
            {optionLevel === 1 ? "選擇生成模式" : null}
            {optionLevel === 2 ? "選擇使用模型" : null}
            {optionLevel === 3 ? "請上傳圖片並輸入以下資訊" : null}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={optionLevel > 1 ? { mt: 1 } : null}>
            {optionLevel > 1 ? "生成模式：" + generateType : null}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {optionLevel > 2 ? "使用模型：" + SDMname : null}
          </Typography>
        </Box>
        <Divider />
        <Box>
          {optionLevel === 1 ?
            <MenuList>
              <MenuItem onClick={() => handleOptionChange("1-1")}>
                Text to Image
              </MenuItem>
              <Divider />
              <MenuItem onClick={() => handleOptionChange("1-2")}>
                Image to Image
              </MenuItem>
              <Divider />
              <MenuItem onClick={() => handleOptionChange("1-3")}>
                Image Inpaint
              </MenuItem>
            </MenuList> : null}
          {optionLevel === 2 ?
            <MenuList>
              <MenuItem onClick={() => handleOptionChange("2-1")}>
                Stable Diffution 2
              </MenuItem>
              <Divider />
              <MenuItem onClick={() => handleOptionChange("2-2")}>
                Stable Diffution Inpaint 2
              </MenuItem>
              <Divider />
              <MenuItem onClick={() => handleOptionChange("2-3")}>
                ControlNet Inpaint 2
              </MenuItem>
              <Divider />
              <MenuItem onClick={() => handleOptionChange("-1")}>
                <ListItemIcon>
                  <ArrowBackIosNewIcon fontSize="small" />
                </ListItemIcon>
                back
              </MenuItem>
            </MenuList> : null}
          {optionLevel === 3 ?
            <MenuList>
              <ListItem>
                <ListItemText sx={inputError & !selectedImg ? { color: 'red' } : null}>
                  Original Image: {selectedImg ? selectedImg.name : '等待上傳圖片...'}</ListItemText>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText sx={inputError & !selectedMask ? { color: 'red' } : null}>
                  Mask Image: {selectedMask ? selectedMask.name : '等待上傳圖片...'}</ListItemText>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText>Prompt: {enterPrompt ? enterPrompt : '等待輸入...(可空白)'}</ListItemText>
                {enterPrompt ? <IconButton onClick={() => setEnterPrompt(null)}><ClearIcon edge='end' /></IconButton> : null}
              </ListItem>
              <Divider />
              <MenuItem sx={{ mt: 1 }} onClick={uploadHandler} disabled={generateState}>
                <ListItemIcon>
                  <SendIcon fontSize="small" />
                </ListItemIcon>
                Generate
              </MenuItem>
              <Divider />
              <MenuItem onClick={() => handleOptionChange("-1")}>
                <ListItemIcon>
                  <ArrowBackIosNewIcon fontSize="small" />
                </ListItemIcon>
                back
              </MenuItem>
            </MenuList> : null}
        </Box>
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
      <Card sx={{ p: 1, mr: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Generating...
        </Typography>
        <CircularProgress color="secondary" />
      </Card>
    </Box>
  )

  const userDialog = (item, key) => (
    item.type === 'prompt' ? <Box key={key} display="flex" flexDirection="row" justifyContent="right" sx={{ mt: 1, mr: 1 }}>
      <Card sx={{ p: 1, mr: 1 }}>
        <Typography variant="h6" >
          Input Prompt
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ minWidth: '150px' }}>
          {item.text}
        </Typography>
      </Card>
      <Avatar sx={{ bgcolor: 'orange', width: 56, height: 56 }}>Y</Avatar>
    </Box> :
      <Box key={key} display="flex" flexDirection="row" justifyContent="right" sx={{ mt: 1, mr: 1 }}>
        <Card sx={{ p: 1, mr: 1 }}>
          <Typography variant="h6" >
            Uploaded {item.type === 'image' ? 'Image' : 'Mask'}: {item.filename}
          </Typography>
          {/* <Box onClick={()=>handleShowImgDialog(item.src)}><img src={item.src}/></Box> */}
          <RViewerJS><img width="512px" src={item.src} /></RViewerJS>
        </Card>
        <Avatar sx={{ bgcolor: 'orange', width: 56, height: 56 }}>Y</Avatar>
      </Box>
  )


  const showDialog = (chatDialogs) => {
    let dialogs = []
    for (let idx in chatDialogs) {
      if (chatDialogs[idx].type === 'option') {
        dialogs.push(optionDialog(idx))
      } else if (chatDialogs[idx].type === 'generating') {
        dialogs.push(generatingDialog(idx))
      } else if (chatDialogs[idx].type === 'output') {
        dialogs.push(outputDialog(chatDialogs[idx], idx))
      } else {
        dialogs.push(userDialog(chatDialogs[idx], idx))
      }
    }
    return dialogs
  }

  const AlwaysScrollToView = () => {
    const elementRef = useRef();
    useEffect(() => elementRef.current?.scrollIntoView());
    return <div ref={elementRef} />;
  };

  const NavBar = ({ userId, userName }) => {
    const logout = () => {
      cookies.remove('user_id', { path: '/' });
      cookies.remove('user_name', { path: '/' });
      navigate('/login');
    }
  
    const [menuAnchorEl, setMenuAnchorEl] = React.useState(null);
    const menuOpen = Boolean(menuAnchorEl);
    const [settingOpen, setSettingOpen] = useState(false);
    const inputImgRef = useRef();
    const inputMaskRef = useRef();
  
  
    const handleMenuClick = (event) => { setMenuAnchorEl(event.currentTarget); };
    const handleMenuClose = () => { setMenuAnchorEl(null); };
  
    const handleSettingOpen = () => {
      setSettingOpen(true)
      handleMenuClose()
    }
    const handleSettingClose = (value) => {
      setSettingOpen(false);
    };
  
    const selectImgHandler = (event) => {
      setSelectedImg(event.target.files[0]);
      preview(event, "img");
    };
    const selectMaskHandler = (event) => {
      setSelectedMask(event.target.files[0]);
      preview(event, "mask");
    };
  
    const handleOnClickImgUpload = () => { inputImgRef.current.click(); };
    const handleOnClickMaskUpload = () => { inputMaskRef.current.click(); };
  
    const deleteDialogs = () => {
      setOptionLevel(1)
      setChatDialogs([{ type: 'option' }])
      setEnterPrompt(null)
      setSelectedImg(null)
      setSelectedMask(null)
    }
  
    const enterTextHanlder = () => {
      setEnterPrompt(prompt)
      handleNewDialog({ type: 'prompt', text: prompt })
      setPrompt("")
    }
  
    const SettingDialog = () => (
      <Dialog onClose={handleSettingClose} open={settingOpen}
        PaperProps={{
          component: 'form',
          onSubmit: (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());
            const steps = formJson.steps;
            console.log(steps);
            setSteps(steps)
            handleSettingClose();
          },
        }}>
        <DialogTitle>Generate Seeting</DialogTitle>
        <DialogContent dividers>
          <TextField
            id="steps"
            name="steps"
            margin="dense"
            label="Generate steps"
            type="number"
            variant="standard"
            defaultValue={steps}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSettingClose}>Cancel</Button>
          <Button type="submit">Confirm</Button>
        </DialogActions>
      </Dialog>
    )
  
    return (
      <AppBar position="fixed"
        sx={{ bgcolor: "#212121", top: 'auto', bottom: 0, }}>
        <Toolbar variant="dense"
          sx={{ display: 'flex', flexDirection: "row", alignItems: "center", height: '6vh' }}>
          <Tooltip
            title="setting"
            placement="top"
            arrow
            slotProps={{
              popper: {
                sx: {
                  [`&.${tooltipClasses.popper}[data-popper-placement*="top"] .${tooltipClasses.tooltip}`]:
                  {
                    marginBottom: '-20px',
                  },
                },
              },
            }}
          >
            <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 5, height: '100%' }}
              onClick={handleMenuClick}>
              <MenuIcon />
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={menuAnchorEl}
            open={menuOpen}
            onClose={handleMenuClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            sx={{ left: "-15px" }}
          >
            <MenuItem onClick={logout}>
              <ListItemIcon>
                <ExitToAppIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Logout</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleSettingOpen}>
              <ListItemIcon>
                <SettingsIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Generate Setting</ListItemText>
            </MenuItem>
          </Menu>
          <input style={{ display: 'none' }}
            ref={inputImgRef}
            type="file" accept="image/*"
            onChange={selectImgHandler} />
          <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2, height: '100%' }} onClick={handleOnClickImgUpload}>
            <ImageIcon />
          </IconButton>
          <input style={{ display: 'none' }}
            ref={inputMaskRef}
            type="file" accept="image/*"
            onChange={selectMaskHandler} />
          <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2, height: '100%' }} onClick={handleOnClickMaskUpload}>
            <HideImageIcon />
          </IconButton>
          <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2, height: '100%' }} onClick={deleteDialogs}>
            <DeleteForeverIcon />
          </IconButton>
          <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2, height: '100%' }}>
            <SaveIcon />
          </IconButton>
  
          <Box
            sx={{
              Width: '100%',
              flex: 1,
              display: 'flex', flexDirection: "row", alignItems: "center",
            }}
          >
            <TextField
              required
              focused
              color="secondary"
              value={prompt}
              id='prompt'
              fullWidth
              placeholder="請輸入..."
              sx={{ input: { color: 'white', height: '90%' } }}
              onChange={(e) => setPrompt(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton
                      aria-label='toggle password visibility'
                      onClick={enterTextHanlder}>
                      <SendIcon color="secondary" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              onKeyDown={(ev) => {
                if (ev.key === 'Enter') {
                  if (prompt) {
                    enterTextHanlder()
                  }
                  ev.preventDefault();
                }
              }}
            />
          </Box>
        </Toolbar>
        <SettingDialog />
      </AppBar>
    )
  }


  return (
    <Box>
      <NavBar userId={userId} userName={userName} />
      <Container disableGutters maxWidth={false} sx={{ m: 0, pb: 10, overflow: 'auto', height: '100vh' }} >
        {showDialog(chatDialogs)}
        <AlwaysScrollToView />
      </Container>
    </Box>
  )
}

