// Import hàm lấy app Firebase đã khởi tạo
import { getApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

// Import hàm kết nối Cloud Firestore
import {
    getFirestore
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Lấy Firebase app hiện tại
const app = getApp();

// Tạo kết nối tới Firestore
const db = getFirestore(app);

// Xuất db để các file khác sử dụng
export { db };