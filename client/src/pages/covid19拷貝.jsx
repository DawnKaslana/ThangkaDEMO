// React and Basic import
import React, { useState, useEffect } from 'react';
import axios from "axios";
import { darkTheme } from '../css/theme';
import { styled } from '@mui/material/styles';

// React MUI import
import Box from '@mui/material/Box';
import ButtonGroup from '@mui/material/ButtonGroup';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Slider from '@mui/material/Slider';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

//Icon import
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import LeaderboardOutlinedIcon from '@mui/icons-material/LeaderboardOutlined';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import SettingsIcon from '@mui/icons-material/Settings';
import InsightsIcon from '@mui/icons-material/Insights';
import PlaceIcon from '@mui/icons-material/Place';
import placeSVG from '../images/icons/place_black_24dp.svg'

// Map import
import { Scene, Zoom, Scale,ExportImage,Fullscreen, Control } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';
import { PolygonLayer, LineLayer, Popup } from '@antv/l7';
import type { LarkMapProps } from '@antv/larkmap';
import { LarkMap } from '@antv/larkmap';

// other func import
import fileDownload from 'js-file-download';

// DatePicker import
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';

// file and img import
import geoData from '../json/geo.json';

// Config
const api_url = 'https://aa3c-114-37-212-61.jp.ngrok.io';
axios.defaults.withCredentials = false

const config: LarkMapProps = {
    mapType: 'Gaode',
    mapOptions: {
      style: 'normal',
      center: [30, 67],
      zoom: 2.5,
      // token: 'xxxx - token',
    },
  };

