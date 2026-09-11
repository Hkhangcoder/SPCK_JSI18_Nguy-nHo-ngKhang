// // ======================================================
// // COLLECTION.JS
// // TRANG BỘ SƯU TẬP POKÉMON
// // ======================================================


// // ======================================================
// // FIREBASE
// // ======================================================

// // ======================================================
// // LẤY PHẦN TỬ HTML
// // ======================================================

// // Danh sách card Pokémon.
// const pokemonList = document.querySelector("#collectionList");

// // Khu vực hiển thị khi không có Pokémon.
// const emptyState = document.querySelector("#collectionEmptyState");

// // Tiêu đề trạng thái trống.
// const emptyTitle = document.querySelector("#collectionEmptyTitle");

// // Nội dung trạng thái trống.
// const emptyText = document.querySelector("#collectionEmptyText");

// // Ô tìm kiếm.
// const searchInput = document.querySelector("#searchInput");

// // Nút tìm kiếm.
// const searchBtn = document.querySelector("#searchBtn");

// // Khung các nút lọc hệ.
// const typeFilters = document.querySelector("#collectionTypeFilters");

// // Tiêu đề danh sách Pokémon.
// const collectionTitle = document.querySelector("#collectionTitle");

// // Số lượng Pokémon.
// const pokemonCount = document.querySelector("#collectionCount");

// // Khung phân trang.
// const collectionPagination = document.querySelector("#collectionPagination");

// // Nút trang trước.
// const prevPage = document.querySelector("#collectionPrevPage");

// // Nút trang sau.
// const nextPage = document.querySelector("#collectionNextPage");

// // Hiển thị số trang.
// const pageInfo = document.querySelector("#collectionPageInfo");


// // ======================================================
// // BIẾN DỮ LIỆU
// // ======================================================

// // Toàn bộ Pokémon trong Collection.
// let collectionData = [];

// // Pokémon sau khi lọc.
// let filteredPokemon = [];

// // Hệ Pokémon đang chọn.
// let selectedType = "all";

// // Từ khóa tìm kiếm.
// let searchKeyword = "";

// // Trang hiện tại.
// let currentPage = 1;

// // Mỗi trang hiển thị 20 Pokémon.
// const pokemonPerPage = 20;

// // Tổng số Pokémon sau khi lọc.
// let totalPokemon = 0;


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

// // Đổi tên Pokémon từ "pikachu" thành "Pikachu".
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
// // LẤY TÊN HỆ POKÉMON
// // ======================================================

// // Lấy danh sách hệ của Pokémon.
// function getTypeNames(pokemon) {

//     if (!pokemon.types) {
//         return [];
//     }

//     return pokemon.types.map(function (type) {

//         // Trường hợp types là chuỗi.
//         if (typeof type === "string") {
//             return type;
//         }

//         // Trường hợp types là object.
//         return type.name;
//     });
// }


// // ======================================================
// // LẤY COLLECTION TỪ LOCAL STORAGE
// // ======================================================

// // Đọc dữ liệu Collection đã lưu.
// function loadCollectionData() {

//     const savedCollection =
//         localStorage.getItem("pokemonCollection");

//     // Chưa có Collection.
//     if (!savedCollection) {
//         return [];
//     }

//     try {

//         const data =
//             JSON.parse(savedCollection);

//         // Chỉ nhận dữ liệu dạng mảng.
//         if (Array.isArray(data)) {
//             return data;
//         }

//         return [];

//     } catch (error) {

//         console.error(
//             "Lỗi đọc Collection:",
//             error
//         );

//         return [];
//     }
// }


// // ======================================================
// // ĐẾM POKÉMON THEO HỆ
// // ======================================================

// // Đếm số Pokémon thuộc một hệ.
// function getPokemonCountByType(type) {

//     // Tất cả Pokémon.
//     if (type === "all") {
//         return collectionData.length;
//     }

//     // Lọc theo hệ rồi đếm.
//     return collectionData.filter(
//         function (pokemon) {

