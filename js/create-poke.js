//   IMPORT FIREBASE AUTH
// Lấy auth từ file cấu hình Firebase.
import { auth, cloudinaryConfig } from "./firebase-config.js";
// Import hàm theo dõi trạng thái đăng nhập.
import { onAuthStateChanged} from
    "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// IMPORT FIRESTORE
// Lấy database Firestore.
import { db } from "./firestore.js";
// Import các hàm Firestore cần sử dụng.
import { collection, addDoc, getDocs, doc, updateDoc, 
    deleteDoc, serverTimestamp } from
    "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

//  LẤY PHẦN TỬ HTML
// Lấy form.
const createPokemonForm = document.querySelector("#createPokemonForm");
// Lấy ô nhập tên.
const pokemonName = document.querySelector("#pokemonName");
// Lấy ô chọn ảnh.
const pokemonImage = document.querySelector("#pokemonImage");
// Lấy ô chọn hệ.
const pokemonType = document.querySelector("#pokemonType");
// Lấy ô nhập mô tả.
const pokemonDescription = document.querySelector("#pokemonDescription");
// Lấy ô nhập chiều cao.
const pokemonHeight = document.querySelector("#pokemonHeight");
// Lấy ô nhập cân nặng.
const pokemonWeight = document.querySelector("#pokemonWeight");
// Lấy khu vực message.
const formMessage = document.querySelector("#formMessage");
// Lấy nút lưu.
const savePokemonBtn = document.querySelector("#savePokemonBtn");
// Lấy nút hủy.
const cancelEditBtn = document.querySelector("#cancelEditBtn");
// Lấy tiêu đề form.
const formTitle = document.querySelector("#formTitle");
// Lấy danh sách Pokémon.
const customPokemonList = document.querySelector("#customPokemonList");
// Lấy loading.
const pokemonLoading = document.querySelector("#pokemonLoading");
// Lấy empty state.
const pokemonEmpty =  document.querySelector("#pokemonEmpty");
// Lấy số lượng Pokémon.
const pokemonCount = document.querySelector("#pokemonCount");
// Lấy tên file.
const imageFileName = document.querySelector("#imageFileName");
// Lấy khu vực preview.
const imagePreviewBox = document.querySelector("#imagePreviewBox");
// Lấy ảnh preview.
const imagePreview = document.querySelector("#imagePreview");

// BIẾN TOÀN CỤC
// Lưu user hiện tại.
let currentUser = null;
// Lưu ID Pokémon đang sửa.
let editingPokemonId = null;
// Lưu URL ảnh cũ.
let editingPokemonImage = "";

//   KIỂM TRA ĐĂNG NHẬP
// Theo dõi trạng thái đăng nhập.
onAuthStateChanged( auth, async function (user) {
        // Nếu chưa đăng nhập.
        if (!user) {
            // Chuyển sang trang login.
            window.location.href = "./login.html";
            return;
        }
        // Lưu user.
        currentUser = user;
        // Tải Pokémon của user này.
        await loadCustomPokemon();
    }
);

//  XỬ LÝ CHỌN ẢNH
// Khi người dùng chọn file.
pokemonImage.addEventListener( "change", function () {
        // Lấy file đầu tiên.
        const file =  pokemonImage.files[0];
        // Nếu không có file.
        if (!file) {
            // Nếu đang sửa và có ảnh cũ.
            if (editingPokemonImage) {
                // Hiển thị trạng thái.
                imageFileName.textContent = "Đang sử dụng hình ảnh hiện tại.";
                // Hiện ảnh cũ.
                imagePreview.src = editingPokemonImage;
                // Hiện preview.
                imagePreviewBox.classList.remove("d-none");
                return;
            }
            // Nếu tạo mới.
            imageFileName.textContent = "Chưa chọn hình ảnh";
            // Ẩn preview.
            imagePreviewBox.classList.add("d-none");
            return;
        }

        //             KIỂM TRA ĐỊNH DẠNG
        // Các định dạng cho phép.
        const allowedTypes = [ "image/png", "image/jpeg", "image/webp" ];
        // Nếu file không hợp lệ.
        if ( !allowedTypes.includes( file.type ) ) {
            // Thông báo.
            showMessage("Chỉ được chọn ảnh PNG, JPG hoặc WEBP!", "danger");
            // Xóa file.
            pokemonImage.value = "";
            // Reset tên.
            imageFileName.textContent = "Chưa chọn hình ảnh";
            // Ẩn preview.
            imagePreviewBox.classList.add("d-none");
            return;
        }

        //  TÊN FILE
        // Hiển thị tên file.
        imageFileName.textContent = "Đã chọn: " + file.name;
        //  PREVIEW
        // Tạo URL tạm.
        const previewURL = URL.createObjectURL(file);
        // Gán ảnh preview.
        imagePreview.src = previewURL;
        // Hiện preview.
        imagePreviewBox.classList.remove("d-none");
    }
);

