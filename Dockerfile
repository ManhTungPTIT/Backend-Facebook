FROM node:22.15.0


WORKDIR /src

COPY package*.json ./

RUN npm install


COPY . .
CMD ["npm", "start"]