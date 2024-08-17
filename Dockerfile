# Use the official Node.js image.
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN yarn install --production

# Copy the rest of the application code to the container
COPY . .

# Build the Nuxt.js application
RUN npm run build

# Expose port 3000 and start the application
EXPOSE 3000
CMD ["npm", "start"]
