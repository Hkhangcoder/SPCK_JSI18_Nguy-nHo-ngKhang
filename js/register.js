// IMPORT FIREBASE AUTH
// Import hàm đăng ký tài khoản Firebase.
import { createUserWithEmailAndPassword, signOut } from 
    "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Import auth đã được khởi tạo sẵn.
import { auth } from "./firebase-config.js";

// IMPORT FIRESTORE
// Import hàm tạo document và lưu dữ liệu.
import { doc, setDoc } from 
    "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Import database Firestore.
import { db } from "./firestore.js";

// HTML ELEMENT
// Lấy form đăng ký.
const registerForm = document.querySelector("#registerForm");
// Lấy username.
const username = document.querySelector("#username");
// Lấy email.
const email = document.querySelector("#email");
// Lấy password
const password =  document.querySelector("#password");
// Lấy confirm password.
const confirmPassword = document.querySelector("#confirmPassword");

// ERROR ELEMENT
// Lỗi username.
const usernameError = document.querySelector("#usernameError");
// Lỗi email.
const emailError = document.querySelector("#emailError");
// Lỗi password.
const passwordError = document.querySelector("#passwordError");
// Lỗi confirm password.
const confirmPasswordError = document.querySelector("#confirmPasswordError");

// PASSWORD RULE
// Password phải có: Ít nhất 1 chữ thường / hoa/ số / ký tự đặc biệt.
// - Ít nhất 8 ký tự.
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

