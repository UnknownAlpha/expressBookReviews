const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');


const doesExist = (username)=>{
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    if(userswithsamename.length > 0){
      return true;
    } else {
      return false;
    }
  }

public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!doesExist(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});



// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  const getBooks = () => {
    return new Promise((resolve, reject) => {
      if (books) {
        resolve(books);
      } else {
        reject('Failed to retrieve books data');
      }
    });
  };

  getBooks()
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const ISBN = req.params.isbn;
  const getBookByISBN = (ISBN) => {
    return new Promise((resolve, reject) => {
        if (books[ISBN]){
            resolve(books[ISBN])
        } else{
            reject('Failed to retrieve books data')
        }
    });
  };

  getBookByISBN(ISBN)
    .then(data => {
      res.send(JSON.stringify(data));
    })
    .catch(error => { 
      res.status(500).json({ error });
    });
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  const bookKeys = Object.keys(books);
  const booksByAuthor = [];

  const getBookByAuthor = (author) => {
    return new Promise((resolve, reject) => {
        if (author){
            for (const key of bookKeys) {
                const book = books[key];
                if (book.author === author) {
                  booksByAuthor.push(book);
                }
              }
            resolve(booksByAuthor)
        } else{
            reject('Failed to retrieve books data')
        }
    });
  };

  getBookByAuthor(author)
    .then(data => {
        res.send(JSON.stringify(data));
    })
    .catch(error => {
        res.status(500).json({ error });
    })
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  const bookKeys = Object.keys(books);
  const booksByTitle = [];

  const getBookByTitle = (title) => {
    return new Promise((resolve, reject) => {
        if (title){
            for (const key of bookKeys) {
                const book = books[key];
                if (book.title === title) {
                  booksByTitle.push(book);
                }
              }
            resolve(booksByTitle)
        } else{
            reject('Failed to retrieve books data')
        }
    });
  };

  getBookByTitle(title)
    .then(data => {
        res.send(JSON.stringify(data));
    })
    .catch(error => {
        res.status(500).json({ error });
    })
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const ISBN = req.params.isbn;
  const book = books[ISBN];

  if (book && book.reviews) {
    res.send(book.reviews);
  } else {
    res.status(404).send("No reviews for the specified ISBN.");
  }
});

module.exports.general = public_users;
