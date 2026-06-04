# DemoQA API Automation Framework

API test automation framework built using Playwright and TypeScript for testing the DemoQA Book Store APIs.

## Tech Stack

* Playwright
* TypeScript
* Node.js
* Git
* GitHub

## Test Coverage

### User Registration

#### Positive Test Cases

* Create user successfully
* Create user with valid minimum password length

#### Negative Test Cases

* Create user with existing username
* Create user with empty username
* Create user with empty password
* Create user with empty username and password
* Create user with excessively long username
* Password missing uppercase letter
* Password missing lowercase letter
* Password missing number
* Password missing special character
* Username and password containing only spaces

#### Validations

* Status code validation
* Response body validation
* Mandatory field validation
* Error message validation

---

### Authentication (Generate Token)

#### Positive Test Cases

* Generate token with valid credentials

#### Negative Test Cases

* Invalid username
* Invalid password
* Empty username
* Empty password
* Empty username and password

#### Validations

* Token generation validation
* Status code validation
* Response schema validation

---

### Authorization

#### Positive Test Cases

* Authorized user validation

#### Negative Test Cases

* Invalid credentials
* Empty credentials
* Unauthorized user validation

---

### Protected API Testing

#### Add Book

* Add book to user profile
* Verify successful book addition

#### Get User Details

* Retrieve user details
* Verify user information and books collection

#### Replace Book

* Replace existing book
* Verify updated book details

#### Delete Book

* Delete book from user profile
* Verify successful deletion

---

### Security Testing

#### Authentication Security

* Access protected API without token
* Access protected API with invalid token
* Access protected API with malformed token

#### Authorization Security

* User A attempts to access User B's data
* User A attempts to delete User B's books

#### Token Validation

* Expired token
* Modified token
* Random token

---

### API Contract Validation

For every API endpoint:

* Verify response schema
* Verify mandatory fields
* Verify data types
* Verify status codes
* Verify response time
* Verify content type (`application/json`)

---

## Running Tests

```bash
npx playwright test
```

## Project Structure

```text
tests/
├── register-user.spec.ts
├── generate-token.spec.ts
├── authorization.spec.ts
├── books.spec.ts

utils/
├── apiClient.ts
├── testData.ts

playwright.config.ts
.env
README.md
```
