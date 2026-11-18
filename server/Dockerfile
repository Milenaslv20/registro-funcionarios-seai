FROM node:20-slim

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev --no-audit --no-fund

COPY index.js ./

ENV NODE_ENV=production
EXPOSE 5000

CMD ["node", "index.js"]
