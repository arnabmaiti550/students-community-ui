# Use an official Node.js image as a base
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN yarn install

# Copy the rest of the application code
COPY . .

ENV BASE_URL=https://students-community-api-nzitikqzsa-el.a.run.app
ENV APP_GOOGLE_CLIENT_ID=475519638401-pkt5btt8ms606t31m2uoc4753h93qvdd.apps.googleusercontent.com
ENV STORAGE_URL=https://storage.googleapis.com/sc-bucket-1108/uploads/

# Build the application
RUN npm run build

# Expose port 3000
EXPOSE 3000

# Start the application
CMD ["npm", "run", "preview"]
