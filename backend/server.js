require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Todo = require("./models/Todo");

const app = express();


// middleware
app.use(cors());
app.use(express.json());

//MongoDB connection

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected ✅"))
.catch(err => console.log(err));

//Routes (API)

// GET todos
app.get("/todos", async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
});

// POST todo
app.post("/todos", async (req, res) => {
  const newTodo = new Todo({
    text: req.body.text,
    completed: false
  });

  await newTodo.save();
  res.json(newTodo);
});

// DELETE todo
app.delete("/todos/:id", async (req, res) => {
  await Todo.findByIdAndDelete(req.params.id);
  res.json({ message: "Todo deleted" });
});

// UPDATE todo (edit + toggle complete)
app.put("/todos/:id", async (req, res) => {
  const updatedTodo = await Todo.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updatedTodo);
});

// test route
app.get("/", (req, res) => {
  res.send("Backend working 🚀");
});

// server start
app.listen(5000, () => {
  console.log("Server running on port 5000");
});