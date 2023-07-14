# Определите базовый образ
FROM node:14

# Создайте директорию приложения
WORKDIR /usr/src/app

# Копируйте package.json и package-lock.json
COPY package*.json ./

# Установите зависимости приложения
RUN npm install

# Скопируйте исходные файлы приложения
COPY . .

# Экспонируйте порт, на котором работает ваше приложение
EXPOSE 8080

# Запустите ваше приложение
CMD [ "node", "server.js" ]
