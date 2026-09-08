// =========================================
// TRANG DANH SÁCH POKÉMON - LIST.JS
// =========================================

// =========================================
// LINK API POKÉAPI
// =========================================

// API lấy danh sách Pokémon
const API_URL = "https://pokeapi.co/api/v2/pokemon";
// API lấy danh sách các hệ Pokémon
const TYPE_API_URL = "https://pokeapi.co/api/v2/type";

// LẤY CÁC PHẦN TỬ HTML
// Phần chứa danh sách card Pokémon
const pokemonList = document.querySelector("#pokemonList");
// Phần hiển thị loading
const loading = document.querySelector("#pokemonListLoading");
// Ô nhập tìm kiếm
const searchInput = document.querySelector("#searchInput");
// Nút tìm kiếm
const searchBtn = document.querySelector("#searchBtn");
// Khung chứa các nút lọc hệ
const typeFilters = document.querySelector("#typeFilters");
// Phần hiển thị tổng số Pokémon
const pokemonCount = document.querySelector("#pokemonCount");
// Nút chuyển trang trước
const prevPage = document.querySelector("#prevPage");
// Nút chuyển trang sau
const nextPage = document.querySelector("#nextPage");
// Phần hiển thị thông tin trang
const pageInfo = document.querySelector("#pageInfo");

// BIẾN QUẢN LÝ DỮ LIỆU
// Danh sách Pokémon hiện tại
let pokemonData = [];
// Trang hiện tại
let currentPage = 1;
// Số Pokémon hiển thị trên mỗi trang
const pokemonPerPage = 20;
// Hệ Pokémon đang được chọn
let selectedType = "all";
// Tổng số Pokémon
let totalPokemon = 0;
// Danh sách Pokémon sau khi lọc hệ
let filteredPokemonResults = [];

// ICON CỦA CÁC HỆ POKÉMON
const typeIcons = {
    all: "🌐",
    normal: "⚪",
    fire: "🔥",
    water: "💧",
    electric: "⚡",
    grass: "🌿",
    ice: "❄️",
    fighting: "🥊",
    poison: "☠️",
    ground: "🟫",
    flying: "🪶",
    psychic: "🔮",
    bug: "🐛",
    rock: "🪨",
    ghost: "👻",
    dragon: "🐉",
    dark: "🌙",
    steel: "⚙️",
    fairy: "✨",
    stellar: "🌟"
};

// VIẾT HOA TÊN POKÉMON
// Hàm viết hoa chữ cái đầu của từng từ
function capitalize(text) {
    // Tách tên theo dấu "-"
    const words = text.split("-");
    // Viết hoa từng từ
    const result = words.map(word => {
        return word.charAt(0).toUpperCase() + word.slice(1);
    });
    // Ghép lại thành tên hoàn chỉnh
    return result.join(" ");
}

// HIỂN THỊ LOADING
// Hiện loading
function showLoading() {
    loading.style.display = "block";
}
// Ẩn loading
function hideLoading() {
    loading.style.display = "none";
}

// LẤY CHI TIẾT POKÉMON
// Hàm lấy thông tin chi tiết của nhiều Pokémon
async function getPokemonDetails(pokemonResults) {
    // Tạo Promise cho từng Pokémon
    const promises = pokemonResults.map(async item => {
        // Gọi API chi tiết
        const response = await fetch(item.url);
        if (!response.ok) {
            throw new Error("Không thể lấy thông tin Pokémon");
        }
        return response.json();
    });
    // Chờ tất cả API hoàn thành
    return Promise.all(promises);
}

