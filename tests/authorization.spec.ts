import test , { expect } from '@playwright/test';
import process from 'node:process';


test.describe("Positive test cases", () => {
    test("Valid username and password", async ({request})=>{
        const response = await request.post("https://demoqa.com/Account/v1/Authorized", {
            data: {
                userName: process.env.VALID_USERNAME ,
                password: process.env.VALID_PASSWORD
            }
        });
        const body = await response.json();
        expect(response.status()).toBe(200);
        expect(body).toBeTruthy();

    })
})
test.describe("Negative test cases", () => {
    test("Invalid username", async ({request})=>{
        const response = await request.post("https://demoqa.com/Account/v1/Authorized", {
            data: {
                userName: process.env.INVALID_USERNAME ,
                password: process.env.VALID_PASSWORD
            }
        });
        const body = await response.json();
        expect(response.status()).toBe(404);
        expect(body).toHaveProperty("message");
        expect(body.message).toContain("User not found!");

    })
     test("Invalid Password", async ({request})=>{
        const response = await request.post("https://demoqa.com/Account/v1/Authorized", {
            data: {
                userName: process.env.VALID_USERNAME ,
                password: process.env.INVALID_PASSWORD
            }
        });
        const body = await response.json();
        expect(response.status()).toBe(404);
        expect(body).toHaveProperty("message");
        expect(body.message).toContain("User not found!");

    })
      test("Empty Username", async ({request})=>{
        const response = await request.post("https://demoqa.com/Account/v1/Authorized", {
            data: {
                userName: "" ,
                password: process.env.INVALID_PASSWORD
            }
        });
        const body = await response.json();
        expect(response.status()).toBe(400);
        expect(body).toHaveProperty("message");
        expect(body.message).toContain("UserName and Password required.");

    })
     test("Empty Password", async ({request})=>{
        const response = await request.post("https://demoqa.com/Account/v1/Authorized", {
            data: {
                userName: process.env.VALID_USERNAME ,
                password: ""
            }
        });
        const body = await response.json();
        expect(response.status()).toBe(400);
        expect(body).toHaveProperty("message");
        expect(body.message).toContain("UserName and Password required.");

    })
     test("Empty Username and Password", async ({request})=>{
        const response = await request.post("https://demoqa.com/Account/v1/Authorized", {
            data: {
                userName: "",
                password: ""
            }
        });
        const body = await response.json();
        expect(response.status()).toBe(400);
        expect(body).toHaveProperty("message");
        expect(body.message).toContain("UserName and Password required.");

    })
})