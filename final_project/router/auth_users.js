const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{ username: "test", password: "123" }, { username: "user1", password: "123" }];

const isValid = (username) => { //returns boolean
  //write code to check is the username is valid
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  })
  console.log(userswithsamename);
  if (userswithsamename.length === 0) {
    return true
  } else {
    return false
  }
}

const authenticatedUser = (username, password) => { //returns boolean
  let validusers = users.filter((user) => {
    return (user.username === username && user.password === password);
  });
  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken, username
    }
    return res.status(200).json({ message: "User successfully logged in" });
  } else {
    return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const reviews = [];
  const isbn = req.params.isbn;
  const content = req.body.review;
  const username = req.session.authorization.username;
  if (books[isbn]) {
    //store previous reviews
    reviews.push(...books[isbn]["reviews"]);
    //if username has no review yet, add it
    if (!books[isbn]["reviews"]["username"]) {
      reviews.push({ username: username, review: req.body.review })
    } else {
      //else update the review in the reviews array
      reviews.forEach((rev) => {
        if (rev.username === username) {
          rev.review = content;
        }
      })
    }
    books[isbn]["reviews"] = reviews;
    return res.status(200).json({ message: "Review added/updated successfully" });
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;
  if (books[isbn]) {
    let reviews = books[isbn]["reviews"];
    //filter out the review by the user
    reviews = reviews.filter((rev) => rev.username !== username);
    books[isbn]["reviews"] = reviews;
    return res.status(200).json({ message: `Review by ${username} deleted successfully!` });
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
