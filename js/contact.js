// =========================================
// CONTACT.JS
// Xử lý form liên hệ
// =========================================

// Lấy form liên hệ.
const contactForm = document.querySelector("#contactForm");
// Lấy modal thành công.
const successModalElement = document.querySelector("#contactSuccessModal");
// Kiểm tra Bootstrap Modal có tồn tại.
let successModal = null;
// Nếu có modal.
if (successModalElement) {
    // Khởi tạo Bootstrap Modal.
    successModal = new bootstrap.Modal(successModalElement);
}
// Kiểm tra form có tồn tại.
if (contactForm) {
    // Lắng nghe sự kiện submit.
    contactForm.addEventListener(
        "submit",
        function (event) {
            event.preventDefault();
            // Kiểm tra dữ liệu form.
            if (!contactForm.checkValidity()) {
                // Hiển thị thông báo validation.
                contactForm.reportValidity();
                return;
            }
            // Hiển thị modal thành công.
            if (successModal) {
                successModal.show();
            }
            // Reset lại form.
            contactForm.reset();
        }
    );
}