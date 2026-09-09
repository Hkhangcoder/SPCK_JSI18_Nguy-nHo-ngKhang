import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getAuth,
    createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import { firebaseConfig } from "./firebase-config.js";

// FIREBASE
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// HTML ELEMENT
const registerForm = document.querySelector("#registerForm");

const username = document.querySelector("#username");
const email = document.querySelector("#email");
const password = document.querySelector("#password");
const confirmPassword = document.querySelector("#confirmPassword");

const usernameError = document.querySelector("#usernameError");
const emailError = document.querySelector("#emailError");
const passwordError = document.querySelector("#passwordError");
const confirmPasswordError = document.querySelector("#confirmPasswordError");

// PASSWORD RULE

// Ít nhất: 1 chữ thường 1 chữ hoa 1 số 1 ký tự đặc biệt
// Tổng cộng ít nhất 8 ký tự

const passwordRegex = 
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

// REGISTER
registerForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    // Xóa lỗi cũ
    usernameError.textContent = "";
    emailError.textContent = "";
    passwordError.textContent = "";
    confirmPasswordError.textContent = "";

    let isValid = true;

    // USERNAME
    const usernameValue = username.value.trim();

    if (usernameValue === "") {
        usernameError.textContent = "Username không được để trống.";

        isValid = false;
    }
    else if (usernameValue.length < 5) {
        usernameError.textContent = "Username phải có ít nhất 5 ký tự.";

        isValid = false;
    }

    // EMAIL
    const emailValue = email.value.trim();

    if (emailValue === "") {
        emailError.textContent = "Email không được để trống.";

        isValid = false;
    }

    else if (!email.validity.valid) {
        emailError.textContent = "Email không đúng định dạng.";

        isValid = false;
    }

    // PASSWORD
    const passwordValue = password.value;

    if (passwordValue === "") {
        passwordError.textContent = "Mật khẩu không được để trống.";

        isValid = false;
    }
    else if (passwordValue.length < 8) {
        passwordError.textContent = "Mật khẩu phải có ít nhất 8 ký tự.";

        isValid = false;
    }
    else if (!passwordRegex.test(passwordValue)) {
        passwordError.textContent = "Mật khẩu phải có chữ hoa, chữ thường, số và ký tự đặc biệt.";
        isValid = false;
    }

    // PASSWORD KHÔNG ĐƯỢC GIỐNG USERNAME
    if (usernameValue !== "" && passwordValue !== "" 
        && usernameValue.toLowerCase() === passwordValue.toLowerCase()) 
    {      
        passwordError.textContent = "Mật khẩu không được giống username.";

        isValid = false;
    }

    // CONFIRM PASSWORD
    const confirmPasswordValue = confirmPassword.value;

    if (confirmPasswordValue === "") {
        confirmPasswordError.textContent = "Vui lòng nhập lại mật khẩu.";
        isValid = false;
    }
    else if (confirmPasswordValue !== passwordValue) {
        confirmPasswordError.textContent = "Mật khẩu xác nhận không trùng khớp.";

        isValid = false;
    }

    // STOP IF INVALID
    if (!isValid) {
        return;
    }

    // FIREBASE REGISTER
    try {
        const userCredential = await createUserWithEmailAndPassword(
                auth, emailValue, passwordValue
            );
        const user = userCredential.user;

        console.log("Đăng ký thành công!");
        console.log("UID:", user.uid);
        console.log("Email:", user.email);

        alert("Đăng ký thành công! Hãy đăng nhập.");

        window.location.href = "./Pages/login.html";
    } catch (error) {
        console.error(error);
        
        if (error.code === "auth/email-already-in-use") {
            emailError.textContent = "Email này đã được đăng ký.";
        }
        else if (error.code === "auth/invalid-email") {
            emailError.textContent = "Email không hợp lệ.";
        }
        else if (error.code === "auth/weak-password") {
            passwordError.textContent = "Mật khẩu quá yếu.";
        }
        else {
            alert("Đăng ký thất bại. Vui lòng thử lại.");
        }
    }
});