// LẤY DANH SÁCH POKÉMON
async function getPokemonList() {
    try {
        // Hiển thị loading
        showLoading();
        // Xóa card cũ
        pokemonList.innerHTML = "";
        // Tính vị trí Pokémon bắt đầu
        const offset = (currentPage - 1) * pokemonPerPage;
        // Gọi API theo trang
        const response = await 
            fetch(`${API_URL}?limit=${pokemonPerPage}&offset=${offset}`);
        if (!response.ok) {
            throw new Error("Không thể lấy danh sách Pokémon");
        }
        // Chuyển dữ liệu thành JSON
        const data = await response.json();
        // Lưu tổng số Pokémon
        totalPokemon = data.count;
        // Lấy chi tiết từng Pokémon
        pokemonData = await getPokemonDetails(data.results);
        // Hiển thị card
        renderPokemonList(pokemonData);
        // Hiển thị tổng số Pokémon
        pokemonCount.textContent = totalPokemon;
        // Cập nhật phân trang
        updatePagination();
        // Cập nhật nút filter đang chọn
        updateActiveFilter();
    } catch (error) {
        console.error(error);
        pokemonList.innerHTML = ` <div class="pokemon-empty-message">
                ❌ Không thể tải danh sách Pokémon.
            </div> `;
    } finally {
        // Luôn ẩn loading
        hideLoading();
    }
}

// RENDER DANH SÁCH POKÉMON
function renderPokemonList(pokemons) {
    // Nếu không có Pokémon
    if (pokemons.length === 0) {
        pokemonList.innerHTML = ` <div class="pokemon-empty-message">
                Không tìm thấy Pokémon phù hợp.
            </div> `;
        return;
    }
    // Tạo HTML cho từng Pokémon
    const html = pokemons.map(pokemon => {
        // Lấy ảnh chính thức
        const image = pokemon.sprites.other["official-artwork"].front_default ||
            pokemon.sprites.front_default;
        // Định dạng ID thành 4 chữ số
        const formattedId = String(pokemon.id).padStart(4, "0");
        // Tạo badge hệ Pokémon
        const types = pokemon.types.map(item => {
            // Lấy tên hệ
            const typeName = item.type.name;
            // Trả về HTML badge
            return ` <span class="pokemon-card-type type-${typeName}">
                    <span> ${typeIcons[typeName] || "✨"} </span> 
                    
                    ${capitalize(typeName)}
                </span> `;
        }).join("");
        // Trả về card Pokémon
        return ` <articleclass="pokemon-card" data-id="${pokemon.id}">
                <div class="pokemon-card-image-box" data-number="${formattedId}">
                    <img class="pokemon-card-image" src="${image}"
                        alt="${capitalize(pokemon.name)}">
                </div>

                <div class="pokemon-card-content">
                    <p class="pokemon-card-id"> #${formattedId} </p>

                    <h2 class="pokemon-card-name"> ${capitalize(pokemon.name)} </h2>

                    <div class="pokemon-card-types"> ${types} </div>
                </div>
            </article> `;
    }).join("");
    // Đưa card vào trang
    pokemonList.innerHTML = html;
    // Gắn sự kiện click
    addPokemonCardEvents();
}

// CLICK CARD POKÉMON
function addPokemonCardEvents() {
    // Lấy tất cả card
    const cards = document.querySelectorAll(".pokemon-card");
    cards.forEach(card => {
        card.addEventListener("click", () => {
            // Lấy ID Pokémon
            const id = card.dataset.id;
            // Chuyển sang trang chi tiết
            window.location.href = `detail.html?id=${id}`;
        });
    });
}

// LẤY DANH SÁCH HỆ POKÉMON
async function getPokemonTypes() {
    try {
        // Gọi API hệ Pokémon
        const response = await fetch(TYPE_API_URL);
        if (!response.ok) {
            throw new Error("Không thể lấy danh sách hệ Pokémon");
        }
        // Chuyển dữ liệu thành JSON
        const data = await response.json();
        // Loại bỏ hệ không sử dụng
        const types = data.results.filter(type => {
            return (type.name !== "unknown" && type.name !== "shadow");
        });

        // CHỈ TẠO CÁC NÚT FILTER
        // Tiêu đề "Lọc theo hệ" đã nằm trong list.html
        let html = ` <div class="type-filter-buttons">
                <button class="pokemon-type-filter active" data-type="all">
                    <span class="type-icon"> ${typeIcons.all} </span> Tất cả
                </button> `;
        // Tạo nút cho từng hệ
        html += types.map(type => {
            // Lấy icon hệ
            const icon = typeIcons[type.name] || "✨";
            // Trả về HTML nút
            return ` <buttonclass="pokemon-type-filter" data-type="${type.name}">
                    <span class="type-icon"> ${icon} </span>
                    ${capitalize(type.name)}
                </button> `;
        }).join("");
        // Đóng khung
        html += ` </div>`;
        // Hiển thị nút filter
        typeFilters.innerHTML = html;
        // Gắn sự kiện click
        addTypeFilterEvents();
    } catch (error) {
        console.error(error);
        // Nếu lỗi thì xóa phần filter
        typeFilters.innerHTML = "";
    }
}

