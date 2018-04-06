# docker login -u js2018group2 js2018group2.azurecr.io
# docker build -t js2018group2.azurecr.io/group2 .
# docker push js2018group2.azurecr.io/group2
FROM js2018group2.azurecr.io/base
EXPOSE 4200

WORKDIR /app
RUN git clone --depth 1 https://github.com/jyotirmay123/nlp_engine.git
RUN pip install -r nlp_engine/requirements.txt
RUN pip install -e nlp_engine
RUN cp -R projects nlp_engine
COPY package.json .
COPY package-lock.json .
RUN npm install
COPY . .

CMD ["./node_modules/.bin/concurrently", \
    "PORT=3001 node server/server.js", \
    "PORT=4200 ./node_modules/.bin/ng serve -H 0.0.0.0 --proxy-config UI/proxy.conf.json --disable-host-check", \
    "npm run start:nlp"]
