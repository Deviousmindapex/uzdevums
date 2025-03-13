# Use Node.js base image to build React
FROM node:18-alpine AS build

# Set working directory inside the container
WORKDIR /front_end

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies with legacy peer deps
RUN npm install --legacy-peer-deps

# Copy the rest of the application
COPY . .

# Build the React app
RUN npm run build

# Use Nginx for serving static files
FROM nginx:alpine

# Set working directory for Nginx
WORKDIR /usr/share/nginx/html

# Remove default Nginx static files
RUN rm -rf ./*

# Copy built React files from Node.js build stage
COPY --from=build /front_end/build /usr/share/nginx/html

# Copy custom Nginx config from the build context
COPY ./nginx.conf /etc/nginx/conf.d/default.conf


# Expose the default Nginx port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
