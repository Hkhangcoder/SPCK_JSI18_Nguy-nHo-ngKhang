// ======================================================
// FAVORITE.JS
// TRANG POKÉMON YÊU THÍCH
// ======================================================



// ======================================================
// LẤY PHẦN TỬ HTML
// ======================================================

// Khung chứa danh sách Pokémon yêu thích.
const favoriteList =
    document.querySelector("#favoriteList");

// Tiêu đề danh sách.
const favoriteTitle =
    document.querySelector("#favoriteTitle");

// Số lượng Pokémon.
const favoriteCount =
    document.querySelector("#favoriteCount");

// Khung chứa các nút lọc hệ.
const favoriteTypeFilters =
    document.querySelector("#favoriteTypeFilters");

// Ô tìm kiếm.
const favoriteInput =
    document.querySelector("#searchInput");

// Nút tìm kiếm.
const favoriteSearch =
    document.querySelector("#searchBtn");



// ======================================================
// BIẾN DỮ LIỆU
// ======================================================

// Toàn bộ Pokémon yêu thích lấy từ LocalStorage.
let favoriteData = [];

// Danh sách Pokémon sau khi lọc.
let filteredFavorites = [];

// Hệ Pokémon đang được chọn.
let currentFavoriteType = "all";

// Từ khóa tìm kiếm hiện tại.
let searchKeyword = "";

// Trang hiện tại.
let currentPage = 1;

// Mỗi trang hiển thị tối đa 20 Pokémon.
const pokemonPerPage = 20;



// ======================================================
// 18 HỆ POKÉMON
// ======================================================

// Danh sách các hệ Pokémon.
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

// Icon tương ứng với từng hệ Pokémon.
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
// VIẾT HOA TÊN POKÉMON
// ======================================================

// Ví dụ:
// "mr-mime" → "Mr Mime"
// "pikachu" → "Pikachu"
function capitalize(text) {

    // Nếu không có dữ liệu thì trả về chuỗi rỗng.
    if (!text) {
        return "";
    }

    // Tách tên Pokémon theo dấu "-".
    return text
        .split("-")

        // Viết hoa chữ cái đầu của từng từ.
        .map(function (word) {

            return (
                word.charAt(0).toUpperCase() +
                word.slice(1)
            );

        })

        // Ghép các từ lại với nhau.
        .join(" ");
}



// ======================================================
// LẤY TÊN CÁC HỆ POKÉMON
// ======================================================

// Hàm này hỗ trợ cả hai dạng dữ liệu:
//
// types: ["fire", "flying"]
//
// hoặc:
//
// types: [
//     { name: "fire" },
//     { name: "flying" }
// ]
function getTypeNames(pokemon) {

    // Pokémon không có thông tin hệ.
    if (!pokemon.types) {
        return [];
    }

    // Đảm bảo types phải là mảng.
    if (!Array.isArray(pokemon.types)) {
        return [];
    }

    // Lấy tên từng hệ.
    return pokemon.types.map(function (type) {

        // Nếu hệ đã là chuỗi.
        if (typeof type === "string") {
            return type;
        }

        // Nếu hệ là object.
        return type.name || "";

    });
}



// ======================================================
// LẤY FAVORITE TỪ LOCAL STORAGE
// ======================================================

// Đọc danh sách Pokémon yêu thích từ LocalStorage.
function loadFavoriteData() {

    // Lấy dữ liệu đã lưu.
    const savedFavorites =
        localStorage.getItem("pokemonFavorite");


    // Nếu chưa có dữ liệu.
    if (!savedFavorites) {
        return [];
    }


    try {

        // Chuyển chuỗi JSON thành mảng JavaScript.
        const data =
            JSON.parse(savedFavorites);


        // Kiểm tra dữ liệu có phải mảng không.
        if (Array.isArray(data)) {
            return data;
        }


        // Nếu không phải mảng.
        return [];

    } catch (error) {

        // Nếu JSON bị lỗi.
        console.error(
            "Lỗi đọc Favorite từ LocalStorage:",
            error
        );

        return [];
    }
}



