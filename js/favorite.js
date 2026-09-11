
// // ======================================================
// // FAVORITE.JS
// // TRANG POKÉMON YÊU THÍCH
// // ======================================================


// // ======================================================
// // LẤY PHẦN TỬ HTML
// // ======================================================

// // Danh sách card Pokémon.
// const favoriteList =
//     document.querySelector("#favoriteList");

// // Tiêu đề danh sách.
// const favoriteTitle =
//     document.querySelector("#favoriteTitle");

// // Số lượng Pokémon.
// const favoriteCount =
//     document.querySelector("#favoriteCount");

// // Khung các nút lọc hệ.
// const favoriteTypeFilters =
//     document.querySelector("#favoriteTypeFilters");

// // Ô tìm kiếm.
// const favoriteInput =
//     document.querySelector("#searchInput");

// // Nút tìm kiếm.
// const favoriteSearch =
//     document.querySelector("#searchBtn");


// // ======================================================
// // BIẾN DỮ LIỆU
// // ======================================================

// // Toàn bộ Pokémon yêu thích.
// let favoriteData = [];

// // Pokémon sau khi lọc.
// let filteredFavorites = [];

// // Hệ đang được chọn.
// let currentFavoriteType = "all";

// // Từ khóa tìm kiếm.
// let searchKeyword = "";

// // Trang hiện tại.
// let currentPage = 1;

// // Mỗi trang có 20 Pokémon.
// const pokemonPerPage = 20;


// // ======================================================
// // 18 HỆ POKÉMON
// // ======================================================

// const pokemonTypes = [

//     "normal",
//     "fire",
//     "water",
//     "electric",
//     "grass",
//     "ice",
//     "fighting",
//     "poison",
//     "ground",
//     "flying",
//     "psychic",
//     "bug",
//     "rock",
//     "ghost",
//     "dragon",
//     "dark",
//     "steel",
//     "fairy"
// ];


// // ======================================================
// // ICON CÁC HỆ
// // ======================================================

// const typeIcons = {

//     normal: "⚪",
//     fire: "🔥",
//     water: "💧",
//     electric: "⚡",
//     grass: "🌿",
//     ice: "❄️",
//     fighting: "🥊",
//     poison: "☠️",
//     ground: "🏜️",
//     flying: "🪽",
//     psychic: "🔮",
//     bug: "🐛",
//     rock: "🪨",
//     ghost: "👻",
//     dragon: "🐉",
//     dark: "🌙",
//     steel: "⚙️",
//     fairy: "✨"
// };


// // ======================================================
// // VIẾT HOA TÊN
// // ======================================================

// // Đổi "mr-mime" thành "Mr Mime".
// function capitalize(text) {

//     if (!text) {
//         return "";
//     }

//     return text
//         .split("-")
//         .map(function (word) {

//             return (
//                 word.charAt(0).toUpperCase() +
//                 word.slice(1)
//             );

//         })
//         .join(" ");
// }


// // ======================================================
// // LẤY TÊN HỆ
// // ======================================================

// // Lấy danh sách hệ của Pokémon.
// function getTypeNames(pokemon) {

//     // Pokémon chưa có thông tin hệ.
//     if (!pokemon.types) {
//         return [];
//     }

//     return pokemon.types.map(function (type) {

//         // Nếu hệ là chuỗi.
//         if (typeof type === "string") {
//             return type;
//         }

//         // Nếu hệ là object.
//         return type.name;
//     });
// }


// // ======================================================
// // LẤY FAVORITE TỪ LOCAL STORAGE
// // ======================================================

// // Đọc Pokémon yêu thích đã lưu.
// function loadFavoriteData() {

//     const savedFavorites =
//         localStorage.getItem("pokemonFavorite");

//     // Chưa có dữ liệu.
//     if (!savedFavorites) {
//         return [];
//     }

//     try {

//         const data =
//             JSON.parse(savedFavorites);

//         // Kiểm tra dữ liệu có phải mảng không.
//         if (Array.isArray(data)) {
//             return data;
//         }

//         return [];

//     } catch (error) {

