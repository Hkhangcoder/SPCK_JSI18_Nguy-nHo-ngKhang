// =========================================================
//                 NAVBAR ACTIVE
// =========================================================


// Lấy tên file của trang hiện tại.
let currentPage = window.location.pathname.split("/").pop();


// Nếu không lấy được tên file,
// mặc định trang hiện tại là index.html.
if (currentPage === "") {
    currentPage = "index.html";
}


// Lấy tất cả link trong navbar.
const navLinks = document.querySelectorAll(".navbar .nav-link");


// Duyệt qua từng link.
navLinks.forEach(function (link) {

    // Lấy đường dẫn của link.
    const href = link.getAttribute("href");


    // Nếu link không có href
    // hoặc href là #
    // thì bỏ qua.
    if (!href || href === "#") {
        return;
    }


    // Lấy tên file cuối cùng trong href.
    //
    // "./list.html" → "list.html"
    const linkPage = href.split("/").pop();


    // Nếu link trùng với trang hiện tại.
    if (linkPage === currentPage) {

        // Thêm class active.
        link.classList.add("active");
    }

});