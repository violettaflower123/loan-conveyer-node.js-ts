# Базовый образ
FROM node:16.13.1-alpine3.14

# Создание директории приложения
WORKDIR /usr/src/app

# Установка зависимостей
COPY package*.json ./
RUN npm install

# Копирование файлов приложения
COPY . .

# Копирование скрипта wait-for-it
COPY wait-for-it.sh /usr/wait-for-it.sh

# Делаем скрипт исполняемым
RUN chmod +x /usr/wait-for-it.sh

# Сборка TypeScript кода
RUN npm run build

# Установка netcat для проверки доступности порта
RUN apk add --no-cache netcat-openbsd

# Запуск приложения после того, как порт станет доступным
CMD /usr/wait-for-it.sh api-deals:3002 -- npm run dev
