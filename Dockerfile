FROM node:4.4

ADD ./package.json /server/package.json
ADD ./assets /server/assets
ADD ./lib /server/lib
ADD ./example /server/example

ENV NODE_ENV=production
WORKDIR /server
RUN npm install
RUN npm link

EXPOSE 8080
ENTRYPOINT ["zab-server", "/server/example", "-p", "8080", "-h", "0.0.0.0"]
