# build environment
FROM node:13.12.0-alpine as build
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json ./
COPY package-lock.json ./
RUN npm ci --silent
RUN npm install react-scripts@3.4.1 -g --silent
#COPY public ./
COPY . ./
RUN npm run build

# production environment
FROM nginx:stable-alpine
#USER nginx
RUN mkdir -p /var/cache/nginx/client_temp
COPY nginx.conf.d.conf /etc/nginx/conf.d/default.conf
COPY nginx.default.conf /etc/nginx/default.conf
COPY --from=build --chown=nginx /app/build /usr/share/nginx/html
RUN chgrp -R root /var/cache/nginx /var/run /var/log/nginx && \
    chmod -R 770 /var/cache/nginx /var/run /var/log/nginx && \
    chmod -R 777 /usr/share/nginx/html/fonts /usr/share/nginx/html/images \
    /usr/share/nginx/html/vendor /usr/share/nginx/html/assets
ENV HOST=0.0.0.0 PORT=8080
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]