// ======================================================
// SỬA DỮ LIỆU FAVORITE CŨ
// ======================================================

// Một số Pokémon cũ có thể chưa lưu types.
//
// Nếu thiếu types,
// hàm này gọi PokéAPI để lấy lại thông tin hệ.
//
// Lưu ý:
// PokéAPI chỉ được dùng để BỔ SUNG dữ liệu types.
// Favorite vẫn được lưu bằng LocalStorage.
async function repairFavoriteTypes() {

    // Tìm những Pokémon chưa có types.
    const needRepair =
        favoriteData.filter(function (pokemon) {

            return (
                !pokemon.types ||
                !Array.isArray(pokemon.types) ||
                pokemon.types.length === 0
            );

        });


    // Nếu tất cả Pokémon đều đã có types.
    if (needRepair.length === 0) {
        return;
    }


    // Lần lượt sửa từng Pokémon.
    for (const pokemon of needRepair) {

        try {

            // Gọi PokéAPI theo ID Pokémon.
            const response =
                await fetch(
                    `https://pokeapi.co/api/v2/pokemon/${pokemon.id}`
                );


            // API trả về lỗi.
            if (!response.ok) {
                continue;
            }


            // Chuyển response thành JSON.
            const data =
                await response.json();


            // Lấy tên các hệ Pokémon.
            pokemon.types =
                data.types.map(function (item) {

                    return item.type.name;

                });


        } catch (error) {

            // Nếu không lấy được dữ liệu.
            console.error(
                `Không thể cập nhật types cho ${pokemon.name}:`,
                error
            );

        }

    }


    // Lưu dữ liệu đã được bổ sung lại vào LocalStorage.
    localStorage.setItem(
        "pokemonFavorite",
        JSON.stringify(favoriteData)
    );
}



// ======================================================
// TẠO CÁC NÚT LỌC HỆ
// ======================================================

function renderFavoriteTypeButtons() {

    // Nếu HTML không có khung filter thì dừng.
    if (!favoriteTypeFilters) {
        return;
    }


    // Tạo nút "Tất cả".
    let html = `

        <button
            type="button"
            class="favorite-type-button ${
                currentFavoriteType === "all"
                    ? "active"
                    : ""
            }"
            data-type="all"
        >

            <span class="type-icon">
                🌐
            </span>

            <span>
                Tất cả
            </span>

        </button>

    `;


    // Tạo nút cho 18 hệ Pokémon.
    pokemonTypes.forEach(function (type) {

        // Kiểm tra hệ hiện tại có đang được chọn không.
        const isActive =
            currentFavoriteType === type;


        // Thêm button vào HTML.
        html += `

            <button
                type="button"
                class="favorite-type-button ${
                    isActive
                        ? "active"
                        : ""
                }"
                data-type="${type}"
            >

                <span class="type-icon">
                    ${typeIcons[type]}
                </span>

                <span>
                    ${capitalize(type)}
                </span>

            </button>

        `;

    });


    // Đưa các button vào HTML.
    favoriteTypeFilters.innerHTML = html;


    // Gắn sự kiện click cho các button.
    addFavoriteTypeEvents();
}



// ======================================================
// SỰ KIỆN CHO NÚT LỌC HỆ
// ======================================================

function addFavoriteTypeEvents() {

    // Lấy tất cả button lọc hệ.
    const buttons =
        document.querySelectorAll(
            ".favorite-type-button"
        );


    // Duyệt qua từng button.
    buttons.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                // Lấy hệ được chọn.
                currentFavoriteType =
                    button.dataset.type;


                // Quay lại trang đầu.
                currentPage = 1;


                // Cập nhật trạng thái button.
                renderFavoriteTypeButtons();


                // Lọc lại danh sách.
                applyFavoriteFilters();

            }
        );

    });
}



// ======================================================
// CẬP NHẬT TIÊU ĐỀ + SỐ LƯỢNG
// ======================================================

