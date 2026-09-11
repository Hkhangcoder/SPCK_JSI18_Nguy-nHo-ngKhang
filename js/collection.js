// ======================================================
// COLLECTION.JS
// TRANG BỘ SƯU TẬP POKÉMON
// ======================================================


// ======================================================
// IMPORT FIREBASE
// ======================================================

// Import Firebase Authentication.
import {
    auth
} from "./firebase-config.js";


// Import Firestore Database.
import {
    db
} from "./firestore.js";


// Import sự kiện kiểm tra trạng thái đăng nhập.
import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


// Import hàm lấy Collection từ Firestore.
import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// ======================================================
// LẤY PHẦN TỬ HTML
// ======================================================


// Danh sách card Pokémon.
const pokemonList =
    document.querySelector("#collectionList");


// Khu vực empty state.
const emptyState =
    document.querySelector("#collectionEmptyState");


// Tiêu đề empty state.
const emptyTitle =
    document.querySelector("#collectionEmptyTitle");


// Nội dung empty state.
const emptyText =
    document.querySelector("#collectionEmptyText");


// Ô tìm kiếm.
const searchInput =
    document.querySelector("#searchInput");


// Nút tìm kiếm.
const searchBtn =
    document.querySelector("#searchBtn");


// Khung các nút lọc hệ.
const typeFilters =
    document.querySelector("#collectionTypeFilters");


// Tiêu đề Collection.
const collectionTitle =
    document.querySelector("#collectionTitle");


// Số lượng Pokémon.
const pokemonCount =
    document.querySelector("#collectionCount");


// Khung phân trang.
const collectionPagination =
    document.querySelector("#collectionPagination");


// Nút Previous.
const prevPage =
    document.querySelector("#collectionPrevPage");


// Nút Next.
const nextPage =
    document.querySelector("#collectionNextPage");


// Thông tin trang.
const pageInfo =
    document.querySelector("#collectionPageInfo");


// ======================================================
// BIẾN DỮ LIỆU
// ======================================================


// User Firebase hiện tại.
let currentUser = null;


// Toàn bộ Collection.
let collectionData = [];


// Collection sau khi lọc.
let filteredPokemon = [];


// Hệ đang chọn.
let selectedType = "all";


// Từ khóa tìm kiếm.
let searchKeyword = "";


// Trang hiện tại.
let currentPage = 1;


// Mỗi trang 20 Pokémon.
const pokemonPerPage = 20;


// Tổng số Pokémon sau khi lọc.
let totalPokemon = 0;


// ======================================================
// 18 HỆ POKÉMON
// ======================================================


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


// ======================================================
// ICON CÁC HỆ
// ======================================================


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


// ======================================================
// VIẾT HOA TÊN
// ======================================================


function capitalize(text) {

    // Nếu không có text thì trả về chuỗi rỗng.
    if (!text) {

        return "";

    }


    // Tách tên Pokémon bằng dấu "-".
    return text
        .split("-")
        .map(function (word) {

            // Viết hoa chữ đầu.
            return (
                word.charAt(0).toUpperCase()
                + word.slice(1)
            );

        })
        .join(" ");

}


// ======================================================
// LẤY TÊN HỆ
// ======================================================


function getTypeNames(pokemon) {

    // Pokémon chưa có types.
    if (!pokemon.types) {

        return [];

    }


    // Chuyển types thành mảng tên hệ.
    return pokemon.types.map(function (type) {

        // Nếu type đã là string.
        if (typeof type === "string") {

            return type;

        }


        // Nếu type là object.
        return type.name;

    });

}


// ======================================================
// LẤY COLLECTION TỪ FIRESTORE
// ======================================================


async function loadCollectionData() {

    // Nếu chưa đăng nhập thì không lấy dữ liệu.
    if (!currentUser) {

        return [];

    }


    // Trỏ tới:
    // users/{uid}/collection
    const collectionRef = collection(
        db,
        "users",
        currentUser.uid,
        "collection"
    );


    // Lấy toàn bộ document.
    const snapshot = await getDocs(collectionRef);


    // Chuyển Firestore documents thành mảng.
    return snapshot.docs.map(function (docSnap) {

        // Lấy data bên trong document.
        return docSnap.data();

    });

}


