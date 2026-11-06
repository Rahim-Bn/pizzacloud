FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY app.js server.js db.js ./
EXPOSE 3000
USER node
CMD ["node", "server.js"]
