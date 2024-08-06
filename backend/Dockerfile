FROM node:18
COPY package.json .
COPY package-lock.json .
RUN npm install
RUN npm install -g knex
COPY . .
CMD ["npm", "start"]
