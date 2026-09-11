// ======================================================
// 1. IMPORT FIREBASE
// ======================================================

// Import Firebase Auth để kiểm tra trạng thái đăng nhập.
import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Import auth từ file cấu hình Firebase.
import {
    auth
} from "./firebase-config.js";

// Import Firestore database.
import {
    db
} from "./firestore.js";

// Import các hàm cần dùng của Firestore.
import {
    doc,
    getDoc,
    setDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// ======================================================
// 2. BIẾN NGƯỜI DÙNG HIỆN TẠI
// ======================================================

// Lưu tài khoản Firebase đang đăng nhập.
let currentUser = null;


// ======================================================
// 3. API
// ======================================================

// API lấy thông tin Pokémon.
const API_URL = "https://pokeapi.co/api/v2/pokemon";

// API lấy thông tin species của Pokémon.
const SPECIES_URL = "https://pokeapi.co/api/v2/pokemon-species";


// ======================================================
// 4. DOM ELEMENT
// ======================================================

// Khu vực loading.
const loading = document.querySelector("#pokemonDetailLoading");

// Container chứa thông tin Pokémon.
const detailContainer = document.querySelector("#pokemonDetail");

// Modal Ability.
const abilityModalElement = document.querySelector("#abilityModal");

// Tiêu đề modal Ability.
const abilityModalTitle = document.querySelector("#abilityModalTitle");

// Nội dung modal Ability.
const abilityModalBody = document.querySelector("#abilityModalBody");

// Tạo Bootstrap Modal.
const abilityModal = new bootstrap.Modal(abilityModalElement);


// ======================================================
// 5. LẤY ID POKÉMON TỪ URL
// ======================================================

// Lấy tham số id trên URL.
const urlParams = new URLSearchParams(window.location.search);

// Lấy giá trị id.
const pokemonId = urlParams.get("id");


// ======================================================
// 6. HÀM VIẾT HOA CHỮ CÁI ĐẦU
// ======================================================

function capitalize(text) {
    // Nếu không có text thì trả về chuỗi rỗng.
    if (!text) {
        return "";
    }

    // Viết hoa chữ cái đầu tiên.
    return text.charAt(0).toUpperCase() + text.slice(1);
}


// ======================================================
// 7. LẤY ID TỪ URL API
// ======================================================

function getIdFromUrl(url) {
    // Tách URL thành các phần.
    const parts = url.split("/");

    // Lấy phần tử cuối cùng trước dấu / cuối.
    return parts[parts.length - 2];
}


// ======================================================
// 8. LẤY THÔNG TIN POKÉMON
// ======================================================

async function getPokemon(id) {
    // Gọi API Pokémon.
    const response = await fetch(`${API_URL}/${id}`);

    // Kiểm tra API có trả về thành công không.
    if (!response.ok) {
        throw new Error("Không thể lấy dữ liệu Pokémon.");
    }

    // Chuyển response sang JSON.
    return await response.json();
}


// ======================================================
// 9. LẤY THÔNG TIN SPECIES
// ======================================================

async function getPokemonSpecies(id) {
    // Gọi API species.
    const response = await fetch(`${SPECIES_URL}/${id}`);

    // Kiểm tra response.
    if (!response.ok) {
        throw new Error("Không thể lấy dữ liệu species.");
    }

    // Chuyển response sang JSON.
    return await response.json();
}


// ======================================================
// 10. LẤY THÔNG TIN ABILITY
// ======================================================

async function getAbility(url) {
    // Gọi API ability.
    const response = await fetch(url);

    // Kiểm tra response.
    if (!response.ok) {
        throw new Error("Không thể lấy dữ liệu ability.");
    }

    // Trả về JSON.
    return await response.json();
}


// ======================================================
// 11. LẤY GIỚI TÍNH
// ======================================================

function getGender(rate) {
    // Nếu gender rate bằng -1 thì Pokémon không có giới tính.
    if (rate === -1) {
        return "Không có giới tính";
    }

    // Tính phần trăm giới tính đực.
    const male = (8 - rate) * 12.5;

    // Tính phần trăm giới tính cái.
    const female = rate * 12.5;

    // Trả về kết quả.
    return `♂ ${male}% &nbsp;&nbsp; ♀ ${female}%`;
}


// ======================================================
// 12. MÀU CHO STAT
// ======================================================

function getStatColor(value) {
    // Nếu stat thấp.
    if (value < 50) {
        return "low";
    }

    // Nếu stat trung bình.
    if (value < 90) {
        return "medium";
    }

    // Nếu stat cao.
    return "high";
}


// ======================================================
// 13. TÊN STAT
// ======================================================

function getStatName(name) {
    // Danh sách tên stat.
    const statNames = {
        hp: "HP",
        attack: "Attack",
        defense: "Defense",
        "special-attack": "Sp. Attack",
        "special-defense": "Sp. Defense",
        speed: "Speed"
    };

    // Trả về tên tương ứng.
    return statNames[name] || capitalize(name);
}


// ======================================================
// 14. RENDER STATS
// ======================================================

function renderStats(stats) {
    // Tạo HTML cho từng stat.
    return stats.map(function(item) {

        // Lấy tên stat.
        const statName = getStatName(item.stat.name);

        // Lấy giá trị stat.
        const value = item.base_stat;

        // Tính phần trăm để tạo thanh progress.
        const percent = Math.min(value, 100);

        // Lấy class màu.
        const color = getStatColor(value);

        // Trả về HTML.
        return `
            <div class="pokemon-stat-row">
                <div class="pokemon-stat-name">
                    ${statName}
                </div>

                <div class="pokemon-stat-value">
                    ${value}
                </div>

                <div class="pokemon-stat-bar">
                    <div
                        class="pokemon-stat-fill ${color}"
                        style="width: ${percent}%"
                    ></div>
                </div>
            </div>
        `;
    }).join("");
}


// ======================================================
// 15. RENDER FORMS
// ======================================================

function renderForms(pokemon) {
    // Kiểm tra Pokémon có forms không.
    if (!pokemon.forms || pokemon.forms.length === 0) {
        return "";
    }

    // Tạo danh sách forms.
    return pokemon.forms.map(function(form) {

        // Lấy tên form.
        const formName = capitalize(
            form.name.replaceAll("-", " ")
        );

        // Lấy ID form.
        const formId = getIdFromUrl(form.url);

        // Trả về HTML.
        return `
            <div class="pokemon-form-item">
                <strong>#${String(formId).padStart(3, "0")}</strong>
                <span>${formName}</span>
            </div>
        `;
    }).join("");
}


// ======================================================
// 16. LẤY EVOLUTION CHAIN
// ======================================================

async function getEvolutionChain(url) {
    // Gọi API evolution chain.
    const response = await fetch(url);

    // Kiểm tra response.
    if (!response.ok) {
        throw new Error("Không thể lấy evolution chain.");
    }

    // Trả về JSON.
    return await response.json();
}


// ======================================================
// 17. LẤY POKÉMON TRONG EVOLUTION CHAIN
// ======================================================

async function getEvolutionPokemon(chain) {

    // Tạo mảng chứa tên Pokémon.
    const names = [];

    // Hàm đệ quy duyệt evolution chain.
    function walk(node) {

        // Nếu node không tồn tại thì dừng.
        if (!node) {
            return;
        }

        // Thêm Pokémon hiện tại.
        names.push(node.species.name);

        // Duyệt tiếp các evolution.
        node.evolves_to.forEach(function(next) {
            walk(next);
        });
    }

    // Bắt đầu từ chain đầu tiên.
    walk(chain);

    // Gọi API cho tất cả Pokémon.
    const pokemonList = await Promise.all(
        names.map(function(name) {
            return getPokemon(name);
        })
    );

    // Trả về danh sách.
    return pokemonList;
}


// ======================================================
// 18. RENDER EVOLUTION
// ======================================================

function renderEvolution(pokemonList) {

    // Nếu không có evolution.
    if (!pokemonList || pokemonList.length === 0) {
        return `
            <p class="text-muted">
                Pokémon này không có tiến hóa.
            </p>
        `;
    }

    // Tạo HTML.
    return pokemonList.map(function(pokemon) {

        // Lấy ảnh official artwork.
        const image =
            pokemon.sprites.other?.["official-artwork"]?.front_default ||
            pokemon.sprites.front_default;

        // Trả về HTML.
        return `
            <div
                class="pokemon-evolution-item"
                data-id="${pokemon.id}"
            >
                <div class="pokemon-evolution-image">
                    <img
                        src="${image}"
                        alt="${pokemon.name}"
                    >
                </div>

                <span>
                    #${String(pokemon.id).padStart(3, "0")}
                </span>

                <strong>
                    ${capitalize(pokemon.name)}
                </strong>
            </div>
        `;
    }).join("");
}


// ======================================================
// 19. MỞ MODAL ABILITY
// ======================================================

async function openAbilityModal(url, name) {

    // Hiển thị loading.
    abilityModalTitle.textContent = capitalize(name);

    // Nội dung loading.
    abilityModalBody.innerHTML = `
        <p>Đang tải thông tin Ability...</p>
    `;

    // Hiển thị modal.
    abilityModal.show();

    try {

        // Lấy dữ liệu ability.
        const ability = await getAbility(url);

        // Tìm mô tả tiếng Anh.
        const entry = ability.effect_entries.find(function(item) {
            return item.language.name === "en";
        });

        // Nếu có mô tả.
        if (entry) {

            // Hiển thị mô tả.
            abilityModalBody.innerHTML = `
                <p>
                    ${entry.effect}
                </p>
            `;

        } else {

            // Không có mô tả.
            abilityModalBody.innerHTML = `
                <p>
                    Chưa có mô tả cho Ability này.
                </p>
            `;
        }

    } catch (error) {

        // Log lỗi.
        console.error("Lỗi Ability:", error);

        // Hiển thị lỗi.
        abilityModalBody.innerHTML = `
            <p>
                Không thể tải thông tin Ability.
            </p>
        `;
    }
}


// ======================================================
// 20. THÊM POKÉMON VÀO BỘ SƯU TẬP - FIRESTORE
// ======================================================

async function addToCollection(pokemon) {

    // Kiểm tra người dùng đã đăng nhập chưa.
    if (!currentUser) {

        // Thông báo.
        alert("Vui lòng đăng nhập để sử dụng Bộ sưu tập.");

        // Chuyển sang trang login.
        window.location.href = "./login.html";

        // Dừng hàm.
        return;
    }

    try {

        // Tạo reference đến document Pokémon.
        const pokemonRef = doc(
            db,
            "users",
            currentUser.uid,
            "collection",
            String(pokemon.id)
        );

        // Kiểm tra Pokémon đã tồn tại chưa.
        const snapshot = await getDoc(pokemonRef);

        // Nếu đã tồn tại.
        if (snapshot.exists()) {

            // Thông báo.
            alert("Pokémon này đã có trong Bộ sưu tập!");

            // Dừng hàm.
            return;
        }

        // Lấy ảnh official artwork.
        const image =
            pokemon.sprites.other?.["official-artwork"]?.front_default ||
            pokemon.sprites.front_default;

        // Lấy danh sách type.
        const types = pokemon.types.map(function(item) {
            return item.type.name;
        });

        // Lưu dữ liệu vào Firestore.
        await setDoc(pokemonRef, {

            // ID Pokémon.
            id: pokemon.id,

            // Tên Pokémon.
            name: pokemon.name,

            // URL hình ảnh.
            image: image,

            // Danh sách type.
            types: types,

            // Thời gian thêm.
            createdAt: serverTimestamp()
        });

        // Thông báo thành công.
        alert("Đã thêm vào Bộ sưu tập!");

    } catch (error) {

        // In lỗi ra console.
        console.error("Lỗi thêm Bộ sưu tập:", error);

        // Thông báo lỗi.
        alert("Không thể thêm Pokémon vào Bộ sưu tập.");
    }
}


// ======================================================
// 21. THÊM POKÉMON VÀO YÊU THÍCH - FIRESTORE
// ======================================================

async function addToFavorite(pokemon) {

    // Kiểm tra đăng nhập.
    if (!currentUser) {

        // Thông báo.
        alert("Vui lòng đăng nhập để sử dụng Yêu thích.");

        // Chuyển sang login.
        window.location.href = "./login.html";

        // Dừng hàm.
        return;
    }

    try {

        // Tạo reference đến document Pokémon.
        const pokemonRef = doc(
            db,
            "users",
            currentUser.uid,
            "favorites",
            String(pokemon.id)
        );

        // Kiểm tra Pokémon đã tồn tại chưa.
        const snapshot = await getDoc(pokemonRef);

        // Nếu đã tồn tại.
        if (snapshot.exists()) {

            // Thông báo.
            alert("Pokémon này đã có trong Yêu thích!");

            // Dừng hàm.
            return;
        }

        // Lấy ảnh official artwork.
        const image =
            pokemon.sprites.other?.["official-artwork"]?.front_default ||
            pokemon.sprites.front_default;

        // Lấy type.
        const types = pokemon.types.map(function(item) {
            return item.type.name;
        });

        // Lưu vào Firestore.
        await setDoc(pokemonRef, {

            // ID Pokémon.
            id: pokemon.id,

            // Tên Pokémon.
            name: pokemon.name,

            // Hình ảnh.
            image: image,

            // Danh sách type.
            types: types,

            // Thời gian tạo.
            createdAt: serverTimestamp()
        });

        // Thông báo.
        alert("Đã thêm vào Yêu thích!");

    } catch (error) {

        // Log lỗi.
        console.error("Lỗi thêm Yêu thích:", error);

        // Thông báo lỗi.
        alert("Không thể thêm Pokémon vào Yêu thích.");
    }
}


// ======================================================
// 22. GẮN EVENT CHO DETAIL
// ======================================================

function addDetailEvents(pokemon) {

    // Lấy nút Bộ sưu tập.
    const collectionButton =
        document.querySelector("#addCollection");

    // Lấy nút Yêu thích.
    const favoriteButton =
        document.querySelector("#addFavorite");


    // ==================================================
    // EVENT BỘ SƯU TẬP
    // ==================================================

    if (collectionButton) {

        // Khi click.
        collectionButton.addEventListener(
            "click",
            function() {

                // Gọi hàm thêm collection.
                addToCollection(pokemon);
            }
        );
    }


    // ==================================================
    // EVENT YÊU THÍCH
    // ==================================================

    if (favoriteButton) {

        // Khi click.
        favoriteButton.addEventListener(
            "click",
            function() {

                // Gọi hàm thêm favorite.
                addToFavorite(pokemon);
            }
        );
    }


    // ==================================================
    // EVENT ABILITY
    // ==================================================

    const abilityButtons =
        document.querySelectorAll(".pokemon-ability-button");

    // Duyệt từng button.
    abilityButtons.forEach(function(button) {

        // Bắt sự kiện click.
        button.addEventListener(
            "click",
            function() {

                // Lấy URL ability.
                const url = button.dataset.url;

                // Lấy tên ability.
                const name = button.dataset.name;

                // Mở modal.
                openAbilityModal(url, name);
            }
        );
    });


    // ==================================================
    // EVENT FORM
    // ==================================================

    const formItems =
        document.querySelectorAll(".pokemon-form-item");

    // Duyệt từng form.
    formItems.forEach(function(item) {

        // Click vào form.
        item.addEventListener(
            "click",
            function() {

                // Lấy ID Pokémon.
                const id = item.dataset.id;

                // Chuyển sang detail Pokémon đó.
                window.location.href =
                    `./detail.html?id=${id}`;
            }
        );
    });


    // ==================================================
    // EVENT EVOLUTION
    // ==================================================

    const evolutionItems =
        document.querySelectorAll(".pokemon-evolution-item");

    // Duyệt từng evolution.
    evolutionItems.forEach(function(item) {

        // Click evolution.
        item.addEventListener(
            "click",
            function() {

                // Lấy ID Pokémon.
                const id = item.dataset.id;

                // Chuyển sang detail.
                window.location.href =
                    `./detail.html?id=${id}`;
            }
        );
    });
}


// ======================================================
// 23. LOAD DETAIL
// ======================================================

async function loadPokemonDetail() {

    try {

        // Hiển thị loading.
        loading.style.display = "block";

        // Ẩn nội dung.
        detailContainer.style.display = "none";


        // ==================================================
        // LẤY DỮ LIỆU POKÉMON
        // ==================================================

        const pokemon = await getPokemon(pokemonId);


        // ==================================================
        // LẤY SPECIES
        // ==================================================

        const species = await getPokemonSpecies(pokemonId);


        // ==================================================
        // LẤY EVOLUTION
        // ==================================================

        let evolutionPokemon = [];

        try {

            // Lấy evolution chain.
            const evolutionChain =
                await getEvolutionChain(
                    species.evolution_chain.url
                );

            // Lấy Pokémon evolution.
            evolutionPokemon =
                await getEvolutionPokemon(
                    evolutionChain.chain
                );

        } catch (error) {

            // Không làm hỏng trang nếu evolution lỗi.
            console.error(
                "Lỗi Evolution:",
                error
            );
        }


        // ==================================================
        // DATA CƠ BẢN
        // ==================================================

        // Lấy hình ảnh chính.
        const image =
            pokemon.sprites.other?.["official-artwork"]?.front_default ||
            pokemon.sprites.front_default;

        // Lấy types.
        const types = pokemon.types.map(function(item) {
            return item.type.name;
        });

        // Lấy abilities.
        const abilities = pokemon.abilities.map(function(item) {
            return `
                <button
                    type="button"
                    class="pokemon-ability-button"
                    data-url="${item.ability.url}"
                    data-name="${item.ability.name}"
                >
                    ${capitalize(
                        item.ability.name.replaceAll("-", " ")
                    )}
                </button>
            `;
        }).join("");


        // ==================================================
        // DESCRIPTION
        // ==================================================

        // Tìm mô tả tiếng Anh.
        const descriptionEntry =
            species.flavor_text_entries.find(function(item) {
                return item.language.name === "en";
            });

        // Lấy mô tả.
        const description =
            descriptionEntry
                ? descriptionEntry.flavor_text
                    .replace(/\f/g, " ")
                : "Chưa có mô tả.";


        // ==================================================
        // GENDER
        // ==================================================

        const gender =
            getGender(species.gender_rate);


        // ==================================================
        // RENDER DETAIL
        // ==================================================

        detailContainer.innerHTML = `

            <section class="pokemon-detail-header">

                <div class="pokemon-detail-image-box">

                    <span class="pokemon-detail-id">
                        #${String(pokemon.id).padStart(3, "0")}
                    </span>

                    <img
                        src="${image}"
                        alt="${pokemon.name}"
                        class="pokemon-detail-image"
                    >

                </div>


                <div class="pokemon-detail-info">

                    <h1 class="pokemon-detail-name">
                        ${capitalize(pokemon.name)}
                    </h1>


                    <div class="pokemon-detail-types">

                        ${types.map(function(type) {
                            return `
                                <span
                                    class="
                                        pokemon-detail-type
                                        type-${type}
                                    "
                                >
                                    ${capitalize(type)}
                                </span>
                            `;
                        }).join("")}

                    </div>


                    <p class="pokemon-detail-description">
                        ${description}
                    </p>


                    <div class="pokemon-detail-actions">

                        <button
                            id="addCollection"
                            class="pokemon-detail-btn collection"
                        >
                            <i class="bi bi-grid"></i>
                            Bộ sưu tập
                        </button>


                        <button
                            id="addFavorite"
                            class="pokemon-detail-btn favorite"
                        >
                            <i class="bi bi-heart"></i>
                            Yêu thích
                        </button>

                    </div>

                </div>

            </section>


            <section class="pokemon-detail-section">

                <h2>Thông tin cơ bản</h2>

                <div class="pokemon-info-grid">

                    <div class="pokemon-info-item">
                        <span>Chiều cao</span>
                        <strong>
                            ${pokemon.height / 10} m
                        </strong>
                    </div>

                    <div class="pokemon-info-item">
                        <span>Cân nặng</span>
                        <strong>
                            ${pokemon.weight / 10} kg
                        </strong>
                    </div>

                    <div class="pokemon-info-item">
                        <span>Giới tính</span>
                        <strong>
                            ${gender}
                        </strong>
                    </div>

                    <div class="pokemon-info-item">
                        <span>EXP cơ bản</span>
                        <strong>
                            ${pokemon.base_experience}
                        </strong>
                    </div>

                </div>

            </section>


            <section class="pokemon-detail-section">

                <h2>Abilities</h2>

                <div class="pokemon-abilities">

                    ${abilities}

                </div>

            </section>


            <section class="pokemon-detail-section">

                <h2>Chỉ số</h2>

                <div class="pokemon-stats">

                    ${renderStats(pokemon.stats)}

                </div>

            </section>


            <section class="pokemon-detail-section">

                <h2>Forms</h2>

                <div class="pokemon-forms">

                    ${renderForms(pokemon)}

                </div>

            </section>


            <section class="pokemon-detail-section">

                <h2>Tiến hóa</h2>

                <div class="pokemon-evolution">

                    ${renderEvolution(
                        evolutionPokemon
                    )}

                </div>

            </section>
        `;


        // Hiện nội dung.
        loading.style.display = "none";

        // Hiện detail.
        detailContainer.style.display = "block";


        // Gắn event cho các button.
        addDetailEvents(pokemon);


    } catch (error) {

        // Log lỗi.
        console.error(
            "Lỗi tải Pokémon:",
            error
        );

        // Ẩn loading.
        loading.style.display = "none";

        // Hiển thị lỗi.
        detailContainer.style.display = "block";

        // Hiển thị thông báo.
        detailContainer.innerHTML = `
            <div class="pokemon-detail-error">
                <h2>Không thể tải Pokémon</h2>

                <p>
                    Đã xảy ra lỗi khi lấy dữ liệu.
                </p>

                <button
                    onclick="window.location.reload()"
                    class="btn btn-primary"
                >
                    Thử lại
                </button>
            </div>
        `;
    }
}


// ======================================================
// 24. KIỂM TRA ĐĂNG NHẬP RỒI MỚI LOAD DETAIL
// ======================================================

onAuthStateChanged(
    auth,
    function(user) {

        // Lưu user hiện tại.
        currentUser = user;

        // Nếu chưa đăng nhập.
        if (!user) {

            // Chuyển về login.
            window.location.href =
                "./login.html";

            // Dừng.
            return;
        }

        // Nếu đã đăng nhập thì load detail.
        loadPokemonDetail();
    }
);