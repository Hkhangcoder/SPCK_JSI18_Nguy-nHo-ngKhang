// // =========================================================
// //                  NAVBAR ACTIVE
// // =========================================================


// // Lấy tên file của trang hiện tại.
// let currentPage = window.location.pathname.split("/").pop();


// // Nếu không có tên file,
// // mặc định là trang chủ.
// if (currentPage === "") {
//     currentPage = "index.html";
// }


// // =========================================================
// //              ACTIVE LINK TRÊN NAVBAR
// // =========================================================


// // Lấy các link chính trên navbar.
// const navLinks = document.querySelectorAll(".navbar .nav-link");


// // Duyệt qua từng link.
// navLinks.forEach(function (link) {

//     // Lấy đường dẫn của link.
//     const href = link.getAttribute("href");


//     // Nếu link không có href hoặc href="#"
//     // thì bỏ qua.
//     if (!href || href === "#") {
//         return;
//     }


//     // Lấy tên file từ href.
//     //
//     // Ví dụ:
//     // "./list.html"
//     // sẽ thành:
//     // "list.html"
//     const linkPage = href.split("/").pop();


//     // Nếu link trùng với trang hiện tại.
//     if (linkPage === currentPage) {

//         // Thêm class active.
//         link.classList.add("active");
//     }

// });


// // =========================================================
// //              ACTIVE CHO DROPDOWN
// // =========================================================


// // Lấy tất cả item bên trong dropdown.
// const dropdownItems = document.querySelectorAll(".navbar .dropdown-item");


// // Duyệt qua từng dropdown item.
// dropdownItems.forEach(function (item) {

//     // Lấy đường dẫn của item.
//     const href = item.getAttribute("href");


//     // Nếu không có href hoặc href="#"
//     // thì bỏ qua.
//     if (!href || href === "#") {
//         return;
//     }


//     // Lấy tên file của dropdown item.
//     const itemPage = href.split("/").pop();


//     // Nếu dropdown item trùng với trang hiện tại.
//     if (itemPage === currentPage) {

//         // Thêm class active cho item.
//         item.classList.add("active");


//         // Tìm dropdown cha của item.
//         const dropdown = item.closest(".nav-item.dropdown");


//         // Nếu tìm thấy dropdown cha.
//         if (dropdown) {

//             // Tìm nút dropdown.
//             const dropdownLink =
//                 dropdown.querySelector(".nav-link.dropdown-toggle");


//             // Nếu tìm thấy nút dropdown.
//             if (dropdownLink) {

//                 // Thêm active cho nút dropdown.
//                 dropdownLink.classList.add("active");
//             }
//         }
//     }

// });