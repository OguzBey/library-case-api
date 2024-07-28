FROM node:20.2.0

COPY ./src/package.json /tmp/package.json
RUN cd /tmp && npm install
RUN mkdir -p /opt/app && cp -a /tmp/node_modules /opt/app/

WORKDIR /opt/app
COPY ./src/. /opt/app

RUN npm run build

EXPOSE 3000

CMD npm run start