// IMPORT FIREBASE AUTH

// Import các hàm cần dùng từ Firebase Authentication.
import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Import auth đã được khởi tạo sẵn.
import { auth } from "./firebase-config.js";


// ============================
// CHECK LOGIN
// ============================

// Kiểm tra trạng thái đăng nhập của người dùng.
onAuthStateChanged(auth, function(user) {

    // Nếu đang đăng nhập.
    if (user) {

        // In thông tin user ra Console.
        console.log("Đang đăng nhập:");
        console.log("UID:", user.uid);
        console.log("Email:", user.email);

    } else {

        // Nếu chưa đăng nhập.
        console.log("Chưa đăng nhập.");

        // Chuyển về trang Login.
        window.location.href = "./login.html";
    }
});


// ============================
// LOGOUT
// ============================

// Lấy nút Đăng xuất.
const logoutBtn = document.querySelector("#logoutBtn");

// Kiểm tra nút có tồn tại không.
if (logoutBtn) {

    // Bắt sự kiện click nút Đăng xuất.
    logoutBtn.addEventListener("click", async function(event) {

        // Ngăn thẻ <a href="#"> chuyển trang mặc định.
        event.preventDefault();

        try {

            // Đăng xuất tài khoản Firebase hiện tại.
            await signOut(auth);

            // In thông báo ra Console.
            console.log("Đã đăng xuất.");

            // Chuyển về trang Login.
            window.location.href = "./login.html";

        } catch (error) {

            // In lỗi ra Console.
            console.error("Lỗi đăng xuất:", error);

            // Thông báo lỗi.
            alert("Đăng xuất thất bại.");
        }
    });
}