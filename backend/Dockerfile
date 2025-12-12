# Use a Node.js image as base
FROM node:18

RUN apt-get update && apt-get install -y default-mysql-client
# Set the working directory in the container
WORKDIR /app


# Copy configuration files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the code into the container
COPY . .
# Expose the application's port
EXPOSE 5000

COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

ENTRYPOINT ["/app/entrypoint.sh"]

