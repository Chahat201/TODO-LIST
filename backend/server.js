require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Todo = require("./models/Todo");
const User = require("./models/user");


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
app.get("/todos/:userId", async (req, res) => {
  
  try {
    const todos = await Todo.find({ userId: req.params.userId });
    res.json(todos);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

// POST todo
app.post("/todos", async (req, res) => {
  const { text, date, userId } = req.body; // userId add
  console.log("POST BODY:", req.body);
  const newTodo = new Todo({
    text,
    date,
    completed: false,
    userId // 🔥 yaha add kar
  });

  await newTodo.save();
  res.json(newTodo);
});

//clear completed todos
app.delete("/todos/completed", async (req, res) => {
  try {
    await Todo.deleteMany({ completed: true });
    res.json({ message: "Completed deleted" });
  } catch (err) {
    console.log(err); // 👈 IMPORTANT
    res.status(500).json({ error: err.message });
  }
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
    { returnDocument: 'after' }
  );
  res.json(updatedTodo);
});


//signup route
app.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  const user = new User({ email, password });
  await user.save();

  res.json({ message: "User created" });
});


// login route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email, password });

  if (!user) {
    return res.json({ message: "Invalid credentials" });
  }

  res.json({ message: "Login successful", userId: user._id });
});


// DELETE all todos (for testing)
app.delete("/todos", async (req, res) => {
  await Todo.deleteMany();
  res.json({ message: "All todos deleted" });
});



// test route
app.get("/", (req, res) => {
  res.send("Backend working 🚀");
});

// server start
app.listen(5000, () => {
  console.log("Server running on port 5000");
});