# Базовый образ
FROM node:16.14.0-alpine3.14

# Создание директории приложения
WORKDIR /usr/src/app

# Копирование файлов package.json и package-lock.json
COPY package*.json ./

# Установка зависимостей
RUN npm install

# Копирование остальных файлов приложения
COPY . .

# Сборка TypeScript кода
RUN npm run build

# Запуск приложения после того, как порт станет доступным
CMD npm run start
