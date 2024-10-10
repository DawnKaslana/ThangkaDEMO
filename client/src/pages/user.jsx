// React and Basic import
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { styled,alpha } from '@mui/material/styles';
import Cookies from 'universal-cookie';

// React MUI import
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

//Icon import
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import AddToPhotosIcon from '@mui/icons-material/AddToPhotos';

//api
import { server } from '../api.js'

//cookie
const cookies = new Cookies();

//SearchField
const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  }));
  
const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));
  
const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
        width: '12ch',
        '&:focus': {
            width: '20ch',
        },
        },
    },
}));

//Main
export function User() {
    const [userList, setUserList] = useState([]);
    const [searchList, setSearchList] = useState([]);
    const [render, setRender] = useState(false);

    const [open, setOpen] = useState(false);
    const [openType, setOpenType] = useState(null);
    const [confirmOpen, setConfirmOpen] = useState(false);

    const [selectUser, setSelectUser] = useState(null);

    const [input, setInput] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [error, setError] = useState(false);
    const [helperText, setHelperText] = useState('');
    
    useEffect(() => {
        server({url:'/getUserList'}).then((res) => {
            setUserList(res.data)
            if (searchInput !== '') {
                let newUserList = []
                res.data.forEach((item) => {
                    if (item.user_name.toLowerCase().includes(searchInput.toLowerCase())){
                        newUserList.push(item)
                    }
                });
                setSearchList(newUserList)
            } else {
                setSearchList(res.data)
            }
        })
    }, [render])

    const handleClose = () => {
        setInput('');
        setError(false);
        setOpen(false);
        setHelperText('');
    };

    const handleConfirmClose = () => {
        setInput('');
        setConfirmOpen(false)
    };

    const handleSearchChange = (event) => {
        setSearchInput(event.target.value)
        let newUserList = []
        userList.forEach((item) => {
            if (item.user_name.toLowerCase().includes(event.target.value.toLowerCase())){
                newUserList.push(item)
            }
        });
        setSearchList(newUserList)
    }

    const addUser = () => {
        if (input) {
            server({url:'/addUser', method:'post',data:{"user_name":input}})
                .then((res) => {
                if(res.data === 'existed'){
                    setError(true)
                    setHelperText('用戶名已存在')
                } else {
                    setRender(!render)
                    handleClose()
                }
            })
        } else {
            setError(true)
            setHelperText('请输入用户名')
        }
    }

    const putUser = () => {
        if (input) {
            server({url:'/putUser', method:'put',data:{'user_id':selectUser, 'user_name': input}})
                .then((res) => {
                if(res.data === 'existed'){
                    setError(true)
                    setHelperText('用戶名已存在')
                } else {
                    setRender(!render)
                    handleClose()
                }
            })
        } else {
            setError(true)
            setHelperText('请输入用户名')
        }
    }

    const deleteUser = () => {
        server({url:'/deleteUser', method:'delete',data:{'user_id':selectUser}})
        .then((res) => {
            setConfirmOpen(false)
            setRender(!render)
        }) 
    }

    const navigate = useNavigate();

    const setUserCookies = (item) => {
        cookies.set('user_id', item.user_id, 
            { path: '/',secure: false,sameSite :false}
        );
        cookies.set('user_name', item.user_name, 
            { path: '/',secure: false,sameSite :false}
        );
        navigate('/');
    }

    const updateImages = () => {
        server({url:'/updateFileList'})
        .then((res) => {
            if (res.data === 'updated') alert('更新完毕')
            else alert('更新失敗')
        })
    }

    return(
    <Box sx={{height: '100vh',display: 'flex', flexDirection:'column', alignItems:'center'}}>
        <CssBaseline />
        <Box sx={{display: 'flex',
            width:{xs: '90vw', sm: '80vw', md:'60vw', lg:'40vw'}, 
            flexDirection:'row',
            alignItems:'center',
            justifyContent:'center',
            mb:'10px', mt:'5vh'}}>
            <Typography
                variant="h5"
                noWrap
                component="div"
            >
                选择用户
            </Typography>
            <Box sx={{ flexGrow: 1 }}/>
        </Box>
        <Box sx={{width:{xs: '90vw', sm: '80vw', md:'60vw', lg:'40vw'},
                border:'#6A0DA0 3px solid',
                borderRadius:'10px'}} >
            <Box sx={{
                display: 'flex',
                flexDirection:'row',
                backgroundColor:'#6A0DA0',
                color:'white',
                fontFamily: 'SimHei',
                padding:'10px',
                alignItems:'center',
                borderTopLeftRadius: '5px',
                borderTopRightRadius: '5px',
                }}>
                <Search>
                    <SearchIconWrapper>
                        <SearchIcon />
                    </SearchIconWrapper>
                    <StyledInputBase
                    placeholder="Search…"
                    inputProps={{ 'aria-label': 'search' }}
                    onChange={handleSearchChange}
                    />
                </Search>
                <Box sx={{flexGrow:1}}/>
                <Button size="large" sx={{fontSize: '1.3rem'}}
                    variant=""
                    endIcon={<AddIcon style={{ color: 'white' }}/>}
                    onClick={()=>{setOpen(true);setOpenType('add')}}>
                    <Box sx={{ display: { xs: 'none', sm: 'flex' }}}>
                        新增用户
                    </Box>
                </Button>
            </Box>
            <List sx={{ 
                maxWidth: {xs: '90vw', sm: '80vw', md:'60vw', lg:'40vw'},
                bgcolor: 'background.paper',
                p:'10px', 
                borderBottomLeftRadius: '10px',
                borderBottomRightRadius: '10px',
                }}>
            {searchList?.map((item) => (
                <ListItem
                key={item.user_id}
                disableGutters
                >
                    <ListItemButton sx={{marginRight:'85px'}} onClick={()=>setUserCookies(item)}>
                        <ListItemText primary={item.user_name} />
                    </ListItemButton>
                    <ListItemSecondaryAction>
                        <IconButton aria-label="comments" onClick={()=>{
                            setOpen(true)
                            setSelectUser(item.user_id)
                            setInput(item.user_name)
                            setOpenType('edit')
                        }}>
                            <EditIcon />
                        </IconButton>
                        <IconButton aria-label="delete" onClick={()=>{
                            setSelectUser(item.user_id)
                            setInput(item.user_name)
                            setConfirmOpen(true)}
                            }>
                            <DeleteIcon />
                        </IconButton>
                    </ListItemSecondaryAction>
                </ListItem>
            ))}
            </List>
        </Box>

        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>{openType === 'add'? '新增用户': '编辑用户'}</DialogTitle>
            <DialogContent sx={{pb:'20px'}}>
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Username"
                    fullWidth
                    variant="outlined"
                    error={error}
                    helperText={helperText}
                    value={input}
                    onChange={(e)=>{
                        setInput(e.target.value)
                        setError(false)
                        setHelperText('')
                    }}
                />
            </DialogContent>
            <DialogActions sx={{display:'flex',justifyContent:'space-between'}}>
            <Button sx={{ml:'15px'}} variant="contained" onClick={handleClose}>Cancel</Button>
            <Button sx={{mr:'15px'}} variant="contained" color="secondary" onClick={openType === 'add'?addUser:putUser}>Submit</Button>
            </DialogActions>
        </Dialog>
        <Dialog open={confirmOpen} onClose={handleConfirmClose}>
            <DialogTitle>确认删除用户{input}</DialogTitle>
            <DialogActions sx={{display:'flex',justifyContent:'space-between'}}>
            <Button sx={{ml:'15px'}} variant="contained" onClick={handleConfirmClose}>Cancel</Button>
            <Button sx={{mr:'15px'}} variant="contained" color="secondary" onClick={deleteUser}>Delete</Button>
            </DialogActions>
        </Dialog>
    </Box>
    )
}