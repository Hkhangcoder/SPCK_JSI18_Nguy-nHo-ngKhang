// ======================================================
// COLLECTION.JS
// TRANG BỘ SƯU TẬP POKÉMON
// ======================================================

// LẤY PHẦN TỬ HTML
// Danh sách card Pokémon.
const pokemonList = document.querySelector("#collectionList");
// Khu vực hiển thị khi không có Pokémon.
const emptyState = document.querySelector("#collectionEmptyState");
// Tiêu đề trạng thái trống.
const emptyTitle = document.querySelector("#collectionEmptyTitle");
// Nội dung trạng thái trống.
const emptyText = document.querySelector("#collectionEmptyText");
// Ô tìm kiếm.
const searchInput = document.querySelector("#searchInput");
// Nút tìm kiếm.
const searchBtn = document.querySelector("#searchBtn");
// Khung các nút lọc hệ.
const typeFilters = document.querySelector("#collectionTypeFilters");
// Tiêu đề danh sách Pokémon.
const collectionTitle = document.querySelector("#collectionTitle");
// Số lượng Pokémon.
const pokemonCount = document.querySelector("#collectionCount");
// Khung phân trang.
const collectionPagination = document.querySelector("#collectionPagination");
// Nút trang trước.
const prevPage = document.querySelector("#collectionPrevPage");
// Nút trang sau.
const nextPage = document.querySelector("#collectionNextPage");
// Hiển thị số trang.
const pageInfo = document.querySelector("#collectionPageInfo");

// BIẾN DỮ LIỆU
// Toàn bộ Pokémon trong Collection.
let collectionData = [];
// Pokémon sau khi lọc.
let filteredPokemon = [];
// Hệ Pokémon đang chọn.
let selectedType = "all";
// Từ khóa tìm kiếm.
let searchKeyword = "";
// Trang hiện tại.
let currentPage = 1;
// Mỗi trang hiển thị 20 Pokémon.
const pokemonPerPage = 20;
// Tổng số Pokémon sau khi lọc.
let totalPokemon = 0;

// 18 HỆ POKÉMON
const pokemonTypes = [

    "normal",
    "fire",
    "water",
    "electric",
    "grass",
    "ice",
    "fighting",
    "poison",
    "ground",
    "flying",
    "psychic",
    "bug",
    "rock",
    "ghost",
    "dragon",
    "dark",
    "steel",
    "fairy"
];

// ICON CÁC HỆ
const typeIcons = {
    normal: "⚪",
    fire: "🔥",
    water: "💧",
    electric: "⚡",
    grass: "🌿",
    ice: "❄️",
    fighting: "🥊",
    poison: "☠️",
    ground: "🏜️",
    flying: "🪽",
    psychic: "🔮",
    bug: "🐛",
    rock: "🪨",
    ghost: "👻",
    dragon: "🐉",
    dark: "🌙",
    steel: "⚙️",
    fairy: "✨"
};

// VIẾT HOA TÊN
// Đổi tên Pokémon từ "pikachu" thành "Pikachu".
function capitalize(text) {
    if (!text) {
        return "";
    }
    return text.split("-").map(function (word) {
            return (word.charAt(0).toUpperCase() + word.slice(1));
        }) .join(" ");
}

// LẤY TÊN HỆ POKÉMON
// Lấy danh sách hệ của Pokémon.
function getTypeNames(pokemon) {
    if (!pokemon.types) {
        return [];
    }
    return pokemon.types.map(function (type) {
        // Trường hợp types là chuỗi.
        if (typeof type === "string") {
            return type;
        }
        // Trường hợp types là object.
        return type.name;
    });
}

// LẤY COLLECTION TỪ LOCAL STORAGE
// Đọc dữ liệu Collection đã lưu.
function loadCollectionData() {
    const savedCollection = localStorage.getItem("pokemonCollection");
    // Chưa có Collection.
    if (!savedCollection) {
        return [];
    }
    try {
        const data = JSON.parse(savedCollection);
        // Chỉ nhận dữ liệu dạng mảng.
        if (Array.isArray(data)) {
            return data;
        }
        return [];
    } catch (error) {
        console.error( "Lỗi đọc Collection:", error);
        return [];
    }
}

// ĐẾM POKÉMON THEO HỆ
// Đếm số Pokémon thuộc một hệ.
function getPokemonCountByType(type) {
    // Tất cả Pokémon.
    if (type === "all") {
        return collectionData.length;
    }
    // Lọc theo hệ rồi đếm.
    return collectionData.filter(
        function (pokemon) {
            const types = getTypeNames(pokemon);
            return types.includes(type); 
        }).length;
}

