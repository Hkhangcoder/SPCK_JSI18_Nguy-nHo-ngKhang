// ======================================================
// PROFILE.JS
// TRANG HỒ SƠ NGƯỜI DÙNG
// ======================================================


// ======================================================
// FIREBASE AUTH
// ======================================================

// Import hàm kiểm tra trạng thái đăng nhập.
import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


// ======================================================
// FIRESTORE
// ======================================================

// Import các hàm cần dùng của Firestore.
import {
    doc,
    getDoc,
    setDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// ======================================================
// FIREBASE CONFIG
// ======================================================

// Lấy Firebase Authentication và Cloudinary config.
import {
    auth,
    cloudinaryConfig
} from "./firebase-config.js";

// Lấy Firestore database.
import {
    db
} from "./firestore.js";


// ======================================================
// LẤY CÁC PHẦN TỬ HTML
// ======================================================

// Username hiển thị ở lời chào.
const welcomeUsername =
    document.getElementById("welcomeUsername");

// Avatar.
const profileAvatar =
    document.getElementById("profileAvatar");

// Input chọn ảnh.
const avatarInput =
    document.getElementById("avatarInput");

// Nút đổi avatar.
const changeAvatarBtn =
    document.getElementById("changeAvatarBtn");

// Trạng thái avatar.
const avatarStatus =
    document.getElementById("avatarStatus");

// Username.
const usernameInput =
    document.getElementById("username");

// Email.
const emailInput =
    document.getElementById("email");

// Họ tên.
const fullNameInput =
    document.getElementById("fullName");

// Ngày sinh.
const birthdayInput =
    document.getElementById("birthday");

// Giới tính.
const genderInput =
    document.getElementById("gender");

// Số điện thoại.
const phoneInput =
    document.getElementById("phone");

// Mô tả.
const bioInput =
    document.getElementById("bio");

// Nút lưu thông tin.
const saveProfileBtn =
    document.getElementById("saveProfileBtn");

// Trạng thái lưu.
const saveStatus =
    document.getElementById("saveStatus");

// Số Pokémon trong Collection.
const collectionCount =
    document.getElementById("collectionCount");

// Số Pokémon yêu thích.
const favoriteCount =
    document.getElementById("favoriteCount");


// ======================================================
// HÀM ĐỌC LOCALSTORAGE AN TOÀN
// ======================================================

// Hàm này lấy dữ liệu từ localStorage.
// Nếu dữ liệu không tồn tại hoặc bị lỗi JSON,
// hàm sẽ trả về một mảng rỗng.
function getLocalStorageArray(key) {

    // Lấy dữ liệu được lưu với key tương ứng.
    const savedData =
        localStorage.getItem(key);

    // Nếu chưa có dữ liệu thì trả về mảng rỗng.
    if (!savedData) {
        return [];
    }

    try {

        // Chuyển chuỗi JSON thành dữ liệu JavaScript.
        const data =
            JSON.parse(savedData);

        // Chỉ chấp nhận dữ liệu dạng mảng.
        if (Array.isArray(data)) {
            return data;
        }

        // Nếu không phải mảng thì trả về mảng rỗng.
        return [];

    } catch (error) {

        // Nếu JSON bị lỗi thì không làm trang bị crash.
        console.error(
            "Không thể đọc localStorage:",
            error
        );

        return [];
    }
}


// ======================================================
// ĐẾM POKÉMON COLLECTION
// ======================================================

function countCollection() {

    // Lấy danh sách Pokémon Collection hiện tại.
    const collectionData =
        getLocalStorageArray("pokemonCollection");

    // Hiển thị số lượng lên Profile.
    if (collectionCount) {

        collectionCount.textContent =
            collectionData.length;
    }
}


// ======================================================
// ĐẾM POKÉMON FAVORITE
// ======================================================

function countFavorite() {

    // Lấy danh sách Pokémon yêu thích hiện tại.
    const favoriteData =
        getLocalStorageArray("pokemonFavorite");

    // Hiển thị số lượng lên Profile.
    if (favoriteCount) {

        favoriteCount.textContent =
            favoriteData.length;
    }
}


// ======================================================
// CẬP NHẬT THỐNG KÊ POKÉMON
// ======================================================

function updatePokemonStats() {

    // Cập nhật Collection.
    countCollection();

    // Cập nhật Favorite.
    countFavorite();
}


// ======================================================
// LOAD PROFILE
// ======================================================

async function loadProfile(user) {

    try {

        // Lấy document profile/info của tài khoản hiện tại.
        const profileRef =
            doc(
                db,
                "users",
                user.uid,
                "profile",
                "info"
            );

        // Đọc dữ liệu Profile.
        const profileSnap =
            await getDoc(profileRef);


        // Dữ liệu mặc định.
        let profileData = {};


        // Nếu tài khoản đã có Profile thì lấy dữ liệu.
        if (profileSnap.exists()) {

            profileData =
                profileSnap.data();
        }


        // ==================================================
        // USERNAME
        // ==================================================

        // Ưu tiên username đã lưu trong Firestore.
        // Nếu chưa có thì thử lấy displayName của Firebase.
        // Cuối cùng dùng phần trước @ của email.
        const username =
            profileData.username ||
            user.displayName ||
            (
                user.email
                    ? user.email.split("@")[0]
                    : "Bạn"
            );


        // Hiển thị username ở lời chào.
        if (welcomeUsername) {

            welcomeUsername.textContent =
                username;
        }


        // Hiển thị username trong avatar card.
        const profileUsername =
            document.getElementById("profileUsername");

        if (profileUsername) {

            profileUsername.textContent =
                username;
        }


        // Điền username vào form.
        if (usernameInput) {

            usernameInput.value =
                username;
        }


        // ==================================================
        // EMAIL
        // ==================================================

        // Email lấy trực tiếp từ Firebase Authentication.
        const email =
            user.email || "";


        // Hiển thị email trong avatar card.
        const profileEmail =
            document.getElementById("profileEmail");

        if (profileEmail) {

            profileEmail.textContent =
                email;
        }


        // Điền email vào form.
        if (emailInput) {

            emailInput.value =
                email;
        }


        // ==================================================
        // CÁC THÔNG TIN KHÁC
        // ==================================================

        if (fullNameInput) {

            fullNameInput.value =
                profileData.fullName || "";
        }


        if (birthdayInput) {

            birthdayInput.value =
                profileData.birthday || "";
        }


        if (genderInput) {

            genderInput.value =
                profileData.gender || "";
        }


        if (phoneInput) {

            phoneInput.value =
                profileData.phone || "";
        }


        if (bioInput) {

            bioInput.value =
                profileData.bio || "";
        }


        // ==================================================
        // AVATAR
        // ==================================================

        // Nếu người dùng đã có avatar thì hiển thị avatar đó.
        if (
            profileAvatar &&
            profileData.avatar
        ) {

            profileAvatar.src =
                profileData.avatar;
        }

    } catch (error) {

        // Hiển thị lỗi trong console để dễ kiểm tra.
        console.error(
            "Lỗi khi tải Profile:",
            error
        );


        // Không để chữ "Đang tải..." xuất hiện mãi.
        if (welcomeUsername) {

            welcomeUsername.textContent =
                user.displayName ||
                (
                    user.email
                        ? user.email.split("@")[0]
                        : "Bạn"
                );
        }
    }
}


// ======================================================
// LƯU PROFILE
// ======================================================

if (saveProfileBtn) {

    saveProfileBtn.addEventListener(
        "click",
        async function () {

            // Kiểm tra tài khoản hiện tại.
            const user =
                auth.currentUser;


            // Nếu chưa đăng nhập thì dừng.
            if (!user) {

                if (saveStatus) {

                    saveStatus.textContent =
                        "Vui lòng đăng nhập trước.";
                }

                return;
            }


            // Thông báo đang lưu.
            if (saveStatus) {

                saveStatus.textContent =
                    "Đang lưu...";
            }


            try {

                // Đường dẫn Profile của tài khoản.
                const profileRef =
                    doc(
                        db,
                        "users",
                        user.uid,
                        "profile",
                        "info"
                    );


                // Dữ liệu cần lưu.
                const profileData = {

                    // Username.
                    username:
                        usernameInput
                            ? usernameInput.value.trim()
                            : "",

                    // Email.
                    email:
                        user.email || "",

                    // Họ tên.
                    fullName:
                        fullNameInput
                            ? fullNameInput.value.trim()
                            : "",

                    // Ngày sinh.
                    birthday:
                        birthdayInput
                            ? birthdayInput.value
                            : "",

                    // Giới tính.
                    gender:
                        genderInput
                            ? genderInput.value
                            : "",

                    // Số điện thoại.
                    phone:
                        phoneInput
                            ? phoneInput.value.trim()
                            : "",

                    // Mô tả.
                    bio:
                        bioInput
                            ? bioInput.value.trim()
                            : ""
                };


                // Lưu dữ liệu lên Firestore.
                await setDoc(
                    profileRef,
                    profileData,
                    {
                        merge: true
                    }
                );


                // Cập nhật username trên giao diện.
                if (welcomeUsername) {

                    welcomeUsername.textContent =
                        profileData.username ||
                        "Bạn";
                }


                // Thông báo thành công.
                if (saveStatus) {

                    saveStatus.textContent =
                        "Đã lưu thông tin thành công!";
                }

            } catch (error) {

                // In lỗi để kiểm tra.
                console.error(
                    "Lỗi khi lưu Profile:",
                    error
                );


                // Thông báo lỗi.
                if (saveStatus) {

                    saveStatus.textContent =
                        "Không thể lưu thông tin.";
                }
            }
        }
    );
}


// ======================================================
// ĐỔI AVATAR
// ======================================================

// Khi nhấn nút đổi avatar thì mở file picker.
if (changeAvatarBtn && avatarInput) {

    changeAvatarBtn.addEventListener(
        "click",
        function () {

            avatarInput.click();
        }
    );
}


// ======================================================
// UPLOAD AVATAR CLOUDINARY
// ======================================================

if (avatarInput) {

    avatarInput.addEventListener(
        "change",
        async function () {

            // Lấy tài khoản hiện tại.
            const user =
                auth.currentUser;


            // Lấy file người dùng chọn.
            const file =
                avatarInput.files[0];


            // Nếu chưa chọn file thì dừng.
            if (!file) {
                return;
            }


            // Kiểm tra đăng nhập.
            if (!user) {

                if (avatarStatus) {

                    avatarStatus.textContent =
                        "Vui lòng đăng nhập trước.";
                }

                return;
            }


            try {

                // Thông báo đang upload.
                if (avatarStatus) {

                    avatarStatus.textContent =
                        "Đang tải ảnh lên...";
                }


                // Tạo FormData để gửi ảnh lên Cloudinary.
                const formData =
                    new FormData();


                // Thêm upload preset.
                formData.append(
                    "upload_preset",
                    cloudinaryConfig.uploadPreset
                );


                // Thêm file ảnh.
                formData.append(
                    "file",
                    file
                );


                // Gửi ảnh lên Cloudinary.
                const response =
                    await fetch(
                        `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`,
                        {
                            method: "POST",
                            body: formData
                        }
                    );


                // Chuyển kết quả thành JSON.
                const data =
                    await response.json();


                // Nếu Cloudinary báo lỗi thì dừng.
                if (!response.ok) {

                    throw new Error(
                        data.error?.message ||
                        "Upload ảnh thất bại."
                    );
                }


                // Lấy URL ảnh sau khi upload.
                const avatarUrl =
                    data.secure_url;


                // Hiển thị avatar mới ngay lập tức.
                if (profileAvatar) {

                    profileAvatar.src =
                        avatarUrl;
                }


                // Đường dẫn Profile.
                const profileRef =
                    doc(
                        db,
                        "users",
                        user.uid,
                        "profile",
                        "info"
                    );


                // Lưu URL avatar vào Firestore.
                await setDoc(
                    profileRef,
                    {
                        avatar: avatarUrl
                    },
                    {
                        merge: true
                    }
                );


                // Thông báo thành công.
                if (avatarStatus) {

                    avatarStatus.textContent =
                        "Đã cập nhật ảnh đại diện!";
                }

            } catch (error) {

                // In lỗi.
                console.error(
                    "Lỗi avatar:",
                    error
                );


                // Thông báo lỗi.
                if (avatarStatus) {

                    avatarStatus.textContent =
                        "Không thể cập nhật ảnh đại diện.";
                }
            }
        }
    );
}


// ======================================================
// KIỂM TRA ĐĂNG NHẬP
// ======================================================

onAuthStateChanged(
    auth,
    async function (user) {

        // Nếu đã đăng nhập.
        if (user) {

            // Tải thông tin Profile.
            await loadProfile(user);

            // Cập nhật số Pokémon Collection/Favorite.
            updatePokemonStats();

        } else {

            // Nếu chưa đăng nhập thì chuyển về trang đăng nhập.
            window.location.href =
                "login.html";
        }
    }
);


// ======================================================
// CẬP NHẬT LẠI SỐ LƯỢNG KHI QUAY LẠI TRANG
// ======================================================

// Khi người dùng quay lại tab/trang Profile,
// đọc lại localStorage để số lượng được cập nhật.
window.addEventListener(
    "pageshow",
    function () {

        updatePokemonStats();
    }
);


// Khi cửa sổ được focus lại cũng cập nhật số lượng.
window.addEventListener(
    "focus",
    function () {

        updatePokemonStats();
    }
);