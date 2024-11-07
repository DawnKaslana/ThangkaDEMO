import * as React from 'react';
import { useState, useEffect } from 'react';
import { useWindowSize } from "@uidotdev/usehooks";
import Drawer from '@material-ui/core/Drawer';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

//api
import { server, django, file_url } from '../api.js';

// 自定义样式
const useStyles = makeStyles((theme)=> ({
  drawer: {
    backgroundColor: '#2e1534', //'#212121'
  },
  tableRoot: {
    flexGrow: 1,
    padding:'1em',
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: '#4F4F4F',
    cursor: 'pointer',
    fontWeight:'500',
    '&:hover': {
      color:'black',
      backgroundColor: '#D3A4FF',
    },
  },
}));

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
    // maxWidth: 100,
    width: '70%',
    backgroundColor: '#635ee7',
  },
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


export default function LabelDrawer({ open, setLabelOpen, isNegativeLabel, 
  prompt, setPrompt, negativePrompt, setNegativePrompt }) {
  const size = useWindowSize();
  const styles = useStyles();
  const [classTab, setClassTab] = useState(); // 使用字符串作为初始值
  const [labelList, setLabelList] = useState([]);
  const [classList, setClassList] = useState([]);

  useEffect(() => {
    server({ url: '/getClassList', params:{isNegativeLabel} }).then((res) => {
      setClassList(res.data);
      setClassTab(res.data[0].id)
    }).catch(error => console.error('Error fetching class list:', error));
    
    server({ url: '/getLabelList' }).then((res) => {
      setLabelList(res.data);
    }).catch(error => console.error('Error fetching label list:', error));
  }, [open]);

  const handleChange = (event, newValue) => {
    setClassTab(newValue); // 将 newValue 转换为字符串
  };

  // 点击label事件，更新prompt，檢查是否已存在
  const handleCellClick = (label) => {
    let promptStr = isNegativeLabel? negativePrompt : prompt
    let setPromptStr = isNegativeLabel? setNegativePrompt : setPrompt

    let promptList = promptStr? promptStr.split(',') : []
    let labelIdx = promptList.indexOf(label)
    if (promptList.indexOf(label) < 0) promptList.push(label)
    else promptList.splice(labelIdx, 1)
    setPromptStr(promptList.join(','))
  };


  const filteredClasses = classList.filter(cls => cls['negative'] === isNegativeLabel);
  const filteredLabels = labelList.filter(label => label['class'] === classTab); // 确保 classTab 和 label['class'] 比较时为字符串

  return (
    <React.Fragment>
      <Drawer anchor={'right'} open={open} onClose={() => setLabelOpen(false)}>
        <Box
          height="100vh"
          className={styles.drawer}
          sx={{ width: `${size.width - 480}px` }}
        >
          <StyledTabs
            value={classTab}
            onChange={handleChange}
            aria-label="label class tabs"
            TabIndicatorProps={{
              style: {
                color: "#6A0DA0",
                backgroundColor: "#6A0DA0"
              }
            }}
          >
            {filteredClasses?.map((item, idx) => (
              <StyledTab
                key={idx}
                label={item.value}
                value={item.id} // 确保 value 为字符串
                className={styles.tab}
              />
            ))}
          </StyledTabs>
          <Box className={styles.tableRoot}>
          <Grid container spacing={3}>
            {/* xs sm md lg xl xxl */}
            {filteredLabels.length > 0 ? (
              filteredLabels?.map((label, idx) => (
                <Grid item xs={12} sm={6} md={3} lg={2} xl={1} xxl={1} key={idx}>
                  <Paper className={styles.paper} onClick={()=>handleCellClick(label.value)} >
                    {label.value}
                  </Paper>
                </Grid>
              ))
            ) : 'No data available' }

          </Grid>
          </Box>
        </Box>
      </Drawer>
    </React.Fragment>
  );
}