// TẠO CÁC NÚT LỌC HỆ
function renderTypeFilters() {
    if (!typeFilters) {
        return;
    }
    // Nút Tất cả.
    let html = ` <button type="button" class="collection-type-filter
                ${selectedType === "all" ? "active" : ""}" data-type="all">
            <span class="type-icon"> 🌐 </span>
            
            <span> Tất cả </span>
        </button> `;
    // Tạo 18 nút hệ.
    pokemonTypes.forEach(function (type) {
            const isActive = selectedType === type;
            html += ` <button type="button" class="collection-type-filter
                        ${isActive ? "active" : ""}" data-type="${type}">
                    
                    <span class="type-icon"> ${typeIcons[type]} </span>

                    <span> ${capitalize(type)} </span>
                </button> `; } );
    // Hiển thị các nút lên trang.
    typeFilters.innerHTML = html;
    // Gắn sự kiện click.
    addTypeFilterEvents();
}

// SỰ KIỆN CHO NÚT LỌC HỆ
function addTypeFilterEvents() {
    const buttons = document.querySelectorAll(".collection-type-filter");
    buttons.forEach( function (button) {
            button.addEventListener("click", function () {
                    // Lấy hệ được chọn.
                    selectedType = button.dataset.type;
                    // Về trang đầu.
                    currentPage = 1;
                    // Cập nhật nút đang chọn.
                    renderTypeFilters();
                    // Lọc lại Pokémon.
                    applyFilters();
                }
            );
        }
    );
}

// CẬP NHẬT TIÊU ĐỀ VÀ SỐ LƯỢNG
function updateCollectionInfo() {
    if (collectionTitle) {
        // Khi chọn tất cả.
        if (selectedType === "all") {
            collectionTitle.textContent = "Tất cả Pokémon";
        } else {
            // Khi chọn một hệ.
            collectionTitle.textContent =
                `Tất cả Pokémon hệ ${capitalize(selectedType)}`;
        }
    }
    // Hiển thị số Pokémon sau khi lọc.
    if (pokemonCount) {
        pokemonCount.textContent = `${totalPokemon} Pokémon`;
    }
}

// CẬP NHẬT EMPTY STATE
function updateEmptyState() {
    if (!emptyState) {
        return;
    }
    // Collection chưa có Pokémon.
    if (collectionData.length === 0) {
        emptyTitle.textContent = "Chưa có Pokémon nào";
        emptyText.textContent = "Bộ sưu tập của bạn hiện đang trống.";
        return;
    }
    // Không tìm thấy kết quả tìm kiếm.
    if (searchKeyword !== "") {
        emptyTitle.textContent = "Không tìm thấy Pokémon";

        emptyText.textContent = 
            `Không có Pokémon phù hợp với "${searchKeyword}".`;
        return;
    }
    // Không có Pokémon thuộc hệ đang chọn.
    if (selectedType !== "all") {
        emptyTitle.textContent = 
            `Chưa có Pokémon hệ ${capitalize(selectedType)}`;
        emptyText.textContent ="Hãy khám phá thêm Pokédex nhé!";
    }
}

// HIỂN THỊ CARD POKÉMON
function renderPokemonList(pokemons) {
    // Không có Pokémon.
    if (pokemons.length === 0) {
        pokemonList.innerHTML = "";
        if (emptyState) {
            emptyState.hidden = false;
            updateEmptyState();
        }
        return;
    }
    // Có Pokémon thì ẩn thông báo trống.
    if (emptyState) {
        emptyState.hidden = true;
    }
    // Tạo card cho từng Pokémon.
    const html = pokemons.map( function (pokemon) {
                // Lấy ảnh Pokémon.
                const image = pokemon.image || "./Image/logo.png";
                // Lấy các hệ.
                const types = getTypeNames(pokemon);
                // Tạo badge hệ.
                const typeHTML = types.map( function (type) {
                            return ` <span class="collection-card-type
                                        type-${type}">
                                    ${capitalize(type)}
                                </span> `; }).join("");
                // Tạo card.
                return ` <article class="collection-pokemon-card"
                            data-id="${pokemon.id}">

                        <span class="collection-card-id">
                            #${String(pokemon.id).padStart(3, "0")}
                        </span>

                        <div class="collection-card-image-box">
                            <img src="${image}" alt="${capitalize(pokemon.name)}">
                        </div>

                        <h3> ${capitalize(pokemon.name)} </h3>

                        <div class="collection-card-types">
                            ${typeHTML}
                        </div>
                    </article> `; }).join("");
    // Đưa card lên trang.
    pokemonList.innerHTML = html;
    // Gắn click cho card.
    addPokemonCardEvents();
}

