const socket = io();

const btnName = document.querySelector(".btn-name");
const inputName = document.querySelector(".user-name input");
const userLabel = document.querySelector(".form-msg label");
const login = document.querySelector(".login");
const formMsg = document.querySelector(".form-msg");
const chat = document.querySelector(".chat");
const msg = document.getElementById("msg");
let userName = "";

const btnSave = document.querySelector(".btn-save");

btnSave.addEventListener("click", async () => {
    try {
      const res = await fetch('/save-messages', { method: 'POST' });
      const text = await res.text();
      console.log(text);
    } catch (error) {
      console.error(error);
    }
  });

btnName.addEventListener("click", () => {
  userName = inputName.value;
  userLabel.innerHTML = userName;
  login.style.display = "none";
  socket.emit("set_username", userName);
});

formMsg.addEventListener("submit", (e) => {
    e.preventDefault();

    socket.emit("send_msg", {
        name: userName,
        msg: msg.value
    });

    msg.value = "";
});
socket.on("new_msg", (data) => {
    const li = document.createElement("li");
    li.innerHTML = `
     <p class="name">${data.name}</p>
     <p class="message">${data.msg}</p>`;
    chat.appendChild(li);
});

