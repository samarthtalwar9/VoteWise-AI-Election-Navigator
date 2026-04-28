FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

RUN npm install --only=production

# Bundle app source
COPY . .

# Expose the port the app runs on
EXPOSE 8080

# Set environment variables (can be overridden at runtime)
ENV PORT=8080
ENV NODE_ENV=production

# Start the application
CMD [ "node", "src/index.js" ]