//         console.error(
//             "Lỗi đọc Favorite:",
//             error
//         );

//         return [];
//     }
// }


// // ======================================================
// // SỬA DỮ LIỆU FAVORITE CŨ
// // ======================================================

// // Một số Pokémon cũ có thể chưa lưu types.
// // Hàm này lấy lại types từ PokéAPI.
// async function repairFavoriteTypes() {

//     // Kiểm tra Pokémon nào đang thiếu types.
//     const needRepair =
//         favoriteData.filter(function (pokemon) {

//             return (
//                 !pokemon.types ||
//                 pokemon.types.length === 0
//             );
//         });

//     // Nếu không có Pokémon nào cần sửa.
//     if (needRepair.length === 0) {
//         return;
//     }

//     // Lấy lại types cho từng Pokémon.
//     for (const pokemon of needRepair) {

//         try {

//             // Gọi PokéAPI bằng ID Pokémon.
//             const response =
//                 await fetch(
//                     `https://pokeapi.co/api/v2/pokemon/${pokemon.id}`
//                 );

//             // Nếu API lỗi thì bỏ qua Pokémon này.
//             if (!response.ok) {
//                 continue;
//             }

//             // Chuyển dữ liệu sang JSON.
//             const data =
//                 await response.json();

//             // Lưu lại tên các hệ.
//             pokemon.types =
//                 data.types.map(function (item) {

//                     return item.type.name;
//                 });

//         } catch (error) {

//             // Nếu không lấy được dữ liệu thì ghi lỗi.
//             console.error(
//                 `Không thể cập nhật types cho ${pokemon.name}:`,
//                 error
//             );
//         }
//     }

//     // Lưu dữ liệu mới vào localStorage.
//     localStorage.setItem(
//         "pokemonFavorite",
//         JSON.stringify(favoriteData)
//     );
// }


// // ======================================================
// // TẠO CÁC NÚT LỌC HỆ
// // ======================================================

// function renderFavoriteTypeButtons() {

//     // Không có khung filter.
//     if (!favoriteTypeFilters) {
//         return;
//     }

//     // Nút Tất cả.
//     let html = `

//         <button
//             type="button"
//             class="favorite-type-button
//             ${currentFavoriteType === "all" ? "active" : ""}"
//             data-type="all"
//         >

//             <span class="type-icon">
//                 🌐
//             </span>

//             <span>
//                 Tất cả
//             </span>

//         </button>

//     `;

//     // Tạo 18 nút hệ.
//     pokemonTypes.forEach(function (type) {

//         // Kiểm tra nút có đang được chọn không.
//         const isActive =
//             currentFavoriteType === type;

//         html += `

//             <button
//                 type="button"
//                 class="favorite-type-button
//                 ${isActive ? "active" : ""}"
//                 data-type="${type}"
//             >

//                 <span class="type-icon">
//                     ${typeIcons[type]}
//                 </span>

//                 <span>
//                     ${capitalize(type)}
//                 </span>

//             </button>

//         `;
//     });

//     // Hiển thị các nút.
//     favoriteTypeFilters.innerHTML = html;

//     // Gắn sự kiện click.
//     addFavoriteTypeEvents();
// }


// // ======================================================
// // SỰ KIỆN CHO NÚT LỌC HỆ
// // ======================================================

// function addFavoriteTypeEvents() {

//     // Lấy tất cả nút hệ.
//     const buttons =
//         document.querySelectorAll(
//             ".favorite-type-button"
//         );

//     // Gắn sự kiện cho từng nút.
//     buttons.forEach(function (button) {

//         button.addEventListener(
//             "click",
//             function () {

//                 // Lấy hệ được chọn.
//                 currentFavoriteType =
//                     button.dataset.type;

//                 // Quay về trang đầu.
//                 currentPage = 1;

//                 // Cập nhật nút đang chọn.
//                 renderFavoriteTypeButtons();

//                 // Lọc lại danh sách.
//                 applyFavoriteFilters();
//             }
//         );
//     });
// }


// // ======================================================
// // CẬP NHẬT TIÊU ĐỀ + SỐ LƯỢNG
// // ======================================================

