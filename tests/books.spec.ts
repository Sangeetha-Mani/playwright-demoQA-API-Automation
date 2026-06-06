import test , {expect, request} from '@playwright/test';
import process from 'node:process';


const token  = process.env.TOKEN;
const isbn = process.env.VALID_ISBN;
const userId = process.env.VALID_USERID;
const invalidISBN = process.env.INVLAID_ISBN;
const invalidToken = process.env.INVALID_TOKEN;
const malformedToken = process.env.MALFORMED_TOKEN;
const userB_userId = process.env.USERB_USERID;
const userB_ISBN = process.env.USERB_ISBN;
const newISBN = process.env.NEW_ISBN



test.describe("Postive Test Cases", () => {

    test("Get All Books", async ({request}) => {

        const response = await request.get("https://demoqa.com/BookStore/v1/Books",{
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const body = await response.json();
        expect(response.status()).toBe(200);
        expect(body).toHaveProperty("books");
        expect(Array.isArray(body.books)).toBeTruthy();
        expect(body.books.length).toBeGreaterThan(1);
        expect(body.books[0]).toHaveProperty("isbn");
        expect(body.books[0]).toHaveProperty("title");
        expect(body.books[0]).toHaveProperty("author");
        expect(body.books[0]).toHaveProperty("pages");

    })

    test("Get a book", async ({request}) => {

        const response = await request.get(`https://demoqa.com/BookStore/v1/Book?ISBN=${isbn}`,{
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const body = await response.json();
        expect(response.status()).toBe(200);
        expect(body).toHaveProperty("isbn");
        expect(body).toHaveProperty("title");
        expect(body).toHaveProperty("author");
        expect(body).toHaveProperty("pages");

    })

    test("Add a book ", async ({request}) => {
        const response = await request.post("https://demoqa.com/BookStore/v1/Books", {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            data: {
                userId: userId,
                collectionOfIsbns:[
                    {
                        isbn: isbn
                    }
                ]
            }
        });
        const body = await response.json();
        expect(response.status()).toBe(201);
        console.log(body);
        expect(body.books.length).toBe(1);
        expect(body.books[0].isbn).toBeDefined();
    })

    test("Replace a book by isbn ", async ({request}) => {
        const response = await request.put(`https://demoqa.com/BookStore/v1/Books/${isbn}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            data: {
               "userId": userId,
                "isbn": "9781449331818"
            }
        });
        const body = await response.json();
        expect(response.status()).toBe(200);
        expect(Array.isArray(body.books)).toBeTruthy();
        expect(body.books[0].isbn).toBeDefined();
        expect(body.books[0].author).toBeDefined();
    })

    test("Delete a book by isbn with userid ", async ({request}) => {
        const response = await request.delete("https://demoqa.com/BookStore/v1/Book", {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            data: {
               "userId": userId,
                "isbn": "9781449331818"
            }
        });
        
        expect(response.status()).toBe(204);
    })
})

test.describe("Negative Test cases", ()=> {
    // Get a book - Negative Cases
    test("Invalid ISBN", async ({request}) => {
        const response = await request.get(`https://demoqa.com/BookStore/v1/Book?ISBN=${invalidISBN}`,{
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        expect(response.status()).toBe(400);
        const body = await response.json();
        expect(body.message).toContain("ISBN supplied is not available in Books Collection!")
    })
    test("Missed ISBN", async ({request}) => {
        const response = await request.get(`https://demoqa.com/BookStore/v1/Book?ISBN=`,{
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        expect(response.status()).toBe(400);
        const body = await response.json();
   
        expect(body.message).toContain("ISBN supplied is not available in Books Collection!")
    })
      test("Special Character ISBN", async ({request}) => {
        const response = await request.get(`https://demoqa.com/BookStore/v1/Book?ISBN=@#76888888`,{
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        expect(response.status()).toBe(400);
        const body = await response.json();
        expect(body.message).toContain("ISBN supplied is not available in Books Collection!")
    })

    // Delete Book - Negative cases
    test("Delete non existing book", async ({request})=>{
        const response = await request.delete("https://demoqa.com/BookStore/v1/Book", {
            headers: {
                Authorization: `Bearer ${token}`
            },
            data: {
                userId: userId,
                isbn: invalidISBN
            }
        })
        expect(response.status()).toBe(400);
        const body = await response.json();
        expect(body.message).toContain("ISBN supplied is not available in User's Collection!")

    })
     test("Delete a book with invalid token", async ({request})=>{
        const response = await request.delete("https://demoqa.com/BookStore/v1/Book", {
            headers: {
                Authorization: `Bearer ${invalidToken}`
            },
            data: {
                userId: userId,
                isbn: isbn
            }
        })
        expect(response.status()).toBe(401);
        const body = await response.json();
        expect(body.message).toContain("User not authorized!");
    })
     test("Delete a book with missing token", async ({request})=>{
        const response = await request.delete("https://demoqa.com/BookStore/v1/Book", {
            headers: {
                Authorization: `Bearer `
            },
            data: {
                userId: userId,
                isbn: isbn
            }
        })
        expect(response.status()).toBe(401);
        const body = await response.json();
        expect(body.message).toContain("User not authorized!");
    })

    // Replace book - negative cases
    test("Replace book with invalid isbn", async ({request}) => {
        const response = await request.put(`https://demoqa.com/BookStore/v1/Books/${invalidISBN}`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            data: {
                userId: userId,
                isbn: "9781449331818"
            }
        })
        const body = await response.json();
        expect(response.status()).toBe(400);
        expect(body.message).toContain("ISBN supplied is not available in User's Collection!")
    })
     test("Replace book with missing new isbn", async ({request}) => {
        const response = await request.put(`https://demoqa.com/BookStore/v1/Books/${isbn}`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            data: {
                userId: userId,
                
            }
        })
        const body = await response.json();
        expect(response.status()).toBe(400);
        expect(body.message).toContain("Request Body is Invalid!")
        
    })
      test("Replace book with invalid new isbn", async ({request}) => {
        const response = await request.put(`https://demoqa.com/BookStore/v1/Books/${isbn}`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            data: {
                userId: userId,
                isbn: invalidISBN
            }
        })
        const body = await response.json();
        expect(response.status()).toBe(400);
        expect(body.message).toContain("ISBN supplied is not available in Books Collection!")
        
    })
   
      test("Replace book with  invalid token", async ({request}) => {
        const response = await request.put(`https://demoqa.com/BookStore/v1/Books/${isbn}`, {
            headers: {
                Authorization: `Bearer ${invalidToken}`
            },
            data: {
                userId: userId,
                isbn: "9781449331818"
            }
        })
        const body = await response.json();
        expect(response.status()).toBe(401);
        expect(body.message).toContain("User not authorized!")
        
    })


})

test.describe("Security Test cases", () => {
    //Authentication
    test("Authentication - Access Procted API with missing token" , async ({request})=>{
        const response = await request.get(`https://demoqa.com/Account/v1/User/${userId}`);
        expect(response.status()).toBe(401);
        const body = await response.json();
        expect(body.message).toContain("User not authorized!")
    })
    test("Authentication - Access Procted API with invalid token" , async ({request})=>{
        const response = await request.get(`https://demoqa.com/Account/v1/User/${userId}`, {
            headers: {
                Authorization: `Bearer ${invalidToken}`
            }
        });
        expect(response.status()).toBe(401);
        const body = await response.json();
        expect(body.message).toContain("User not authorized!")
    })
    test("Authentication - Access Procted API with malformed token" , async ({request})=>{
        const response = await request.get(`https://demoqa.com/Account/v1/User/${userId}`, {
            headers: {
                Authorization: `Bearer ${malformedToken}`
            }
        });
        expect(response.status()).toBe(401);
        const body = await response.json();
        expect(body.message).toContain("User not authorized!")
    })

    // Authorization
    //9781593277574 - ecma script - kalis book collection
    // 9781449325862 - git pocket - san's book collection
    //9781449331818 - learning javascript - ram's book collection
    test("Authorization - User A trying to update the user B isbn", async ({request})=> {
        const response = await request.put(`https://demoqa.com/BookStore/v1/Books/${userB_ISBN}`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            data:{
                userId: userB_userId,
                isbn: newISBN
            }
        })
        expect(response.status()).toBe(401);
        const body  = await response.json();
        expect(body.message).toContain("User not authorized")
    })

     test("Authorization - User A trying to delete the user B isbn", async ({request})=> {
        const response = await request.delete("https://demoqa.com/BookStore/v1/Book", {
            headers: {
                Authorization: `Bearer ${token}`
            },
            data:{
                userId: userB_userId,
                isbn: userB_ISBN
            }
        })
        expect(response.status()).toBe(401);
        const body  = await response.json();
        expect(body.message).toContain("User not authorized")
    })
})