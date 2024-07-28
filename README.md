# library-case-api

for case study. Have fun 👻

# How run the project ⚙️

- First run npm install and set the environments. .env file must be in /src path.

### 1- Only docker Method (for production)

Set the environments. And start the project

```bash
docker compose up --build -d
```

- Note: you must be in same path with docker-compose.yml file.
- Note 2: DB_FULL_HOST cannot be localhost use docker-compose service name. db_postgres:5432

### 2- Semi docker method (good for development)

First set the environments. And db up with docker compose

```bash
docker compose up -d db_postgres
```

Now db up and connectable. DB opened the port 5432 to localhost.

```bash
npm run dev # for run development with nodemon
```

OR

```bash
npm run build && npm run start # for run with production build
```

### Note: You can find db name, db user and password values in docker-compose.yml. You must to use this values in backend environments if you will up db with docker.

### 3- No docker method 💀

If you want to run this project with no docker using. You may need to install postgres to your localhost. After you can run backend project.

```bash
npm run dev
```

OR

```bash
npm run build && npm run start
```

# Environments

| Name             | Example Value  | Type           |
| ---------------- | -------------- | -------------- |
| **RUN_MODE**     | dev            | ("dev","prod") |
| **DB_NAME**      | library_db     | string         |
| **DB_FULL_HOST** | localhost:5432 | string         |
| **DB_USER**      | library-user   | string         |
| **DB_PASSWORD**  | h311000        | string         |
