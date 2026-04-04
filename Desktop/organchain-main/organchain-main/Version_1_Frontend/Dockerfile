FROM node:18-alpine AS build
# Add openssl legacy provider support for Webpack 4
ENV NODE_OPTIONS=--openssl-legacy-provider
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
# Copy compiled output to Nginx HTML root folder
COPY --from=build /app/dist /usr/share/nginx/html
# Also copy forms if necessary
COPY --from=build /app/forms /usr/share/nginx/html/forms
# Configure Nginx logic to handle single page app routing and proxy backends
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