// function updateFavoriteInfo() {

//     // Cập nhật tiêu đề.
//     if (favoriteTitle) {

//         // Đang xem tất cả.
//         if (currentFavoriteType === "all") {

//             favoriteTitle.textContent =
//                 "Tất cả Pokémon";

//         } else {

//             // Đang xem một hệ cụ thể.
//             favoriteTitle.textContent =
//                 `Tất cả Pokémon hệ ${capitalize(currentFavoriteType)}`;
//         }
//     }

//     // Cập nhật số lượng sau khi lọc.
//     if (favoriteCount) {

//         favoriteCount.textContent =
//             `${filteredFavorites.length} Pokémon`;
//     }
// }


// // ======================================================
// // HIỂN THỊ CARD
// // ======================================================

// function renderFavoriteList(pokemons) {

//     // Không có Pokémon.
//     if (pokemons.length === 0) {

//         // Xóa card cũ.
//         favoriteList.innerHTML = `

//             <div class="favorite-empty">

//                 <i class="bi bi-heart"></i>

//                 <h3>
//                     Không tìm thấy Pokémon
//                 </h3>

//                 <p>
//                     Không có Pokémon yêu thích phù hợp.
//                 </p>

//             </div>

//         `;

//         return;
//     }

//     // Tạo card.
//     const html =
//         pokemons.map(function (pokemon) {

//             // Lấy ảnh.
//             const image =
//                 pokemon.image ||
//                 "./Image/logo.png";

//             // Lấy hệ.
//             const types =
//                 getTypeNames(pokemon);

//             // Tạo badge hệ.
//             const typeHTML =
//                 types.map(function (type) {

//                     return `

//                         <span
//                             class="
//                             favorite-card-type
//                             type-${type}
//                             "
//                         >

//                             ${capitalize(type)}

//                         </span>

//                     `;

//                 }).join("");

//             // Tạo card Pokémon.
//             return `

//                 <article
//                     class="favorite-pokemon-card"
//                     data-id="${pokemon.id}"
//                 >

//                     <span class="favorite-card-id">

//                         #${String(
//                             pokemon.id
//                         ).padStart(3, "0")}

//                     </span>

//                     <div
//                         class="
//                         favorite-card-image-box
//                         "
//                     >

//                         <img
//                             src="${image}"
//                             alt="${capitalize(pokemon.name)}"
//                             onerror="this.src='./Image/logo.png'"
//                         >

//                     </div>

//                     <h3>

//                         ${capitalize(
//                             pokemon.name
//                         )}

//                     </h3>

//                     <div
//                         class="
//                         favorite-card-types
//                         "
//                     >

//                         ${typeHTML}

//                     </div>

//                 </article>

//             `;

//         }).join("");

//     // Hiển thị card.
//     favoriteList.innerHTML = html;

//     // Gắn click.
//     addFavoriteCardEvents();
// }


// // ======================================================
// // CLICK CARD → DETAIL
// // ======================================================

// function addFavoriteCardEvents() {

//     // Lấy tất cả card.
//     const cards =
//         document.querySelectorAll(
//             ".favorite-pokemon-card"
//         );

//     // Gắn sự kiện click.
//     cards.forEach(function (card) {

//         card.addEventListener(
//             "click",
//             function () {

//                 // Chuyển sang trang Detail.
//                 window.location.href =
//                     `detail.html?id=${card.dataset.id}`;
//             }
//         );
//     });
// }


// // ======================================================
// // LỌC FAVORITE
// // ======================================================

// function applyFavoriteFilters() {

//     // Bắt đầu với toàn bộ Favorite.
//     let result =
//         [...favoriteData];


//     // ------------------------------
//     // LỌC THEO HỆ
//     // ------------------------------

//     if (currentFavoriteType !== "all") {

//         result =
//             result.filter(function (pokemon) {

//                 const types =
//                     getTypeNames(pokemon);

//                 return types.includes(
//                     currentFavoriteType
//                 );
//             });
//     }


//     // ------------------------------
//     // LỌC THEO TÌM KIẾM
//     // ------------------------------

//     if (searchKeyword !== "") {