function updateFavoriteInfo() {

    // Cập nhật tiêu đề.
    if (favoriteTitle) {

        // Nếu đang xem tất cả.
        if (currentFavoriteType === "all") {

            favoriteTitle.textContent =
                "Tất cả Pokémon";

        } else {

            // Nếu đang xem một hệ.
            favoriteTitle.textContent =
                `Tất cả Pokémon hệ ${
                    capitalize(currentFavoriteType)
                }`;

        }

    }


    // Cập nhật số lượng Pokémon.
    if (favoriteCount) {

        favoriteCount.textContent =
            `${filteredFavorites.length} Pokémon`;

    }

}


// ======================================================
// HIỂN THỊ CARD POKÉMON
// ======================================================

function renderFavoriteList(pokemons) {

    // Nếu không có Pokémon.
    if (pokemons.length === 0) {

        // Hiển thị trạng thái rỗng.
        // Giữ nguyên class "favorite-empty"
        // để không làm ảnh hưởng CSS card hiện tại.
        favoriteList.innerHTML = `

            <div class="favorite-empty">

                <!-- Icon trái tim -->
                <i class="bi bi-heart"></i>

                <!-- Tiêu đề -->
                <h3>
                    Bạn chưa có Pokémon yêu thích
                </h3>

                <!-- Nội dung hướng dẫn -->
                <p>
                    Hãy đến Pokédex để khám phá
                    và thêm Pokémon bạn yêu thích nhé!
                </p>

                <!-- Nút chuyển sang trang Pokédex -->
                <a
                    href="./list.html"
                    class="favorite-empty-button"
                >
                    <i class="bi bi-search"></i>
                    Đến Pokédex
                </a>

            </div>

        `;

        // Không chạy phần render card.
        return;
    }



    // ==================================================
    // CÓ POKÉMON → GIỮ NGUYÊN CARD CŨ
    // ==================================================

    const html =
        pokemons.map(function (pokemon) {

            // Lấy ảnh Pokémon.
            const image =
                pokemon.image ||
                "./Image/logo.png";



            // Lấy danh sách hệ.
            const types =
                getTypeNames(pokemon);



            // Tạo HTML cho các badge hệ.
            const typeHTML =
                types.map(function (type) {

                    return `

                        <span
                            class="
                                favorite-card-type
                                type-${type}
                            "
                        >

                            ${capitalize(type)}

                        </span>

                    `;

                }).join("");



            // Trả về card Pokémon.
            return `

                <article
                    class="favorite-pokemon-card"
                    data-id="${pokemon.id}"
                >

                    <span class="favorite-card-id">

                        #${String(
                            pokemon.id
                        ).padStart(3, "0")}

                    </span>



                    <div
                        class="
                            favorite-card-image-box
                        "
                    >

                        <img
                            src="${image}"
                            alt="${capitalize(pokemon.name)}"
                            onerror="this.src='./Image/logo.png'"
                        >

                    </div>



                    <h3>

                        ${capitalize(
                            pokemon.name
                        )}

                    </h3>



                    <div
                        class="
                            favorite-card-types
                        "
                    >

                        ${typeHTML}

                    </div>

                </article>

            `;

        }).join("");



    // Hiển thị card.
    favoriteList.innerHTML = html;



    // Gắn sự kiện click cho card.
    addFavoriteCardEvents();
}



// ======================================================
// CLICK CARD → DETAIL
// ======================================================

function addFavoriteCardEvents() {

    // Lấy tất cả card Pokémon.
    const cards =
        document.querySelectorAll(
            ".favorite-pokemon-card"
        );


    // Gắn sự kiện cho từng card.
    cards.forEach(function (card) {

        card.addEventListener(
            "click",
            function () {

                // Lấy ID Pokémon.
                const pokemonId =
                    card.dataset.id;


                // Chuyển sang trang detail.
                window.location.href =
                    `detail.html?id=${pokemonId}`;

            }
        );

    });
}



// ======================================================
// LỌC FAVORITE
// ======================================================

