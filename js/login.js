// Import hàm đăng nhập bằng email và mật khẩu.
import {signInWithEmailAndPassword} from 
    "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Import auth đã được khởi tạo sẵn.
import { auth } from "./firebase-config.js";

// HTML ELEMENT
// Lấy form đăng nhập.
const loginForm = document.querySelector("#loginForm");
// Lấy ô email.
const email = document.querySelector("#email");
// Lấy ô mật khẩu.
const password = document.querySelector("#password");
// Lấy khu vực báo lỗi email.
const emailError = document.querySelector("#emailError");
// Lấy khu vực báo lỗi mật khẩu.
const passwordError = document.querySelector("#passwordError");

// LOGIN
// Kiểm tra form có tồn tại không.
if (loginForm) {
    // Bắt sự kiện submit.
    loginForm.addEventListener("submit", async function(event) {
        event.preventDefault();

        // XÓA LỖI CŨ
        // Xóa lỗi email.
        emailError.textContent = "";
        // Xóa lỗi password.
        passwordError.textContent = "";

        // LẤY GIÁ TRỊ
        // Lấy email và bỏ khoảng trắng đầu/cuối.
        const emailValue = email.value.trim();
        // Lấy mật khẩu.
        const passwordValue = password.value;

        // CHECK EMAIL
        // Kiểm tra email rỗng.
        if (emailValue === "") {
            // Hiển thị lỗi.
            emailError.textContent = "Vui lòng nhập email.";
            // Dừng submit.
            return;
        }
        // Kiểm tra định dạng email.
        if (!email.validity.valid) {
            // Hiển thị lỗi.
            emailError.textContent = "Email không đúng định dạng.";
            // Dừng submit.
            return;
        }

        // CHECK PASSWORD
        // Kiểm tra mật khẩu rỗng.
        if (passwordValue === "") {
            // Hiển thị lỗi.
            passwordError.textContent = "Vui lòng nhập mật khẩu.";
            // Dừng submit.
            return;
        }

        // FIREBASE LOGIN
        try {
            // Đăng nhập Firebase.
            const userCredential = await signInWithEmailAndPassword(
                    auth, emailValue, passwordValue);
            // Lấy thông tin user.
            const user = userCredential.user;
            
            console.log("Đăng nhập thành công!");
            console.log("UID:", user.uid);
            console.log("Email:", user.email);

            alert("Đăng nhập thành công!");

            window.location.href = "./index.html";

        } catch (error) {
            console.error("Lỗi đăng nhập:", error);

            // Sai email hoặc mật khẩu.
            if (error.code === "auth/invalid-credential" ||
                error.code === "auth/wrong-password" ||
                error.code === "auth/user-not-found") {

                passwordError.textContent = "Email hoặc mật khẩu không chính xác.";
            }
            // Email không hợp lệ.
            else if (error.code === "auth/invalid-email") {
                // Hiển thị lỗi.
                emailError.textContent = "Email không hợp lệ.";
            }
            // Lỗi khác
            else {
                // Hiển thị thông báo.
                alert("Đăng nhập thất bại. Vui lòng thử lại.");
            }
        }
    });
}


// import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

// import {
//     getAuth,
//     signInWithEmailAndPassword
// } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// import { firebaseConfig } from "./firebase-config.js";


// // ===============================
// // FIREBASE
// // ===============================

// const app = initializeApp(firebaseConfig);

// const auth = getAuth(app);


// // ===============================
// // HTML
// // ===============================

// const loginForm = document.querySelector("#loginForm");

// const email = document.querySelector("#email");
// const password = document.querySelector("#password");

// const emailError = document.querySelector("#emailError");
// const passwordError = document.querySelector("#passwordError");


// // ===============================
// // LOGIN
// // ===============================

// loginForm.addEventListener("submit", async function(event) {

//     event.preventDefault();

//     // Xóa lỗi
//     emailError.textContent = "";
//     passwordError.textContent = "";

//     const emailValue = email.value.trim();
//     const passwordValue = password.value;


//     // ===============================
//     // CHECK EMAIL
//     // ===============================

//     if (emailValue === "") {

//         emailError.textContent =
//             "Vui lòng nhập email.";

//         return;
//     }

//     if (!email.validity.valid) {

//         emailError.textContent =
//             "Email không đúng định dạng.";

//         return;
//     }


//     // ===============================
//     // CHECK PASSWORD
//     // ===============================

//     if (passwordValue === "") {

//         passwordError.textContent =
//             "Vui lòng nhập mật khẩu.";

//         return;
//     }


//     // ===============================
//     // FIREBASE LOGIN
//     // ===============================

//     try {

//         const userCredential =
//             await signInWithEmailAndPassword(
//                 auth,
//                 emailValue,
//                 passwordValue
//             );

//         const user = userCredential.user;

//         console.log("Đăng nhập thành công!");
//         console.log("UID:", user.uid);
//         console.log("Email:", user.email);

//         alert("Đăng nhập thành công!");

//         // Chuyển Home
//         window.location.href = "./index.html";

//     } catch (error) {

//         console.error(error);

//         if (error.code === "auth/invalid-credential" ||
//             error.code === "auth/wrong-password" ||
//             error.code === "auth/user-not-found") {
//             passwordError.textContent = "Email hoặc mật khẩu không chính xác.";

//         }

//         else if (error.code === "auth/invalid-email") {
//             emailError.textContent = "Email không hợp lệ.";
//         }

//         else {
//             alert("Đăng nhập thất bại. Vui lòng thử lại.");
//         }
//     }

// });