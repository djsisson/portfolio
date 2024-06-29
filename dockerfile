FROM node:latest

RUN corepack enable && corepack prepare yarn@stable --activate

WORKDIR /app

COPY package.json yarn.lock  ./

RUN yarn install

COPY . .

#RUN yarn build

EXPOSE 3001

ENV HOST=0.0.0.0

CMD [ "yarn", "dev" ]