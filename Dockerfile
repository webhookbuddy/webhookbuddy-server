FROM  node:12.16.1

LABEL author="Johnny Oshika"

ENV   PORT=8000

COPY    . /var/www
WORKDIR /var/www

RUN   npm install

EXPOSE ${PORT}

ENTRYPOINT [ "npm", "start" ]