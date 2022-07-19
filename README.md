## Usage

In order to run this, you will need a docker POSTGRESQL database image. There are
multiple ways to install one - I used docker-compose.yml:

### Setting up the environment
First Create the '.env' file:

```
POSTGRES_HOST="localhost"
POSTGRES_DB="storefront_dev"
POSTGRES_TEST_DB="storefront_test"
POSTGRES_USER="postgres"
POSTGRES_PASSWORD="postgres"
DB_PORT="5000"
NODE_ENV= "dev"

BCRYPT_PASSWORD="stev" 
SALT_ROUNDS=10
TOKEN_SECRET="steveee"
```

If the `ENV` variable is set to test, the `storefront_test` database will be used
instead of the `store` database later on.

### Setting up postgresql
we will use docker to pull a postgresql db Image:
1. First make sure you have docker installed
2. check to make sure you also have docker-compose, run in terminal `docker-compose -v` to check version
3. Inside the project root terminal run `docker-compose up -d` to create and start the container,
the docker-compose.yml contains the docker image: "postgres", then the environment variables requierd,
POSTGRES_PASSWORD: "postgres", POSTGRES_USER: "postgres" and the dev DB we want to create POSTGRES_DB: "storefront_dev". after its done you will have a new running conatiner with postgresql DB 
4. make sure .env file is set as part of it will be used to establish a connection with the docker DB image
5. Now you are all set and ready for the next step

### Install the modules
Run `npm install` or `yarn` to install all required modules.
I prefer yarn myself

### Run the automated tests
Run `npm run test` or `yarn test` to build the serer and run Jasmine tests as often as you
would like. The test will switch to the `storefront_test` database automatically,
run db-migrate, run the tests and revert everything again and switch back to the
`storefront_dev` database for normal use.

### Run the server

#### Building
1. Run `db-migrate up` to set up the regular database tables.
2. Run `npm run watch` to build the server.
3. Run `npm run start` to run the server.

#### Using
The database will run on port 5000. You can access the server on localhost on
port 3000 (unless you change it in in `.env`), so http://localhost:3000.
It will give you nothing but a greeting message "Hello world".

##### Users routes
- Create: [post] http://localhost:3000/users to create a user.
Body Parameters are: `username`, `firstname`, `lastname` and `password`.
You will receive a JWT that is required for accessing most other routes.
- Index: [get] http://localhost:3000/users while providing authorization
will list all users.
- Show: [get] http://localhost:3000/users/:id while providing authorization
will list the information for the user with the `id`.
- Update: [put] http://localhost:3000/api/users while providing authorization will edit the user with the id
according to the token and set username, firstname, lastname and password as provided as parameters.
- Delete: [delete] http://localhost:3000/users while providing,Body Parameters: `id`
authorization will delete the user with the `id`.

##### Products routes
- Index: [get] http://localhost:3000/products to get a list of all
products.
- Show: [get] http://localhost:3000/products/:id to get the product with
`id`.
- Create: [post] http://localhost:3000/products while providing
authorization to create a product. Parameters are: `name`, `price`.
- Delete: [delete] http://localhost:3000/products while providing, Body Parameters: `id`
authorization to delete a product with `id`.

##### Order routes
- Index: [get] http://localhost:3000/orders while providing authorization
to get a list of all orders.
- Show: [get] http://localhost:3000/orders/users/:user_id while providing
authorization to get a list of all orders from user `user_id`.
- Create: [post] http://localhost:3000/orders while providing
authorization to create an order. Parameters are: `status`, Note: I use the userID from the token thus
the client won't have to supply it.
- Delete: [delete] http://localhost:3000/orders while providing, Body Parameters: `id`
authorization to delete an order with `id`.