//         result =
//             result.filter(function (pokemon) {

//                 // Tên Pokémon.
//                 const name =
//                     String(
//                         pokemon.name || ""
//                     ).toLowerCase();

//                 // ID Pokémon.
//                 const id =
//                     String(
//                         pokemon.id || ""
//                     );

//                 // Tìm theo tên hoặc ID.
//                 return (
//                     name.includes(searchKeyword) ||
//                     id.includes(searchKeyword)
//                 );
//             });
//     }


//     // Lưu kết quả.
//     filteredFavorites =
//         result;


//     // Về trang đầu sau khi lọc.
//     const totalPages =
//         Math.ceil(
//             filteredFavorites.length /
//             pokemonPerPage
//         );

//     // Nếu trang hiện tại vượt quá số trang.
//     if (
//         totalPages > 0 &&
//         currentPage > totalPages
//     ) {

//         currentPage =
//             totalPages;
//     }

//     // Không có kết quả.
//     if (totalPages === 0) {

//         currentPage = 1;
//     }


//     // Hiển thị lại danh sách.
//     renderCurrentFavoritePage();
// }


// // ======================================================
// // HIỂN THỊ TRANG HIỆN TẠI
// // ======================================================

// function renderCurrentFavoritePage() {

//     // Vị trí bắt đầu.
//     const start =
//         (currentPage - 1) *
//         pokemonPerPage;

//     // Vị trí kết thúc.
//     const end =
//         start +
//         pokemonPerPage;

//     // Lấy Pokémon của trang hiện tại.
//     const currentFavorites =
//         filteredFavorites.slice(
//             start,
//             end
//         );

//     // Hiển thị card.
//     renderFavoriteList(
//         currentFavorites
//     );

//     // Cập nhật tiêu đề + số lượng.
//     updateFavoriteInfo();

//     // Cập nhật phân trang.
//     updateFavoritePagination();
// }


// // ======================================================
// // TẠO KHUNG PHÂN TRANG
// // ======================================================

// function createFavoritePagination() {

//     // Nếu đã có phân trang thì không tạo lại.
//     if (
//         document.querySelector(
//             "#favoritePagination"
//         )
//     ) {
//         return;
//     }

//     // Tạo khung phân trang.
//     const pagination =
//         document.createElement("section");

//     // Gắn ID + class.
//     pagination.id =
//         "favoritePagination";

//     pagination.className =
//         "favorite-pagination";

//     // Tạo nội dung phân trang.
//     pagination.innerHTML = `

//         <button
//             type="button"
//             id="favoritePrevPage"
//         >
//             <i class="bi bi-chevron-left"></i>
//             Trước
//         </button>

//         <span id="favoritePageInfo">
//             Trang 1 / 1
//         </span>

//         <button
//             type="button"
//             id="favoriteNextPage"
//         >
//             Sau
//             <i class="bi bi-chevron-right"></i>
//         </button>

//     `;

//     // Đặt phân trang sau danh sách card.
//     favoriteList.after(pagination);

//     // Gắn sự kiện cho nút.
//     addFavoritePaginationEvents();
// }


// // ======================================================
// // CẬP NHẬT PHÂN TRANG
// // ======================================================

// function updateFavoritePagination() {

//     // Lấy khung phân trang.
//     const pagination =
//         document.querySelector(
//             "#favoritePagination"
//         );

//     // Lấy nút trước.
//     const prevButton =
//         document.querySelector(
//             "#favoritePrevPage"
//         );

//     // Lấy nút sau.
//     const nextButton =
//         document.querySelector(
//             "#favoriteNextPage"
//         );

//     // Lấy thông tin trang.
//     const pageInfo =
//         document.querySelector(
//             "#favoritePageInfo"
//         );

//     // Tính tổng số trang.
//     const totalPages =
//         Math.ceil(
//             filteredFavorites.length /
//             pokemonPerPage
//         );

//     // Không có kết quả.
//     if (
//         !pagination ||
//         totalPages <= 1
//     ) {

//         if (pagination) {
//             pagination.hidden = true;
//         }

//         return;
//     }

