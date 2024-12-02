import * as React from 'react';
import { useState, useEffect } from 'react';
import { useWindowSize } from "@uidotdev/usehooks";
import Drawer from '@material-ui/core/Drawer';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControlLabel from '@mui/material/FormControlLabel';

//Icon
import AddIcon from '@mui/icons-material/Add';
import EditOffIcon from '@mui/icons-material/EditOff';
import EditIcon from '@mui/icons-material/Edit';
import EditNoteIcon from '@mui/icons-material/EditNote';

// CSS
import useStyles from '../css/style';

//api
import { server, django, file_url } from '../api.js';


const StyledTabs = styled((props) => (
  <Tabs
    {...props}
    TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
  />
))({
  '& .MuiTabs-indicator': {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  '& .MuiTabs-indicatorSpan': {
    width: '70%',
    backgroundColor: '#635ee7',
  },
  '& .MuiTabScrollButton-root':{
    color:'white',
  }
});

const StyledTab = styled((props) => <Tab disableRipple {...props} />)(
  ({ theme }) => ({
    textTransform: 'none',
    fontWeight: theme.typography.fontWeightRegular,
    fontSize: theme.typography.pxToRem(15),
    marginRight: theme.spacing(1),
    color: 'rgba(255, 255, 255, 0.7)',
    '&.Mui-selected': {
      color: '#fff',
    },
    '&.Mui-focusVisible': {
      backgroundColor: 'rgba(100, 95, 228, 0.32)',
    },
  }),
);

const cellList = {label:{url:'Label', title:'標籤'}, class:{url:'Class', title:'類別'}}


export default function LabelDrawer({ open, setLabelOpen, isNegativeLabel, 
  prompt, setPrompt, negativePrompt, setNegativePrompt, userId }) {
  const size = useWindowSize();
  const styles = useStyles();
  const [classTab, setClassTab] = useState();
  const [labelList, setLabelList] = useState([]);
  const [classList, setClassList] = useState([]);
  const [renderLabel, setRenderLabel] = useState(false);
  const [renderClass, setRenderClass] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteCheck, setDeleteCheck] = useState(false);

  const [cellDialogOpen, setCellDialogOpen] = useState(false);
  const [openType, setOpenType] = useState();
  const [openFunc, setOpenFunc] = useState();
  const [selectItem, setSelectItem] = useState();
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);
  const [helperText, setHelperText] = useState('');

  useEffect(() => {
    server({ url: '/getClassList', params:{negative:isNegativeLabel, user_id: userId} })
    .then((res) => {
      setClassList(res.data);
      setClassTab(res.data[0].id)
    }).catch(error => console.error('Error fetching class list:', error));
    
    server({ url: '/getLabelList', params:{user_id: userId} })
    .then((res) => {
      setLabelList(res.data);
    }).catch(error => console.error('Error fetching label list:', error));
  }, [open]);

  useEffect(() => {
    server({ url: '/getClassList', params:{negative:isNegativeLabel, user_id: userId} })
    .then((res) => {
      setClassList(res.data);
      setClassTab(openFunc==='add'?res.data.at(-1).id:res.data[0].id)
    }).catch(error => console.error('Error fetching class list:', error));
  }, [renderClass]);

  useEffect(() => {
    server({ url: '/getLabelList', params:{user_id: userId} })
    .then((res) => {
      setLabelList(res.data);
    }).catch(error => console.error('Error fetching label list:', error));
  }, [renderLabel]);

  const handleChange = (event, newValue) => {
    setClassTab(newValue);
  };

  // 点击label事件：檢查是否已存在，更新prompt
  const handleCellClick = (label) => {
    let promptStr = isNegativeLabel? negativePrompt : prompt
    let setPromptStr = isNegativeLabel? setNegativePrompt : setPrompt

    let promptList = promptStr? promptStr.split(',') : []
    let labelIdx = promptList.indexOf(label)
    if (promptList.indexOf(label) < 0) promptList.push(label)
    else promptList.splice(labelIdx, 1)
    setPromptStr(promptList.join(','))
  };

  const handleCellFunc = (type, func, item) => {
      setCellDialogOpen(true)
      setOpenType(type)
      setOpenFunc(func)
      if (func === 'edit') {
        setInput(item.value)
        setSelectItem(item)
      }
  }

  const addCell = () => {
    if (input) {
        let data = {}
        if (openType === 'label'){
          data = {user_id:userId, class_id:classTab, value:input}
        } else {
          data = {user_id:userId, value:input, negative:isNegativeLabel}
        }
        server({url:'/add'+cellList[openType].url, method:'post', data})
            .then((res) => {
            if(res.data === 'existed'){
                setError(true)
                setHelperText('該'+cellList[openType].title+'已存在')
            } else {
                openType === 'label'?setRenderLabel(!renderLabel):setRenderClass(!renderClass)
                handleClose()
            }
        })
    } else {
        setError(true)
        setHelperText('请输入'+cellList[openType].title+'名稱')
    }
}

  const putCell = () => {
      if (input && input !== selectItem.value) {
        let data = {}
        if (openType === 'label'){
          data = {id:selectItem.id, value:input, user_id:userId, class_id:classTab}
        } else {
          data = {id:selectItem.id, user_id:userId, value:input, negative:isNegativeLabel}
        }
        server({url:'/put'+cellList[openType].url, method:'put', data})
            .then((res) => {
            if(res.data === 'existed'){
                setError(true)
                setHelperText('該'+cellList[openType].title+'已存在')
            } else {
                openType === 'label'?setRenderLabel(!renderLabel):setRenderClass(!renderClass)
                handleClose()
            }
        })
      } else {
        handleClose()
      }
      if (!input) {
          setError(true)
          setHelperText('请输入'+cellList[openType].title+'名稱')
      }
  }

  const deleteCell = () => {
      if (openType === 'class') setShowDelete(true)
      if (openType === 'class'&& deleteCheck || openType === 'label') {
        server({url:'/delete'+cellList[openType].url, method:'delete',data:{id:selectItem.id}})
        .then((res) => {
          openType === 'label'?setRenderLabel(!renderLabel):setRenderClass(!renderClass)
        }) 
        handleClose()
      }
  }

  const handleClose = () => {
    setInput('')
    setError(false);
    setHelperText('');
    setCellDialogOpen(false)
    setShowDelete(false)
    setDeleteCheck(false)
  }

  const filteredClasses = classList.filter(cls => cls['negative'] === isNegativeLabel);
  const filteredLabels = labelList.filter(label => label['class'] === classTab); // 确保 classTab 和 label['class'] 比较时为字符串

  return (
    <>
      <Drawer anchor={'right'} open={open} onClose={() => setLabelOpen(false)} disableEnforceFocus>
        <Box
          height="100vh"
          className={styles.labelDrawer}
          sx={{ width: `${size.width - 480}px` }}
        > 
          <Box className={styles.flexRow}>
            <StyledTabs
              value={classTab}
              onChange={handleChange}
              aria-label="label class tabs"
              variant="scrollable"
              scrollButtons="auto"
              TabIndicatorProps={{
                style: {
                  color: "#6A0DA0",
                  backgroundColor: "#6A0DA0",
                }
              }}
            >
              {filteredClasses?.map((item, idx) => (
                <StyledTab
                  key={idx}
                  label={<Box>
                    {item.value}
                    {showEdit&&item.user_id?
                    <EditIcon sx={{ml:1,fontSize:18,verticalAlign:'middle'}}/>
                    :null}
                  </Box>}
                  value={item.id}
                  className={styles.tab}
                  onClick={()=>showEdit&&item.user_id?handleCellFunc('class','edit',item):null}
                />
              ))}
            </StyledTabs>
            <Tooltip title={<h3>add class</h3>} placement="bottom" arrow>
              <IconButton key={-1} edge="start" className={styles.tabIconButton} onClick={()=>handleCellFunc('class','add')}>
                  <AddIcon/>
              </IconButton>
            </Tooltip>
            <Box sx={{flex:1}}/>
            <Tooltip title={showEdit? <h3>edit</h3>:<h3>close edit</h3> } placement="bottom" arrow>
              <IconButton key={-2} edge="start" className={styles.tabIconButton} onClick={()=>setShowEdit(!showEdit)}>
                  {showEdit? <EditNoteIcon/>:<EditOffIcon/>}
              </IconButton>
            </Tooltip>
          </Box>
          <Box className={styles.tableRoot}>
          <Grid container spacing={3}>
            {/* xs sm md lg xl xxl */}
            {filteredLabels.length > 0 ? (
              filteredLabels?.map((label, idx) => (
                <Grid item xs={12} sm={6} md={3} lg={2} xl={1} xxl={1} key={idx}>
                  <Paper className={styles.paper} onClick={()=>showEdit&&label.user_id?handleCellFunc('label','edit',label):handleCellClick(label.value)} >
                      <Box sx={{margin:'0 auto', maxWidth:'100%', wordWrap: 'break-word', textWrap: 'wrap'}}>{label.value}</Box>
                      {showEdit && label.user_id? 
                        <EditIcon sx={{fontSize:20,verticalAlign:'middle',position:'absolute'}}/>
                      :null}
                  </Paper>
                </Grid>
              ))
            ) : null }
                <Grid item xs={12} sm={6} md={3} lg={2} xl={1} xxl={1} key={-1}>
                  <Paper className={styles.paper} onClick={()=>handleCellFunc('label','add')} >
                    <AddIcon sx={{ margin:'0 auto',fontSize: 23, verticalAlign:'middle'}}/>
                  </Paper>
                </Grid>
          </Grid>
          </Box>
        </Box>
      </Drawer>
      <Dialog open={cellDialogOpen} onClose={handleClose} disableEnforceFocus>
      <DialogTitle >{openFunc === 'add'? '新增': '编辑'}{openType === 'class'? '類別': '標籤'}</DialogTitle>
      <DialogContent sx={{pb:'20px'}}>
          <TextField
              autoFocus
              margin="dense"
              id="label"
              fullWidth
              variant="outlined"
              color="secondary"
              error={error}
              helperText={helperText}
              FormHelperTextProps={{
                className: styles.helperText
              }}
              value={input}
              onChange={(e)=>{
                  setInput(e.target.value)
                  setError(false)
                  setHelperText('')
              }}
          />
          {showDelete? <FormControlLabel required
          control={<Checkbox color="secondary" onChange={()=>setDeleteCheck(!deleteCheck)}/>} 
          label="Confirm to delete, all labels in this class will be deleted" />
          : null }
      </DialogContent>
      <DialogActions sx={{display:'flex', justifyContent:'space-between'}}>
      <Button sx={{ml:'15px'}} className={styles.cancelButton} variant="outlined" onClick={handleClose}>Cancel</Button>
      {showEdit&&openFunc==='edit'?<Button variant="contained" color="warning" onClick={deleteCell}>Delete</Button>:null}
      <Button sx={{mr:'15px'}} variant="contained" color="secondary" onClick={openFunc === 'add'?addCell:putCell}>Submit</Button>
      </DialogActions>
    </Dialog>
    </>
  );
}