// REGISTER
// Kiểm tra form đăng ký có tồn tại không.
if (registerForm) {
    // Bắt sự kiện submit form.
    registerForm.addEventListener( "submit", async function(event) {
            event.preventDefault();

            // XÓA LỖI CŨ
            // Xóa lỗi username.
            usernameError.textContent = "";
            // Xóa lỗi email.
            emailError.textContent = "";
            // Xóa lỗi password.
            passwordError.textContent = "";
            // Xóa lỗi confirm password.
            confirmPasswordError.textContent = "";
            // Biến kiểm tra form có hợp lệ không.
            let isValid = true;

            // LẤY GIÁ TRỊ
            // Lấy username và bỏ khoảng trắng đầu/cuối.
            const usernameValue = username.value.trim();
            // Lấy email và bỏ khoảng trắng đầu/cuối.
            const emailValue = email.value.trim();
            // Lấy password.
            const passwordValue = password.value;
            // Lấy confirm password.
            const confirmPasswordValue = confirmPassword.value;

            // CHECK USERNAME
            // Username không được để trống.
            if (usernameValue === "") {
                // Hiển thị lỗi.
                usernameError.textContent = "Username không được để trống.";
                // Đánh dấu form không hợp lệ.
                isValid = false;
            }
            // Username phải có ít nhất 5 ký tự.
            else if (usernameValue.length < 5) {
                // Hiển thị lỗi.
                usernameError.textContent = "Username phải có ít nhất 5 ký tự.";
                // Đánh dấu form không hợp lệ.
                isValid = false;
            }

            // CHECK EMAIL
            // Email không được để trống.
            if (emailValue === "") {
                // Hiển thị lỗi.
                emailError.textContent = "Email không được để trống.";
                // Đánh dấu form không hợp lệ.
                isValid = false;
            }
            // Kiểm tra định dạng email.
            else if (!email.validity.valid) {
                // Hiển thị lỗi.
                emailError.textContent = "Email không đúng định dạng.";
                // Đánh dấu form không hợp lệ.
                isValid = false;
            }

            // CHECK PASSWORD
            // Password không được để trống.
            if (passwordValue === "") {
                // Hiển thị lỗi.
                passwordError.textContent = "Mật khẩu không được để trống.";
                // Đánh dấu form không hợp lệ.
                isValid = false;
            }
            // Password phải có ít nhất 8 ký tự.
            else if (passwordValue.length < 8) {
                // Hiển thị lỗi.
                passwordError.textContent = "Mật khẩu phải có ít nhất 8 ký tự.";
                // Đánh dấu form không hợp lệ.
                isValid = false;
            }
            // Kiểm tra password có đủ chữ hoa, chữ thường, số và ký tự đặc biệt.
            else if (!passwordRegex.test(passwordValue)) {
                // Hiển thị lỗi.
                passwordError.textContent = "Mật khẩu phải có chữ hoa, chữ thường, số và ký tự đặc biệt.";
                // Đánh dấu form không hợp lệ.
                isValid = false;
            }

            // PASSWORD KHÔNG ĐƯỢC GIỐNG USERNAME
            // Kiểm tra username và password.
            if ( usernameValue !== "" && passwordValue !== "" &&
                usernameValue.toLowerCase() === passwordValue.toLowerCase()) {
                // Hiển thị lỗi.
                passwordError.textContent = "Mật khẩu không được giống username.";
                // Đánh dấu form không hợp lệ.
                isValid = false;
            }

            // CHECK CONFIRM PASSWORD
            // Confirm password không được để trống.
            if (confirmPasswordValue === "") {
                // Hiển thị lỗi.
                confirmPasswordError.textContent = "Vui lòng nhập lại mật khẩu.";
                // Đánh dấu form không hợp lệ.
                isValid = false;
            }
            // Kiểm tra hai password có giống nhau không.
            else if (confirmPasswordValue !== passwordValue) {
                // Hiển thị lỗi.
                confirmPasswordError.textContent = "Mật khẩu xác nhận không trùng khớp.";
                // Đánh dấu form không hợp lệ.
                isValid = false;
            }

            // DỪNG NẾU FORM KHÔNG HỢP LỆ
            // Nếu có lỗi thì không đăng ký.
            if (!isValid) {
                return;
            }

            // FIREBASE REGISTER
            try {
                // Tạo tài khoản Firebase.
                const userCredential = await createUserWithEmailAndPassword(
                        auth, emailValue, passwordValue);
                // Lấy thông tin user vừa tạo.
                const user = userCredential.user;

                // LƯU USERNAME VÀO FIRESTORE
                // Tạo document profile riêng cho user.
                await setDoc( doc(  db, "users", user.uid, "profile","info"), {
                        // Username người dùng đã nhập.
                        username: usernameValue,
                        // Email của tài khoản.
                        email: user.email,
                        // Avatar mặc định.
                        avatar: "./Image/logo.png",
                        // Họ và tên ban đầu.
                        fullName: "",
                        // Ngày sinh ban đầu.
                        birthday: "",
                        // Giới tính ban đầu.
                        gender: "",
                        // Giới thiệu ban đầu.
                        bio: ""
                    }
                );

                // CONSOLE
                // Thông báo đăng ký thành công.
                console.log("Đăng ký thành công!");
                // Hiển thị UID.
                console.log("UID:", user.uid);
                // Hiển thị email.
                console.log("Email:", user.email);
                console.log("Username:", usernameValue);

                // ĐĂNG XUẤT USER VỪA ĐĂNG KÝ
                // Firebase tự động đăng nhập user ngay sau khi đăng ký thành công.
                // Vì vậy đăng xuất trước khi chuyển về trang login.
                await signOut(auth);

                // THÔNG BÁO
                alert("Đăng ký thành công! Hãy đăng nhập.");

                // CHUYỂN SANG LOGIN
                window.location.href = "./login.html";
            }

            // XỬ LÝ LỖI FIREBASE
            catch (error) {
                console.error( "Lỗi đăng ký:", error);

                // EMAIL ĐÃ TỒN TẠI
                if ( error.code === "auth/email-already-in-use") {
                    // Hiển thị lỗi email.
                    emailError.textContent = "Email này đã được đăng ký.";
                }

                // EMAIL KHÔNG HỢP LỆ
                else if ( error.code === "auth/invalid-email") {
                    // Hiển thị lỗi email.
                    emailError.textContent = "Email không hợp lệ.";
                }

                // PASSWORD YẾU
                else if ( error.code === "auth/weak-password" ) {
                    // Hiển thị lỗi password.
                    passwordError.textContent = "Mật khẩu quá yếu.";
                }

                // LỖI FIRESTORE
                else if (error.code === "permission-denied") {
                    // Firestore Rules không cho phép lưu.
                    alert("Tài khoản đã được tạo nhưng không thể lưu thông tin profile. Hãy kiểm tra Firestore Rules.");
                }

                // LỖI KHÁC
                else {
                    alert("Đăng ký thất bại. Vui lòng thử lại.");
                }
            }
        }
    );
}





// import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

// import {
//     getAuth,
//     createUserWithEmailAndPassword
// } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// import { firebaseConfig } from "./firebase-config.js";

