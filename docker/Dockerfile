# docker login -u js2018group2 js2018group2.azurecr.io
# docker build -t js2018group2.azurecr.io/base -f Dockerfile-base .
# docker push js2018group2.azurecr.io/base
FROM ubuntu:16.04

RUN apt-get update
RUN apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup_8.x | bash -
RUN apt-get install -y python python-pip nodejs git
