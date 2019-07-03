FROM node:alpine
WORKDIR frontend
COPY ./ .
RUN yarn 
CMD yarn offline:docker
