// ======================================================
// FEEDBACK.JS
// Xử lý chức năng trang góp ý.
// ======================================================

// LẤY CÁC PHẦN TỬ HTML
// Lấy form góp ý.
const feedbackForm = document.querySelector("#feedbackForm");
// Lấy tất cả nút đánh giá sao.
const starButtons = document.querySelectorAll(".star-btn");
// Lấy ô lưu điểm đánh giá. 
const ratingInput = document.querySelector("#feedbackRating");
// Lấy phần hiển thị trạng thái đánh giá.
const ratingText = document.querySelector("#ratingText");

// BIẾN QUẢN LÝ
// Lưu số sao người dùng chọn.
let selectedRating = 0;

// NỘI DUNG TƯƠNG ỨNG VỚI SỐ SAO
const ratingMessages = {
    1: "Rất chưa hài lòng 😞",
    2: "Chưa hài lòng 😕",
    3: "Bình thường 🙂",
    4: "Hài lòng 😊",
    5: "Rất hài lòng 🤩"
};

// CẬP NHẬT GIAO DIỆN SAO
function updateStars() {
    // Duyệt qua từng nút sao.
    starButtons.forEach(function (button) {
        // Lấy số sao của nút.
        const rating = Number(button.dataset.rating);
        // Lấy icon bên trong nút.
        const icon = button.querySelector("i");
        // Nếu sao nhỏ hơn hoặc bằng mức đã chọn.
        if (rating <= selectedRating) {
            // Đổi thành sao đầy.
            icon.className = "bi bi-star-fill";
            // Thêm class active.
            button.classList.add("active");
        } else {
            // Đổi thành sao rỗng.
            icon.className = "bi bi-star"; 
            // Xóa class active.
            button.classList.remove("active");
        }
    });
    // Cập nhật input.
    if (ratingInput) {
        ratingInput.value = selectedRating;
    }
    // Cập nhật nội dung đánh giá.
    if (ratingText) {
        // Nếu đã chọn sao.
        if (selectedRating > 0) {
            ratingText.textContent = ratingMessages[selectedRating];
        } else {
            ratingText.textContent = "Chưa chọn đánh giá";
        }
    }
}

// CLICK CHỌN SAO
starButtons.forEach(function (button) {
    button.addEventListener( "click", function () {
            // Lấy số sao.
            selectedRating = Number(button.dataset.rating);
            // Cập nhật giao diện.
            updateStars();
        }
    );
});

// XỬ LÝ GỬI FORM
if (feedbackForm) {
    feedbackForm.addEventListener( "submit", function (event) {
            // Ngăn form reload trang.
            event.preventDefault();
            // Kiểm tra các input bắt buộc.
            if (!feedbackForm.checkValidity()) {
                // Hiển thị thông báo lỗi mặc định.
                feedbackForm.reportValidity();
                return;
            }
            // Kiểm tra đánh giá.
            if (selectedRating === 0) {
                // Thông báo.
                alert("Bạn chưa chọn mức đánh giá!");
                return;
            }
            // Hiển thị modal.
            const modalElement = document.querySelector("#feedbackSuccessModal");
            // Kiểm tra modal tồn tại.
            if (modalElement) {
                // Tạo Bootstrap Modal.
                const successModal = new bootstrap.Modal(modalElement);
                // Hiển thị modal.
                successModal.show();
            }
            // Reset form.
            feedbackForm.reset();
            // Reset số sao.
            selectedRating = 0;
            // Cập nhật giao diện.
            updateStars();
        }
    );
}