function applyFavoriteFilters() {

    // Bắt đầu với toàn bộ Favorite.
    let result =
        [...favoriteData];


    // --------------------------------------------------
    // LỌC THEO HỆ
    // --------------------------------------------------

    if (currentFavoriteType !== "all") {

        result =
            result.filter(function (pokemon) {

                // Lấy hệ Pokémon.
                const types =
                    getTypeNames(pokemon);


                // Kiểm tra Pokémon có hệ đang chọn không.
                return types.includes(
                    currentFavoriteType
                );

            });

    }


    // --------------------------------------------------
    // LỌC THEO TỪ KHÓA
    // --------------------------------------------------

    if (searchKeyword !== "") {

        result =
            result.filter(function (pokemon) {

                // Lấy tên Pokémon.
                const name =
                    String(
                        pokemon.name || ""
                    ).toLowerCase();


                // Lấy ID Pokémon.
                const id =
                    String(
                        pokemon.id || ""
                    );


                // Tìm theo tên hoặc ID.
                return (
                    name.includes(searchKeyword) ||
                    id.includes(searchKeyword)
                );

            });

    }


    // Lưu kết quả sau khi lọc.
    filteredFavorites =
        result;


    // Tính tổng số trang.
    const totalPages =
        Math.ceil(
            filteredFavorites.length /
            pokemonPerPage
        );


    // Nếu trang hiện tại vượt quá số trang.
    if (
        totalPages > 0 &&
        currentPage > totalPages
    ) {

        currentPage =
            totalPages;

    }


    // Nếu không có kết quả.
    if (totalPages === 0) {

        currentPage = 1;

    }


    // Hiển thị lại trang hiện tại.
    renderCurrentFavoritePage();
}



// ======================================================
// HIỂN THỊ TRANG HIỆN TẠI
// ======================================================

function renderCurrentFavoritePage() {

    // Tính vị trí bắt đầu.
    const start =
        (currentPage - 1) *
        pokemonPerPage;


    // Tính vị trí kết thúc.
    const end =
        start +
        pokemonPerPage;


    // Lấy Pokémon của trang hiện tại.
    const currentFavorites =
        filteredFavorites.slice(
            start,
            end
        );


    // Hiển thị card.
    renderFavoriteList(
        currentFavorites
    );


    // Cập nhật tiêu đề và số lượng.
    updateFavoriteInfo();


    // Cập nhật phân trang.
    updateFavoritePagination();
}



// ======================================================
// TẠO KHUNG PHÂN TRANG
// ======================================================

function createFavoritePagination() {

    // Nếu đã có phân trang thì không tạo lại.
    if (
        document.querySelector(
            "#favoritePagination"
        )
    ) {
        return;
    }


    // Tạo section chứa phân trang.
    const pagination =
        document.createElement("section");


    // Gán ID.
    pagination.id =
        "favoritePagination";


    // Gán class CSS.
    pagination.className =
        "favorite-pagination";


    // Tạo HTML phân trang.
    pagination.innerHTML = `

        <button
            type="button"
            id="favoritePrevPage"
        >

            <i class="bi bi-chevron-left"></i>

            Trước

        </button>


        <span id="favoritePageInfo">
            Trang 1 / 1
        </span>


        <button
            type="button"
            id="favoriteNextPage"
        >

            Sau

            <i class="bi bi-chevron-right"></i>

        </button>

    `;


    // Đặt phân trang ngay sau danh sách Pokémon.
    favoriteList.after(pagination);


    // Gắn sự kiện cho nút phân trang.
    addFavoritePaginationEvents();
}



// ======================================================
// CẬP NHẬT PHÂN TRANG
// ======================================================

function updateFavoritePagination() {

    // Khung phân trang.
    const pagination =
        document.querySelector(
            "#favoritePagination"
        );


    // Nút trang trước.
    const prevButton =
        document.querySelector(
            "#favoritePrevPage"
        );


    // Nút trang sau.
    const nextButton =
        document.querySelector(
            "#favoriteNextPage"
        );


    // Text hiển thị số trang.
    const pageInfo =
        document.querySelector(
            "#favoritePageInfo"
        );


    // Tính tổng số trang.
    const totalPages =
        Math.ceil(
            filteredFavorites.length /
            pokemonPerPage
        );


    // Nếu chỉ có một trang hoặc không có dữ liệu.
    if (
        !pagination ||
        totalPages <= 1
    ) {

        if (pagination) {
            pagination.hidden = true;
        }

        return;
    }


    // Hiển thị phân trang.
    pagination.hidden = false;


    // Cập nhật số trang.
    pageInfo.textContent =
        `Trang ${currentPage} / ${totalPages}`;


    // Khóa nút Trước ở trang đầu.
    prevButton.disabled =
        currentPage === 1;


    // Khóa nút Sau ở trang cuối.
    nextButton.disabled =
        currentPage === totalPages;
}



