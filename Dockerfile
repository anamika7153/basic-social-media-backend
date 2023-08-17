# Use an official Node.js runtime as the base image
FROM node:14

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the application dependencies
RUN npm install

# Copy the rest of the application files to the working directory
COPY . .


# Run tests using Mocha
RUN npm test

# Specify the command to run when the container starts
CMD ["npm", "start"]

# Expose port 8080 for the application
ENV PORT 8080

EXPOSE $PORT