//    UPLOAD CLOUDINARY
// Hàm upload ảnh lên Cloudinary.
async function uploadImageToCloudinary(file) {
    // Kiểm tra file.
    if (!file) {
        return "";
    }
    // Kiểm tra cấu hình.
    if ( !cloudinaryConfig || !cloudinaryConfig.cloudName ||
        !cloudinaryConfig.uploadPreset) {
        // Báo lỗi.
        throw new Error("Cloudinary chưa được cấu hình.");
    }
    // Tạo FormData.
    const formData = new FormData();
    // Thêm file.
    formData.append( "file", file);
    // Thêm upload preset.
    formData.append("upload_preset", cloudinaryConfig.uploadPreset);
    // Tạo URL Cloudinary.
    const uploadURL = 
        `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`;
    // Gửi request.
    const response = await fetch( uploadURL, {
                method: "POST", body: formData
            }
);
    // Nếu upload thất bại.
    if (!response.ok) {
        // Lấy lỗi.
        const errorData = await response.json().catch( function () {
                        return {};
                    }
                );
        // Tạo lỗi.
        throw new Error( errorData.error?.message || "Upload ảnh thất bại.");
    }
    // Lấy dữ liệu.
    const data = await response.json();
    // Trả về URL ảnh.
    return data.secure_url;
}

// SUBMIT FORM
// Lắng nghe submit.
createPokemonForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        // Nếu chưa có user.
        if (!currentUser) {
            // Dừng.
            return;
        }

        //  LẤY DỮ LIỆU
        // Lấy tên.
        const name = pokemonName.value.trim();
        // Lấy hệ.
        const type = pokemonType.value;
        // Lấy mô tả.
        const description =  pokemonDescription.value.trim();
        // Lấy chiều cao.
        const height = Number(pokemonHeight.value);
        // Lấy cân nặng.
        const weight = Number(pokemonWeight.value);
        // Lấy file mới.
        const selectedFile = pokemonImage.files[0];

        //   KIỂM TRA
        // Kiểm tra trường bắt buộc.
        if ( !name || !type || !description) {
            showMessage("Vui lòng nhập đầy đủ thông tin!", "danger");
            return;
        }
        // Nếu đang tạo mới.
        if ( !editingPokemonId && !selectedFile) {
            // Bắt chọn ảnh.
            showMessage( "Vui lòng chọn hình ảnh Pokémon!", "danger");
            return;
        }
        try {
            //   HIỂN THỊ TRẠNG THÁI LƯU
            // Khóa nút.
            savePokemonBtn.disabled = true;
            // Đổi nội dung nút.
            savePokemonBtn.innerHTML = ` <span class="spinner-border spinner-border-sm"
                    role="status"> </span> Đang lưu...  `;

            //    XỬ LÝ ẢNH
            // Bắt đầu với ảnh cũ.
            let image = editingPokemonImage;
            // Nếu có ảnh mới.
            if (selectedFile) {
                // Upload Cloudinary.
                image = await uploadImageToCloudinary(selectedFile);
            }
            // Nếu không có ảnh.
            if (!image) {
                // Báo lỗi.
                throw new Error("Không có hình ảnh Pokémon.");
            }

            //   UPDATE
            if (editingPokemonId) {
                // Tạo reference.
                const pokemonRef = doc( db, "users", currentUser.uid,
                        "customPokemon", editingPokemonId);
                // Cập nhật.
                await updateDoc( pokemonRef, {
                        name: name,
                        image: image,
                        type: type,
                        description: description,
                        height: height,
                        weight: weight,
                        updatedAt: serverTimestamp()
                    }
                );

                showMessage( "Cập nhật Pokémon thành công! 🎉", "success");
            }

            //   CREATE
            else {
                // Lấy collection.
                const pokemonCollection = collection( db, "users",
                        currentUser.uid, "customPokemon");
                // Thêm document.
                await addDoc( pokemonCollection, {
                        name: name,
                        image: image,
                        type: type,
                        description: description,
                        height: height,
                        weight: weight,
                        createdAt: serverTimestamp(),
                        updatedAt: serverTimestamp()
                    }
                );
                // Thông báo.
                showMessage("Tạo Pokémon thành công! 🎉", "success");
            }
            // Reset form.
            resetForm();
            // Tải lại danh sách.
            await loadCustomPokemon();
        }
        catch (error) {
            console.error("Lỗi khi lưu Pokémon:", error);
            
            showMessage( error.message ||
                "Không thể lưu Pokémon. Vui lòng thử lại!", "danger");
        }
        finally {
            // Mở lại nút.
            savePokemonBtn.disabled = false;
            // Nếu không ở chế độ sửa.
            if (!editingPokemonId) {
                // Nội dung nút thêm.
                savePokemonBtn.innerHTML = ` <i class="bi bi-plus-circle"></i> Thêm Pokémon `;
            }
        }

    }
);

