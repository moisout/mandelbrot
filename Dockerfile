# Frontend stage 1
FROM node:14.2-alpine3.11 as node
WORKDIR /home/app

COPY . .
RUN \
  npm install && \
  npm run build

#Frontend stage 2
FROM nginx:1.18-alpine

COPY --from=node /home/app/dist /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 3030