FROM node:lts

WORKDIR /src

COPY package.json package-lock.json ./

RUN npm ci

COPY . ./

RUN npm run build

CMD ["npm", "start"]