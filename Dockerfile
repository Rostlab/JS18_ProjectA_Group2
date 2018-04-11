# docker login -u js2018group2 js2018group2.azurecr.io
# docker build -t js2018group2.azurecr.io/group2 .
# docker push js2018group2.azurecr.io/group2
FROM ubuntu:16.04

RUN apt-get update && \
    apt-get install -y curl && \
    curl -sL https://deb.nodesource.com/setup_8.x | bash - && \
    apt-get install -y --no-install-recommends python3 python3-pip nodejs git

EXPOSE 4200

WORKDIR /app
RUN git clone --depth 1 https://github.com/jyotirmay123/nlp_engine.git
RUN cd nlp_engine && \
    pip3 install -r requirements.txt && \
    pip3 install -e . && \
    pip3 install rasa_nlu[spacy] && \
    python3 -m spacy download en_core_web_md && \
    python3 -m spacy link en_core_web_md en && \
    cd ..
COPY package.json package-lock.json .
RUN npm install
COPY . .
RUN cp -R projects nlp_engine

CMD ["./node_modules/.bin/concurrently", \
    "PORT=3001 node server/server.js", \
    "PORT=4200 ./node_modules/.bin/ng serve -H 0.0.0.0 --proxy-config UI/proxy.conf.json --disable-host-check", \
    "npm run start:nlp"]