//     // Hiện phân trang.
//     pagination.hidden = false;

//     // Hiển thị số trang.
//     pageInfo.textContent =
//         `Trang ${currentPage} / ${totalPages}`;

//     // Khóa nút trước ở trang đầu.
//     prevButton.disabled =
//         currentPage === 1;

//     // Khóa nút sau ở trang cuối.
//     nextButton.disabled =
//         currentPage === totalPages;
// }


// // ======================================================
// // EVENT PHÂN TRANG
// // ======================================================

// function addFavoritePaginationEvents() {

//     // Nút trang trước.
//     const prevButton =
//         document.querySelector(
//             "#favoritePrevPage"
//         );

//     // Nút trang sau.
//     const nextButton =
//         document.querySelector(
//             "#favoriteNextPage"
//         );

//     // Click Previous.
//     if (prevButton) {

//         prevButton.addEventListener(
//             "click",
//             function () {

//                 // Không cho lùi ở trang 1.
//                 if (currentPage <= 1) {
//                     return;
//                 }

//                 // Lùi trang.
//                 currentPage--;

//                 // Hiển thị lại.
//                 renderCurrentFavoritePage();
//             }
//         );
//     }

//     // Click Next.
//     if (nextButton) {

//         nextButton.addEventListener(
//             "click",
//             function () {

//                 // Tính tổng số trang.
//                 const totalPages =
//                     Math.ceil(
//                         filteredFavorites.length /
//                         pokemonPerPage
//                     );

//                 // Không cho vượt quá trang cuối.
//                 if (
//                     currentPage >= totalPages
//                 ) {
//                     return;
//                 }

//                 // Sang trang tiếp theo.
//                 currentPage++;

//                 // Hiển thị lại.
//                 renderCurrentFavoritePage();
//             }
//         );
//     }
// }


// // ======================================================
// // TÌM KIẾM
// // ======================================================

// function searchFavorites() {

//     // Lấy từ khóa.
//     searchKeyword =
//         favoriteInput.value
//         .trim()
//         .toLowerCase();

//     // Về trang đầu.
//     currentPage = 1;

//     // Lọc lại.
//     applyFavoriteFilters();
// }


// // ======================================================
// // EVENT TÌM KIẾM
// // ======================================================

// // Click nút tìm kiếm.
// if (favoriteSearch) {

//     favoriteSearch.addEventListener(
//         "click",
//         searchFavorites
//     );
// }


// // Nhấn Enter để tìm kiếm.
// if (favoriteInput) {

//     favoriteInput.addEventListener(
//         "keydown",
//         function (event) {

//             if (event.key === "Enter") {

//                 searchFavorites();
//             }
//         }
//     );
// }


// // ======================================================
// // KHỞI ĐỘNG FAVORITE
// // ======================================================

// async function initFavorite() {

//     // Đọc Favorite từ localStorage.
//     favoriteData =
//         loadFavoriteData();

//     // Sửa dữ liệu cũ nếu thiếu types.
//     await repairFavoriteTypes();

//     // Sao chép dữ liệu ban đầu.
//     filteredFavorites =
//         [...favoriteData];

//     // Tạo các nút hệ.
//     renderFavoriteTypeButtons();

//     // Tạo phân trang.
//     createFavoritePagination();

//     // Hiển thị danh sách.
//     applyFavoriteFilters();
// }


// // Chạy trang Favorite.
// initFavorite();








// ============================
// FIREBASE
// ============================

