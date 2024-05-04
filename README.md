# 🎯 Grocertec

Online Grocery Store

## ⬇ Installation

Make sure you have [Nodejs](https://nodejs.org/en/download/current) and [@nestjs/cli](https://docs.nestjs.com/first-steps) installed, otherwise you'll have to install them on your machine.

```bash
~ node -v
~ nest --version
```

```bash
# Clone via SSH or any other method
$ git clone git@github.com:oussamabouchikhi/grocertec

# CD into the project
$ cd grocertec

# Install the dependencies (feel for to use another package manage like npm or yarn)
$ pnpm install
```

## 🛠️ Configuration

Rename the `example.env.production`, `example.env.development` and the `example.test.env` files to `.env.production`, `.env.development` and `.env.test` respectively, then edit the environment variables \
`DB_TYPE=YOUR_DB_TYPE` for example: postgres \
`DB_HOST=YOUR_DB_HOST` for example: db \
`DB_PORT=YOUR_DB_PORT` for example: 5432 \
`DB_USERNAME=YOUR_DB_USERNAME` for example: postgres \
`DB_PASSWORD=YOUR_DB_PASSWORD` for example: postgres \
`DB_NAME=YOUR_DB_NAME` for example: postgres

```.env.production
DB_TYPE=YOUR_PRODUCTION_ENV_DB_TYPE
DB_HOST=YOUR_PRODUCTION_ENV_DB_HOST
DB_PORT=YOUR_PRODUCTION_ENV_DB_PORT
DB_USERNAME=YOUR_PRODUCTION_ENV_DB_USERNAME
DB_PASSWORD=YOUR_PRODUCTION_ENV_DB_PASSWORD
DB_DATABASE=YOUR_PRODUCTION_ENV_DB_DATABASE
```

```.env.development
DB_TYPE=
DB_NAME=
```

```.env.test
DB_TYPE=
DB_NAME=
```

## 🚀 Running the app

For a weird reason, sometimes cross-env deos not work and environment variables are not being passed if you face this issue you can do the following:

1. If you choose to run the project locally, in the `app.module.ts` file, replace the `TypeOrm.forRootAsync` with this

```typescript
TypeOrmModule.forRoot({
  type: 'sqlite',
  database: 'db.sqlite',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: true, // Remove in production
}),
```

2. And in case you choose to run the project with docker, enable docker on your machine and run the docker compose to build and run the docker container and specifuy the env file expplicitly by running this command

```bash
docker compose --env-file .env.production up
```

Running the app locally

```bash
# development
$ pnpm start

# watch mode (recomended)
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## 🧪 Test

```bash
# unit tests (you can add the prefix --watch)
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# single file e2e tests
$ pnpm run test:e2e -- item.e2e-spec.ts

# test coverage
$ pnpm run test:cov
```

### 🐳 Docker

Make sure docker is running on your machine. And Obviously you installed it :)

```bash
# Build and run the container
Docker compose up
```

After running the Above command, you access the app from <http://localhost:3000/api/v1/>

Other usefull commands

```bash
# Build docker images
docker-compose build

# Show docker images
docker images

# Show running docker containers
docker ps -a
```

### 📄 License

This project is open-sourced under the [MIT license](https://opensource.org/licenses/MIT).
