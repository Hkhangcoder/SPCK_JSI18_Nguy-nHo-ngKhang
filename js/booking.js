// Lấy form đặt bàn
const bookingForm = document.getElementById("bookingForm"); // Tạo biến bookingForm, lưu form thông qua id 

// Khi người dùng bấm Gửi
bookingForm.addEventListener("submit", function (event) {  // Ngheo theo sự kiện của ng dùng
    event.preventDefault(); // Ngăn reload trang

    // Lấy dữ liệu từ input
    const name = document.getElementById("fname").value.trim(); // Biến name, lấy value id fname, xóa khoảng trắng
    const where = document.getElementById("where").value;
    const time = document.getElementById("time").value;
    const phone = document.getElementById("tele").value.trim();
    const note = document.getElementById("content").value.trim();

    // Kiểm tra dữ liệu
    if (name === "" || where === "" || time === "" || phone === "") { // Kiểm tra xem có nhập đủ ko
        alert("⚠️ Vui lòng nhập đầy đủ thông tin!");
        return;
    }

    // Thông báo thành công
    alert(
        "🎉 Đặt nước thành công!\n" +
        "Họ tên: " + name + "\n" +
        "Địa chỉ: " + where + "\n" +
        "Thời gian: " + time
    );

    // Reset form
    bookingForm.reset(); 
});