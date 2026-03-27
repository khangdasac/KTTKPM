FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --only=production

COPY . .

RUN addgroup app && adduser -S -G app app
USER app

CMD ["node", "index.js"]