FROM node:latest
COPY package.json .
COPY package-lock.json .
RUN npm install
RUN npm install -g http-server
COPY . .
RUN npm run build
CMD ["http-server", "dist"]