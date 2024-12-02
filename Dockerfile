# Use a Node.js image for building
FROM node:18-alpine as builder

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and lock files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Build the Remix app
RUN npm run build

# Production stage
FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy dependencies and built files from builder stage
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/public ./public
COPY --from=builder /usr/src/app/build ./build
COPY --from=builder /usr/src/app/package*.json ./

# Expose port 3000
EXPOSE 3000

# Command to start the server
CMD ["npm", "run", "start"]