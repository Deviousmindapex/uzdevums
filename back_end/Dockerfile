# Use Node.js base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install --production

# Copy the rest of the code
COPY . .

# Expose port (matching the Node.js server port)
EXPOSE 3010

# Start the application
CMD ["npm", "start"]