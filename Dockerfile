# docker login -u js2018group2 js2018group2.azurecr.io
# docker build -t js2018group2.azurecr.io/group2 .
# docker push js2018group2.azurecr.io/group2
FROM js2018group2.azurecr.io/base
EXPOSE 4200

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
