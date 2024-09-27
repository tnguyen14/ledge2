FROM node:lts

WORKDIR /src

COPY package.json package-lock.json ./

RUN npm ci

COPY . ./

CMD ["npm", "run", "dev"]