//                       READ
// Hàm tải Pokémon.
async function loadCustomPokemon() {
    // Nếu chưa đăng nhập.
    if (!currentUser) {
        return;
    }
    // Hiện loading.
    pokemonLoading.classList.remove("d-none");
    // Ẩn empty.
    pokemonEmpty.classList.add("d-none");
    // Xóa danh sách cũ.
    customPokemonList.innerHTML = "";
    try {
        //  COLLECTION CỦA USER
        const pokemonCollection = collection(db, "users",
                currentUser.uid, "customPokemon");
        // Lấy document.
        const snapshot = await getDocs(pokemonCollection);
        // Tạo mảng.
        const pokemonData = [];
        // Duyệt dữ liệu.
        snapshot.forEach( function (pokemonDoc) {
                // Lấy data.
                const data = pokemonDoc.data();
                // Thêm vào mảng.
                pokemonData.push( {
                        id: pokemonDoc.id, ...data
                    }
                );
            }
        );

        //  SẮP XẾP
        // Sắp xếp mới nhất lên trước.
        pokemonData.sort( function (a, b) {
                // Lấy thời gian A.
                const timeA = a.createdAt?.seconds || 0;
                // Lấy thời gian B.
                const timeB = b.createdAt?.seconds || 0;
                // B trước A.
                return timeB - timeA;
            }
        );
        // Hiển thị số lượng.
        pokemonCount.textContent = `${pokemonData.length} Pokémon`;
        // Tắt loading.
        pokemonLoading.classList.add("d-none");
        // Nếu không có Pokémon.
        if ( pokemonData.length === 0) {
            // Hiện empty.
            pokemonEmpty.classList.remove("d-none");
            return;
        }

        //  RENDER
        // Render từng Pokémon.
        pokemonData.forEach( function (pokemon) {
                // Tạo card.
                renderPokemonCard(pokemon);
            }
        );
    }
    catch (error) {
        console.error( "Lỗi khi đọc Pokémon:", error);
        // Tắt loading.
        pokemonLoading.classList.add("d-none");

        showMessage( "Không thể tải danh sách Pokémon!", "danger" );
    }
}

