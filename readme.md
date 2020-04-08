# Skeleton

## Skeleton Has:

- ExpressJs
- Sequelize
- GraphQL
- Postgress
- Twilio
- Basic Auth
- Eslint Airbnb
- Prettier

## Local config

Create `setup/config/local.js` file with following sample data from main config file

## Migrations

Base migration Name: `20191209132650-baseMigration`

Please don't forget to RUN and MAKE migrations for any change in the models.

To run migrations:

```
yarn sequelize-cli db:migrate
```

or

```
npx sequelize-cli db:migrate
```

To make empty migrations:

```
yarn sequelize-cli migration:generate --name [MIGRATION-NAME]
```

or

```
npx sequelize-cli migration:generate --name [MIGRATION-NAME]
```

Documentation about sequelize migrations: https://sequelize.org/master/manual/migrations.html
