# API for METRO EVENTS
#README REWORK
<!-- ## Endpoints

### Register

**Endpoint:** `POST /register`

**Description:** Register a new user provided the username is unique

**Request:**

- Method: `POST`
- URL: `/register`
- Body:
  - `username` (string): The username for the new user.
  - `password` (string): The password for the new user.

**Response:**

- Status Code: 200 OK
- Body: `"User created successfully!"`

- Status Code: 400 Bad Request
- Body: `"Please provide a username and password"`

- Status Code: 409 Conflict
- Body: `"Username already taken"`

- Status Code: 500 Internal Server Error
- Body: `"Error creating user"`

### Login

**Endpoint:** `POST /login`

**Description:** Log in an existing user with a valid username and password. It returns a JWT token for authentication.

**Request:**

- Method: `POST`
- URL: `/login`
- Body:
  - `username` (string): The username of the existing user.
  - `password` (string): The password of the existing user.

**Response:**

- Status Code: 200 OK
- Body: A JSON object containing the user's ID and username, and a JWT token.
  Example:
```json
{
    "id": 1,
    "username": "exampleuser",
    "token": "your-jwt-token"
}
```
Status Code: 400 Bad Request

Body: `"Please provide a username and password"`

Status Code: 401 Unauthorized

Body: `"Invalid username or password"`

## Authentication

This API uses JWT (JSON Web Tokens) for authentication. After a successful login, a JWT token is provided in the response. To access protected routes, include the token in the `Authorization` header of your requests.

**Example Header:**

## TODO List
- [ ] Make participants id sequential -->