//   RENDER CARD
// Hàm render card
function renderPokemonCard(pokemon) {
    // Tạo cột.
    const col =  document.createElement("div");
    // Bootstrap responsive.
    col.className =  "col-12 col-md-6 col-lg-4";
    // Tạo card.
    const card = document.createElement("div");
    // Class chung của website.
    card.className =  "pokemon-card h-100";
    // Lấy chiều cao.
    const height = pokemon.height ?? 0;
    // Lấy cân nặng.
    const weight = pokemon.weight ?? 0;
    // Tạo HTML card.
    card.innerHTML = ` <img src="${escapeHTML(pokemon.image || "")}"
            alt="${escapeHTML(pokemon.name || "Pokémon")}"
            onerror="this.src='./Image/logo.png'">

        <h4> ${escapeHTML(pokemon.name || "Pokémon")} </h4>

        <span class="type ${getTypeClass(pokemon.type)}">
            <span class="type-icon">${getTypeIcon(pokemon.type)}</span>
            ${escapeHTML(pokemon.type)}
        </span>

        <p class="mt-3 text-muted">
            ${escapeHTML(pokemon.description || "")}
        </p>

        <p class="mb-2">
            <strong>Chiều cao:</strong> ${escapeHTML(height)} m
        </p>

        <p class="mb-3">
            <strong>Cân nặng:</strong> ${escapeHTML(weight)} kg
        </p>

        <div class="d-flex gap-2">
            <button class="card-btn edit-btn" data-id="${escapeHTML(pokemon.id)}">
                <i class="bi bi-pencil-square"></i> Sửa
            </button>

            <button class="card-btn delete-btn" data-id="${escapeHTML(pokemon.id)}">
                <i class="bi bi-trash"></i> Xóa
            </button>
        </div> `;
    // Đưa card vào cột.
    col.appendChild(card);
    // Đưa cột vào danh sách.
    customPokemonList.appendChild(col);

    //    NÚT SỬA
    // Tìm nút sửa.
    const editBtn =  card.querySelector(".edit-btn");
    // Lắng nghe click.
    editBtn.addEventListener( "click", function () {
            // Chuyển sang chế độ sửa.
            editPokemon(pokemon);
        }
    );

    //   NÚT XÓA
    // Tìm nút xóa.
    const deleteBtn = card.querySelector(".delete-btn");
    // Lắng nghe click.
    deleteBtn.addEventListener("click", function () {
            // Xóa Pokémon.
            deletePokemon(pokemon.id);
        }
    );
}

// UPDATE - CHẾ ĐỘ SỬA
// Hàm đưa dữ liệu Pokémon vào form.
function editPokemon(pokemon) {
    // Lưu ID.
    editingPokemonId = pokemon.id;
    // Lưu ảnh cũ.
    editingPokemonImage = pokemon.image || "";

    //    TIN
    // Đưa tên vào input.
    pokemonName.value = pokemon.name || "";
    // Đưa hệ vào select.
    pokemonType.value = pokemon.type || "";
    // Đưa mô tả.
    pokemonDescription.value =  pokemon.description || "";
    // Đưa chiều cao.
    pokemonHeight.value = pokemon.height ?? "";
    // Đưa cân nặng.
    pokemonWeight.value = pokemon.weight ?? "";

    //  ẢNH
    // QUAN TRỌNG:  Không được viết: 
    // pokemonImage.value = pokemon.image;
    // Vì input type="file" không cho phép JavaScript gán đường dẫn file.

    // Nếu có ảnh cũ.
    if (editingPokemonImage) {
        // Hiển thị thông báo ảnh.
        imageFileName.textContent = "Đang sử dụng hình ảnh hiện tại. " +
            "Chọn ảnh mới nếu muốn thay đổi.";
        // Hiển thị ảnh.
        imagePreview.src =  editingPokemonImage;
        // Hiện preview.
        imagePreviewBox.classList.remove("d-none");
    }

    //  ĐỔI TIÊU ĐỀ
    // Đổi tiêu đề.
    formTitle.innerHTML = ` <i class="bi bi-pencil-square"></i> Sửa Pokémon `;

    //  ĐỔI NÚT
    // Đổi nút lưu.
    savePokemonBtn.innerHTML = ` <i class="bi bi-save"></i> Cập nhật Pokémon `;
    // Hiện nút hủy.
    cancelEditBtn.classList.remove("d-none");
    // Cuộn lên form.
    createPokemonForm.scrollIntoView( {
            behavior: "smooth", block: "start"
        }
    );
}