import {
    collection,
    getDocs,
    setDoc,
    doc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import { auth } from "./firebase-config.js";
import { db } from "./firestore.js";


// ============================
// DOM
// ============================

const pokemonList =
    document.querySelector("#collectionList");

const emptyState =
    document.querySelector("#collectionEmptyState");

const emptyTitle =
    document.querySelector("#collectionEmptyTitle");

const emptyText =
    document.querySelector("#collectionEmptyText");

const searchInput =
    document.querySelector("#searchInput");

const searchBtn =
    document.querySelector("#searchBtn");

const typeFilters =
    document.querySelector("#collectionTypeFilters");

const collectionTitle =
    document.querySelector("#collectionTitle");

const pokemonCount =
    document.querySelector("#collectionCount");

const collectionPagination =
    document.querySelector("#collectionPagination");

const prevPage =
    document.querySelector("#collectionPrevPage");

const nextPage =
    document.querySelector("#collectionNextPage");

const pageInfo =
    document.querySelector("#collectionPageInfo");


// ============================
// STATE
// ============================

let collectionData = [];

let filteredPokemon = [];

let selectedType = "all";

let searchKeyword = "";

let currentPage = 1;

const pokemonPerPage = 20;

let totalPokemon = 0;


// ============================
// TYPES
// ============================

const pokemonTypes = [

    {
        name: "normal",
        icon: "⚪"
    },

    {
        name: "fire",
        icon: "🔥"
    },

    {
        name: "water",
        icon: "💧"
    },

    {
        name: "electric",
        icon: "⚡"
    },

    {
        name: "grass",
        icon: "🌿"
    },

    {
        name: "ice",
        icon: "❄️"
    },

    {
        name: "fighting",
        icon: "🥊"
    },

    {
        name: "poison",
        icon: "☠️"
    },

    {
        name: "ground",
        icon: "🌍"
    },

    {
        name: "flying",
        icon: "🪽"
    },

    {
        name: "psychic",
        icon: "🔮"
    },

    {
        name: "bug",
        icon: "🐛"
    },

    {
        name: "rock",
        icon: "🪨"
    },

    {
        name: "ghost",
        icon: "👻"
    },

    {
        name: "dragon",
        icon: "🐉"
    },

    {
        name: "dark",
        icon: "🌑"
    },

    {
        name: "steel",
        icon: "⚙️"
    },

    {
        name: "fairy",
        icon: "🧚"
    }
];


// ============================
// FIREBASE USER
// ============================

function getCurrentUser() {

    return new Promise(function (resolve) {

        if (auth.currentUser) {

            resolve(auth.currentUser);

            return;
        }


        const unsubscribe =
            onAuthStateChanged(
                auth,
                function (user) {

                    unsubscribe();

                    resolve(user);
                }
            );
    });
}


// ============================
// HELPER
// ============================

function capitalize(text) {

    if (!text) {
        return "";
    }

    return text.charAt(0).toUpperCase()
        + text.slice(1);
}


function getTypeNames(types) {

    if (!types) {
        return [];
    }


    if (Array.isArray(types)) {

        return types.map(function (item) {

            if (typeof item === "string") {
                return item;
            }

            if (
                item &&
                item.type &&
                item.type.name
            ) {
                return item.type.name;
            }

            return "";
        }).filter(Boolean);
    }


    return [];
}


// ============================
// LOCAL STORAGE
// ============================

function loadCollectionData() {

    try {

        return JSON.parse(
            localStorage.getItem(
                "pokemonCollection"
            )
        ) || [];

    } catch (error) {

        console.error(
            "Không thể đọc Collection:",
            error
        );

        return [];
    }
}


// ============================
// FIREBASE COLLECTION
// ============================

async function loadCollectionFromFirebase() {

    const localData =
        loadCollectionData();


    try {

        const user =
            await getCurrentUser();


        // Chưa đăng nhập -> dùng localStorage
        if (!user) {
            return localData;
        }


        const collectionRef =
            collection(
                db,
                "users",
                user.uid,
                "collection"
            );


        const snapshot =
            await getDocs(collectionRef);


        const firebaseData =
            snapshot.docs.map(
                function (item) {
                    return item.data();
                }
            );


        // =================================
        // FIREBASE CHƯA CÓ DỮ LIỆU
        // -> chuyển dữ liệu cũ lên Firebase
        // =================================

        if (
            firebaseData.length === 0 &&
            localData.length > 0
        ) {

            for (
                const pokemon
                of localData
            ) {

                await setDoc(
                    doc(
                        db,
                        "users",
                        user.uid,
                        "collection",
                        String(pokemon.id)
                    ),
                    {
                        ...pokemon,
                        updatedAt:
                            serverTimestamp()
                    }
                );
            }


            return localData;
        }


        // =================================
        // FIREBASE ĐÃ CÓ DỮ LIỆU
        // =================================

        if (firebaseData.length > 0) {

            localStorage.setItem(
                "pokemonCollection",
                JSON.stringify(firebaseData)
            );


            return firebaseData;
        }


        return localData;

    } catch (error) {

        console.error(
            "Không thể tải Collection từ Firebase:",
            error
        );


        // Firebase lỗi -> quay về localStorage
        return localData;
    }
}


// ============================
// ĐẾM THEO TYPE
// ============================

function getPokemonCountByType(type) {

    return collectionData.filter(
        function (pokemon) {

            const types =
                getTypeNames(
                    pokemon.types
                );

            return types.includes(type);
        }
    ).length;
}


// ============================
// TYPE FILTER
// ============================

function renderTypeFilters() {

    if (!typeFilters) {
        return;
    }


    typeFilters.innerHTML = `

        <button
            class="collection-type-filter active"
            data-type="all"
        >
            <span>🎯</span>
            <span>Tất cả</span>
            <span class="type-count">
                ${collectionData.length}
            </span>
        </button>

        ${pokemonTypes.map(function (type) {

            return `
                <button
                    class="collection-type-filter"
                    data-type="${type.name}"
                >

                    <span>
                        ${type.icon}
                    </span>

                    <span>
                        ${capitalize(type.name)}
                    </span>

                    <span class="type-count">
                        ${getPokemonCountByType(type.name)}
                    </span>

                </button>
            `;

        }).join("")}
    `;


    addTypeFilterEvents();
}


function addTypeFilterEvents() {

    const buttons =
        typeFilters.querySelectorAll(
            ".collection-type-filter"
        );


    buttons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    buttons.forEach(
                        function (item) {
                            item.classList.remove("active");
                        }
                    );


                    button.classList.add("active");


                    selectedType =
                        button.dataset.type;


                    currentPage = 1;

                    applyFilters();
                }
            );
        }
    );
}


