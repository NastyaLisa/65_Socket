import express from "express";
import http from "http";
import { Server } from "socket.io";
import fs from "fs";

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = 3000;
const userMessageHistory = [];

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "pug");

app.get("/", (req, res) => {
  res.render("index");
});

io.on("connection", (socket) => {
  socket.on("set_username", (username) => {
    socket.username = username;
    console.log(`System user ${username} is connected`);
  });
  socket.on("disconnect", (reason) => {
    if (socket.username) {
      console.log(
        `System user ${socket.username} is disconnected, reason: ${reason}`
      );
    }
  });

  socket.on("send_msg", (data) => {
    console.log(data);
    userMessageHistory.push([data.name, data.msg]);

    io.emit("new_msg", { name: data.name, msg: data.msg });
  });
});

app.post("/save-messages", (req, res) => {
  const writeStream = fs.createWriteStream("./message.txt");
  userMessageHistory.forEach((message) => {
    writeStream.write(message[0] + ": " + message[1] + "\n");
  });
  writeStream.end();
  res.status(200).send("Messages saved");
});

server.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});

// const readStream = fs.createReadStream("./public/css/style.css");
// const writeStream = fs.createWriteStream("./public/css/style_copy.css");
// readStream.pipe(writeStream);
