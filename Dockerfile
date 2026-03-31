FROM node:18-bullseye

# 🔥 Install all required system deps
RUN apt-get update && apt-get install -y \
    ffmpeg \
    poppler-utils \
    libvips-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["node", "dist/server.js"]