// CẬP NHẬT FILTER ĐANG CHỌN
function updateActiveFilter() {
    // Lấy tất cả nút
    const buttons = document.querySelectorAll(".pokemon-type-filter");
    // Kiểm tra từng nút
    buttons.forEach(button => {
        // Nếu đúng hệ đang chọn
        if (button.dataset.type === selectedType) {
            button.classList.add("active");
        } else {
            button.classList.remove("active");
        }
    });
}

// SỰ KIỆN CLICK FILTER
function addTypeFilterEvents() {
    // Lấy tất cả nút filter
    const buttons = document.querySelectorAll(".pokemon-type-filter");
    buttons.forEach(button => {
        button.addEventListener("click", async () => {
            // Lưu hệ được chọn
            selectedType = button.dataset.type;
            // Quay về trang đầu
            currentPage = 1;
            // Xóa nội dung tìm kiếm
            searchInput.value = "";
            // Cập nhật nút active
            updateActiveFilter();
            // Nếu chọn tất cả
            if (selectedType === "all") {
                // Xóa dữ liệu lọc
                filteredPokemonResults = [];
                // Lấy danh sách bình thường
                await getPokemonList();
            } else {
                // Lấy Pokémon theo hệ
                await getPokemonByType(selectedType);
            }
        });
    });
}

// LẤY POKÉMON THEO HỆ
async function getPokemonByType(type) {
    try {
        // Hiển thị loading
        showLoading();
        // Xóa danh sách cũ
        pokemonList.innerHTML = "";
        // Gọi API theo hệ
        const response = await fetch(`${TYPE_API_URL}/${type}`);
        if (!response.ok) {
            throw new Error("Không thể lấy Pokémon theo hệ");
        }
        // Lấy dữ liệu
        const data = await response.json();
        // Lấy danh sách Pokémon
        filteredPokemonResults = data.pokemon.map(item => item.pokemon);
        // Lưu tổng số
        totalPokemon = filteredPokemonResults.length;
        // Render trang đầu tiên
        await renderFilteredPokemonPage();
    } catch (error) {
        console.error(error);
        pokemonList.innerHTML = ` <div class="pokemon-empty-message">
                ❌ Không thể tải Pokémon theo hệ này.
            </div> `;
    } finally {
        hideLoading();
    }
}

// RENDER POKÉMON ĐANG LỌC
async function renderFilteredPokemonPage() {
    try {
        showLoading();
        // Xóa dữ liệu cũ
        pokemonList.innerHTML = "";
        // Vị trí bắt đầu
        const start = (currentPage - 1) * pokemonPerPage;
        // Lấy Pokémon của trang hiện tại
        const pokemonPage = filteredPokemonResults.slice(start, 
            start + pokemonPerPage);
        // Lấy chi tiết
        pokemonData = await getPokemonDetails(pokemonPage);
        // Render card
        renderPokemonList(pokemonData);
        // Cập nhật số lượng
        pokemonCount.textContent = totalPokemon;
        // Cập nhật phân trang
        updatePagination();
        // Cập nhật filter
        updateActiveFilter();
    } catch (error) {
        console.error(error);
        pokemonList.innerHTML = ` <div class="pokemon-empty-message">
                ❌ Không thể tải dữ liệu Pokémon.
            </div> `;
    } finally {
        hideLoading();
    }
}

