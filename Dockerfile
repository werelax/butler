FROM node:4.4

ADD ./package.json /app/package.json
ADD ./assets /app/assets
ADD ./lib /app/lib
ADD ./example /app/example

ENV NODE_ENV=production
WORKDIR /app
RUN npm install
RUN npm link

EXPOSE 8080
ENTRYPOINT ["bif", "/app/example", "-p", "8080", "-h", "0.0.0.0"]
