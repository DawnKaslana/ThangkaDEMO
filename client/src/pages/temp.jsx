// React and Basic import
import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';

// React MUI import
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import Divider from '@mui/material/Divider';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import AddIcon from '@mui/icons-material/Add';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import SendIcon from '@mui/icons-material/Send';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import Slider from '@mui/material/Slider';

//api
import { server, django, file_url } from '../api.js'

// cookie
const cookies = new Cookies();

// 模拟分类数据
const classData = [
  { class_id: 1, class_name: "class1" },
  { class_id: 2, class_name: "class2" },
];

// 模拟标签数据
const labelData = [
  { label_id: 1, label_text: "Label 1 - Class 1", class_id: 1, isFavorite: false },
  { label_id: 2, label_text: "Label 2 - Class 1", class_id: 1, isFavorite: true },
  { label_id: 3, label_text: "Label 1 - Class 2", class_id: 2, isFavorite: false },
];

// Main Component
export function Temp() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(cookies.get("user_id"));
  const [userName, setUserName] = useState(cookies.get("user_name"));

  const [selectedModel, setSelectedModel] = useState("SDI2"); // 默认生成模型
  const [selectedImg, setSelectedImg] = useState(null);
  const [previewImg, setPreviewImg] = useState(null);
  const [steps, setSteps] = useState(10); // 渲染步数
  const [imageCount, setImageCount] = useState(1); // 生成张数
  const [sidebarOpen, setSidebarOpen] = useState(true); // 控制侧边栏的状态
  const [sidebarWidth, setSidebarWidth] = useState(250); // 控制侧边栏的宽度
  const [selectedLabels, setSelectedLabels] = useState([]); // 存储用户已选的标签
  const [prompt, setPrompt] = useState(""); // prompt输入
  const [enterPrompt, setEnterPrompt] = useState(""); // 保存输入的 prompt

  const [currentTab, setCurrentTab] = useState(0); // 当前选中的分类 tab
  const [labels, setLabels] = useState(labelData); // 保存标签列表
  const [isDialogOpen, setIsDialogOpen] = useState(false); // 控制对话框打开/关闭
  const [editingLabel, setEditingLabel] = useState(null); // 当前编辑的标签信息
  const [newLabelText, setNewLabelText] = useState(''); // 新标签文本

  const [isTagBarExpanded, setIsTagBarExpanded] = useState(false); // 控制标签栏的展开和收起
  const inputImgRef = useRef();

  useEffect(() => {
    if (!userId) navigate('/login');
  }, []);

  // 处理图片上传
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImg(file);
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImg(reader.result); // 设置图片预览
      };
      reader.readAsDataURL(file);
    }
  };

  // 切换分类 Tab
  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  // 点击标签时，将标签加入到已选标签中
  const handleLabelClick = (label) => {
    if (!selectedLabels.includes(label.label_text)) {
      setSelectedLabels((prev) => [...prev, label.label_text]); // 防止重复添加相同标签
    }
  };

  // 移除已选标签
  const handleRemoveLabel = (labelText) => {
    setSelectedLabels((prev) => prev.filter((label) => label !== labelText));
  };

  // 收藏或取消收藏标签
  const toggleFavorite = (labelId) => {
    setLabels((prevLabels) =>
      prevLabels.map((label) =>
        label.label_id === labelId ? { ...label, isFavorite: !label.isFavorite } : label
      )
    );
  };

  // 渲染标签对应的分类
  const renderLabels = (classId) => {
    return labels
      .filter((label) => label.class_id === classId)
      .map((label) => (
        <Grid item key={label.label_id}>
          <Chip
            label={label.label_text}
            onClick={() => handleLabelClick(label)} // 点击时添加到已选标签中
            deleteIcon={<DeleteIcon />}
            icon={
              <IconButton onClick={() => toggleFavorite(label.label_id)}>
                {label.isFavorite ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
              </IconButton>
            }
            color="primary"
            sx={{ marginRight: 1, marginBottom: 1 }}
          />
        </Grid>
      ));
  };

  // 最终生成的 Prompt（根据用户选择的标签组合）
  const finalPrompt = selectedLabels.join(', ');

  // 处理侧边栏宽度的变化
  const handleSidebarWidthChange = (event, newValue) => {
    setSidebarWidth(newValue);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {/* 标签栏 */}
      <AppBar position="fixed" sx={{ top: 0, left: 0, right: 0, zIndex: 1300, transition: 'height 0.3s', height: isTagBarExpanded ? '150px' : '40px', bgcolor: "#000000" }}>
        <Box sx={{ p: 1 }}>
          <Tabs value={currentTab} onChange={handleTabChange} centered textColor="inherit" indicatorColor="secondary">
            {classData.map((classItem) => (
              <Tab 
                key={classItem.class_id} 
                label={classItem.class_name} 
                sx={{ fontSize: '0.875rem', color: '#fff' }}  // 设置字体大小为14px，配色为黑白风格
              />
            ))}
          </Tabs>
          {/* 标签展示区域 */}
          {isTagBarExpanded && (
            <Box sx={{ p: 1, display: 'flex', justifyContent: 'center' }}>
              <Grid container spacing={1}>
                {renderLabels(classData[currentTab].class_id)}
                <Grid item>
                  <Button startIcon={<AddIcon />} variant="outlined" onClick={() => setIsDialogOpen(true)} sx={{ color: 'white', borderColor: 'white' }}>
                    新增标签
                  </Button>
                </Grid>
              </Grid>
            </Box>
          )}
          {/* 下拉/上收按钮 */}
          <IconButton
            onClick={() => setIsTagBarExpanded(!isTagBarExpanded)}
            sx={{ position: "absolute", right: "16px", top: isTagBarExpanded ? "110px" : "5px", color: 'white' }}
          >
            {isTagBarExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>
      </AppBar>

      {/* 侧边栏 */}
      <Box sx={{ display: "flex", flexGrow: 1, mt: isTagBarExpanded ? '150px' : '40px' }}>
        <Drawer
          variant="persistent"
          anchor="left"
          open={sidebarOpen}
          sx={{
            width: sidebarWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: sidebarWidth,
              transition: "width 0.3s",
              boxSizing: "border-box",
            },
          }}
        >
          <Box sx={{ display: "flex", justifyContent: sidebarOpen ? "flex-end" : "center", padding: "8px" }}>
            <IconButton onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>
          </Box>

          {sidebarOpen && (
            <Box sx={{ padding: 2 }}>
              {/* 模型选择 */}
              <Typography variant="h6">选择生成模型</Typography>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <Select value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)}>
                  {[
                    { value: "SDI2", label: "Stable Diffusion Inpaint 2" },
                    { value: "SD2", label: "Stable Diffusion 2" },
                    { value: "CN2", label: "ControlNet Inpaint 2" },
                    { value: "LORA", label: "LORA 模型" },
                  ].map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* 上传图片 */}
              <Typography variant="h6">上传图片</Typography>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <IconButton component="label">
                  <AddPhotoAlternateIcon />
                  <input ref={inputImgRef} type="file" hidden accept="image/*" onChange={handleImageUpload} />
                </IconButton>
                <Typography>{selectedImg ? selectedImg.name : "选择图片"}</Typography>
              </Box>

              {/* 预览图片 */}
              <Typography variant="h6">预览图片</Typography>
              <Box
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
                {previewImg ? <img src={previewImg} alt="Preview" style={{ maxWidth: "100%", maxHeight: "100%" }} /> : <AddIcon fontSize="large" />}
              </Box>

              <Divider />

              {/* 渲染步数选择 */}
              <Typography variant="h6">渲染步数</Typography>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <Select value={steps} onChange={(e) => setSteps(e.target.value)}>
                  {[10, 20, 30, 40, 50].map((option) => (
                    <MenuItem key={option} value={option}>
                      {option} 步
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* 生成张数选择 */}
              <Typography variant="h6">生成张数</Typography>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <Select value={imageCount} onChange={(e) => setImageCount(e.target.value)}>
                  {[1, 2, 3, 4, 5].map((option) => (
                    <MenuItem key={option} value={option}>
                      {option} 张
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* 滚动条调节宽度 */}
              <Box sx={{ padding: 2 }}>
                <Typography variant="caption">调节侧边栏宽度</Typography>
                <Slider
                  value={sidebarWidth}
                  min={60}
                  max={300}
                  onChange={handleSidebarWidthChange}
                  aria-labelledby="sidebar-width-slider"
                />
              </Box>
            </Box>
          )}
        </Drawer>

        {/* 主内容区 */}
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          {/* 已选标签展示 */}
          <Typography variant="h6">已选标签</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            {selectedLabels.map((labelText, index) => (
              <Chip
                key={index}
                label={labelText}
                onDelete={() => handleRemoveLabel(labelText)} // 点击删除已选标签
                color="primary"
                sx={{ marginBottom: 1 }}
              />
            ))}
          </Box>

          {/* 显示生成的 Prompt */}
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            生成描述：{finalPrompt || "无已选标签"}
          </Typography>

          {/* 底部固定输入区 */}
          <AppBar position="fixed" sx={{ top: "auto", bottom: 0, bgcolor: "#212121", p: 1 }}>
            <Toolbar>
              <TextField
                required
                fullWidth
                value={prompt}
                placeholder="请输入生成描述 (prompt)..."
                onChange={(e) => setPrompt(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton aria-label="toggle prompt submit" onClick={() => setEnterPrompt(prompt)} disabled={!prompt}>
                        <SendIcon color="secondary" />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ mr: 2 }}
              />
              <Button variant="contained" color="secondary" onClick={() => setEnterPrompt(prompt)} disabled={!prompt}>
                Enter
              </Button>
            </Toolbar>
          </AppBar>
        </Box>
      </Box>
    </Box>
  );
}
