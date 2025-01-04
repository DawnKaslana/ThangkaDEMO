项目环境配置
---

在根目錄執行以下指令來執行 Docker Container 的建構和啟動。

```bash
docker-compose up --build (win)
```
或
```bash
docker compose up --build (Linux/Mac)
```
docker 快速啟動容器指令：
```bash
docker start $(docker ps -a -q)
```

如果不能拉取到 image，可以改換一個源。

### 設定 Docker 鏡像源

執行下列指令來設定。

```bash
sudo mkdir -p /etc/docker
sudo tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": [available_mirrors]
}
EOF
sudo systemctl daemon-reload
sudo systemctl restart docker
```

若正確啟動，可在 `localhost:3000` 上查看網頁。

### 安裝缺失套件


查看網頁時如果有套件缺失，可以通過瀏覽器的 `F12` 工具背後模式查看。執行下列指令進入容器依要求安裝套件。

```bash
docker exec -it <container_code> /bin/sh
npm install <package_name>
```

### Django 啟動伺服器

在 Django 目錄中執行以下指令來啟動伺服器。

```bash
conda activate pytorch_env
cd /mnt/Workspace/thangka_inpaint_DEMO/Django/
python3 manage.py runserver localhost:4000
```


### 更改模型路徑

使用本組件時，需要將模型路徑更改為您本地的路徑。修改以下檔案中的模型路徑。

檔案位置：`/Django/server/models/diffusion.py`

```python
"""presetting"""
edge_connect_dir = "/mnt/Workspace/edge-connect"
model_rootpath = "/mnt/Workspace/models/"
cn_model_path = join(model_rootpath, "CN")
lora_model_path = join(model_rootpath, "Lora")
edge_model_path = join(model_rootpath, "edge")
# 圖片上傳存放的路徑
filePath = "/mnt/Workspace/thangka_inpaint_DEMO/Django/server/media"
```

其中引用了[2019 EdgeConnect](https://github.com/knazeri/edge-connect)的邊緣修復工作。


### MySQL 數據庫查看

通過 Adminer 來查看 MySQL 數據庫中的資料表。指令如下：

1. 瀏覽 `127.0.0.1:8080`
2. 登入使用的資訊如下：
   - 伺服器: `mysql_db`
   - 使用者名稱: `root`
   - 密碼: `root`
   - 數據庫: `thangkaDEMO`


重點功能代碼
===
```
Django
   ├── manage.py
   └── server
       ├── asgi.py
       ├── files
       ├── __init__.py
       ├── models
       │   ├── diffusion.py
       │   ├── ernie_bot.py
       │   ├── images.py
       │   └── thangka.py
       ├── settings.py
       ├── urls.py
       └── wsgi.py
```

1. 擴散模型調用：models/diffusion.py
    - presetting, preloading, getModelType
    - loadModel, changeModel
    - edge_inpaint
    - Main Func: load_lora inpaint text2img img2img
2. 處理前端請求：models/thangka.py 
    - 接收前端請求
    - 檢查參數
    - 呼叫diffusion執行相應函式
3. 文心語言模型請求與調用：models/ernie_bot.py
    - presetting: functions, availible_params
    - Main Func: chat






