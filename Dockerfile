FROM node:22.15.0

WORKDIR /app

# copy package
COPY package*.json ./

# install deps
RUN npm install

# copy source
COPY . .

# build typescript
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