// ============================
// INFO
// ============================

function updateCollectionInfo() {

    if (collectionTitle) {

        if (selectedType === "all") {

            collectionTitle.textContent =
                "Bộ sưu tập";

        } else {

            collectionTitle.textContent =
                `Bộ sưu tập - ${capitalize(selectedType)}`;
        }
    }


    if (pokemonCount) {

        pokemonCount.textContent =
            filteredPokemon.length;
    }
}


// ============================
// EMPTY STATE
// ============================

function updateEmptyState() {

    if (!emptyState) {
        return;
    }


    if (filteredPokemon.length === 0) {

        emptyState.style.display =
            "block";


        if (searchKeyword) {

            emptyTitle.textContent =
                "Không tìm thấy Pokémon";

            emptyText.textContent =
                `Không có Pokémon nào phù hợp với "${searchKeyword}".`;

        } else if (selectedType !== "all") {

            emptyTitle.textContent =
                "Chưa có Pokémon";

            emptyText.textContent =
                `Bạn chưa có Pokémon hệ ${capitalize(selectedType)} trong bộ sưu tập.`;

        } else {

            emptyTitle.textContent =
                "Bộ sưu tập trống";

            emptyText.textContent =
                "Hãy thêm Pokémon vào bộ sưu tập của bạn.";
        }


    } else {

        emptyState.style.display =
            "none";
    }
}


// ============================
// RENDER LIST
// ============================

