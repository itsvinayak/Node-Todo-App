import express from "express";
import { promises as fs } from "fs";
import path from "path";

const app = new express();

const __dirname = path.resolve();
const dir = __dirname + "/todo";
const fileExists = async (dir) => !!(await fs.stat(dir).catch((e) => false));

app.use(express.urlencoded({ extended: false }));

const todo = [];

const enrichTodos = async () => {
  let raw_todos;
  try {
    if (!fileExists(dir)) {
      await fs.mkdir(dir);
    }
    raw_todos = await fs.readFile("./todo/todos.txt", "utf8");
  } catch (err) {
    console.error("unable to load todos ! ", err);
  }
  let todos = raw_todos.split("\n");
  for (let item of todos) {
    todo.push(item);
  }
};

const printTodo = () => {
  let todo_html = [];
  console.log(todo);
  for (let i of todo) {
    todo_html.push(`<li> ${i} </li>`);
  }
  let todos = todo_html.join(" ");
  return todos;
};

app.get("/", (_req, res) => {
  res.status(200).send(`
  <center>
    <h1> TODO </h1>
    <form action="/create" method="POST">
      <input type="text" name="todo" placeholder="Todo">
      <input type="submit" value="Create">
    </form>
    <ol>
      ${printTodo()}
    </ol>
    <a href="/save"> SAVE TODOs </a>
  </center >
  `);
});

app.post("/create", (req, res) => {
  todo.push(req.body.todo);
  res.redirect("/");
});

app.get("/save", async (req, res) => {
  let todos = todo.join("\n");
  try {
    await fs.appendFile("./todo/todos.txt", todos);
  } catch (err) {
    console.error("unable to save todos ", err);
  }
  res.redirect("/");
});

app.listen(3000, async () => {
  await enrichTodos();
  console.log("Server started on port 3000");
});
