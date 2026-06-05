import test , {expect} from '@playwright/test';
import process from 'node:process';

const token  = process.env.TOKEN;
const userID = process.env.VALID_USERID;
const invalidToken = process.env.INVALID_TOKEN;
const invalidUserID = process.env.INVALID_USERID;

test.describe("Positive Test Cases", ()=> {

    test("Valid token", async ({request})=> {
        const response  = await request.get(`https://demoqa.com/Account/v1/User/${userID}`, {
            headers:{
                Authorization: `Bearer ${token}`
            }
        });
        const body = await response.json();
        expect(response.status()).toBe(200);
        expect(body).toHaveProperty("username");
        expect(body).toHaveProperty("books");
        expect(body).toHaveProperty("userId");
        expect(body.userId).toBeDefined();
        
    })
})

test.describe("Negative Test Cases", ()=> {

    test("Invalid token", async ({request})=> {
        const response  = await request.get(`https://demoqa.com/Account/v1/User/${userID}`, {
            headers:{
                Authorization: `Bearer ${invalidToken}`
            }
        });
        const body = await response.json();
        expect(response.status()).toBe(401);
        expect(body).toHaveProperty("message");
        expect(body.message).toContain("User not authorized!")
    })

    test("Invalid userID", async ({request})=> {
        const response  = await request.get(`https://demoqa.com/Account/v1/User/${invalidUserID}`, {
            headers:{
                Authorization: `Bearer ${token}`
            }
        });
        const body = await response.json();
        expect(response.status()).toBe(401);
        expect(body).toHaveProperty("message");
        expect(body.message).toContain("User not found!")
    })
     test("Missing token", async ({request})=> {
        const response  = await request.get(`https://demoqa.com/Account/v1/User/${userID}`, {
            headers:{
                Authorization: `Bearer`
            }
        });
        const body = await response.json();
        expect(response.status()).toBe(401);
        expect(body).toHaveProperty("message");
        expect(body.message).toContain("User not authorized!")
    })
})