FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ARG VITE_API_URL=http://localhost:5000/api
ENV VITE_API_URL=$VITE_API_URL
ARG VITE_REVIEW_API_URL=http://localhost:5100
ENV VITE_REVIEW_API_URL=$VITE_REVIEW_API_URL

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "3000"]