//             const types =
//                 getTypeNames(pokemon);

//             return types.includes(type);
//         }
//     ).length;
// }


// // ======================================================
// // TẠO CÁC NÚT LỌC HỆ
// // ======================================================

// function renderTypeFilters() {

//     if (!typeFilters) {
//         return;
//     }

//     // Nút Tất cả.
//     let html = `

//         <button
//             type="button"
//             class="collection-type-filter
//             ${selectedType === "all" ? "active" : ""}"
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
//     pokemonTypes.forEach(
//         function (type) {

//             const isActive =
//                 selectedType === type;

//             html += `

//                 <button
//                     type="button"
//                     class="collection-type-filter
//                     ${isActive ? "active" : ""}"
//                     data-type="${type}"
//                 >

//                     <span class="type-icon">
//                         ${typeIcons[type]}
//                     </span>

//                     <span>
//                         ${capitalize(type)}
//                     </span>

//                 </button>

//             `;
//         }
//     );

//     // Hiển thị các nút lên trang.
//     typeFilters.innerHTML = html;

//     // Gắn sự kiện click.
//     addTypeFilterEvents();
// }


// // ======================================================
// // SỰ KIỆN CHO NÚT LỌC HỆ
// // ======================================================

// function addTypeFilterEvents() {

//     const buttons =
//         document.querySelectorAll(
//             ".collection-type-filter"
//         );

//     buttons.forEach(
//         function (button) {

//             button.addEventListener(
//                 "click",
//                 function () {

//                     // Lấy hệ được chọn.
//                     selectedType =
//                         button.dataset.type;

//                     // Về trang đầu.
//                     currentPage = 1;

//                     // Cập nhật nút đang chọn.
//                     renderTypeFilters();

//                     // Lọc lại Pokémon.
//                     applyFilters();
//                 }
//             );
//         }
//     );
// }


// // ======================================================
// // CẬP NHẬT TIÊU ĐỀ VÀ SỐ LƯỢNG
// // ======================================================

// function updateCollectionInfo() {

//     if (collectionTitle) {

//         // Khi chọn tất cả.
//         if (selectedType === "all") {

//             collectionTitle.textContent =
//                 "Tất cả Pokémon";

//         } else {

//             // Khi chọn một hệ.
//             collectionTitle.textContent =
//                 `Tất cả Pokémon hệ ${capitalize(selectedType)}`;
//         }
//     }

//     // Hiển thị số Pokémon sau khi lọc.
//     if (pokemonCount) {

//         pokemonCount.textContent =
//             `${totalPokemon} Pokémon`;
//     }
// }


// // ======================================================
// // CẬP NHẬT EMPTY STATE
// // ======================================================

// function updateEmptyState() {

//     if (!emptyState) {
//         return;
//     }

//     // Collection chưa có Pokémon.
//     if (collectionData.length === 0) {

//         emptyTitle.textContent =
//             "Chưa có Pokémon nào";

//         emptyText.textContent =
//             "Bộ sưu tập của bạn hiện đang trống.";

//         return;
//     }

//     // Không tìm thấy kết quả tìm kiếm.
//     if (searchKeyword !== "") {

//         emptyTitle.textContent =
//             "Không tìm thấy Pokémon";

//         emptyText.textContent =
//             `Không có Pokémon phù hợp với "${searchKeyword}".`;

//         return;
//     }

//     // Không có Pokémon thuộc hệ đang chọn.
//     if (selectedType !== "all") {

//         emptyTitle.textContent =
//             `Chưa có Pokémon hệ ${capitalize(selectedType)}`;

//         emptyText.textContent =
//             "Hãy khám phá thêm Pokédex nhé!";
//     }
// }


// // ======================================================
// // HIỂN THỊ CARD POKÉMON
// // ======================================================

// function renderPokemonList(pokemons) {

//     // Không có Pokémon.
//     if (pokemons.length === 0) {

//         pokemonList.innerHTML = "";

//         if (emptyState) {

