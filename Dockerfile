# Base stage for shared dependencies
FROM node:20-alpine as base
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Development stage
FROM base as dev
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host"]

# Build stage
FROM base as build
RUN npm run build

# Production stage
FROM nginx:stable-alpine as production
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