const StyledList = styled(List)({
    // selected and (selected + hover) states
    '&& .Mui-selected, && .Mui-selected:hover': {
      backgroundColor: 'rgb(143,168,246,0.2)',
      borderLeft: '3px solid rgb(36,87,246)',
      '&, & .MuiListItemIcon-root': {
        color: 'rgb(74,118,247)',
      },
    }
  });
  
  function navBar() {
      return(
      <AppBar position="sticky" color="primary" theme={darkTheme}>
          <Container maxWidth="xl" >
          <Toolbar disableGutters>
          <Typography
              variant="h5"
              noWrap
              component="a"
              href="/"
              sx={{
              mr: 2,
              fontFamily: 'SimHei',
              fontWeight: 400,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
              }}
          >
              新冠疫情感染分布及病毒传播路径研究
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Typography
              variant="h5"
              noWrap
              component="a"
              href="/"
              sx={{
              mr: 2,
              fontFamily: 'SimHei',
              fontWeight: 400,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
              }}
          >
              by还没有名字小队
          </Typography>
          </Toolbar>
      </Container>
      </AppBar>
      )
  }
  
  export function Covid19() {
      const [date, setDate] = useState(dayjs('2022-01-01'));
      const [selectedIndex, setSelectedIndex] = useState(1);
      const [timeRange, setTimeRange] = useState(1);
      const [timeView, setTimeView] = useState(['year', 'day']);
      const [dateFormat, setDateFormat] = useState("YYYY/MM/DD");
      const [maxData, setMaxData] = useState(0);
      const [value, setValue] = React.useState('female');
  
      const handleRadioChange = (event) => {
        setValue(event.target.value);
      };
      
      const scene = new Scene({
        id: 'map',
        map: new GaodeMap({
          style: 'normal',
          center: [60, 37.8],
          zoom: 2.5,
          WebGLParams: {
            preserveDrawingBuffer: true,
          },
        }),
        logoVisible: false,
      });
  
      let showKey = ''
      let showKeyList = ''
  
      const popup = new Popup({
        offsets: [ 0, 0 ],
        closeButton: false,
        maxWidth: 'auto'
      })
  
      const initScene = () => {
        scene.removeAllLayer();
        scene.removePopup(popup);
      }
  
      if (selectedIndex === 1){
        showKey = 'cumulative_confirmed'
        showKeyList = ['cumulative_confirmed',
        'cumulative_deceased','cumulative_recovered',
        'cumulative_tested','new_confirmed',
        'new_deceased','new_recovered','new_tested']
      } else if(selectedIndex === 2){
        showKey = 'cumulative_persons_vaccinated'
        showKeyList = ['cumulative_persons_fully_vaccinated',
        'cumulative_persons_vaccinated','new_persons_fully_vaccinated',
        'new_persons_vaccinated']
      } 
      const color = [ 'rgb(255,255,217,0)','rgb(255,255,217)', 'rgb(237,248,177)', 'rgb(199,233,180)', 'rgb(127,205,187)', 'rgb(65,182,196)', 'rgb(29,145,192)', 'rgb(34,94,168)', 'rgb(12,44,132)' ];
      
      const handleSliderChange = (event, newValue) => {
        initScene()
        if (timeRange == 1){
          setDate(dayjs(newValue))
        } else if (timeRange == 2){
          let y = parseInt(newValue/12)
          let m = newValue % 12
          setDate(dayjs('202'+y+'/'+m))
        } else if (timeRange == 3){
          setDate(newValue+'-01-01')
        }
      }
    
      const handleChange = (newValue) => {
        initScene()
          if (newValue){
            setDate(newValue);
          }
      };
  
      const handleListItemClick = (event, index) => {
        initScene()
          setSelectedIndex(index);
      };
  
      const changeTimeRange = (e, value) => {
        initScene()
        if (value == 1){
          setTimeView(["year", "day"])
          setDateFormat("YYYY/MM/DD")
        } else if (value == 2){
          setTimeView(["year", "month"])
          setDateFormat("YYYY/MM")
        } else if (value == 3){
          setTimeView(["year"])
          setDateFormat("YYYY")
        }
        setTimeRange(value)
      }
  
      function dateSlider (){
        let marks = [];
        if (timeRange == 1){
          marks = [{value: new Date("2020-01-01").getTime(),label: '2020/01/01'},
          {value: new Date("2021-01-01").getTime(),label: '2021/01/01'},
          {value: new Date("2022-01-01").getTime(),label: '2022/01/01'},
          {value: new Date("2022-08-31").getTime(),label: '2022/08/31'},]
          return (<Slider
          //size='small'
          value={new Date(date).getTime()}
          aria-label="Day Slider"
          valueLabelFormat={value => <div>{dayjs(value).format('YYYY/MM/DD')}</div>}
          valueLabelDisplay="auto"
          step={86400000}
          marks={marks}
          min={new Date("2020-01-01").getTime()}
          max={new Date("2022-08-01").getTime()}
          //onChange={handleSliderChange}
          onChangeCommitted={handleSliderChange}
        /> )
        } else if (timeRange == 2){
          marks = [{value: 1,label: '2020/01'},
          {value: 6,label: '2020/06'},
          {value: 13,label: '2021/01'},
          {value: 18,label: '2021/06'},
          {value: 25,label: '2022/01'},
          {value: 30,label: '2022/06'},]
          const getDate = () => {
            let y = parseInt(dayjs(date).format('YYYY'))
            let m = parseInt(dayjs(date).format('MM'))
            return (y-2020)*12 + m
          }
          const showDate = (value) => {
            let y = 2020+parseInt(value/12)
            let m = value % 12
            return(dayjs(y+'/'+m).format('YYYY/MM'))
          }
          return (<Slider
          value={getDate()}
          aria-label="Month Slider"
          valueLabelFormat={value => <div>{showDate(value)}</div>}
          valueLabelDisplay="auto"
          step={1}
          marks={marks}
          min={1}
          max={32}
          onChangeCommitted={handleSliderChange}
        />)
        } else if (timeRange == 3){
          marks = [{value: 2020,label: '2020'},
          {value: 2021,label: '2021'},
          {value: 2022,label: '2022'}]
          return (<Slider
            value={parseInt(dayjs(date).format('YYYY'))}
            aria-label="Year Slider"
            valueLabelFormat={value => <div>{value}</div>}
            valueLabelDisplay="auto"
            step={1}
            marks={marks}
            min={2020}
            max={2022}
            onChangeCommitted={handleSliderChange}
          />)
        }
      }
  
      useEffect(() => {
        let type = selectedIndex === 1?'epid':'vacc';
        let query = ['/selectByDate?date=','/selectByMonth?date=','/selectByYear?date=']
        console.log(api_url+query[timeRange-1]+dayjs(date).format('YYYY-MM-DD')+'&type='+type)
        axios.get(api_url+query[timeRange-1]+dayjs(date).format('YYYY-MM-DD')+'&type='+type)
          .then(res => {
            let max=0
              geoData.features.forEach((item, index, array)=>{
                  let location = item.properties.location_key
                  if (res.data[location]){
                      let keys = Object.keys(res.data[location])
                      keys.forEach((key, index, array)=>{
                        if(key === showKey){
                            if (res.data[location][key] > max) max = res.data[location][key];
                        }
                          item.properties[key] = res.data[location][key]
                      })
                  }
              })
              console.log(geoData)
              setMaxData(max)
          })
      },[date,timeRange]);
  

    scene.on('loaded',()=>{
        console.log('first render scene')
        let grades = ['0', '1-9', '10-99', '100-499', '500-999', '1000-10000', '>10000','>20000','>30000'];
        console.log(maxData)

        const polygonLayer = new PolygonLayer({})
            .source(geoData)
            .scale(showKey, {
            type: 'quantile'
            })
            .color(
            showKey, color
            )
            .shape('fill')
            .active(true);

        const lineLayer = new LineLayer({
            zIndex: 2
            })
            .source(geoData)
            .color('#fff')
            .active(true)
            .size(1)
            .style({
            lineType: 'dash',
            dashArray: [ 2, 2 ],
        });

        scene.addLayer(polygonLayer);
        scene.addLayer(lineLayer);

        polygonLayer.on('mousemove', e => {
            let text = `<div style="display:flex;align-item:center;"><img src="${placeSVG}" width='20px' style="margin-right:5px"><b>${e.feature.properties.name}</b></div>`
            showKeyList.map((item, i, arr)=>{
                text+=`<span>${item}: ${e.feature.properties[item]?e.feature.properties[item]:0}<br></span>`
            })
            popup.setLnglat(e.lngLat).setHTML(text);
            scene.addPopup(popup);
        });

        const legend = new Control({
            position: 'topcenter',
        });
        legend.onAdd = function () {
            const el = document.createElement('div');
            el.className = 'infolegend legend';
            for (let i = 0; i < grades.length; i++) {
            el.innerHTML += `<span style="margin-right: 24px;"><i style="background:${!i?'white':color[i]};display: inline-block; width: 10px;height: 10px;"></i>
            ${grades[i]}</span>`;
            }
            return el;
        };
        const zoom = new Zoom();
        const scale = new Scale();
        const fullscreen = new Fullscreen();
        const exportImage = new ExportImage({
            onExport: (base64) => {
            fetch(base64)
            .then(res => res.blob())
            .then(blob => {
            const file = new File([blob], "File name",{ type: "image/png" })
            fileDownload(file,'img.png')
            })
        },imageType:'png'
        });
        scene.addControl(zoom);
        scene.addControl(scale);
        scene.addControl(fullscreen);
        scene.addControl(exportImage);
        scene.addControl(legend);
    })

  
      return(
      <Box>
          {navBar()}
          <Box sx={{display: 'flex'}}>
            <Box sx={{ 
              display: 'flex',flexDirection: 'column', 
              width: 'auto', maxWidth: 240, bgcolor: 'background.paper',position:'sticky' }}>
              <nav aria-label="main mailbox folders">
                <StyledList sx={{ml:.8}}>
                  <ListItem disablePadding>
                    <ListItemButton
                      selected={selectedIndex === 1}
                      onClick={(event) => handleListItemClick(event, 1)}>
                      <ListItemIcon>
                        <HomeOutlinedIcon />
                      </ListItemIcon>
                      <ListItemText primary="感染人数统计" sx={{mr:1}}/>
                    </ListItemButton>
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemButton
                      selected={selectedIndex === 2}
                      onClick={(event) => handleListItemClick(event, 2)}>
                      <ListItemIcon>
                        <LeaderboardOutlinedIcon />
                      </ListItemIcon>
                      <ListItemText primary="疫苗接种统计" />
                    </ListItemButton>
                  </ListItem>
                  {/* <ListItem disablePadding>
                    <ListItemButton
                      selected={selectedIndex === 3}
                      onClick={(event) => handleListItemClick(event, 3)}>
                      <ListItemIcon>
                        <GroupOutlinedIcon />
                      </ListItemIcon>
                      <ListItemText primary="病毒传播情况" />
                    </ListItemButton>
                  </ListItem> */}
                </StyledList>
              </nav>
              <Box sx={{display:'flex',flexGrow:1,flexDirection:'column'}}>
                <Box sx={{display: 'flex', justifyContent:'flex-start', mt:'5vh'}}>
                  <InsightsIcon sx={{mr:1, ml:2}}/>
                    选择显示数据
                </Box>
                <FormControl sx={{ml:2.8}}>
                  <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    defaultValue={showKey}
                    name="radio-buttons-group"
                  >
                    {showKeyList.map((item, index, arr)=>{
                        return <FormControlLabel value={item} key={index} control={<Radio size="small"/>} label={item} />
                    })}
                  </RadioGroup>
                </FormControl>
              </Box>
              <Box sx={{fontSize:'1.1em',flexDirection:'column'}}>
                <Box sx={{display: 'flex', justifyContent:'flex-start'}}>
                <SettingsIcon sx={{mr:1, ml:2}}/>
                时间跨度单位
                </Box>
                <ButtonGroup
                  sx={{mr:1.5, ml:1.5, mt:1.5}} aria-label="time range button group">
                  <Button variant={timeRange == 1 ? "contained" : "outlined"} onClick={(event) => changeTimeRange(event, 1)}>Day</Button>
                  <Button variant={timeRange == 2 ? "contained" : "outlined"} onClick={(event) => changeTimeRange(event, 2)}>Month</Button>
                  <Button variant={timeRange == 3 ? "contained" : "outlined"} onClick={(event) => changeTimeRange(event, 3)}>Year</Button>
                </ButtonGroup>
              </Box>
            </Box>
            <Box sx={{width: '100%', height:'90vh'}}>
              <Box id='map' sx={{flexGrow:'1',height:'93%',justifyContent: 'center',position: 'relative'}}/>
              <Box sx={{width: '100%', height:'7%', mt:1.5, display:'flex', flexDirection:'row'}}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DesktopDatePicker
                  inputFormat={dateFormat}
                  label="range(2020-01-01, 2022-08-31)"
                  value={date}
                  views={timeView}
                  onChange={handleChange}
                  renderInput={(params) => <TextField size="small" {...params} />}
                  minDate={new Date("2020-01-01")}
                  maxDate={new Date("2022-08-31")}
                  placeholderText="range(2020-01-01, 2022-08-31)"
                />
                </LocalizationProvider>
                <Box sx={{ width: '100%' , ml:5, mr:5, position:'relative'}}>
                    {dateSlider()}
                </Box>
              </Box>
            </Box>
          </Box>
      </Box>
      )
  }