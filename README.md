# Token-Authenticator
This is a sandbox repository for various apps to authenticate users and provide JWT tokens and local storage persistence in various languages. 

## How to use this repository
Within the main repository, there are functioning web servers in various languages/frameworks built to accomplish the same tasks. Each is built to accomplish the following tasks:
1) Accept user data via a POST request and create a new Customer Entry. This includes:
   a. A customer email and password combination for authentication
   b. Assignment of an arbitrary Customer ID
   c. Persistence of Customer Information for use in marketing and personalization
   d. Return a time-bound JWT token for authentication of subsequent requests
2) Authenticate a user based on email and password combination and return a time-bound JWT token for authentication
3) Get User Details for personalization when providing a correct JWT token
4) Update user data via PUT request when providing a correct JWT token

Specifics for each framework are detailed in the appropriate README within the directory. 

## Completed Authentication Services
- Node 
