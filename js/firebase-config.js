import { initializeApp } from
    "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import { getAuth } from
    "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// const firebaseConfig = {
//   apiKey: "AIzaSyDzdAN1-WIB49z_vkCsO3dBGrfTJc6ZB5E",
//   authDomain: "spck-jsi-aa661.firebaseapp.com",
//   projectId: "spck-jsi-aa661",
//   storageBucket: "spck-jsi-aa661.firebasestorage.app",
//   messagingSenderId: "18620777519",
//   appId: "1:18620777519:web:eead10968bc9954925f2da"
// };
const firebaseConfig = {
  apiKey: "AIzaSyDHqRS9Tv--44j30GLMrzRLDbtOv-Hmoyo",
  authDomain: "spck-jsi-43b76.firebaseapp.com",
  projectId: "spck-jsi-43b76",
  storageBucket: "spck-jsi-43b76.firebasestorage.app",
  messagingSenderId: "527263221422",
  appId: "1:527263221422:web:2cdbd62c3d9d4c42604f3f"
};

/* Khởi tạo Firebase */
const app = initializeApp ( firebaseConfig );

/* Firebase Authentication */
const auth = getAuth ( app );


export { firebaseConfig };