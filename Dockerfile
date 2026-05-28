FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci
COPY . ./
ARG API_BASE_URL=/api
RUN node scripts/write-runtime-config.mjs
RUN npm run build

FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY docker-entrypoint.d/ /docker-entrypoint.d/
COPY --from=build /app/dist/flipshop-frontend/browser /usr/share/nginx/html
RUN chmod +x /docker-entrypoint.d/*.sh
EXPOSE 80
