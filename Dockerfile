FROM node:16.17.1-alpine As dev

WORKDIR /usr/src/app

# bufferutils 패키지 설치 시 파이썬이 필요
RUN apk add --update --no-cache python3 build-base gcc && ln -sf /usr/bin/python3 /usr/bin/python

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:16.17.1-alpine As prod

ARG NODE_ENV=prod
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

# bufferutils 패키지 설치 시 파이썬이 필요
RUN apk add --update --no-cache python3 build-base gcc && ln -sf /usr/bin/python3 /usr/bin/python  

COPY package*.json ./

RUN npm install --production

COPY . .

COPY --from=dev /usr/src/app/dist ./dist

EXPOSE 8000

CMD ["node", "dist/main"]