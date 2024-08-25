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

Django
---------
cd ./Django
python3 manage.py runserver localhost:4000