// // FIREBASE

// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);

// // HTML ELEMENT

// const registerForm = document.querySelector("#registerForm");

// const username = document.querySelector("#username");
// const email = document.querySelector("#email");
// const password = document.querySelector("#password");
// const confirmPassword = document.querySelector("#confirmPassword");

// const usernameError = document.querySelector("#usernameError");
// const emailError = document.querySelector("#emailError");
// const passwordError = document.querySelector("#passwordError");
// const confirmPasswordError = document.querySelector("#confirmPasswordError");

// // PASSWORD RULE

// // Ít nhất:
// // 1 chữ thường
// // 1 chữ hoa
// // 1 số
// // 1 ký tự đặc biệt
// // Tổng cộng ít nhất 8 ký tự

// const passwordRegex =
//     /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

// // REGISTER

// registerForm.addEventListener("submit", async function(event) {

//     event.preventDefault();

//     // Xóa lỗi cũ
//     usernameError.textContent = "";
//     emailError.textContent = "";
//     passwordError.textContent = "";
//     confirmPasswordError.textContent = "";

//     let isValid = true;

//     // USERNAME

//     const usernameValue = username.value.trim();

//     if (usernameValue === "") {
//         usernameError.textContent = "Username không được để trống.";

//         isValid = false;
//     }
//     else if (usernameValue.length < 5) {
//         usernameError.textContent = "Username phải có ít nhất 5 ký tự.";

//         isValid = false;
//     }

//     // EMAIL

//     const emailValue = email.value.trim();

//     if (emailValue === "") {
//         emailError.textContent = "Email không được để trống.";

//         isValid = false;
//     }

//     else if (!email.validity.valid) {
//         emailError.textContent = "Email không đúng định dạng.";

//         isValid = false;
//     }

//     // PASSWORD
    
//     const passwordValue = password.value;

//     if (passwordValue === "") {
//         passwordError.textContent = "Mật khẩu không được để trống.";

//         isValid = false;
//     }

//     else if (passwordValue.length < 8) {
//         passwordError.textContent = "Mật khẩu phải có ít nhất 8 ký tự.";

//         isValid = false;
//     }

//     else if (!passwordRegex.test(passwordValue)) {
//         passwordError.textContent = "Mật khẩu phải có chữ hoa, chữ thường, số và ký tự đặc biệt.";

//         isValid = false;
//     }

//     // PASSWORD KHÔNG ĐƯỢC GIỐNG USERNAME

//     if (usernameValue !== "" && passwordValue !== "" 
//         && usernameValue.toLowerCase() === passwordValue.toLowerCase()) 
//     {      
//         passwordError.textContent = "Mật khẩu không được giống username.";

//         isValid = false;
//     }

//     // CONFIRM PASSWORD

//     const confirmPasswordValue =
//         confirmPassword.value;

//     if (confirmPasswordValue === "") {
//         confirmPasswordError.textContent = "Vui lòng nhập lại mật khẩu.";

//         isValid = false;
//     }

//     else if (confirmPasswordValue !== passwordValue) {
//         confirmPasswordError.textContent = "Mật khẩu xác nhận không trùng khớp.";

//         isValid = false;
//     }

//     // STOP IF INVALID

//     if (!isValid) {
//         return;
//     }

//     // FIREBASE REGISTER
    
//     try {
//         const userCredential =
//             await createUserWithEmailAndPassword(
//                 auth,
//                 emailValue,
//                 passwordValue
//             );

//         const user = userCredential.user;

//         console.log("Đăng ký thành công!");
//         console.log("UID:", user.uid);
//         console.log("Email:", user.email);

//         alert("Đăng ký thành công! Hãy đăng nhập.");

//         // Chuyển sang LOGIN
//         window.location.href = "./login.html";

//     } catch (error) {

//         console.error(error);

//         if (error.code === "auth/email-already-in-use") {
//             emailError.textContent = "Email này đã được đăng ký.";
//         }

//         else if (error.code === "auth/invalid-email") {
//             emailError.textContent = "Email không hợp lệ.";
//         }

//         else if (error.code === "auth/weak-password") {
//             passwordError.textContent = "Mật khẩu quá yếu.";
//         }

//         else {
//             alert("Đăng ký thất bại. Vui lòng thử lại.");
//         }
//     }
// });