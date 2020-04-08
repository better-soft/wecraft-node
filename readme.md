# WECRAFT API BOILERPLATE

## What Do We Have?:

- ExpressJs Server
- Sequelize ORM for database communications
- GraphQL
- PostgresQL as the database dialect of choice
- Basic Auth With Option of SMS Confirmation
- Twilio SMS Verify Service for 2 Factor Auth
- Eslint Airbnb for linting
- Prettier for formating

## Local config

Create `setup/config/local.js` file with sample data from main config file. This file is ignored by git and can be used for configuration

## Migrations & Seeds

Base migration Name: `20191209132650-baseMigration`

Please don't forget to RUN and MAKE migrations for any change in the models.

Migrations run on every `yarn/npm start` but for manual running use `yarn/npm migrate'. Seeds run on every`yarn/npm start`but for manual running use`yarn/npm seed`. For running server without migrating and seeding use`yarn/npm start:only`

To make empty migrations:

```
yarn sequelize-cli migration:generate --name [MIGRATION-NAME]
```

or

```
npx sequelize-cli migration:generate --name [MIGRATION-NAME]
```

To make empty seeds:

```
yarn sequelize-cli seed:generate --name [SEED-NAME]
```

or

```
npx sequelize-cli seed:generate --name [SEED-NAME]
```

Documentation about sequelize migrations: https://sequelize.org/master/manual/migrations.html

## PLEASE DONT MIX PACKAGERS. YARN IS ALWAYS PREFERED
