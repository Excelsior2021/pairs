# # syntax=docker/dockerfile:1

# # Comments are provided throughout this file to help you get started.
# # If you need more help, visit the Dockerfile reference guide at
# # https://docs.docker.com/go/dockerfile-reference/

# # Want to help us make this template better? Share your feedback here: https://forms.gle/ybq9Krt8jtBL3iCk7

ARG NODE_VERSION=20.11.0
# ARG PNPM_VERSION=8.14.0

# ################################################################################
# # Use node image for base image for all stages.
FROM node:${NODE_VERSION}-alpine as base


WORKDIR /usr/src/app

COPY . .

USER node

EXPOSE 3000

CMD npx serve ./dist