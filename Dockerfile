#base Image
# This line specifies the base image for the Docker container
# Using Node.js version 20.10.0 with Alpine Linux 3.17 as the base
# Alpine is a lightweight Linux distribution, making the image smaller
FROM node:20.10.0-alpine3.17

#Create app directory
WORKDIR /app

#Copy package.json and package-lock.json
COPY package*.json ./

#Install app dependencies
RUN npm install

#Copy app source code
COPY . .

#Expose port
EXPOSE 3000

#Start the app
CMD ["npm","run dev"]