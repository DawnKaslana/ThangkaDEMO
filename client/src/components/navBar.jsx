// React and Basic import
import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import clsx from 'clsx';

// MUI import
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import List from '@material-ui/core/List';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Toolbar from '@mui/material/Toolbar';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import Drawer from '@material-ui/core/Drawer';
import Typography from '@material-ui/core/Typography';

// Icon import
import SendIcon from '@mui/icons-material/Send';
import MenuIcon from '@mui/icons-material/Menu';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import SettingsIcon from '@mui/icons-material/Settings';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import ReplayIcon from '@mui/icons-material/Replay';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';


// CSS
import useStyles from '../css/style';

// api
import { server, django, file_url } from '../api.js'

const NavBar = ({
    inputText, setInput, errorState,
    messages, handleMessages,
    drawerOpen, setDrawerOpen,
    handleNewDialog, deleteDialogs, revokeDialogs, regenerateDialogs
}) => {
    // CSS
    const classes = useStyles();

    // handle drawers
    const handleDrawerOpen = () => {setDrawerOpen(true);};
    const handleDrawerClose = () => {setDrawerOpen(false);};

    // 新增messages & call 文心一言
    const enterTextHanlder = () => {
        //update user messages
        let userArgs = { "role": "user", "content": inputText }
        handleMessages(userArgs)
        handleNewDialog({ type: 'load', class: 'speak' })

        setInput("")

        let messagesList = messages
        messagesList.push(userArgs)
        const formData = new FormData();
        formData.append('messages', JSON.stringify(messagesList));

        django({ url: '/chat/', method: 'post', data: formData })
        .then(res=>{
            console.log(res.data)
            handleMessages(res.data)
        })

        
    }

    return (
        <AppBar position="fixed"
            className={clsx(classes.appBar, {[classes.appBarShift]: drawerOpen,})}
            sx={{ bgcolor: "#212121", top: 'auto', bottom: 0, }}>
            <Toolbar variant="dense"
                sx={{ display: 'flex', flexDirection: "row", alignItems: "center", height: '6vh' }}>

                {/* 打開生成設置drawer ＆ 登出按鈕 */}
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    onClick={!drawerOpen? handleDrawerOpen : handleDrawerClose}
                    edge="start"
                    sx={{ mr: 4}}
                >
                    {drawerOpen? <MenuOpenIcon />:<MenuIcon />}
                </IconButton>

                {/* 重新生成 */}
                <Tooltip title={<h3>regenerate</h3>} placement="top" arrow>
                <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2}}
                    onClick={regenerateDialogs}>
                    <AutorenewIcon />
                </IconButton>
                </Tooltip>
                {/* 撤回消息 */}
                <Tooltip title={<h3>revoke</h3>} placement="top" arrow>
                <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2}}
                    onClick={revokeDialogs}>
                    <ReplayIcon />
                </IconButton>
                </Tooltip>
                {/* 清除消息 */}
                <Tooltip title={<h3>clear</h3>} placement="top" arrow>
                <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2}}
                    onClick={deleteDialogs}>
                    <DeleteForeverIcon />
                </IconButton>
                </Tooltip>

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
                        value={inputText}
                        id='inputField'
                        fullWidth
                        placeholder="請輸入..."
                        sx={{ input: { color: 'white', height: '90%' } }}
                        onChange={e => setInput(e.target.value)}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position='end'>
                                    <IconButton
                                        aria-label='toggle password visibility'
                                        onClick={inputText ? enterTextHanlder : null}
                                        disabled={errorState}>
                                        <SendIcon color="secondary" />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        onKeyDown={(ev) => {
                            if (ev.key === 'Enter') {
                                if (inputText && !errorState) {
                                    enterTextHanlder()
                                }
                                ev.preventDefault();
                            }
                        }}
                    />
                </Box>
            </Toolbar>
        </AppBar>
    )
}

export default NavBar
