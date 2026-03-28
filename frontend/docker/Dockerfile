FROM node:22-alpine AS builder
WORKDIR /app
COPY ./backend ./backend
COPY ./frontend ./frontend
WORKDIR /app/frontend
RUN npm install
RUN npm run build 

FROM docker.io/nginx:stable AS final
EXPOSE 80
EXPOSE 443
COPY --from=builder /app/frontend/dist /usr/share/nginx/html
COPY ./frontend/docker/nginx.conf /etc/nginx/conf.d/default.conf
