# Dockerfile

# base image
FROM node:23.11.1-alpine3.21

# create & set working directory
RUN mkdir -p /usr/src
WORKDIR /usr/src

# copy source files
COPY . /usr/src

# install dependencies
RUN yarn install
CMD yarn run scan
