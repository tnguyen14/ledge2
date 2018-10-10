FROM mhart/alpine-node:10.11

WORKDIR /src

COPY package.json /src/
RUN npm install
COPY . /src/

RUN npm run doc

CMD ["npm", "run", "server"]