// TÌM KIẾM POKÉMON
async function searchPokemon() {
    // Lấy từ khóa
    const keyword = searchInput.value.trim().toLowerCase();
    // Nếu ô tìm kiếm trống
    if (!keyword) {
        // Quay về trang đầu
        currentPage = 1;
        // Nếu đang lọc theo hệ
        if (selectedType !== "all") {
            await renderFilteredPokemonPage();
        } else {
            await getPokemonList();
        }
        return;
    }
    try {
        showLoading();
        pokemonList.innerHTML = "";
        // Gọi API theo tên hoặc ID
        const response = await fetch(`${API_URL}/${keyword}`);
        // Kiểm tra Pokémon tồn tại
        if (!response.ok) {
            throw new Error("Không tìm thấy Pokémon");
        }
        // Lấy dữ liệu Pokémon
        const pokemon = await response.json();
        // Nếu đang lọc theo hệ
        if (selectedType !== "all") {
            // Kiểm tra hệ Pokémon
            const hasSelectedType = pokemon.types.some(item => {
                    return (item.type.name === selectedType);
                });
            // Không thuộc hệ đang chọn
            if (!hasSelectedType) {
                pokemonList.innerHTML = ` <div class="pokemon-empty-message">
                        Không tìm thấy Pokémon "${keyword}"
                        trong hệ ${capitalize(selectedType)}.
                    </div> `;
                // Hiển thị số lượng
                pokemonCount.textContent = 0;
                // Thông báo trang
                pageInfo.textContent = "Không có kết quả";
                // Ẩn phân trang
                hidePagination();
                return;
            }
        }
        // Lưu Pokémon tìm được
        pokemonData = [pokemon];
        // Hiển thị Pokémon
        renderPokemonList(pokemonData);
        // Hiển thị số lượng
        pokemonCount.textContent = 1;
        // Thông báo kết quả
        pageInfo.textContent = "Kết quả tìm kiếm";
        // Ẩn phân trang
        hidePagination();
    } catch (error) {
        console.error(error);
        // Thông báo không tìm thấy
        pokemonList.innerHTML = ` <div class="pokemon-empty-message">
                ❌ Không tìm thấy Pokémon "${keyword}".
            </div> `;
        // Hiển thị số lượng
        pokemonCount.textContent = 0;
        // Cập nhật trang
        pageInfo.textContent = "Không có kết quả";
        // Ẩn phân trang
        hidePagination();
    } finally {
        hideLoading();
    }
}

// ẨN PHÂN TRANG
function hidePagination() {
    prevPage.style.display = "none";
    nextPage.style.display = "none";
}

// HIỆN PHÂN TRANG
function showPagination() {
    prevPage.style.display = "block";
    nextPage.style.display = "block";
}

// CẬP NHẬT PHÂN TRANG
function updatePagination() {
    // Hiển thị lại nút
    showPagination();
    // Tính tổng số trang
    const totalPages = Math.ceil(totalPokemon / pokemonPerPage);
    // Hiển thị thông tin trang
    pageInfo.textContent = `Trang ${currentPage} / ${totalPages}`;
    // Khóa nút trước ở trang đầu
    prevPage.disabled = currentPage === 1;
    // Khóa nút sau ở trang cuối
    nextPage.disabled = currentPage === totalPages;
}

// SỰ KIỆN TÌM KIẾM
// Click nút tìm kiếm
searchBtn.addEventListener("click", () => {
    searchPokemon();
});
// Nhấn Enter
searchInput.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        searchPokemon();
    }
});

// SỰ KIỆN NÚT TRƯỚC
prevPage.addEventListener("click", async () => {
    // Nếu đang ở trang đầu
    if (currentPage <= 1) {
        return;
    }
    // Giảm trang
    currentPage--;
    // Kiểm tra đang lọc hệ
    if (selectedType !== "all") {
        await renderFilteredPokemonPage();
    } else {
        await getPokemonList();
    }
});

// SỰ KIỆN NÚT SAU
nextPage.addEventListener("click", async () => {
    // Tính tổng số trang
    const totalPages = Math.ceil(totalPokemon / pokemonPerPage);
    // Nếu đang ở trang cuối
    if (currentPage >= totalPages) {
        return;
    }
    // Tăng trang
    currentPage++;
    // Kiểm tra đang lọc hệ
    if (selectedType !== "all") {
        await renderFilteredPokemonPage();
    } else {
        await getPokemonList();
    }
});

// KHỞI ĐỘNG TRANG
// Lấy danh sách các hệ Pokémon
getPokemonTypes();
// Lấy danh sách Pokémon đầu tiên
getPokemonList();