// CLICK CARD → DETAIL
function addPokemonCardEvents() {
    const cards = document.querySelectorAll(".collection-pokemon-card");
    cards.forEach( function (card) {
            card.addEventListener("click", function () {
                    // Chuyển sang trang Detail.
                    window.location.href = `detail.html?id=${card.dataset.id}`;
                }
            );
        }
    );
}

// LỌC POKÉMON
function applyFilters() {
    // Bắt đầu với toàn bộ Collection.
    let result = [...collectionData];
        // LỌC THEO HỆ
    if (selectedType !== "all") {
        result = result.filter( function (pokemon) {
                    const types = getTypeNames(pokemon);
                    return types.includes(selectedType);
                }
            );
    }

    // LỌC THEO TÌM KIẾM
    if (searchKeyword !== "") {
        result = result.filter( function (pokemon) {
                    // Tên Pokémon.
                    const name = String(pokemon.name || "").toLowerCase();
                    // ID Pokémon.
                    const id = String(pokemon.id || "");
                    // Tìm theo tên hoặc ID.
                    return (name.includes(searchKeyword) ||
                        id.includes(searchKeyword));
                }
            );
    }
    // Lưu kết quả.
    filteredPokemon = result;
    // Cập nhật số lượng.
    totalPokemon = filteredPokemon.length;

    // TÍNH SỐ TRANG
    const totalPages = Math.ceil(totalPokemon / pokemonPerPage);
    // Nếu trang hiện tại vượt quá số trang.
    if (totalPages > 0 && currentPage > totalPages) {
        currentPage = totalPages;
    }
    // Không có kết quả.
    if (totalPages === 0) {
        currentPage = 1;
    }
    // Hiển thị lại trang.
    renderCurrentPage();
}

// HIỂN THỊ TRANG HIỆN TẠI
function renderCurrentPage() {
    // Vị trí bắt đầu.
    const start = (currentPage - 1) * pokemonPerPage;
    // Vị trí kết thúc.
    const end = start + pokemonPerPage;
    // Lấy Pokémon của trang hiện tại.
    const currentPokemon = filteredPokemon.slice(start, end);
    // Hiển thị card.
    renderPokemonList(currentPokemon);
    // Cập nhật tiêu đề + số lượng.
    updateCollectionInfo();
    // Cập nhật phân trang.
    updatePagination();
}

// PHÂN TRANG
function updatePagination() {
    const totalPages = Math.ceil(totalPokemon / pokemonPerPage);
    // Không có dữ liệu.
    if (totalPages === 0) {
        collectionPagination.hidden = true;
        return;
    }
    // Hiện phân trang.
    collectionPagination.hidden = false;
    // Hiển thị số trang.
    pageInfo.textContent = `Trang ${currentPage} / ${totalPages}`;
    // Khóa nút Previous ở trang đầu.
    prevPage.disabled = currentPage === 1;
    // Khóa nút Next ở trang cuối.
    nextPage.disabled = currentPage === totalPages;
}

// TÌM KIẾM POKÉMON
function searchPokemon() {
    // Lấy nội dung ô tìm kiếm.
    searchKeyword = searchInput.value.trim().toLowerCase();
    // Về trang đầu.
    currentPage = 1;
    // Lọc lại danh sách.
    applyFilters();
}

// EVENT SEARCH
// Click nút tìm kiếm.
if (searchBtn) {
    searchBtn.addEventListener( "click", searchPokemon );
}

// Nhấn Enter để tìm kiếm.
if (searchInput) {
    searchInput.addEventListener( "keydown", function (event) {
            if (event.key === "Enter") {
                searchPokemon();
            }
        }
    );
}

// PHÂN TRANG EVENT
// Nút Previous.
if (prevPage) {
    prevPage.addEventListener( "click", function () {
            // Không cho lùi khi đang ở trang 1.
            if (currentPage <= 1) {
                return;
            }
            currentPage--;
            renderCurrentPage();
        }
    );
}

// Nút Next.
if (nextPage) {
    nextPage.addEventListener( "click", function () {
            const totalPages = Math.ceil(totalPokemon / pokemonPerPage);
            // Không cho sang trang tiếp theo nếu đang ở cuối.
            if (currentPage >= totalPages) {
                return;
            }
            currentPage++;
            renderCurrentPage();
        }
    );
}

// KHỞI ĐỘNG COLLECTION
function initCollection() {
    // Đọc Collection từ localStorage.
    collectionData = loadCollectionData();
    // Sao chép dữ liệu ban đầu.
    filteredPokemon = [...collectionData];
    // Cập nhật số lượng ban đầu.
    totalPokemon = collectionData.length;
    // Tạo các nút hệ.
    renderTypeFilters();
    // Hiển thị trang đầu.
    renderCurrentPage();
}

// Chạy trang Collection.
initCollection();