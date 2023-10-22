FROM node:lts

WORKDIR /src

COPY package.json package-lock.json ./

RUN npm ci

COPY . ./

RUN npm run static

CMD ["npm", "run", "dev"]