//             emptyState.hidden = false;

//             updateEmptyState();
//         }

//         return;
//     }

//     // Có Pokémon thì ẩn thông báo trống.
//     if (emptyState) {
//         emptyState.hidden = true;
//     }

//     // Tạo card cho từng Pokémon.
//     const html =
//         pokemons.map(
//             function (pokemon) {

//                 // Lấy ảnh Pokémon.
//                 const image =
//                     pokemon.image ||
//                     "./Image/logo.png";

//                 // Lấy các hệ.
//                 const types =
//                     getTypeNames(pokemon);

//                 // Tạo badge hệ.
//                 const typeHTML =
//                     types.map(
//                         function (type) {

//                             return `

//                                 <span
//                                     class="
//                                     collection-card-type
//                                     type-${type}
//                                     "
//                                 >

//                                     ${capitalize(type)}

//                                 </span>

//                             `;
//                         }
//                     )
//                     .join("");

//                 // Tạo card.
//                 return `

//                     <article
//                         class="collection-pokemon-card"
//                         data-id="${pokemon.id}"
//                     >

//                         <span
//                             class="collection-card-id"
//                         >

//                             #${String(
//                                 pokemon.id
//                             ).padStart(3, "0")}

//                         </span>

//                         <div
//                             class="
//                             collection-card-image-box
//                             "
//                         >

//                             <img
//                                 src="${image}"
//                                 alt="${capitalize(
//                                     pokemon.name
//                                 )}"
//                             >

//                         </div>

//                         <h3>

//                             ${capitalize(
//                                 pokemon.name
//                             )}

//                         </h3>

//                         <div
//                             class="
//                             collection-card-types
//                             "
//                         >

//                             ${typeHTML}

//                         </div>

//                     </article>

//                 `;
//             }
//         )
//         .join("");

//     // Đưa card lên trang.
//     pokemonList.innerHTML = html;

//     // Gắn click cho card.
//     addPokemonCardEvents();
// }


// // ======================================================
// // CLICK CARD → DETAIL
// // ======================================================

// function addPokemonCardEvents() {

//     const cards =
//         document.querySelectorAll(
//             ".collection-pokemon-card"
//         );

//     cards.forEach(
//         function (card) {

//             card.addEventListener(
//                 "click",
//                 function () {

//                     // Chuyển sang trang Detail.
//                     window.location.href =
//                         `detail.html?id=${card.dataset.id}`;
//                 }
//             );
//         }
//     );
// }


// // ======================================================
// // LỌC POKÉMON
// // ======================================================

// function applyFilters() {

//     // Bắt đầu với toàn bộ Collection.
//     let result =
//         [...collectionData];


//     // ------------------------------
//     // LỌC THEO HỆ
//     // ------------------------------

//     if (selectedType !== "all") {

//         result =
//             result.filter(
//                 function (pokemon) {

//                     const types =
//                         getTypeNames(pokemon);

//                     return types.includes(
//                         selectedType
//                     );
//                 }
//             );
//     }


//     // ------------------------------
//     // LỌC THEO TÌM KIẾM
//     // ------------------------------

//     if (searchKeyword !== "") {

//         result =
//             result.filter(
//                 function (pokemon) {

//                     // Tên Pokémon.
//                     const name =
//                         String(
//                             pokemon.name || ""
//                         )
//                         .toLowerCase();

//                     // ID Pokémon.
//                     const id =
//                         String(
//                             pokemon.id || ""
//                         );

//                     // Tìm theo tên hoặc ID.
//                     return (
//                         name.includes(searchKeyword) ||
//                         id.includes(searchKeyword)
//                     );
//                 }
//             );
//     }


//     // Lưu kết quả.
//     filteredPokemon = result;

//     // Cập nhật số lượng.
//     totalPokemon =
//         filteredPokemon.length;


//     // ------------------------------
//     // TÍNH SỐ TRANG
//     // ------------------------------

//     const totalPages =
//         Math.ceil(
//             totalPokemon /
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


