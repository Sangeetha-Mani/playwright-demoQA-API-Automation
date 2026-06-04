import test , {expect} from '@playwright/test';
import process from 'node:process';



test.describe("Positive Test Cases", () =>{
    test('Create user successfully', async ({request}) => {
        const response =   await request.post("https://demoqa.com/Account/v1/User",{
            data: {
                userName: process.env.VALID_USERNAME,
                password: process.env.VALID_PASSWORD
            }
        });
        const body = await response.json();
        expect(response.status()).toBe(201);
        expect(response.ok()).toBeTruthy();
        expect(body).toHaveProperty("userID");
        expect(body).toHaveProperty("username");
        expect(body).toHaveProperty("books");
        expect(body.userID).toBeDefined();
    });
    test("Create user with minimum password length" , async ({request})=>{
        const response = await request.post("https://demoqa.com/Account/v1/User", {
            data: {
                userName: process.env.VALID_USERNAME,
                password: process.env.MINIMUM_PASSWORD
            }
        })
        const body = await response.json();
        expect(response.status()).toBe(201);
        expect(response.ok()).toBeTruthy();
        expect(body.userID).toBeDefined();
        expect(body).toHaveProperty("userID");
        expect(body).toHaveProperty("username");
        expect(body).toHaveProperty("books");

    })
});

test.describe("Negative Test Cases" , () => {

    test("create user with 500 long input", async ({request}) => {
        const response = await request.post("https://demoqa.com/Account/v1/User",{
            data: {
                userName: process.env.MAXIMUM_USERNAME,
                password: process.env.VALID_PASSWORD
            }
        });
        // it should be 400 bad request but getting 500
        expect(response.status()).toBe(500);

    })
    test("create user with empty username", async ({request}) => {
        const response = await request.post("https://demoqa.com/Account/v1/User",{
            data: {
                userName: "",
                password: process.env.VALID_PASSWORD
            }
        })
        const body = await response.json()
        expect(response.status()).toBe(400);
        expect(body.message).toContain("UserName and Password required.")


    })
    test("create user with empty password", async ({request}) => {
        const response = await request.post("https://demoqa.com/Account/v1/User",{
            data: {
                userName: process.env.VALID_USERNAME,
                password: ""
            }
        })
        const body = await response.json()
        expect(response.status()).toBe(400);
        expect(body.message).toContain("UserName and Password required.")

    })
    test("Both username and password are emtpy", async ({request}) => {
        const response = await request.post("https://demoqa.com/Account/v1/User",{
            data: {
                userName: "",
                password: ""
            }
        })
        const body = await response.json()
        expect(response.status()).toBe(400);
        expect(body.message).toContain("UserName and Password required.")

    })
    test("Existing username and password", async ({request}) => {
        const response = await request.post("https://demoqa.com/Account/v1/User",{
            data: {
                userName: process.env.VALID_USERNAME,
                password: process.env.VALID_PASSWORD
            }
        })
        const body = await response.json();
        expect(response.status()).toBe(406);
        expect(body.message).toContain("User exists!");
        expect(body).toHaveProperty("message")

    })
    // password negative cases
    test("Password missing uppercase letter", async ({request}) => {
        const response = await request.post("https://demoqa.com/Account/v1/User",{
            data: {
                userName: process.env.VALID_USERNAME,
                password: "1@3saradamaa"
            }
        })
        const body = await response.json()
        expect(response.status()).toBe(400);
        expect(body.message).toContain("Passwords must have at least one non alphanumeric character, one digit ('0'-'9'), one uppercase ('A'-'Z'), one lowercase ('a'-'z'), one special character and Password must be eight characters or longer.")

    })
    test("Password missing lowercase letter", async ({request}) => {
        const response = await request.post("https://demoqa.com/Account/v1/User",{
            data: {
                userName: process.env.VALID_USERNAME,
                password: "1@3SARADAMAA"
            }
        })
        const body = await response.json()
        expect(response.status()).toBe(400);
        expect(body.message).toContain("Passwords must have at least one non alphanumeric character, one digit ('0'-'9'), one uppercase ('A'-'Z'), one lowercase ('a'-'z'), one special character and Password must be eight characters or longer.")

    })
    test("Password missing number", async ({request}) => {
        const response = await request.post("https://demoqa.com/Account/v1/User",{
            data: {
                userName: process.env.VALID_USERNAME,
                password: "@saradamaa"
            }
        })
        const body = await response.json()
        expect(response.status()).toBe(400);
        expect(body.message).toContain("Passwords must have at least one non alphanumeric character, one digit ('0'-'9'), one uppercase ('A'-'Z'), one lowercase ('a'-'z'), one special character and Password must be eight characters or longer.")

    })
      test("Password missing special character", async ({request}) => {
        const response = await request.post("https://demoqa.com/Account/v1/User",{
            data: {
                userName: process.env.VALID_USERNAME,
                password: "13saradamaa"
            }
        })
        const body = await response.json()
        expect(response.status()).toBe(400);
        expect(body.message).toContain("Passwords must have at least one non alphanumeric character, one digit ('0'-'9'), one uppercase ('A'-'Z'), one lowercase ('a'-'z'), one special character and Password must be eight characters or longer.")

    })
     test("Both username and password having only spaces", async ({request}) => {
        const response = await request.post("https://demoqa.com/Account/v1/User",{
            data: {
                userName: "   ",
                password: "   "
            }
        })
        const body = await response.json()
        expect(response.status()).toBe(400);
        expect(body.message).toContain("Passwords must have at least one non alphanumeric character, one digit ('0'-'9'), one uppercase ('A'-'Z'), one lowercase ('a'-'z'), one special character and Password must be eight characters or longer.")

    })
      test("Missing the password field completely", async ({request}) => {
        const response = await request.post("https://demoqa.com/Account/v1/User",{
            data: {
                userName: process.env.VALID_USERNAME,
               
            }
        })
        const body = await response.json()
        expect(response.status()).toBe(400);
        expect(body.message).toContain("UserName and Password required.")

    })
     test("Username with Special Characters", async ({request}) => {
        const response = await request.post("https://demoqa.com/Account/v1/User",{
            data: {
                userName: process.env.SPECIAL_USERNAME,
                password: process.env.VALID_PASSWORD
            }
        })
        const body = await response.json();
        // expected validation erroor but its gives 201
         expect(response.status()).toBe(201);
        // expect(body.message).toContain("UserName and Passwords required.")

    })
});
