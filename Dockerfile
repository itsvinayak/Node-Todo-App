FROM node:17.0.0


WORKDIR /app

COPY ./package.json /app

RUN npm install

COPY . /app

## anonymous volume
VOLUME [ "/app/node_modules" ]

## enviorment var
ARG default_port=3000
ENV PORT $default_port
ENV DB_URL "mongodb://172.17.0.3:27017/todosDB"
EXPOSE $PORT

CMD ["npm", "start"]