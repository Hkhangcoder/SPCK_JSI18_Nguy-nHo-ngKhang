import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getAuth,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import { firebaseConfig } from "./firebase-config.js";


// Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

// ===============================
// CHECK LOGIN
// ===============================

onAuthStateChanged(auth, function(user) {

    if (user) {

        console.log("Đang đăng nhập:");
        console.log("UID:", user.uid);
        console.log("Email:", user.email);
    }
    else {
        console.log("Chưa đăng nhập.");

        // Không cho vào Home
        window.location.href = "./Pages/login.html";
    }

});


// ===============================
// LOGOUT
// ===============================

const logoutBtn =
    document.querySelector("#logoutBtn");

if (logoutBtn) {
    logoutBtn.addEventListener("click", async function(event) {

        event.preventDefault();

        try {
            await signOut(auth);

            console.log("Đã đăng xuất.");
            window.location.href ="./Pages/login.html";

        }
        catch (error) { 
            console.error("Lỗi đăng xuất:",error);
            alert("Đăng xuất thất bại.");
        }
    });
}