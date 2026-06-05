import test , {expect, request} from '@playwright/test';
import process from 'node:process';
import { array } from 'node:stream/iter';

const token  = process.env.TOKEN;
const isbn = process.env.VALID_ISBN;
const userId = process.env.VALID_USERID;



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
        const response = await request.put("https://demoqa.com/BookStore/v1/Books/${isbn}", {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            data: {
               "userId": userId,
                "isbn": 9781449331818
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
                "isbn": 9781449331818
            }
        });
        
        expect(response.status()).toBe(204);
    })
})