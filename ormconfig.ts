import "dotenv/config";
export default
{
  "username": process.env.username,
  "password": process.env.password,

  "name": "default",
  "type": "postgres",
  "host": process.env.host,
  "port": process.env.port,
  "database": process.env.database,
  "entities": [
    "./src/modules/**/entities/*.ts"
  ],
  "migrations": [
    "./src/database/migrations/*.ts"
  ],
  "cli": {
    "migrationsDir": "./src/database/migrations"
  }
}
