FROM node:17.6.0

RUN yarn config set registry https://registry.npm.taobao.org

ENV HOME=/opt/app

WORKDIR $HOME

COPY package.json $HOME
COPY yarn.lock $HOME

RUN yarn install

COPY . $HOME
RUN yarn build

ENV SERVER_PORT 80
EXPOSE 80

RUN sh -c "ln -s ${HOME}/ormconfig/ormconfig.json ${HOME}/ormconfig.json"

CMD ["yarn", "start:prod"]



