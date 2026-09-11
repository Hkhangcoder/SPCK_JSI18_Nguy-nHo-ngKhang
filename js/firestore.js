// Import hàm kết nối Firestore.
import { getFirestore } from 
    "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Import Firebase App đã được khởi tạo.
import { app } from "./firebase-config.js";

// Tạo kết nối tới Cloud Firestore.
const db = getFirestore(app);

// Xuất db để các file khác sử dụng.
export { db };