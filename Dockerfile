FROM ubuntu:16.04
EXPOSE 4200

RUN apt-get update
RUN apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup_8.x | bash -
RUN apt-get install -y python python-pip nodejs git

WORKDIR /app
COPY package.json .
COPY package-lock.json .
COPY nlp_engine/alt_requirements/requirements_bare.txt .
RUN npm install
RUN pip install -r requirements_bare.txt
COPY . .

CMD ["./node_modules/.bin/concurrently", \
    "PORT=3001 node server/server.js", \
    "PORT=4200 ./node_modules/.bin/ng serve -H 0.0.0.0 --proxy-config UI/proxy.conf.json --disable-host-check", \
    "npm run start:nlp"]
