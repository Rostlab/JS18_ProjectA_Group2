#!/bin/bash
docker login -u "$DOCKER_USERNAME" -p "$DOCKER_PASSWORD" js2018group2.azurecr.io
docker build -t js2018group2.azurecr.io/group2 .
docker push js2018group2.azurecr.io/group2
