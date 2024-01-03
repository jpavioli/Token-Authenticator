# Ruby / Rails Token Authenticator

This is a web service built using `ruby`, `rails`, and `sqlite3` to signup, authenticate users, and issue JWT tokens for request Authorization. In order to use this repository, please ensure you have `ruby` and `rails` installed on your local machine.

## Using this Repository 
1. Install `ruby` gems $ bundle install
2. Update jwtSecret to a custom value for unique encoding of your personal instance ( ruby-rails > config > application.yml )
3. Perform a database migration to create required tables $ bin/rails db:migrate
3. The server will default to port 3000
4. Start the node server $ bin/rails server

## Routes and Sample Requests 

### POST users/signup
- Validate email and password
- Validate email is unique against users
- Create a new DB entry for
   - User Details using customerId as primaryKey
   - Autentication linking email and salted / hashed password to customerId
- Return JWT token for authentcated user

Sample Request:
```
curl --location 'http://localhost:3000/users/signup' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email": "john.doe@gmail.com",
    "password": "shhh",
    "first_name": "John",
    "last_name": "Doe",
    "birthday": "01/06/1988",
    "city": "New York",
    "state": "NY",
    "zip": "10029"
}'
```

Sample Response:
```
{
    "user": {
        "id": "<UUID>",
        "email": "john.doe@gmail.com",
        "first_name": "John",
        "last_name": "Doe",
        "birthday": "01/06/1988",
        "city": "New York",
        "state": "NY",
        "zip": "10029"
    },
    "token": "<TOKEN>"
}
```

### GET /signin
- Validate email and password are included in request
- Validate email exists
- Authenticate email and salted / hashed password
- Return JWT token for authentcated user

Sample Request:
```
curl --location --request GET 'http://localhost:3000/users/signin' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email": "john.doe@gmail.com",
    "password": "shhh"
}'
```

Sample Response:
```
{
    "token": "<TOKEN>"
}
```

### GET user/
- Authenticate JWT
- Find authenticated user
- Return the authenticated user

Sample Request:
```
curl --location --request PATCH 'http://localhost:3000/user/' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer <TOKEN>' \
```

Sample Response:
```
{
    "user": {
        "customerId": "<UUID>",
        "firstName": "John",
        "lastName": "Doe",
        "birthday": "01/06/1988",
        "city": "New York",
        "state": "NY",
        "zip": 10029
    }
}
```

### PUT user/
- Validate email and password are included in the request
- Validate email exists
- Authenticate email and salted/hashed password
- Return JWT token for authenticated user

Sample Request:
```
curl --location --request PUT 'http://localhost:3000/users/' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer <TOKEN>' \
--data '{
    "firstName": "Not John"
}'
```

Sample Response:
```
{
    "user": {
        "customerId": "<UUID>",
        "firstName": "Not John",
        "lastName": "Doe",
        "birthday": "01/06/1988",
        "city": "New York",
        "state": "NY",
        "zip": 10029
    }
}
```
