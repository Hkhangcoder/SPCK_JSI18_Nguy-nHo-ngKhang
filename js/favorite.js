// ======================================================
// FAVORITE.JS
// TRANG POKÉMON YÊU THÍCH
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


// Import kiểm tra trạng thái đăng nhập.
import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


// Import hàm đọc Collection Firestore.
import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// ======================================================
// HTML ELEMENTS
// ======================================================


// Danh sách Pokémon.
const favoriteList =
    document.querySelector("#favoriteList");


// Tiêu đề.
const favoriteTitle =
    document.querySelector("#favoriteTitle");


// Số lượng.
const favoriteCount =
    document.querySelector("#favoriteCount");


// Bộ lọc type.
const favoriteTypeFilters =
    document.querySelector("#favoriteTypeFilters");


// Ô tìm kiếm.
const favoriteInput =
    document.querySelector("#searchInput");


// Nút tìm kiếm.
const favoriteSearch =
    document.querySelector("#searchBtn");


// ======================================================
// VARIABLES
// ======================================================


// User hiện tại.
let currentUser = null;


// Toàn bộ Favorite.
let favoriteData = [];


// Favorite sau khi lọc.
let filteredFavorites = [];


// Type đang chọn.
let currentFavoriteType = "all";


// Keyword.
let searchKeyword = "";


// Page hiện tại.
let currentPage = 1;


// 20 Pokémon mỗi page.
const pokemonPerPage = 20;


// ======================================================
// 18 TYPES
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
// TYPE ICONS
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
// CAPITALIZE
// ======================================================


function capitalize(text) {

    // Nếu không có text.
    if (!text) {

        return "";

    }


    // Viết hoa từng phần.
    return text
        .split("-")
        .map(function (word) {

            return (
                word.charAt(0).toUpperCase()
                + word.slice(1)
            );

        })
        .join(" ");

}


// ======================================================
// GET TYPE NAMES
// ======================================================


function getTypeNames(pokemon) {

    // Không có types.
    if (!pokemon.types) {

        return [];

    }


    // Chuyển types thành tên.
    return pokemon.types.map(function (type) {

        // Nếu type là string.
        if (typeof type === "string") {

            return type;

        }


        // Nếu type là object.
        return type.name;

    });

}


// ======================================================
// LOAD FAVORITE FROM FIRESTORE
// ======================================================


async function loadFavoriteData() {

    // Không có user.
    if (!currentUser) {

        return [];

    }


    // Trỏ tới:
    // users/{uid}/favorites
    const favoritesRef =
        collection(
            db,
            "users",
            currentUser.uid,
            "favorites"
        );


    // Lấy documents.
    const snapshot =
        await getDocs(favoritesRef);


    // Chuyển thành array.
    return snapshot.docs.map(
        function (docSnap) {

            return docSnap.data();

        }
    );

}


// ======================================================
// ĐẾM THEO TYPE
// ======================================================


function getFavoriteCountByType(type) {

    // Tất cả.
    if (type === "all") {

        return favoriteData.length;

    }


    // Lọc theo type.
    return favoriteData.filter(
        function (pokemon) {

            const types =
                getTypeNames(pokemon);

            return types.includes(type);

        }
    ).length;

}


// ======================================================
// RENDER TYPE BUTTONS
// ======================================================


function renderFavoriteTypeButtons() {

    // Không có filter.
    if (!favoriteTypeFilters) {

        return;

    }


    // Nút Tất cả.
    let html = `
        <button
            type="button"
            class="favorite-type-button
            ${currentFavoriteType === "all" ? "active" : ""}"
            data-type="all">

            <span class="type-icon">
                🌐
            </span>

            <span>
                Tất cả (${getFavoriteCountByType("all")})
            </span>

        </button>
    `;


    // Tạo 18 type.
    pokemonTypes.forEach(
        function (type) {

            // Kiểm tra active.
            const isActive =
                currentFavoriteType === type;


            // Lấy số lượng.
            const count =
                getFavoriteCountByType(type);


            // Tạo button.
            html += `
                <button
                    type="button"
                    class="favorite-type-button
                    ${isActive ? "active" : ""}"
                    data-type="${type}">

                    <span class="type-icon">
                        ${typeIcons[type]}
                    </span>

                    <span>
                        ${capitalize(type)}
                        (${count})
                    </span>

                </button>
            `;

        }
    );


    // Hiển thị.
    favoriteTypeFilters.innerHTML =
        html;


    // Gắn event.
    addFavoriteTypeEvents();

}


// ======================================================
// TYPE EVENTS
// ======================================================


function addFavoriteTypeEvents() {

    // Lấy button.
    const buttons =
        document.querySelectorAll(
            ".favorite-type-button"
        );


    // Duyệt button.
    buttons.forEach(
        function (button) {

            // Click.
            button.addEventListener(
                "click",
                function () {

                    // Lấy type.
                    currentFavoriteType =
                        button.dataset.type;


                    // Về page 1.
                    currentPage = 1;


                    // Render button.
                    renderFavoriteTypeButtons();


                    // Apply filter.
                    applyFavoriteFilters();

                }
            );

        }
    );

}


