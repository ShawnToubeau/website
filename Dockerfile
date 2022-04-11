# Stage 0, "build-stage", based on Node.js, to build and compile the frontend
FROM node:alpine as build-stage
WORKDIR /app
COPY package*.json /app
RUN yarn
COPY ./ /app/
RUN yarn build
# Stage 1, based on Nginx, to have only the compiled app, ready for production with Nginx
FROM nginx:alpine
COPY --from=build-stage /app/dist/ /usr/share/nginx/html
COPY ./nginx.conf ./etc/nginx/conf.d/default.conf