// ======================================================
// ĐẾM POKÉMON THEO HỆ
// ======================================================


function getPokemonCountByType(type) {

    // Nếu chọn tất cả.
    if (type === "all") {

        return collectionData.length;

    }


    // Lọc Pokémon theo hệ.
    return collectionData.filter(
        function (pokemon) {

            // Lấy types.
            const types = getTypeNames(pokemon);

            // Kiểm tra Pokémon có hệ đó không.
            return types.includes(type);

        }
    ).length;

}


// ======================================================
// TẠO NÚT LỌC HỆ
// ======================================================


function renderTypeFilters() {

    // Không có khu vực filter.
    if (!typeFilters) {

        return;

    }


    // Tạo nút Tất cả.
    let html = `
        <button
            type="button"
            class="collection-type-filter
            ${selectedType === "all" ? "active" : ""}"
            data-type="all">

            <span class="type-icon">🌐</span>

            <span>
                Tất cả (${getPokemonCountByType("all")})
            </span>

        </button>
    `;


    // Tạo 18 nút hệ.
    pokemonTypes.forEach(function (type) {

        // Kiểm tra hệ đang chọn.
        const isActive =
            selectedType === type;


        // Lấy số Pokémon của hệ.
        const count =
            getPokemonCountByType(type);


        // Tạo button.
        html += `
            <button
                type="button"
                class="collection-type-filter
                ${isActive ? "active" : ""}"
                data-type="${type}">

                <span class="type-icon">
                    ${typeIcons[type]}
                </span>

                <span>
                    ${capitalize(type)} (${count})
                </span>

            </button>
        `;

    });


    // Hiển thị button.
    typeFilters.innerHTML = html;


    // Gắn event.
    addTypeFilterEvents();

}


// ======================================================
// EVENT NÚT LỌC
// ======================================================


function addTypeFilterEvents() {

    // Lấy tất cả button.
    const buttons =
        document.querySelectorAll(
            ".collection-type-filter"
        );


    // Duyệt từng button.
    buttons.forEach(function (button) {

        // Bắt sự kiện click.
        button.addEventListener(
            "click",
            function () {

                // Lấy type.
                selectedType =
                    button.dataset.type;


                // Về trang đầu.
                currentPage = 1;


                // Render button.
                renderTypeFilters();


                // Lọc dữ liệu.
                applyFilters();

            }
        );

    });

}


// ======================================================
// CẬP NHẬT THÔNG TIN
// ======================================================


function updateCollectionInfo() {

    // Cập nhật tiêu đề.
    if (collectionTitle) {

        // Nếu xem tất cả.
        if (selectedType === "all") {

            collectionTitle.textContent =
                "Tất cả Pokémon";

        } else {

            // Nếu xem một hệ.
            collectionTitle.textContent =
                `Tất cả Pokémon hệ ${capitalize(selectedType)}`;

        }

    }


    // Cập nhật số lượng.
    if (pokemonCount) {

        pokemonCount.textContent =
            `${totalPokemon} Pokémon`;

    }

}


// ======================================================
// EMPTY STATE
// ======================================================


function updateEmptyState() {

    // Không có empty state.
    if (!emptyState) {

        return;

    }


    // Collection hoàn toàn trống.
    if (collectionData.length === 0) {

        emptyTitle.textContent =
            "Chưa có Pokémon nào";

        emptyText.textContent =
            "Bộ sưu tập của bạn hiện đang trống.";

        return;

    }


    // Không tìm thấy theo search.
    if (searchKeyword !== "") {

        emptyTitle.textContent =
            "Không tìm thấy Pokémon";

        emptyText.textContent =
            `Không có Pokémon phù hợp với "${searchKeyword}".`;

        return;

    }


    // Không có Pokémon thuộc type.
    if (selectedType !== "all") {

        emptyTitle.textContent =
            `Chưa có Pokémon hệ ${capitalize(selectedType)}`;

        emptyText.textContent =
            "Hãy khám phá thêm Pokédex nhé!";

    }

}


