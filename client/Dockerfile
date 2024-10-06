FROM node:14-alpine

RUN mkdir -p /app
WORKDIR /app

COPY package.json /app
COPY yarn.lock /app
COPY . /app


RUN yarn install
RUN npm config set registry https://mirrors.huaweicloud.com/repository/npm/ && npm install

CMD ["yarn", "start"]