// ======================================================
// SỰ KIỆN PHÂN TRANG
// ======================================================

function addFavoritePaginationEvents() {

    // Nút trang trước.
    const prevButton =
        document.querySelector(
            "#favoritePrevPage"
        );


    // Nút trang sau.
    const nextButton =
        document.querySelector(
            "#favoriteNextPage"
        );


    // Sự kiện nút Trước.
    if (prevButton) {

        prevButton.addEventListener(
            "click",
            function () {

                // Không cho lùi nếu đang ở trang đầu.
                if (currentPage <= 1) {
                    return;
                }


                // Lùi một trang.
                currentPage--;


                // Hiển thị lại.
                renderCurrentFavoritePage();

            }
        );

    }


    // Sự kiện nút Sau.
    if (nextButton) {

        nextButton.addEventListener(
            "click",
            function () {

                // Tính tổng số trang.
                const totalPages =
                    Math.ceil(
                        filteredFavorites.length /
                        pokemonPerPage
                    );


                // Không cho vượt quá trang cuối.
                if (
                    currentPage >= totalPages
                ) {
                    return;
                }


                // Sang trang tiếp theo.
                currentPage++;


                // Hiển thị lại.
                renderCurrentFavoritePage();

            }
        );

    }
}



// ======================================================
// TÌM KIẾM
// ======================================================

function searchFavorites() {

    // Lấy nội dung ô tìm kiếm.
    searchKeyword =
        favoriteInput.value
            .trim()
            .toLowerCase();


    // Quay về trang đầu.
    currentPage = 1;


    // Lọc lại danh sách.
    applyFavoriteFilters();
}



// ======================================================
// EVENT TÌM KIẾM
// ======================================================

// Khi click nút tìm kiếm.
if (favoriteSearch) {

    favoriteSearch.addEventListener(
        "click",
        searchFavorites
    );

}



// Khi nhấn Enter trong ô tìm kiếm.
if (favoriteInput) {

    favoriteInput.addEventListener(
        "keydown",
        function (event) {

            // Kiểm tra có phải Enter không.
            if (event.key === "Enter") {

                searchFavorites();

            }

        }
    );

}



// ======================================================
// KHỞI ĐỘNG FAVORITE
// ======================================================

async function initFavorite() {

    // ----------------------------------------------
    // BƯỚC 1:
    // Lấy Favorite từ LocalStorage.
    // ----------------------------------------------

    favoriteData =
        loadFavoriteData();


    // ----------------------------------------------
    // BƯỚC 2:
    // Kiểm tra Pokémon cũ có thiếu types không.
    //
    // Nếu thiếu thì lấy bổ sung từ PokéAPI.
    // ----------------------------------------------

    await repairFavoriteTypes();


    // ----------------------------------------------
    // BƯỚC 3:
    // Tạo bản sao dữ liệu ban đầu.
    // ----------------------------------------------

    filteredFavorites =
        [...favoriteData];


    // ----------------------------------------------
    // BƯỚC 4:
    // Tạo các nút lọc hệ.
    // ----------------------------------------------

    renderFavoriteTypeButtons();


    // ----------------------------------------------
    // BƯỚC 5:
    // Tạo khung phân trang.
    // ----------------------------------------------

    createFavoritePagination();


    // ----------------------------------------------
    // BƯỚC 6:
    // Lọc và hiển thị danh sách.
    // ----------------------------------------------

    applyFavoriteFilters();

}



// ======================================================
// CHẠY TRANG FAVORITE
// ======================================================

initFavorite();