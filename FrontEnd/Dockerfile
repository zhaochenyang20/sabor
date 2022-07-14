FROM node:16.14.0

RUN npm config set registry https://registry.npm.taobao.org

ENV HOME=/opt/app

WORKDIR $HOME
COPY package.json $HOME
COPY package-lock.json $HOME

RUN npm install
RUN npm install -g serve

COPY . $HOME
RUN npm run build

EXPOSE 80

CMD ["serve", "-s", "build", "-l", "80"]