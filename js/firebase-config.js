// Import hàm khởi tạo Firebase App.
import { initializeApp } from 
    "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

// Import hàm lấy Firebase Authentication.
import { getAuth } from 
    "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


// const firebaseConfig = {
//   apiK ey: "AIzaSyDzdAN1-WIB49z_vkCsO3dBGrfTJc6ZB5E",
//   authDomain: "spck-jsi-aa661.firebaseapp.com",
//   projectId: "spck-jsi-aa661",
//   storageBucket: "spck-jsi-aa661.firebasestorage.app",
//   messagingSenderId: "18620777519",
//   appId: "1:18620777519:web:eead10968bc9954925f2da"
// };

// Cấu hình Firebase của project.
const firebaseConfig = {
    apiKey: "AIzaSyDHqRS9Tv--44j30GLMrzRLDbtOv-Hmoyo",
    authDomain: "spck-jsi-43b76.firebaseapp.com",
    projectId: "spck-jsi-43b76",
    storageBucket: "spck-jsi-43b76.firebasestorage.app",
    messagingSenderId: "527263221422",
    appId: "1:527263221422:web:2cdbd62c3d9d4c42604f3f"
};

// Khởi tạo Firebase App một lần.
const app = initializeApp(firebaseConfig);

// Khởi tạo Firebase Authentication.
const auth = getAuth(app);

// Xuất app và auth để các file khác sử dụng.
export { app, auth }; 