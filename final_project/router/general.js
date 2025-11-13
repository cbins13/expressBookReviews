const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username?.length > 0 && password?.length > 0) {
    if (isValid(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  } else {
    return res.status(404).json({ message: "Username and password must not be empty" });
  }
}
);

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  let myPromise = new Promise((resolve, reject) => {
    resolve(books);
  })
  myPromise.then((books) => {
    return res.status(200).json(books);
  }).catch((err) => {
    return res.status(500).json({ message: "Error retrieving books" });
  });
  // return res.status(200).json(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  let myPromise = new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject("Book not found");
    }
  }
  );
  myPromise.then((book) => {
    return res.status(200).json(book);
  }).catch((err) => {
    return res.status(404).json({ message: err });
  });

  // if (books[isbn]) {
  //   return res.status(200).json(books[isbn]);
  // } else {
  //   return res.status(404).json({ message: "Book not found" });
  // }
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  let myPromise = new Promise((resolve, reject) => {
    const authorInput = req.params.author.trim();
    const result = []
    Object?.values(books).forEach((book) => {
      const bookAuthor = book.author.replace(/\s+/g, '').trim();
      if (bookAuthor === authorInput) {
        result.push(book)
      }
    });
    if (result.length > 0) {
      resolve(result);
    } else {
      reject("Author not found");
    }
  });
  myPromise.then((books) => {
    return res.status(200).json(books);
  }).catch((err) => {
    return res.status(404).json({ message: err });
  });
  // const authorInput = req.params.author.trim();
  // const result = []
  // Object?.values(books).forEach((book) => {
  //   const bookAuthor = book.author.replace(/\s+/g, '').trim();
  //   if (bookAuthor === authorInput) {
  //     result.push(book)
  //   }
  // })
  // if (result.length > 0) {
  //   return res.status(200).json(result);
  // } else {
  //   return res.status(404).json({ message: "Author not found" });
  // }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  let myPromise = new Promise((resolve, reject) => {
    const titleInput = req.params.title.trim();
    const result = []
    Object?.values(books).forEach((book) => {
      const bookTitle = book.title.replace(/\s+/g, '').trim();
      if (bookTitle === titleInput) {
        result.push(book)
      };
    });
    if (result.length > 0) {
      resolve(result);
    } else {
      reject("Title not found");
    }   
  })
  myPromise.then((books) => {
    return res.status(200).json(books);
  }).catch((err) => {
    return res.status(404).json({ message: err });
  });
  // const titleInput = req.params.title.trim();
  // const result = []
  // Object?.values(books).forEach((book) => {
  //   const bookTitle = book.title.replace(/\s+/g, '').trim();
  //   if (bookTitle === titleInput) {
  //     result.push(book)
  //   }
  // })
  // if (result.length > 0) {
  //   return res.status(200).json(result);
  // } else {
  //   return res.status(404).json({ message: "Title not found" });
  // }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn].reviews) {
    return res.status(200).json(books[isbn].reviews);
  } else {
    return res.status(404).json({ message: "Review not found" });
  }
});

module.exports.general = public_users;
