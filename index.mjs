import express from "express";
import redis from "redis";
import { v4 as uuidv4 } from "uuid";

const app = new express();

// redis client
const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";
const client = redis.createClient({ url: redisUrl });

client.connect();

client.on("error", (err) => console.log("Redis Client : ", err));
client.on("connect", () => console.log("Redis Client Connected"));

// middleware
app.use(express.urlencoded({ extended: false }));

  const printTodo = async () => {
  let todo_html = [];
  let todos = await client.hGetAll("todos");
  todos = Object.values(todos);
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
    const todo = await client.hSet("todos", uuidv4(), req.body.todo);
  } catch (err) {
    console.error("unable to save todo ", err);
  }
  res.redirect("/");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server started on port 3000");
});
