import express from "express";
import mongoose from "mongoose";

// setting up db schema

const todoSchema = new mongoose.Schema({
  task: {
    type: String,
    required: true,
  },
});

const todoModel = mongoose.model("todo", todoSchema);

const app = new express();

app.use(express.urlencoded({ extended: false }));

const printTodo = async () => {
  let todo_html = [];
  let todos = await todoModel.find({});
  todos = todos.map((todo) => todo.task);
  for (let todo of todos) {
    todo_html.push(`<li> ${todo} </li>`);
  }
  let return_html = todo_html.join(" ");
  return return_html;
};

app.get("/", async (_req, res) => {
  res.status(200).send(`
  <center>
    <h1> TODO </h1>
    <form action="/create" method="POST">
      <input type="text" name="todo" placeholder="Todo">
      <input type="submit" value="Create">
    </form>
    <ol>
      ${await printTodo()}
    </ol>
  </center >
  `);
});

app.post("/create", async (req, res) => {
  try {
    const todo = new todoModel({
      task: req.body.todo,
    });
    await todo.save();
  } catch (err) {
    console.error("unable to save todo ", err);
  }
  res.redirect("/");
});

const DB_URL = process.env.DB_URL;
const PORT = process.env.PORT || 3000;

console.log(DB_URL);
mongoose
  .connect(DB_URL)
  .then((res) => {
    console.log("connected to DB");
    app.listen(PORT, () => {
      console.log("Server started on port 3000");
    });
  })
  .catch((err) => {
    console.error("unable to connect to DB ", err);
    process.exit();
  });
