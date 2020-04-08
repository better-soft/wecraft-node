FROM alpine:3.11
RUN apk add --update nodejs nodejs-npm
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8000

CMD npm start
