FROM node:18 as build
WORKDIR /app
COPY . .
RUN npm install && npm run build

FROM nginx
COPY --from=build /app/build /usr/share/nginx/html