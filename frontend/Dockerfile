FROM node:20.13.1 as build
WORKDIR /app
COPY package*.json ./
RUN npm install
Copy . .

# FROM nginx:alpine
# COPY --from=build /app/dist /usr/share/nginx/html
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]