import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getAuth,
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import { firebaseConfig } from "./firebase-config.js";


// ===============================
// FIREBASE
// ===============================

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);


// ===============================
// HTML
// ===============================

const loginForm = document.querySelector("#loginForm");

const email = document.querySelector("#email");
const password = document.querySelector("#password");

const emailError = document.querySelector("#emailError");
const passwordError = document.querySelector("#passwordError");


// ===============================
// LOGIN
// ===============================

loginForm.addEventListener("submit", async function(event) {

    event.preventDefault();

    // Xóa lỗi
    emailError.textContent = "";
    passwordError.textContent = "";

    const emailValue = email.value.trim();
    const passwordValue = password.value;


    // ===============================
    // CHECK EMAIL
    // ===============================

    if (emailValue === "") {

        emailError.textContent =
            "Vui lòng nhập email.";

        return;
    }

    if (!email.validity.valid) {

        emailError.textContent =
            "Email không đúng định dạng.";

        return;
    }


    // ===============================
    // CHECK PASSWORD
    // ===============================

    if (passwordValue === "") {

        passwordError.textContent =
            "Vui lòng nhập mật khẩu.";

        return;
    }


    // ===============================
    // FIREBASE LOGIN
    // ===============================

    try {

        const userCredential =
            await signInWithEmailAndPassword(
                auth,
                emailValue,
                passwordValue
            );

        const user = userCredential.user;

        console.log("Đăng nhập thành công!");
        console.log("UID:", user.uid);
        console.log("Email:", user.email);

        alert("Đăng nhập thành công!");

        // Chuyển Home
        window.location.href = "./home.html";

    } catch (error) {

        console.error(error);

        if (error.code === "auth/invalid-credential" ||
            error.code === "auth/wrong-password" ||
            error.code === "auth/user-not-found") {
            passwordError.textContent = "Email hoặc mật khẩu không chính xác.";

        }

        else if (error.code === "auth/invalid-email") {
            emailError.textContent = "Email không hợp lệ.";
        }

        else {
            alert("Đăng nhập thất bại. Vui lòng thử lại.");
        }
    }

});