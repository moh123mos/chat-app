<template>
  <div class="container">
    <div class="background"></div>
    <div class="login" v-if="state.username === '' || state.username === null">
      <h2>Chat App</h2>
      <form @submit.prevent="login">
        <input type="text" v-model="inputLogin" placeholder="Enter username" />
        <input type="submit" value="login" />
      </form>
    </div>
    <div class="chat" v-else>
      <header>
        <h2>GEEKS</h2>
        <form>
          <input type="submit" value="logout" @click="logout" />
        </form>
      </header>
      <main ref="chatContainer">
        <div
          v-for="message in state.messages"
          :key="message.id"
          class="message-container"
          :class="message.username === state.username && 'current-chat'"
          @change="scrollToBotton"
        >
          <div class="user-logo">
            <div class="logo">
              {{ message.username.charAt(0).toUpperCase() }}
            </div>
          </div>
          <div class="username">{{ message.username }}</div>
          <div class="message">
            {{ message.body }}
          </div>
        </div>
      </main>
      <form class="input-message" @submit.prevent>
        <input type="text" v-model="inputMessage" placeholder="Message" />
        <input type="submit" value="send" @click="sendMeesage" />
      </form>
    </div>
  </div>
</template>
<script setup>
import { nextTick, ref, onMounted, reactive } from "vue";
import { onValue, push } from "firebase/database";
import messageRef from "./db";
let inputLogin = ref("");
let inputMessage = ref("");
const chatContainer = ref(null);
let state = reactive({
  username: "",
  messages: [],
});
const login = () => {
  if (inputLogin.value !== "" || inputLogin.value !== null)
    state.username = inputLogin.value;
  localStorage.setItem("username", state.username);
  inputLogin.value = "";
  scrollToBottom();
};
const logout = () => {
  state.username = "";
  localStorage.setItem("username", "");
};
const sendMeesage = () => {
  if (inputMessage.value === null || inputMessage.value === "") return;
  const message = {
    username: state.username,
    body: inputMessage.value,
  };
  push(messageRef, message);
  inputMessage.value = "";
  scrollToBottom();
};
onMounted(() => {
  if (localStorage.getItem("username"))
    state.username = localStorage.getItem("username");
  onValue(messageRef, (snapshot) => {
    let data = snapshot.val();
    let messages = [];
    if (snapshot.exists()) {
      Object.entries(data).forEach((key) => {
        // console.log(key);
        messages.push({
          id: key[0],
          username: key[1].username,
          body: key[1].body,
        });
      });
      state.messages = messages;
    }
    scrollToBottom();
  });
});
const scrollToBottom = () => {
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
    }
  });
};
</script>
<style lang="scss">
$main-color: #04aa6d;
$second-color: #2f2f2f;
$bg-color: #15202b;
body {
  color: #fff;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}
*::-webkit-scrollbar {
  width: 5px;
}

*::-webkit-scrollbar-thumb {
  background-color: #202d3b;
  border-radius: 5px;
}

*::-webkit-scrollbar-track {
  background-color: $bg-color;
}
.background {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: $bg-color;
  z-index: -1;
}
input {
  border: none;
  &:focus {
    outline: none;
  }
}
.container {
  margin: auto;
  padding: 15px 0;
  display: flex;
  justify-content: center;
  text-align: center;
  max-width: 1000px;
  .login {
    width: 100%;
    max-width: 500px;
    display: block !important;
    padding: 30px 30px;
    border-radius: 15px;
    background: $bg-color;
    form {
      margin-top: 15px;
      display: flex;
      flex-direction: column;
      row-gap: 15px;
      input {
        border: none;
        padding: 10px 10px;
        border-radius: 10px;
        &:focus {
          outline: none;
        }
      }
      input[type="submit"] {
        text-transform: capitalize;
        cursor: pointer;
        color: #000;
        font-weight: 900;
        transition: 0.3s;
        &:hover {
          background-color: $main-color;
          color: white;
        }
      }
    }
  }
  .chat {
    width: 100%;
    text-align: start;
    max-width: 1000px;
    position: relative;
    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 10px;
      margin: 0 10px 15px;
      border-bottom: 3px solid #fff;
      input[type="submit"] {
        cursor: pointer;
        text-transform: capitalize;
        padding: 10px 5px;
        border-radius: 10px;
        color: #000;
        font-weight: 900;
        &:hover {
          color: #df0303;
        }
      }
    }
    main {
      position: relative;
      display: flex;
      flex-direction: column;
      padding: 10px;
      padding-bottom: 55px;
      border-radius: 10px;
      overflow-y: scroll;
      .message-container {
        position: relative;
        align-self: flex-start;
        background-color: $second-color;
        font-size: 14px;
        padding: 5px;
        margin-bottom: 15px;
        margin-left: 25px;
        border-radius: 10px;
        &.current-chat {
          align-self: flex-end;
          margin-left: 50%;
          margin-right: 20px;
          background: $main-color;
          .user-logo {
            right: -25px;
            left: calc(100% + 3px);
          }
          .username {
            display: none;
          }
        }
        .user-logo {
          text-align: center;
          width: 20px;
          height: 20px;
          cursor: pointer;
          position: absolute;
          left: -25px;
          background: $main-color;
          border-radius: 50%;
        }
        .username {
          cursor: pointer;
          color: $main-color;
        }
        .message {
          font-style: italic;
          word-break: break-word;
        }
      }
    }
    .input-message {
      position: fixed;
      max-width: 1150px;
      left: 50%;
      transform: translateX(-50%);
      bottom: -5px;
      padding: 10px 0;
      width: 100%;
      text-align: center;
      background: #15202b;
      input {
        padding: 10px 15px;
        border-radius: 10px;
      }
      input[type="text"] {
        color: #fff;
        background-color: $second-color;
        padding: 10px 30px;
        width: 80%;
        margin-right: 5px;
        &::placeholder {
          color: #a5a5a5;
        }
      }
      input[type="submit"] {
        font-weight: bold;
        text-transform: capitalize;
        background-color: #fff;
        color: #04aa6d;
        transition: 0.3s;
        &:hover {
          background-color: #04aa6d;
          color: #fff;
        }
      }
    }
  }
}
</style>
