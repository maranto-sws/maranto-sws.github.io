FROM kkarczmarczyk/node-yarn:latest

WORKDIR /usr/app

COPY package.json .
RUN yarn

COPY . .