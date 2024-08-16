// Import the necessary Firebase modules
import { initializeApp } from "firebase/app";
import { getDatabase, ref } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAhhau7gGsZCtp3qLmRQswQKJUlx67xVBs",
  authDomain: "vue-chat-946f0.firebaseapp.com",
  projectId: "vue-chat-946f0",
  storageBucket: "vue-chat-946f0.appspot.com",
  messagingSenderId: "184265946050",
  appId: "1:184265946050:web:14378889af4e9e75fd5c5b",
  databaseURL:
    "https://vue-chat-946f0-default-rtdb.europe-west1.firebasedatabase.app/",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
console.log(db);
const messageRef = ref(db, "messages");
export default messageRef;