//     // Hiển thị lại trang.
//     renderCurrentPage();
// }


// // ======================================================
// // HIỂN THỊ TRANG HIỆN TẠI
// // ======================================================

// function renderCurrentPage() {

//     // Vị trí bắt đầu.
//     const start =
//         (currentPage - 1) *
//         pokemonPerPage;

//     // Vị trí kết thúc.
//     const end =
//         start +
//         pokemonPerPage;

//     // Lấy Pokémon của trang hiện tại.
//     const currentPokemon =
//         filteredPokemon.slice(
//             start,
//             end
//         );

//     // Hiển thị card.
//     renderPokemonList(
//         currentPokemon
//     );

//     // Cập nhật tiêu đề + số lượng.
//     updateCollectionInfo();

//     // Cập nhật phân trang.
//     updatePagination();
// }


// // ======================================================
// // PHÂN TRANG
// // ======================================================

// function updatePagination() {

//     const totalPages =
//         Math.ceil(
//             totalPokemon /
//             pokemonPerPage
//         );

//     // Không có dữ liệu.
//     if (totalPages === 0) {

//         collectionPagination.hidden =
//             true;

//         return;
//     }

//     // Hiện phân trang.
//     collectionPagination.hidden =
//         false;

//     // Hiển thị số trang.
//     pageInfo.textContent =
//         `Trang ${currentPage} / ${totalPages}`;

//     // Khóa nút Previous ở trang đầu.
//     prevPage.disabled =
//         currentPage === 1;

//     // Khóa nút Next ở trang cuối.
//     nextPage.disabled =
//         currentPage === totalPages;
// }


// // ======================================================
// // TÌM KIẾM POKÉMON
// // ======================================================

// function searchPokemon() {

//     // Lấy nội dung ô tìm kiếm.
//     searchKeyword =
//         searchInput.value
//         .trim()
//         .toLowerCase();

//     // Về trang đầu.
//     currentPage = 1;

//     // Lọc lại danh sách.
//     applyFilters();
// }


// // ======================================================
// // EVENT SEARCH
// // ======================================================

// // Click nút tìm kiếm.
// if (searchBtn) {

//     searchBtn.addEventListener(
//         "click",
//         searchPokemon
//     );
// }


// // Nhấn Enter để tìm kiếm.
// if (searchInput) {

//     searchInput.addEventListener(
//         "keydown",
//         function (event) {

//             if (event.key === "Enter") {

//                 searchPokemon();
//             }
//         }
//     );
// }


// // ======================================================
// // PHÂN TRANG EVENT
// // ======================================================

// // Nút Previous.
// if (prevPage) {

//     prevPage.addEventListener(
//         "click",
//         function () {

//             // Không cho lùi khi đang ở trang 1.
//             if (currentPage <= 1) {
//                 return;
//             }

//             currentPage--;

//             renderCurrentPage();
//         }
//     );
// }


// // Nút Next.
// if (nextPage) {

//     nextPage.addEventListener(
//         "click",
//         function () {

//             const totalPages =
//                 Math.ceil(
//                     totalPokemon /
//                     pokemonPerPage
//                 );

//             // Không cho sang trang tiếp theo nếu đang ở cuối.
//             if (currentPage >= totalPages) {
//                 return;
//             }

//             currentPage++;

//             renderCurrentPage();
//         }
//     );
// }


// // ======================================================
// // KHỞI ĐỘNG COLLECTION
// // ======================================================

// function initCollection() {

//     // Đọc Collection từ localStorage.
//     collectionData =
//         loadCollectionData();

//     // Sao chép dữ liệu ban đầu.
//     filteredPokemon =
//         [...collectionData];

//     // Cập nhật số lượng ban đầu.
//     totalPokemon =
//         collectionData.length;

//     // Tạo các nút hệ.
//     renderTypeFilters();

//     // Hiển thị trang đầu.
//     renderCurrentPage();
// }


// // Chạy trang Collection.
// initCollection();



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