const express = require("express");
const shortid = require("shortid");
const cors = require("cors");

const server = express();

server.use(express.json());
server.use(cors());

let users = [
  {
    id: shortid.generate(),
    name: "User1",
    bio: "This is user 1",
  },
  {
    id: shortid.generate(),
    name: "User2",
    bio: "This is user 2",
  },
  {
    id: shortid.generate(),
    name: "User3",
    bio: "This is user 3",
  },
  {
    id: shortid.generate(),
    name: "User4",
    bio: "This is user 4",
  },
];

//// GET REQUESTS ////

server.get("/api/users", (req, res) => {
  if (users) {
    res.status(200).json(users);
  } else {
    res
      .status(500)
      .json({ errorMessage: "The users information could not be retrieved." });
  }
});

server.get("/api/users/:id", (req, res) => {
  const { id } = req.params;
  const user = users.find((user) => user.id === id);
  if (user) {
    res.status(200).json(user);
  } else if (!user) {
    res
      .status(404)
      .json({ message: "The user with the specified ID does not exist." });
  } else {
    res
      .status(500)
      .json({ errorMessage: "the user information could not be retrieved" });
  }
});

//// POST REQUESTS ////

server.post("/api/users", (req, res) => {
  const newUser = req.body;

  newUser.id = shortid.generate();

  if (!newUser.name || !newUser.bio) {
    res
      .status(400)
      .json({ errorMessage: "Please provide name and bio for the user." });
  } else if (newUser.name && newUser.bio) {
    users.push(newUser);
    res.status(201).json(newUser);
  } else {
    res.status(500).json({
      errorMessage: "There was an error while saving the user to the database",
    });
  }
});

//// DELETE REQUESTS ////

server.delete("/api/users/:id", (req, res) => {
  const { id } = req.params;
  const deleted = users.find((user) => user.id === id);

  if (deleted) {
    users = users.filter((user) => user.id !== id);
    res.status(200).end();
  } else if (!deleted) {
    res
      .status(404)
      .json({ message: "The user with the specified ID does not exist." });
  } else {
    res.status(500).json({ errorMessage: "The user could not be removed." });
  }
});

//// PUT REQUESTS ////

server.put("/api/users/:id", (req, res) => {
  const { id } = req.params;
  const changes = req.body;

  let index = users.findIndex((user) => user.id === id);

  if (!changes.name || !changes.bio) {
    res
      .status(400)
      .json({ errorMessage: "Please provide name and bio for the user." });
  } else if (index === -1) {
    res
      .status(404)
      .json({ message: "The user with the specified ID does not exist." });
  } else if (index !== -1) {
    users[index] = changes;
    res.status(200).json(users[index]);
  } else {
    res
      .status(500)
      .json({ errorMessage: "The user information could not be modified." });
  }
});

const PORT = 8000;
server.listen(PORT, () => console.log(`The server is running on port ${PORT}`));
