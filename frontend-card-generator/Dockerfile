FROM node:18-alpine3.20 as builder

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package.json ./
COPY package-lock.json ./
RUN npm install --silent
RUN npm install react-scripts@3.4.1 -g --silent

COPY . ./

RUN npm run build 

FROM nginx:latest
COPY --from=builder /app/dist/ /usr/share/nginx/html
EXPOSE 80