// ======================================================
// UPDATE INFO
// ======================================================


function updateFavoriteInfo() {

    // Update title.
    if (favoriteTitle) {

        // Tất cả.
        if (currentFavoriteType === "all") {

            favoriteTitle.textContent =
                "Tất cả Pokémon";

        }
        else {

            // Theo type.
            favoriteTitle.textContent =
                `Tất cả Pokémon hệ ${capitalize(currentFavoriteType)}`;

        }

    }


    // Update count.
    if (favoriteCount) {

        favoriteCount.textContent =
            `${filteredFavorites.length} Pokémon`;

    }

}


// ======================================================
// RENDER FAVORITE CARDS
// ======================================================


function renderFavoriteList(pokemons) {

    // Không có Pokémon.
    if (pokemons.length === 0) {

        favoriteList.innerHTML = `
            <div class="favorite-empty">

                <i class="bi bi-heart"></i>

                <h3>
                    Không tìm thấy Pokémon
                </h3>

                <p>
                    Không có Pokémon yêu thích phù hợp.
                </p>

            </div>
        `;

        return;

    }


    // Tạo card.
    const html =
        pokemons.map(
            function (pokemon) {

                // Lấy ảnh.
                const image =
                    pokemon.image ||
                    "./Image/logo.png";


                // Lấy types.
                const types =
                    getTypeNames(pokemon);


                // Tạo badge type.
                const typeHTML =
                    types.map(
                        function (type) {

                            return `
                                <span
                                    class="favorite-card-type
                                    type-${type}">

                                    ${capitalize(type)}

                                </span>
                            `;

                        }
                    ).join("");


                // Tạo card.
                return `
                    <article
                        class="favorite-pokemon-card"
                        data-id="${pokemon.id}">

                        <span
                            class="favorite-card-id">

                            #${String(pokemon.id).padStart(3, "0")}

                        </span>


                        <div
                            class="favorite-card-image-box">

                            <img
                                src="${image}"
                                alt="${capitalize(pokemon.name)}"
                                onerror="this.src='./Image/logo.png'">

                        </div>


                        <h3>
                            ${capitalize(pokemon.name)}
                        </h3>


                        <div
                            class="favorite-card-types">

                            ${typeHTML}

                        </div>

                    </article>
                `;

            }
        ).join("");


    // Hiển thị card.
    favoriteList.innerHTML =
        html;


    // Gắn click.
    addFavoriteCardEvents();

}


// ======================================================
// CARD CLICK
// ======================================================


function addFavoriteCardEvents() {

    // Lấy card.
    const cards =
        document.querySelectorAll(
            ".favorite-pokemon-card"
        );


    // Duyệt card.
    cards.forEach(
        function (card) {

            // Click.
            card.addEventListener(
                "click",
                function () {

                    // Lấy ID.
                    const id =
                        card.dataset.id;


                    // Chuyển Detail.
                    window.location.href =
                        `detail.html?id=${id}`;

                }
            );

        }
    );

}


// ======================================================
// FILTER FAVORITE
// ======================================================


function applyFavoriteFilters() {

    // Copy data.
    let result =
        [...favoriteData];


    // Filter type.
    if (currentFavoriteType !== "all") {

        result =
            result.filter(
                function (pokemon) {

                    const types =
                        getTypeNames(pokemon);

                    return types.includes(
                        currentFavoriteType
                    );

                }
            );

    }


    // Filter search.
    if (searchKeyword !== "") {

        result =
            result.filter(
                function (pokemon) {

                    // Tên.
                    const name =
                        String(
                            pokemon.name || ""
                        ).toLowerCase();


                    // ID.
                    const id =
                        String(
                            pokemon.id || ""
                        );


                    // Search.
                    return (
                        name.includes(searchKeyword)
                        ||
                        id.includes(searchKeyword)
                    );

                }
            );

    }


    // Lưu kết quả.
    filteredFavorites =
        result;


    // Tổng page.
    const totalPages =
        Math.ceil(
            filteredFavorites.length /
            pokemonPerPage
        );


    // Nếu vượt page.
    if (
        totalPages > 0
        &&
        currentPage > totalPages
    ) {

        currentPage =
            totalPages;

    }


    // Không có dữ liệu.
    if (totalPages === 0) {

        currentPage = 1;

    }


    // Render.
    renderCurrentFavoritePage();

}


// ======================================================
// RENDER CURRENT PAGE
// ======================================================


function renderCurrentFavoritePage() {

    // Start.
    const start =
        (currentPage - 1)
        * pokemonPerPage;


    // End.
    const end =
        start + pokemonPerPage;


    // Lấy data page hiện tại.
    const currentFavorites =
        filteredFavorites.slice(
            start,
            end
        );


    // Render card.
    renderFavoriteList(
        currentFavorites
    );


    // Update info.
    updateFavoriteInfo();


    // Update pagination.
    updateFavoritePagination();

}


