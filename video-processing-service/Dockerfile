FROM node:lts AS builder

WORKDIR /app

# Copy package files and install all dependencies
COPY package*.json ./
RUN npm install

# Copy app source code
COPY . .

# Build the app
RUN npm run build


# Stage 2: Production stage
FROM node:lts

# Install ffmpeg
RUN apt-get update && apt-get install -y ffmpeg

WORKDIR /app

# Copy package files and install only production dependencies
COPY package*.json ./
RUN npm install --only=production

# Copy built app from builder stage
COPY --from=builder /app/dist ./dist

# Expose the port your app listens on
EXPOSE 3000

# Run the app
CMD ["npm", "run", "serve"]