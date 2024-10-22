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
  "registry-mirrors": ["https://yaguali8.mirror.aliyuncs.com"]
}
EOF
sudo systemctl daemon-reload
sudo systemctl restart docker
```

成功開啟的話可在localhost:3000看到網頁。
有些套件要進去安裝，從F12可以看到缺失套件(因為我沒加在package.json裡)
```
docker exec -it <container_code> /bin/sh
npm install <package_name>
```

Django
---------
cd ./Django
python3 manage.py runserver localhost:4000

裡面模型位置要換成你的本地模型路徑！
/server/models/diffusion.py底下的
```
output_path = "/mnt/Workspace/thangka_inpaint_DEMO/Django/server/media/output/"
sd_model_path = "/mnt/Workspace/SDmodels/"
model_path = "/mnt/Workspace/SDmodels/Lora"
filePath = "/mnt/Workspace/Django/server/media/"
```
Mysql
---------
127.0.0.1:8080
登入adminer可查看資料表
伺服器: mysql_db
帳密: root & root 
資料庫: thangkaDEMO



