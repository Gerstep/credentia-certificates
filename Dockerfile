
FROM node:12.3.1-alpine as install

ARG NODE_ENV=development
ENV NODE_ENV ${NODE_ENV}

COPY package.json .
COPY yarn.lock .

RUN yarn install --ignore-scripts --frozen-lockfile --ignore-optional

FROM node:12.3.1-alpine as build

ARG NODE_ENV=production
ENV NODE_ENV ${NODE_ENV}

ARG PORT=3000
ENV PORT ${PORT}

COPY --from=install node_modules node_modules
COPY . .
RUN mv src/environments/environment.prod.ts src/environments/environment.ts

RUN yarn build

FROM node:12.3.1-alpine as run

# we don't need the args here cause they're sent at run time
# and we only really need these to run successully (KEEP IT LEAN!)
WORKDIR /usr/src/app
COPY --from=build node_modules node_modules
COPY --from=build .build .build
COPY --from=build package.json package.json

EXPOSE ${PORT}

CMD ["yarn", "start"]
