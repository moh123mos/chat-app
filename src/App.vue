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
      <main>
        <div
          v-for="message in state.messages"
          :key="message.id"
          class="message-container"
          :class="message.username === state.username && 'current-chat'"
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
        <form class="input-message" @submit.prevent>
          <input type="text" v-model="inputMessage" placeholder="Message" />
          <input type="submit" value="send" @click="sendMeesage" />
        </form>
      </main>
    </div>
  </div>
</template>
<script setup>
import { reactive, ref, onMounted } from "vue";
import { onValue, push } from "firebase/database";

import messageRef from "./db";
let inputLogin = ref("");
let inputMessage = ref("");
let state = reactive({
  username: "",
  messages: [],
});
const login = () => {
  if (inputLogin.value !== "" || inputLogin.value !== null)
    state.username = inputLogin.value;
  inputLogin.value = "";
};
const logout = () => {
  state.value.username = "";
};
const sendMeesage = () => {
  if (inputMessage.value === null || inputMessage.value === "") return;
  const message = {
    username: state.username,
    body: inputMessage.value,
  };
  push(messageRef, message);
  inputMessage.value = "";
};
onMounted(() => {
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
    // console.log(messages);
    // console.log(state.messages);
  });
});
</script>
<style lang="scss">
$main-color: #5ea3de;
$second-color: #1f316f;
$bg-color: #333c4d;
body {
  color: #fff;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(135deg, #1f316f, #5b99c2);
  background-repeat: no-repeat;
  &::-webkit-scrollbar {
    width: 5px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #888;
    border-radius: 5px;
  }

  &::-webkit-scrollbar-track {
    background-color: #f1f1f1;
  }
}
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}
.background {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: linear-gradient(135deg, #1f316f, #5b99c2);
  background-repeat: no-repeat;
  z-index: -1;
}
input {
  border: none;
  &:focus {
    outline: none;
  }
}
.container {
  width: 90%;
  margin: auto;
  padding: 15px;
  display: flex;
  justify-content: center;
  text-align: center;
  .login {
    width: 100%;
    max-width: 500px;
    display: block !important;
    padding: 30px 30px;
    border-radius: 15px;
    background: #5b99c2;
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
      input[type="text"] {
        &:focus {
          outline: 2px solid #1f316f;
        }
      }
      input[type="submit"] {
        text-transform: capitalize;
        cursor: pointer;
        color: #1f316f;
        font-weight: 900;
        transition: 0.3s;
        &:hover {
          background-color: #1f306f;
          color: white;
        }
      }
    }
  }
  .chat {
    text-align: start;
    min-width: 400px;
    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
      input[type="submit"] {
        cursor: pointer;
        text-transform: capitalize;
        padding: 10px 5px;
        border-radius: 10px;
        color: #1f316f;
        font-weight: 900;
        &:hover {
          color: indianred;
        }
      }
    }
    main {
      position: relative;
      display: flex;
      flex-direction: column;
      min-height: 86vh;
      background: linear-gradient(225deg, #1f316f, #5b99c2);
      box-shadow: 0 0 2px 0px #0000007c;
      padding: 10px;
      padding-bottom: 40px;
      border-radius: 10px;

      .message-container {
        position: relative;
        align-self: flex-start;
        background-color: $bg-color;
        // max-width: 70%;
        // width: 400px;
        font-size: 14px;
        padding: 5px;
        margin-bottom: 15px;
        margin-left: 20px;
        border-radius: 10px;
        &.current-chat {
          align-self: flex-end;
          margin-left: 50%;
          margin-right: 20px;
          background: #4e79a4;
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
          background: linear-gradient(135deg, #1f316f, #5b99c2);
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
      .input-message {
        position: absolute;
        left: 0;
        bottom: 5px;
        width: 100%;
        text-align: center;
        input {
          padding: 10px 15px;
          border-radius: 10px;
        }
        input[type="text"] {
          color: #fff;
          background-color: $bg-color;
          padding: 10px 30px;
          width: 80%;
          margin-right: 5px;
          &::placeholder {
            color: #a5a5a5;
          }
        }
        input[type="submit"] {
          background-color: #5b99c2;
          color: #fff;
          transition: 0.3s;
          &:hover {
            background-color: #32479c;
          }
        }
      }
    }
  }
}
</style>
