FROM node:18

# Set working directory
WORKDIR /usr/src/app

# Copy only package files first for better caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Install AWS Amplify CLI globally
# RUN npm install -g @aws-amplify/cli

# Copy the full app code
COPY . .

# Expose port
EXPOSE 3000

# Use nodemon to start app
CMD ["sh", "-c", "npx ampx sandbox & npm run dev"]
