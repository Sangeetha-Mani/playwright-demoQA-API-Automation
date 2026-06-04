import test , { expect } from '@playwright/test';
import process from 'node:process';

test.describe("Positive Case", ()=>{
    test("Generate token with valid username and password", async ({request})=>{
        const response = await request.post("https://demoqa.com/Account/v1/GenerateToken", {
            data: {
                userName: process.env.VALID_USERNAME,
                password: process.env.VALID_PASSWORD
            }
        });
        const body = await response.json();
        expect(response.status()).toBe(200);
        expect(body).toHaveProperty("token");
        expect(body).toHaveProperty("expires");
        expect(body).toHaveProperty("result");
        expect(body.token).toBeDefined();
    })
});

test.describe("Negative Cases", () => {
    test("Invalid username", async ({request}) => {
         const response = await request.post("https://demoqa.com/Account/v1/GenerateToken", {
            data: {
                userName: process.env.INVALID_USERNAME,
                password: process.env.VALID_PASSWORD
            }
        });
        const body = await response.json();
        //it shoule be 400 bad request 
        //expect(response.status()).toBe(400);
        expect(body).toHaveProperty("token");
        expect(body).toHaveProperty("expires");
        expect(body).toHaveProperty("result");
        expect(body.token).toBeNull();
        expect(body.expires).toBeNull();
        expect(body.result).toContain("User authorization failed.")
    })
    test("Invalid password", async ({request}) => {
         const response = await request.post("https://demoqa.com/Account/v1/GenerateToken", {
            data: {
                userName: process.env.VALID_USERNAME,
                password: process.env.INVALID_PASSWORD
            }
        });
        const body = await response.json();
        //it shoule be 400 bad request 
        //expect(response.status()).toBe(400);
        expect(body).toHaveProperty("token");
        expect(body).toHaveProperty("expires");
        expect(body).toHaveProperty("result");
        expect(body.token).toBeNull();
        expect(body.expires).toBeNull();
        expect(body.result).toContain("User authorization failed.")
    })
    test("Invalid username and password", async ({request}) => {
         const response = await request.post("https://demoqa.com/Account/v1/GenerateToken", {
            data: {
                userName: process.env.INVALID_USERNAME,
                password: process.env.INVALID_PASSWORD
            }
        });
        const body = await response.json();
        //it shoule be 400 bad request 
        //expect(response.status()).toBe(400);
        expect(body).toHaveProperty("token");
        expect(body).toHaveProperty("expires");
        expect(body).toHaveProperty("result");
        expect(body.token).toBeNull();
        expect(body.expires).toBeNull();
        expect(body.result).toContain("User authorization failed.")
    })
    test("Empty Username", async ({request}) => {
         const response = await request.post("https://demoqa.com/Account/v1/GenerateToken", {
            data: {
                userName: "",
                password: process.env.VALID_PASSWORD
            }
        });
        const body = await response.json();
        //it shoule be 400 bad request 
        expect(response.status()).toBe(400);
        expect(body.message).toContain("UserName and Password required.")
    })
     test("Empty Password", async ({request}) => {
         const response = await request.post("https://demoqa.com/Account/v1/GenerateToken", {
            data: {
                userName: process.env.VALID_USERNAME,
                password: ""
            }
        });
        const body = await response.json();
        //it shoule be 400 bad request 
        expect(response.status()).toBe(400);
        expect(body.message).toContain("UserName and Password required.")
    })
     test("Empty Username and Password", async ({request}) => {
         const response = await request.post("https://demoqa.com/Account/v1/GenerateToken", {
            data: {
                userName: "",
                password: ""
            }
        });
        const body = await response.json();
        //it shoule be 400 bad request 
        expect(response.status()).toBe(400);
        expect(body.message).toContain("UserName and Password required.")
    })

})