//  DELETE
// Hàm xóa Pokémon.
async function deletePokemon( pokemonId ) {
    // Hỏi xác nhận.
    const confirmDelete = confirm("Bạn có chắc muốn xóa Pokémon này không?");
    // Nếu không đồng ý.
    if (!confirmDelete) {
        return;
    }
    try {
        // Tạo reference.
        const pokemonRef = doc( db, "users", currentUser.uid, 
            "customPokemon", pokemonId);
        // Xóa document.
        await deleteDoc(pokemonRef);

        showMessage( "Đã xóa Pokémon! 🗑️", "success");
        // Tải lại.
        await loadCustomPokemon();
    }
    catch (error) {
        console.error("Lỗi khi xóa Pokémon:", error);
        
        showMessage( "Không thể xóa Pokémon!", "danger");
    }
}

//  HỦY CHẾ ĐỘ SỬA
// Lắng nghe nút hủy.
cancelEditBtn.addEventListener("click", function () {
        // Reset.
        resetForm();
    }
);

//      RESET
// Reset form.
function resetForm() {
    // Reset tất cả input.
    createPokemonForm.reset();
    // Xóa ID sửa.
    editingPokemonId = null;
    // Xóa ảnh cũ.
    editingPokemonImage = "";
    // Đổi title.
    formTitle.innerHTML = ` <i class="bi bi-pencil-square"></i> Thêm Pokémon `;
    // Đổi nút.
    savePokemonBtn.innerHTML = ` <i class="bi bi-plus-circle"></i> Thêm Pokémon `;
    // Ẩn nút hủy.
    cancelEditBtn.classList.add("d-none");
    // Reset tên file.
    imageFileName.textContent = "Chưa chọn hình ảnh";
    // Xóa preview.
    imagePreview.src = "";
    // Ẩn preview.
    imagePreviewBox.classList.add("d-none");
}

//  HIỂN THỊ MESSAGE
// Hàm hiển thị message.
function showMessage( message, type ) {
    // Gán nội dung.
    formMessage.textContent = message;
    // Xóa class cũ.
    formMessage.classList.remove("d-none", "alert-success", "alert-danger");
    // Thêm class mới.
    formMessage.classList.add(`alert-${type}`);
    // Tự ẩn sau 3 giây.
    setTimeout( function () {
            // Ẩn.
            formMessage.classList.add("d-none");
        }, 3000
    );
}

//   ESCAPE HTML
// Bảo vệ dữ liệu trước khi đưa vào innerHTML.
function escapeHTML(value) {
    // Chuyển thành chuỗi.
    return String( value ?? "")
        // Xử lý &.
        .replace(/&/g, "&amp;")
        // Xử lý <.
        .replace(/</g, "&lt;")
        // Xử lý >.
        .replace(/>/g, "&gt;")
        // Xử lý ".
        .replace(/"/g, "&quot;")
        // Xử lý '.
        .replace(/'/g, "&#039;");
}

// LẤY CLASS MÀU CHO TYPE
function getTypeClass(type) {
    // Chuyển type về chữ thường
    const typeName = String(type || "").toLowerCase();
    
    // Trả về class CSS tương ứng
    return `type-${typeName}`;
}

// LẤY ICON CHO TYPE
function getTypeIcon(type) {
    // Chuyển type về chữ thường
    const typeName = String(type || "").toLowerCase();
    
    // Danh sách icon của từng hệ
    const icons = {
        normal: "⚪",
        fire: "🔥",
        water: "💧",
        grass: "🌿",
        electric: "⚡",
        ice: "❄️",
        fighting: "🥊",
        poison: "☠️",
        ground: "🌍",
        flying: "🪽",
        psychic: "🔮",
        bug: "🐛",
        rock: "🪨",
        ghost: "👻",
        dragon: "🐉",
        dark: "🌑",
        steel: "⚙️",
        fairy: "✨"
    };

    // Nếu tìm thấy icon thì trả về icon
    // Nếu không thì dùng biểu tượng Pokémon mặc định
    return icons[typeName] || "⭐";
}