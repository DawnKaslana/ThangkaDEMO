// React and Basic import
import React, { useState, useEffect } from 'react';
import axios from "axios";

// React MUI import
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

// Map import
import { LineLayer, Popup, PolygonLayer } from '@antv/l7';
import { Scene, Zoom, Scale, ExportImage, Fullscreen, Control } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';
import { LarkMap,useScene } from '@antv/larkmap';

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

let colors = [ 'rgb(255,255,217,0)','rgb(255,255,217)', 'rgb(237,248,177)', 'rgb(199,233,180)', 'rgb(127,205,187)', 'rgb(65,182,196)', 'rgb(29,145,192)', 'rgb(34,94,168)', 'rgb(12,44,132)' ];
let grades = ['0', '1-9', '10-99', '100-499', '500-999', '1000-10000', '>10000','>20000','>30000'];
//let colors = [ '#FFF317','#FACE14','##F0AC20', '#D97511', '#F15818', '#FA0B07', '#F0069F', '#B007D9', '#6802F1'];
        
const config = {
    mapType: 'Gaode',
    mapOptions: {
      style: 'normal',
      center: [-60, 37],
      zoom: 3,
      WebGLParams: {
        preserveDrawingBuffer: true,
      },
    },
};
const MyPolygonLayer = (param) => {
    console.log(param.maxData)
    const scene = useScene();

    useEffect(()=>{
        console.log('render layer')
        scene.removeAllLayer();
        const layer = new PolygonLayer({})
            .source(param.source)
            .scale('cumulative_confirmed', {
                type: 'quantile'
            })
            .color(
            'cumulative_confirmed', colors
            )
            .shape('fill')
            .active(true);
        //   active: { color: 'red', }
        //   select: { color: 'red', } (click)
        const layer2 = new LineLayer({
            zIndex: 2
        })
            .source(param.source)
            .color('#fff')
            .active(true)
            .size(1)
            .style({
            lineType: 'dash',
            dashArray: [ 2, 2 ],
        });
        layer.on('mousemove', e => {
            const popup = new Popup({
            offsets: [ 0, 0 ],
            closeButton: false
            })
            .setLnglat(e.lngLat)
            .setHTML(`<span>${e.feature.properties.name}: ${e.feature.properties.cumulative_confirmed}</span>`);
            scene.addPopup(popup);
        });
        scene.addLayer(layer)
        scene.addLayer(layer2);
    },[param])
  };

          
const legend = new Control({
    position: 'topcenter',
});
const zoom = new Zoom();
const scale = new Scale();
const fullscreen = new Fullscreen();
const exportImage = new ExportImage({
    onExport: (mapImg) => {
    // console.log(scene.exportMap('png'))
    fetch(mapImg)
    .then(res => res.blob())
    .then(blob => {
        const file = new File([blob], "File name",{ type: "image/png" })
        fileDownload(file,'map.png')
    })
    }
});
  
//Main
export function Covid19() {
    //組件初始值
    const [date, setDate] = useState(dayjs('2022-01-01'));
    const [source, setSource] = useState(geoData);
    const [maxData, setMaxData] = useState(0);
    
    let query = ''
    let timeRange = 1
    let type = 'epid'
    let dateFormat="YYYY/MM/DD"
    let timeView = ["year","day"]
    let showKey = "cumulative_confirmed"

    if (timeRange === 1){
        query = '/selectByDate?date='+dayjs(date).format('YYYY-MM-DD')+'&type='+type
        } else if (timeRange === 2){
        query = '/selectByMonth?date='+dayjs(date).format('YYYY-MM-DD')+'&type='+type
        }else if (timeRange === 3){
        query = '/selectByYear?date='+dayjs(date).format('YYYY-MM-DD')+'&type='+type
    }

    const handleDateChange = (newDate) => {
        if (newDate) setDate(newDate);
    }

    

    useEffect(() => {
        console.log('date changed')
        let max = 0
        axios.get(api_url+query)
        .then(res => {
            geoData.features.forEach((item, index, array)=>{
                let location = item.properties.location_key
                if (res.data[location]){
                    let keys = Object.keys(res.data[location])
                    keys.forEach((key, index, array)=>{
                        if (key === showKey){
                            if (res.data[location][key]>max){
                                max = res.data[location][key]
                            }
                        }
                        item.properties[key] = res.data[location][key]
                    })
                }
            })
            setMaxData(max)
            return geoData
        }).then((data)=>{
            setSource(data)
        })
    },[date]);

    const onSceneLoaded = (scene) => {
        console.log('first render scene')
        legend.onAdd = function () {
            const el = document.createElement('div');
            el.className = 'infolegend legend';
            for (let i = 0; i < grades.length; i++) {
            el.innerHTML += `<span style="margin-right: 24px;"><i style="background:${!i?'white':colors[i]};display: inline-block; width: 10px;height: 10px;"></i>
                ${grades[i]}</span>`;
            }
            return el;
        };
        scene.addControl(zoom);
        scene.addControl(scale);
        scene.addControl(fullscreen);
        scene.addControl(exportImage);
        scene.addControl(legend);
    }   


    return(
    <Box>
        <LarkMap {...config} style={{ height: '100vh' }} onSceneLoaded={onSceneLoaded}>
            <MyPolygonLayer source={source} maxData={maxData}/>
        </LarkMap>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DesktopDatePicker
            inputFormat={dateFormat}
            label="range(2020-01-01, 2022-08-31)"
            value={date}
            views={timeView}
            onChange={handleDateChange}
            renderInput={(params) => <TextField size="small" {...params} />}
            minDate={new Date("2020-01-01")}
            maxDate={new Date("2022-08-31")}
            placeholderText="range(2020-01-01, 2022-08-31)"
            />
        </LocalizationProvider>
    </Box>
    )

}