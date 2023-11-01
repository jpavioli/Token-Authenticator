# Node Token Authenticator

This is a web service built using `node`, `express`, and `sqlite3` to signup, authenticate users, and issue JWT tokens for request Authorization. In order to use this repository, please ensure you have `node` installed on your local machine.

## Using this Repository 
1. Install `node` packages $ npm i
2. Update jwtSecret to a custom value for unique encoding of your personal instance ( node > config > default.json )
3. The server will default to port 6969, this can be updated in routes > server.js (Line 14)
4. Start the node server $ npm run server

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
curl --location 'http://localhost:${port}/users/signup' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email": "john.doe@gmail.com",
    "password": "shhh",
    "firstName": "John",
    "lastName": "Doe",
    "birthday": "01/06/1988",
    "city": "New York",
    "state": "NY",
    "zip": "10029"
}'
```

Sample Response:
```
{
    "token": "<TOKEN>",
    "success": true
}
```

### GET /signin
- Validate email and password are included in request
- Validate email exists
- Authenticate email and salted / hashed password
- Return JWT token for authentcated user

Sample Request:
```
curl --location --request GET 'http://localhost:6969/users/signin' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email": "john.doe@gmail.com",
    "password": "shhh"
}'
```

Sample Response:
```
{
    "token": "<TOKEN>",
    "success": true
}
```

### GET user/
- Authenticate JWT
- Find authenticated user
- Return the authenticated user

Sample Request:
```
curl --location --request PATCH 'http://localhost:6969/users/' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer <TOKEN>' \
```

Sample Response:
```
{
    "user": {
        "customerId": "70ed9854-d215-4bd4-96d9-368b18a486c3",
        "firstName": "John",
        "lastName": "Doe",
        "birthday": "01/06/1988",
        "city": "New York",
        "state": "NY",
        "zip": 10029,
        "createdAt": "2023-11-01 00:03:30.960 +00:00",
        "updatedAt": "2023-11-01 00:03:30.960 +00:00"
    },
    "success": false
}
```

### PUT user/
- Validate email and password are included in the request
- Validate email exists
- Authenticate email and salted/hashed password
- Return JWT token for authenticated user

Sample Request:
```
curl --location --request PUT 'http://localhost:6969/users/' \
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
        "customerId": "70ed9854-d215-4bd4-96d9-368b18a486c3",
        "firstName": "Not John",
        "lastName": "Doe",
        "birthday": "01/06/1988",
        "city": "New York",
        "state": "NY",
        "zip": 10029,
        "createdAt": "2023-11-01 00:03:30.960 +00:00",
        "updatedAt": "2023-11-01 00:03:30.960 +00:00"
    },
    "success": false
}
```