// ======================================================
// HIỂN THỊ CARD
// ======================================================


function renderPokemonList(pokemons) {

    // Nếu không có Pokémon.
    if (pokemons.length === 0) {

        // Xóa danh sách.
        pokemonList.innerHTML = "";


        // Hiện empty state.
        if (emptyState) {

            emptyState.hidden = false;

            updateEmptyState();

        }


        return;

    }


    // Ẩn empty state.
    if (emptyState) {

        emptyState.hidden = true;

    }


    // Tạo HTML card.
    const html = pokemons.map(
        function (pokemon) {

            // Lấy ảnh.
            const image =
                pokemon.image ||
                "./Image/logo.png";


            // Lấy types.
            const types =
                getTypeNames(pokemon);


            // Tạo badge types.
            const typeHTML =
                types.map(function (type) {

                    return `
                        <span
                            class="collection-card-type
                            type-${type}">

                            ${capitalize(type)}

                        </span>
                    `;

                }).join("");


            // Tạo card.
            return `
                <article
                    class="collection-pokemon-card"
                    data-id="${pokemon.id}">

                    <span
                        class="collection-card-id">

                        #${String(pokemon.id).padStart(3, "0")}

                    </span>


                    <div
                        class="collection-card-image-box">

                        <img
                            src="${image}"
                            alt="${capitalize(pokemon.name)}"
                            onerror="this.src='./Image/logo.png'">

                    </div>


                    <h3>
                        ${capitalize(pokemon.name)}
                    </h3>


                    <div
                        class="collection-card-types">

                        ${typeHTML}

                    </div>

                </article>
            `;

        }
    ).join("");


    // Đưa card lên trang.
    pokemonList.innerHTML = html;


    // Gắn click card.
    addPokemonCardEvents();

}


// ======================================================
// CLICK CARD
// ======================================================


function addPokemonCardEvents() {

    // Lấy tất cả card.
    const cards =
        document.querySelectorAll(
            ".collection-pokemon-card"
        );


    // Duyệt từng card.
    cards.forEach(function (card) {

        // Bắt click.
        card.addEventListener(
            "click",
            function () {

                // Lấy ID Pokémon.
                const id =
                    card.dataset.id;


                // Chuyển sang detail.
                window.location.href =
                    `detail.html?id=${id}`;

            }
        );

    });

}


// ======================================================
// LỌC COLLECTION
// ======================================================


function applyFilters() {

    // Sao chép Collection.
    let result =
        [...collectionData];


    // Lọc theo type.
    if (selectedType !== "all") {

        result = result.filter(
            function (pokemon) {

                // Lấy types.
                const types =
                    getTypeNames(pokemon);


                // Kiểm tra type.
                return types.includes(
                    selectedType
                );

            }
        );

    }


    // Lọc theo search.
    if (searchKeyword !== "") {

        result = result.filter(
            function (pokemon) {

                // Tên Pokémon.
                const name =
                    String(
                        pokemon.name || ""
                    ).toLowerCase();


                // ID Pokémon.
                const id =
                    String(
                        pokemon.id || ""
                    );


                // Search theo tên hoặc ID.
                return (
                    name.includes(searchKeyword)
                    ||
                    id.includes(searchKeyword)
                );

            }
        );

    }


    // Lưu kết quả.
    filteredPokemon = result;


    // Cập nhật số lượng.
    totalPokemon =
        filteredPokemon.length;


    // Tính tổng page.
    const totalPages =
        Math.ceil(
            totalPokemon / pokemonPerPage
        );


    // Nếu page vượt quá giới hạn.
    if (
        totalPages > 0
        &&
        currentPage > totalPages
    ) {

        currentPage = totalPages;

    }


    // Nếu không có dữ liệu.
    if (totalPages === 0) {

        currentPage = 1;

    }


    // Render page.
    renderCurrentPage();

}


// ======================================================
// RENDER PAGE
// ======================================================


