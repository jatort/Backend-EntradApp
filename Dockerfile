FROM node:14 as development

RUN mkdir -p /entradapp
WORKDIR /entradapp
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:14 as production

WORKDIR /entradapp
COPY package*.json ./
RUN npm install --only=production
COPY --from=development /entradapp/build ./build
CMD ["node", "build/index.js"]
