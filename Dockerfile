FROM node:17.0.0


WORKDIR /app

COPY ./package.json /app

RUN npm install

COPY . /app

## anonymous volume
VOLUME [ "/app/node_modules" ]

CMD ["npm", "start"]