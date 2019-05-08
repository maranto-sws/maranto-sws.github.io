FROM kkarczmarczyk/node-yarn:latest
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json .
RUN yarn
COPY . ./