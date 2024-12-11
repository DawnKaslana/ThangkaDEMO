# REACT-NODEJS-MYSQL-DOCKER 

需要一個Docker
---------
根目錄執行

docker-compose up --build or docker compose up --build 依系統而定
如果docker pull不到image可以換個源
```
sudo mkdir -p /etc/docker
sudo tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": [available_mirrors]
}
EOF
sudo systemctl daemon-reload
sudo systemctl restart docker
```

成功開啟的話可在localhost:3000看到網頁。
若有缺失套件可進容器進行安裝
```
docker exec -it <container_code> /bin/sh
npm install <package_name>
```

Django
---------
cd ./Django
python3 manage.py runserver localhost:4000

裡面模型位置要換成你的本地模型路徑！
修改/server/models/diffusion.py底下的"""presetting"""處
```
edge_connect_dir = "/mnt/Workspace/edge-connect"
model_rootpath = "/mnt/Workspace/models/"
cn_model_path = join(model_rootpath, "CN")
lora_model_path = join(model_rootpath, "Lora")
edge_model_path = join(model_rootpath, "edge")
# 圖片上傳存放的路徑
filePath = "/mnt/Workspace/thangka_inpaint_DEMO/Django/server/media"
```
Mysql
---------
127.0.0.1:8080
登入adminer可查看資料表
伺服器: mysql_db
帳密: root & root 
資料庫: thangkaDEMO