function renderPokemonList(pokemonArray) {

    if (!pokemonList) {
        return;
    }


    if (
        !pokemonArray ||
        pokemonArray.length === 0
    ) {

        pokemonList.innerHTML = "";

        updateEmptyState();

        return;
    }


    emptyState.style.display =
        "none";


    pokemonList.innerHTML =
        pokemonArray.map(
            function (pokemon) {

                const image =
                    pokemon.image ||
                    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`;


                const types =
                    getTypeNames(
                        pokemon.types
                    );


                return `
                    <article
                        class="collection-pokemon-card"
                        data-id="${pokemon.id}"
                    >

                        <span class="collection-card-id">
                            #${String(pokemon.id).padStart(3, "0")}
                        </span>

                        <div class="collection-card-image-box">

                            <img
                                src="${image}"
                                alt="${capitalize(pokemon.name)}"
                                loading="lazy"
                            >

                        </div>

                        <h3>
                            ${capitalize(pokemon.name)}
                        </h3>

                        <div class="collection-card-types">

                            ${types.map(function (type) {

                                return `
                                    <span
                                        class="pokemon-type type-${type}"
                                    >
                                        ${capitalize(type)}
                                    </span>
                                `;

                            }).join("")}

                        </div>

                    </article>
                `;
            }
        ).join("");


    addPokemonCardEvents();
}


// ============================
// CARD EVENTS
// ============================

function addPokemonCardEvents() {

    const cards =
        pokemonList.querySelectorAll(
            ".collection-pokemon-card"
        );


    cards.forEach(
        function (card) {

            card.addEventListener(
                "click",
                function () {

                    const id =
                        card.dataset.id;


                    window.location.href =
                        `detail.html?id=${id}`;
                }
            );
        }
    );
}


// ============================
// FILTER
// ============================

function applyFilters() {

    filteredPokemon =
        collectionData.filter(
            function (pokemon) {

                const types =
                    getTypeNames(
                        pokemon.types
                    );


                const matchesType =
                    selectedType === "all" ||
                    types.includes(selectedType);


                const name =
                    pokemon.name
                        ? pokemon.name.toLowerCase()
                        : "";


                const id =
                    String(pokemon.id);


                const matchesSearch =
                    searchKeyword === "" ||
                    name.includes(searchKeyword) ||
                    id.includes(searchKeyword);


                return (
                    matchesType &&
                    matchesSearch
                );
            }
        );


    updateCollectionInfo();

    updateEmptyState();

    renderCurrentPage();
}


// ============================
// CURRENT PAGE
// ============================

function renderCurrentPage() {

    const startIndex =
        (currentPage - 1) *
        pokemonPerPage;


    const endIndex =
        startIndex +
        pokemonPerPage;


    const currentPokemon =
        filteredPokemon.slice(
            startIndex,
            endIndex
        );


    renderPokemonList(
        currentPokemon
    );


    updatePagination();
}


// ============================
// PAGINATION
// ============================

function updatePagination() {

    if (!collectionPagination) {
        return;
    }


    const totalPages =
        Math.ceil(
            filteredPokemon.length /
            pokemonPerPage
        );


    if (totalPages <= 1) {

        collectionPagination.style.display =
            "none";

        return;
    }


    collectionPagination.style.display =
        "flex";


    if (pageInfo) {

        pageInfo.textContent =
            `${currentPage} / ${totalPages}`;
    }


    if (prevPage) {

        prevPage.disabled =
            currentPage <= 1;
    }


    if (nextPage) {

        nextPage.disabled =
            currentPage >= totalPages;
    }
}


// ============================
// SEARCH
// ============================

function searchCollection() {

    searchKeyword =
        searchInput.value
            .trim()
            .toLowerCase();


    currentPage = 1;

    applyFilters();
}


if (searchBtn) {

    searchBtn.addEventListener(
        "click",
        searchCollection
    );
}


if (searchInput) {

    searchInput.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Enter") {

                searchCollection();
            }
        }
    );
}


// ============================
// PAGINATION EVENTS
// ============================

if (prevPage) {

    prevPage.addEventListener(
        "click",
        function () {

            if (currentPage > 1) {

                currentPage--;

                renderCurrentPage();
            }
        }
    );
}


if (nextPage) {

    nextPage.addEventListener(
        "click",
        function () {

            const totalPages =
                Math.ceil(
                    filteredPokemon.length /
                    pokemonPerPage
                );


            if (currentPage < totalPages) {

                currentPage++;

                renderCurrentPage();
            }
        }
    );
}


// ============================
// INIT
// ============================

async function initCollection() {

    collectionData =
        await loadCollectionFromFirebase();


    filteredPokemon =
        [...collectionData];


    totalPokemon =
        collectionData.length;


    renderTypeFilters();

    renderCurrentPage();
}


initCollection();