// ======================================================
// CREATE PAGINATION
// ======================================================


function createFavoritePagination() {

    // Nếu đã có.
    if (
        document.querySelector(
            "#favoritePagination"
        )
    ) {

        return;

    }


    // Tạo section.
    const pagination =
        document.createElement(
            "section"
        );


    // ID.
    pagination.id =
        "favoritePagination";


    // Class.
    pagination.className =
        "favorite-pagination";


    // HTML.
    pagination.innerHTML = `
        <button
            type="button"
            id="favoritePrevPage">

            <i class="bi bi-chevron-left"></i>
            Trước

        </button>


        <span id="favoritePageInfo">
            Trang 1 / 1
        </span>


        <button
            type="button"
            id="favoriteNextPage">

            Sau
            <i class="bi bi-chevron-right"></i>

        </button>
    `;


    // Đặt sau list.
    favoriteList.after(
        pagination
    );


    // Gắn event.
    addFavoritePaginationEvents();

}


// ======================================================
// UPDATE PAGINATION
// ======================================================


function updateFavoritePagination() {

    // Lấy pagination.
    const pagination =
        document.querySelector(
            "#favoritePagination"
        );


    // Previous.
    const prevButton =
        document.querySelector(
            "#favoritePrevPage"
        );


    // Next.
    const nextButton =
        document.querySelector(
            "#favoriteNextPage"
        );


    // Page info.
    const pageInfo =
        document.querySelector(
            "#favoritePageInfo"
        );


    // Tổng page.
    const totalPages =
        Math.ceil(
            filteredFavorites.length /
            pokemonPerPage
        );


    // Không cần pagination.
    if (
        !pagination
        ||
        totalPages <= 1
    ) {

        if (pagination) {

            pagination.hidden =
                true;

        }

        return;

    }


    // Hiện pagination.
    pagination.hidden =
        false;


    // Hiển thị page.
    pageInfo.textContent =
        `Trang ${currentPage} / ${totalPages}`;


    // Disable Previous.
    prevButton.disabled =
        currentPage === 1;


    // Disable Next.
    nextButton.disabled =
        currentPage === totalPages;

}


// ======================================================
// PAGINATION EVENTS
// ======================================================


function addFavoritePaginationEvents() {

    // Previous.
    const prevButton =
        document.querySelector(
            "#favoritePrevPage"
        );


    // Next.
    const nextButton =
        document.querySelector(
            "#favoriteNextPage"
        );


    // Previous event.
    if (prevButton) {

        prevButton.addEventListener(
            "click",
            function () {

                // Không lùi được.
                if (currentPage <= 1) {

                    return;

                }


                // Lùi page.
                currentPage--;


                // Render.
                renderCurrentFavoritePage();

            }
        );

    }


    // Next event.
    if (nextButton) {

        nextButton.addEventListener(
            "click",
            function () {

                // Tổng page.
                const totalPages =
                    Math.ceil(
                        filteredFavorites.length /
                        pokemonPerPage
                    );


                // Không tiến được.
                if (
                    currentPage >= totalPages
                ) {

                    return;

                }


                // Sang page.
                currentPage++;


                // Render.
                renderCurrentFavoritePage();

            }
        );

    }

}


// ======================================================
// SEARCH
// ======================================================


function searchFavorites() {

    // Lấy keyword.
    searchKeyword =
        favoriteInput.value
            .trim()
            .toLowerCase();


    // Về page đầu.
    currentPage = 1;


    // Apply filter.
    applyFavoriteFilters();

}


// ======================================================
// SEARCH EVENTS
// ======================================================


// Click search.
if (favoriteSearch) {

    favoriteSearch.addEventListener(
        "click",
        searchFavorites
    );

}


// Enter.
if (favoriteInput) {

    favoriteInput.addEventListener(
        "keydown",
        function (event) {

            // Kiểm tra Enter.
            if (event.key === "Enter") {

                searchFavorites();

            }

        }
    );

}


// ======================================================
// INIT FAVORITE
// ======================================================


async function initFavorite() {

    try {

        // Lấy Favorite từ Firestore.
        favoriteData =
            await loadFavoriteData();


        // Copy data.
        filteredFavorites =
            [...favoriteData];


        // Render type.
        renderFavoriteTypeButtons();


        // Tạo pagination.
        createFavoritePagination();


        // Render.
        applyFavoriteFilters();

    }
    catch (error) {

        // Console error.
        console.error(
            "Lỗi tải Favorite từ Firestore:",
            error
        );

    }

}


// ======================================================
// AUTH STATE
// ======================================================


onAuthStateChanged(
    auth,
    async function (user) {

        // Nếu chưa đăng nhập.
        if (!user) {

            // Chuyển Login.
            window.location.href =
                "./login.html";

            return;

        }


        // Lưu user.
        currentUser = user;


        // Khởi động Favorite.
        await initFavorite();

    }
);