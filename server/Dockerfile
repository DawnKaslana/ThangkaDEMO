FROM node:12

RUN mkdir -p /app
WORKDIR /app

COPY package.json /app

COPY . /app


RUN npm config set registry https://mirrors.huaweicloud.com/repository/npm/ && npm install

CMD ["npm", "start"]