function renderCurrentPage() {

    // Tính vị trí bắt đầu.
    const start =
        (currentPage - 1)
        * pokemonPerPage;


    // Tính vị trí kết thúc.
    const end =
        start + pokemonPerPage;


    // Lấy Pokémon của page.
    const currentPokemon =
        filteredPokemon.slice(
            start,
            end
        );


    // Render card.
    renderPokemonList(
        currentPokemon
    );


    // Update thông tin.
    updateCollectionInfo();


    // Update pagination.
    updatePagination();

}


// ======================================================
// PAGINATION
// ======================================================


function updatePagination() {

    // Tổng page.
    const totalPages =
        Math.ceil(
            totalPokemon /
            pokemonPerPage
        );


    // Không có page.
    if (totalPages === 0) {

        if (collectionPagination) {

            collectionPagination.hidden =
                true;

        }

        return;

    }


    // Hiện pagination.
    collectionPagination.hidden =
        false;


    // Hiển thị page.
    pageInfo.textContent =
        `Trang ${currentPage} / ${totalPages}`;


    // Disable Previous.
    prevPage.disabled =
        currentPage === 1;


    // Disable Next.
    nextPage.disabled =
        currentPage === totalPages;

}


// ======================================================
// SEARCH
// ======================================================


function searchPokemon() {

    // Lấy keyword.
    searchKeyword =
        searchInput.value
            .trim()
            .toLowerCase();


    // Về page đầu.
    currentPage = 1;


    // Apply filter.
    applyFilters();

}


// ======================================================
// SEARCH EVENTS
// ======================================================


// Click Search.
if (searchBtn) {

    searchBtn.addEventListener(
        "click",
        searchPokemon
    );

}


// Nhấn Enter.
if (searchInput) {

    searchInput.addEventListener(
        "keydown",
        function (event) {

            // Kiểm tra Enter.
            if (event.key === "Enter") {

                searchPokemon();

            }

        }
    );

}


// ======================================================
// PAGINATION EVENTS
// ======================================================


// Previous.
if (prevPage) {

    prevPage.addEventListener(
        "click",
        function () {

            // Không cho lùi quá page 1.
            if (currentPage <= 1) {

                return;

            }


            // Lùi page.
            currentPage--;


            // Render.
            renderCurrentPage();

        }
    );

}


// Next.
if (nextPage) {

    nextPage.addEventListener(
        "click",
        function () {

            // Tổng page.
            const totalPages =
                Math.ceil(
                    totalPokemon /
                    pokemonPerPage
                );


            // Không cho vượt page cuối.
            if (currentPage >= totalPages) {

                return;

            }


            // Sang page tiếp.
            currentPage++;


            // Render.
            renderCurrentPage();

        }
    );

}


// ======================================================
// KHỞI ĐỘNG COLLECTION
// ======================================================


async function initCollection() {

    try {

        // Lấy dữ liệu từ Firestore.
        collectionData =
            await loadCollectionData();


        // Sao chép dữ liệu.
        filteredPokemon =
            [...collectionData];


        // Cập nhật số lượng.
        totalPokemon =
            collectionData.length;


        // Render filter.
        renderTypeFilters();


        // Render danh sách.
        renderCurrentPage();

    }
    catch (error) {

        // In lỗi ra Console.
        console.error(
            "Lỗi tải Collection từ Firestore:",
            error
        );


        // Hiển thị thông báo.
        if (emptyState) {

            emptyState.hidden = false;

            emptyTitle.textContent =
                "Không thể tải bộ sưu tập";

            emptyText.textContent =
                "Đã xảy ra lỗi khi kết nối Firestore.";

        }

    }

}


// ======================================================
// KIỂM TRA ĐĂNG NHẬP
// ======================================================


onAuthStateChanged(
    auth,
    async function (user) {

        // Nếu chưa đăng nhập.
        if (!user) {

            // Chuyển sang Login.
            window.location.href =
                "./login.html";

            return;

        }


        // Lưu user hiện tại.
        currentUser = user;


        // Khởi động Collection.
        await initCollection();

    }
);