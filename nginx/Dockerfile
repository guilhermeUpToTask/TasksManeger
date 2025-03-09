# Stage 1: Build the frontend using Node.js
FROM node:20 AS build-stage

WORKDIR /app

# Copy package.json and install dependencies
COPY /frontend/package*.json /app/
RUN npm install

# Copy frontend source code and build
COPY /frontend/ /app/
ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# Stage 2: Serve the frontend with Nginx
FROM nginx:alpine

# Copy built frontend files to Nginx web root
COPY --from=build-stage /app/dist/ /usr/share/nginx/html

# Copy Nginx configuration files from /nginx/ build context=(taskmaneger folder)
COPY /nginx/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

