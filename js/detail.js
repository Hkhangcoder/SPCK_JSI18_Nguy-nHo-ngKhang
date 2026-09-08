// ============================
// API POKEMON
// ============================

// URL API chính dùng để lấy thông tin Pokémon.
const API_URL = "https://pokeapi.co/api/v2/pokemon";
// URL API Species dùng để lấy thông tin bổ sung của Pokémon.
const SPECIES_URL = "https://pokeapi.co/api/v2/pokemon-species";

// LẤY PHẦN TỬ HTML
// Lấy khu vực hiển thị loading.
const loading = document.querySelector("#pokemonDetailLoading");
// Lấy khu vực chứa toàn bộ nội dung detail Pokémon.
const detailContainer = document.querySelector("#pokemonDetail");
// Lấy phần tử Modal Bootstrap.
const abilityModalElement = document.querySelector("#abilityModal");
// Lấy tiêu đề của Modal.
const abilityModalTitle = document.querySelector("#abilityModalTitle");
// Lấy phần nội dung của Modal.
const abilityModalBody = document.querySelector("#abilityModalBody");
// Tạo đối tượng Modal Bootstrap từ phần tử HTML.
const abilityModal = new bootstrap.Modal(abilityModalElement);

// LẤY ID TỪ URL
// Lấy toàn bộ phần query phía sau dấu ? trên URL.
const params = new URLSearchParams(window.location.search);
// Lấy giá trị id từ URL.
// Ví dụ: detail.html?id=25 → pokemonId = "25".
const pokemonId = params.get("id");

// VIẾT HOA CHỮ ĐẦU
// Tạo hàm viết hoa chữ cái đầu của tên Pokémon.
function capitalize(text) {
    // Tách tên Pokémon thành nhiều phần bằng dấu "-".
    const words = text.split("-");
    // Duyệt qua từng phần của tên.
    return words.map(function (word) {
        // Viết hoa ký tự đầu tiên -> Sau đó nối với phần còn lại của từ.
        return word.charAt(0).toUpperCase() + word.slice(1);
    // Nối các phần lại bằng khoảng trắng.
    }).join(" ");
}

// LẤY ID TỪ URL API
// Tạo hàm lấy ID Pokémon từ URL API.
function getIdFromUrl(url) {
    // Tách URL thành từng phần bằng dấu "/".
    const parts = url.split("/");
    // Phần tử cuối thường là chuỗi rỗng -> Vì vậy lấy phần tử đứng trước nó.
    return parts[parts.length - 2];
}

// LẤY 1 POKEMON
// Tạo hàm async để lấy thông tin một Pokémon.
async function getPokemon(id) {
    // Bắt lỗi khi gọi API.
    try {
        // Gửi request GET đến API Pokémon.
        const response = await fetch(`${API_URL}/${id}`);
        // Kiểm tra response có thành công hay không.
        if (!response.ok) {
            // Nếu lỗi thì tạo Error.
            throw new Error("Không tìm thấy Pokémon");
        }
        // Chuyển dữ liệu JSON thành JavaScript object.
        return await response.json();
    } catch (error) {
        console.error("Lỗi Pokémon:", error);
        return null;
    }
}

// LẤY POKEMON SPECIES
// Tạo hàm lấy dữ liệu Species của Pokémon.
async function getPokemonSpecies(id) {
    // Bắt lỗi khi gọi API.
    try {
        // Gửi request đến API Species.
        const response = await fetch(`${SPECIES_URL}/${id}`);
        // Kiểm tra request có thành công không.
        if (!response.ok) {
            // Tạo lỗi nếu không tìm thấy Species.
            throw new Error("Không tìm thấy Species");
        }
        // Chuyển response JSON thành JavaScript object.
        return await response.json();
    } catch (error) {
        console.error("Lỗi Species:", error);
        return null;
    }
}

// LẤY THÔNG TIN ABILITY
// Tạo hàm lấy thông tin một Ability.
async function getAbility(url) {
    // Bắt lỗi khi gọi API.
    try {
        // Gửi request đến URL Ability.
        const response = await fetch(url);
        if (!response.ok) {
            // Tạo lỗi nếu không lấy được dữ liệu.
            throw new Error("Không lấy được Ability");
        }
        // Chuyển dữ liệu JSON thành object.
        return await response.json();
    } catch (error) {
        console.error("Lỗi Ability:", error);
        return null;
    }
}

// THÊM VÀO BỘ SƯU TẬP
// Tạo hàm thêm Pokémon vào Collection.
function addToCollection(pokemon) {
    // Lấy dữ liệu Collection từ localStorage.
    // Nếu chưa có dữ liệu thì sử dụng mảng rỗng.
    const collection = JSON.parse(localStorage.getItem("pokemonCollection")) || [];
    // Kiểm tra Pokémon đã tồn tại trong Collection chưa.
    const exists = collection.some(function (item) {
        // So sánh ID của Pokémon.
        return item.id === pokemon.id;
    });
    // Nếu Pokémon chưa tồn tại.
    if (!exists) {
        // Thêm Pokémon vào mảng Collection.
        collection.push({
            id: pokemon.id,
            name: pokemon.name,
            // Lấy ảnh official artwork -> không có thì dùng ảnh mặc định
            image: pokemon.sprites.other["official-artwork"].front_default ||
                pokemon.sprites.front_default,
            types: pokemon.types.map(function (item) {
                // Chỉ lấy tên của hệ.
                return item.type.name;
            })
        });
        // Chuyển mảng thành JSON rồi lưu vào localStorage.
        localStorage.setItem("pokemonCollection", JSON.stringify(collection));
        alert("Đã thêm vào Bộ sưu tập!");
    } else {
        alert("Pokémon này đã có trong Bộ sưu tập!");
    }
}

// THÊM VÀO YÊU THÍCH
// Tạo hàm thêm Pokémon vào Favorite.
function addToFavorite(pokemon) {
    // Lấy danh sách Favorite từ localStorage -> chưa có thì tạo mảng rỗng.
    const favorites = JSON.parse(localStorage.getItem("pokemonFavorite")) || [];
    // Kiểm tra Pokémon đã tồn tại chưa.
    const exists = favorites.some(function (item) {
        return item.id === pokemon.id;
    });
    // Nếu Pokémon chưa tồn tại.
    if (!exists) {
        favorites.push({
            id: pokemon.id,
            name: pokemon.name,
            image: pokemon.sprites.other["official-artwork"].front_default ||
                pokemon.sprites.front_default,
            // Lưu danh sách hệ.
            types: pokemon.types.map(function (item) {
                // Lấy tên hệ.
                return item.type.name;
            })
        });
        // Lưu danh sách Favorite vào localStorage.
        localStorage.setItem("pokemonFavorite", JSON.stringify(favorites));
        alert("Đã thêm vào Yêu thích!");
    } else {
        alert("Pokémon này đã có trong Yêu thích!");
    }
}

// GIỚI TÍNH
// Tạo hàm tính giới tính Pokémon.
function getGender(genderRate) {
    // -1 nghĩa là Pokémon không xác định giới tính.
    if (genderRate === -1) {
        return "Không xác định";
    }
    const female = genderRate * 12.5;
    const male = 100 - female;
    // Trả về HTML hiển thị giới tính.
    return ` <div class="pokemon-detail-gender">
            <span class="gender-male"> ♂ ${male}% </span>

            <span class="gender-female"> ♀ ${female}% </span>
        </div> `;
}

// MÀU CHỈ SỐ
// Tạo hàm lấy màu tương ứng với từng chỉ số.
function getStatColor(statName) {
    const colors = {
        hp: "#24a148",
        attack: "#f04b23",
        defense: "#f5a800", "special-attack": "#2878b8",
            "special-defense": "#49a35a",
        speed: "#7d3fc7"
    };
    // Trả về màu tương ứng -> không tìm thấy thì dùng màu xanh mặc định.
    return colors[statName] || "#2a75bb";
}

// TÊN ĐẸP CỦA CHỈ SỐ
// Tạo hàm chuyển tên API thành tên dễ đọc.
function getStatName(name) {
    const names = {
        hp: "HP",
        attack: "Attack",
        defense: "Defense","special-attack": "Special Attack",
            "special-defense": "Special Defense",
        speed: "Speed"
    };
    // Có tên trong object thì dùng tên đó -> không có thì dùng hàm capitalize().
    return names[name] || capitalize(name);
}

// RENDER CHỈ SỐ
// Tạo hàm render danh sách chỉ số.
function renderStats(stats) {
    // Tính tổng tất cả chỉ số.
    const total = stats.reduce(function (sum, stat) {
        // Cộng base_stat vào tổng.
        return sum + stat.base_stat;
    }, 0);
    // Tạo HTML cho từng chỉ số.
    const statHTML = stats.map(function (stat) {
        // Tính độ dài thanh progress.
        // 150 được xem là mức tối đa để tính phần trăm.
        const width = Math.min(stat.base_stat / 150 * 100, 100);
        // Lấy màu tương ứng với chỉ số.
        const color = getStatColor(stat.stat.name);
        // Trả về HTML của một chỉ số.
        return ` <div class="pokemon-detail-stat">
                <span class="pokemon-detail-stat-name" style="color: ${color};">
                    ${getStatName(stat.stat.name)}
                </span>

                <div class="pokemon-detail-stat-bar">
                    <div class="pokemon-detail-stat-fill"
                        style=" width: ${width}%;background: ${color};"> 
                    </div>
                </div>

                <span class="pokemon-detail-stat-value">
                    ${stat.base_stat}
                </span>
            </div> `; }).join("");
    // Trả về toàn bộ khu vực chỉ số.
    return ` <div class="pokemon-detail-stat-list"> ${statHTML} </div>
        <p class="pokemon-detail-total"> 
            Tổng: <strong>${total}</strong>
        </p> `;
}

// RENDER DẠNG / TRẠNG THÁI
// Tạo hàm render các dạng Pokémon.
async function renderForms(species) {
    // Lấy danh sách varieties -> không có thì sử dụng mảng rỗng.
    const forms = species.varieties || [];
    // Tạo Promise cho từng dạng.
    const formPromises = forms.map(async function (variety) {
        // Lấy ID từ URL Pokémon.
        const id = getIdFromUrl(variety.pokemon.url);
        // Gọi API để lấy Pokémon.
        const pokemon = await getPokemon(id);
        if (!pokemon) {
            return "";
        }
        // Lấy ảnh official artwork.
        const image = pokemon.sprites.other["official-artwork"].front_default ||
            pokemon.sprites.front_default;
        // Trả về HTML của card dạng.
        return ` <div class="pokemon-detail-form-card" data-id="${pokemon.id}">
                <img class="pokemon-detail-form-image"
                    src="${image}" alt="${pokemon.name}">
                <div>
                    <h4 class="pokemon-detail-form-name">
                        ${capitalize(pokemon.name)}
                    </h4>

                    <p class="pokemon-detail-form-id"> #${pokemon.id} </p>
                </div>
                <i class="bi bi-chevron-right"></i>
            </div> `;
    });
    // Chờ tất cả API trả dữ liệu.
    const formCards = await Promise.all(formPromises);
    // Nối tất cả card thành một chuỗi HTML.
    return formCards.join("");
}

// LẤY EVOLUTION CHAIN
// Tạo hàm lấy dữ liệu Evolution Chain.
async function getEvolutionChain(url) {
    // Bắt lỗi khi gọi API.
    try {
        // Gửi request đến URL Evolution.
        const response = await fetch(url);
        if (!response.ok) {
            // Tạo lỗi nếu request thất bại.
            throw new Error("Không lấy được Evolution");
        }
        // Chuyển JSON thành JavaScript object.
        return await response.json();
    } catch (error) {
        console.error("Lỗi Evolution:", error);
        return null;
    }
}

// TẠO DANH SÁCH TIẾN HÓA
// Tạo hàm lấy danh sách Pokémon trong Evolution Chain.
function getEvolutionPokemon(chain) {
    const result = [];
    // Bắt đầu từ Pokémon đầu tiên trong chain.
    let current = chain;
    // Lặp khi vẫn còn Pokémon.
    while (current) {
        // Thêm Pokémon hiện tại vào kết quả.
        result.push({
            name: current.species.name,
            // Lấy ID từ URL species.
            id: getIdFromUrl(current.species.url)
        });
        // Kiểm tra có Pokémon tiến hóa tiếp theo không.
        if (current.evolves_to && current.evolves_to.length > 0) {
            // Lấy Pokémon tiến hóa đầu tiên.
            current = current.evolves_to[0];
        } else {
            // Không còn tiến hóa thì kết thúc vòng lặp.
            current = null;
        }
    }
    return result;
}

// RENDER TIẾN HÓA
// Tạo hàm render khu vực Evolution.
async function renderEvolution(evolutionUrl) {
    // Lấy dữ liệu Evolution Chain.
    const evolutionData = await getEvolutionChain(evolutionUrl);
    // Nếu không lấy được dữ liệu.
    if (!evolutionData) {
        return ` <p>Không có dữ liệu tiến hóa.</p> `;
    }
    // Lấy danh sách Pokémon tiến hóa.
    const evolutionList = getEvolutionPokemon(evolutionData.chain);
    // Tạo Promise để lấy thông tin từng Pokémon.
    const pokemonPromises = evolutionList.map(function (item) {
        // Gọi API theo ID.
        return getPokemon(item.id);
    });
    // Chờ tất cả Pokémon được lấy về.
    const pokemons = await Promise.all(pokemonPromises);
    // Chỉ giữ lại những Pokémon lấy thành công.
    const validPokemons = pokemons.filter(function (pokemon) {
        return pokemon !== null;
    });
    // Tạo HTML cho từng Pokémon.
    return validPokemons.map(function (pokemon, index) {
        const image = pokemon.sprites.other["official-artwork"].front_default ||
            pokemon.sprites.front_default;
        // Tạo card Pokémon.
        const card = ` <div class="pokemon-detail-evolution-card"
                data-id="${pokemon.id}">

                <img class="pokemon-detail-evolution-image" 
                    src="${image}" alt="${pokemon.name}">

                <p class="pokemon-detail-evolution-name">
                    ${capitalize(pokemon.name)}
                </p>

                <p class="pokemon-detail-evolution-id"> #${pokemon.id} </p>
            </div> `;
        // Kiểm tra Pokémon có phải Pokémon cuối không.
        if (index < validPokemons.length - 1) {
            // Nếu chưa phải cuối thì thêm mũi tên.
            return ` ${card}
                <i class="bi bi-arrow-right
                    pokemon-detail-evolution-arrow"></i> `;
        }
        // Nếu là Pokémon cuối thì chỉ trả card.
        return card;
    // Nối tất cả thành một chuỗi HTML.
    }).join("");
}

// MỞ MODAL KỸ NĂNG
// Tạo hàm mở Modal Ability.
async function openAbilityModal(url) {
    // Hiển thị Modal.
    abilityModal.show();
    // Đổi tiêu đề thành trạng thái loading.
    abilityModalTitle.textContent = "Đang tải kỹ năng...";
    // Hiển thị loading trong phần nội dung.
    abilityModalBody.innerHTML = "<p>⏳ Đang lấy thông tin...</p>";
    // Gọi API lấy Ability.
    const ability = await getAbility(url);
    // Nếu không lấy được dữ liệu.
    if (!ability) {
        // Đổi tiêu đề thành lỗi.
        abilityModalTitle.textContent = "Lỗi";
        // Hiển thị thông báo lỗi.
        abilityModalBody.innerHTML = "<p>Không thể tải thông tin kỹ năng.</p>";
        return;
    }
    // Tìm mô tả tiếng Anh trong danh sách effect.
    const effectEntry = ability.effect_entries.find(function (item) {
            // Chỉ lấy phần có language = en.
            return item.language.name === "en"; });
    // Lấy mô tả ngắn -> không có thì hiển thị thông báo mặc định.
    const description = effectEntry ? effectEntry.short_effect : "Chưa có mô tả.";
    // Đổi tiêu đề Modal thành tên Ability.
    abilityModalTitle.textContent = capitalize(ability.name);
    // Hiển thị thông tin Ability.
    abilityModalBody.innerHTML = `<div class="pokemon-ability-modal-row">
            <strong>Tên:</strong> ${capitalize(ability.name)}
        </div>

        <div class="pokemon-ability-modal-row">
            <strong>Mô tả:</strong> ${description}
        </div> `;
}

// GẮN SỰ KIỆN
// Tạo hàm gắn các event cho trang Detail.
function addDetailEvents(pokemon) {
    // NÚT BỘ SƯU TẬP
    // Tìm nút thêm Collection.
    const collectionButton = document.querySelector("#addCollection");
    // Kiểm tra nút có tồn tại không.
    if (collectionButton) {
        collectionButton.addEventListener("click", function () {
                addToCollection(pokemon);
            }
        );
    }
    // NÚT YÊU THÍCH
    // Tìm nút Favorite.
    const favoriteButton = document.querySelector("#addFavorite");
    // Kiểm tra nút có tồn tại không.
    if (favoriteButton) {
        // Gắn sự kiện click.
        favoriteButton.addEventListener("click", function () {
                addToFavorite(pokemon);
            }
        );
    }
    // NÚT ABILITY
    // Lấy tất cả button Ability.
    document.querySelectorAll(".pokemon-detail-ability-button")
        .forEach(function (button) {
            button.addEventListener("click", function () {
                    // Mở Modal bằng URL Ability.
                    openAbilityModal(button.dataset.url);
                }
            );
        });

    // CARD DẠNG
    // Lấy tất cả card dạng Pokémon.
    document.querySelectorAll(".pokemon-detail-form-card")
        .forEach(function (card) {
            card.addEventListener( "click", function () {
                    // Chuyển sang trang Detail của dạng đó.
                    window.location.href = `./Pages/detail.html?id=${card.dataset.id}`;
                }
            );
        });
    // CARD TIẾN HÓA
    // Lấy tất cả card Evolution.
    document.querySelectorAll(".pokemon-detail-evolution-card")
        .forEach(function (card) {
            card.addEventListener( "click", function () {
                    // Chuyển sang Detail Pokémon được chọn.
                    window.location.href = `./Pages/detail.html?id=${card.dataset.id}`;
                }
            );
        });
}

// LOAD TRANG DETAIL
// Tạo hàm load toàn bộ dữ liệu Detail.
async function loadPokemonDetail() {
    // Kiểm tra URL có ID Pokémon không.
    if (!pokemonId) {
        loading.textContent = "❌ Không tìm thấy Pokémon.";
        return;
    }
    // Bắt lỗi toàn bộ quá trình load.
    try {
        // Lấy dữ liệu Pokémon.
        const pokemon = await getPokemon(pokemonId);
        // Nếu không lấy được Pokémon.
        if (!pokemon) {
            loading.textContent = "❌ Không tìm thấy Pokémon.";
            return;
        }
        // LẤY SPECIES
        // Lấy dữ liệu Species.
        const species = await getPokemonSpecies(pokemon.id);

        // LẤY ẢNH
        // Lấy ảnh official artwork -> không có thì dùng ảnh mặc định.
        const image = pokemon.sprites.other["official-artwork"].front_default ||
            pokemon.sprites.front_default;
        // RENDER HỆ
        // Lấy danh sách hệ Pokémon.
        const types = pokemon.types.map(function (item) {
                // Tạo HTML cho từng hệ.
                return ` <span class="pokemon-detail-type">
                        ${capitalize(item.type.name)}
                    </span> `;
            }
        // Nối tất cả hệ thành một chuỗi.
        ).join("");

        // CATEGORY
        // Đặt Category mặc định.
        let category = "Chưa có dữ liệu";
        // Kiểm tra có Species không.
        if (species) {
            // Tìm genus tiếng Anh.
            const englishGenus = species.genera.find(function (item) {
                        // Chỉ lấy genus có language = en.
                        return item.language.name === "en";
                    }
                );
            // Nếu tìm thấy genus.
            if (englishGenus) {
                // Lấy tên genus.
                category = englishGenus.genus;
            }
        }

        // GIỚI TÍNH
        // Lấy thông tin giới tính.
        const gender = species ? getGender(species.gender_rate)
                : "Không xác định";

        // ABILITY
        // Lấy các Ability thường.
        const normalAbilities = pokemon.abilities.filter(function (item) {
                    // Chỉ lấy Ability không phải hidden.
                    return !item.is_hidden;
                }
            );
        // Tìm Ability ẩn.
        const hiddenAbility = pokemon.abilities.find(function (item) {
                    // Tìm Ability có is_hidden = true.
                    return item.is_hidden;
                }
            );

        // RENDER ABILITY THƯỜNG
        // Tạo button cho từng Ability thường.
        const abilityButtons = normalAbilities.map(function (item) {
                   // Trả về HTML button.
                    return ` <button class="pokemon-detail-ability-button"
                                data-url="${item.ability.url}">
                            ${capitalize(item.ability.name)}
                        </button> `;
                }
            // Nối tất cả button.
            ).join("");

        // RENDER DẠNG
        // Lấy HTML các dạng Pokémon.
        const forms = species ? await renderForms(species)
                : "<p>Không có dữ liệu dạng.</p>";

        // RENDER TIẾN HÓA
        // Lấy HTML Evolution.
        const evolution = species ? 
            await renderEvolution(species.evolution_chain.url)
            : "<p>Không có dữ liệu tiến hóa.</p>";

        // POKEMON TRƯỚC
        // Nếu ID > 1 thì lấy Pokémon trước.
        // Nếu là Pokémon #1 thì vẫn giữ ID 1.
        const previousId = pokemon.id > 1 ? pokemon.id - 1 : 1;

        // POKEMON SAU
        // Lấy ID Pokémon tiếp theo.
        const nextId = pokemon.id + 1;

        // ẨN LOADING
        // Ẩn khu vực loading.
        loading.style.display = "none";
        // Hiển thị khu vực Detail.
        detailContainer.style.display = "block";

        // RENDER TOÀN BỘ DETAIL
        // Đưa toàn bộ HTML vào detailContainer.
        detailContainer.innerHTML = `
            <!-- CARD CHÍNH + NÚT CHUYỂN -->
            <div class="pokemon-detail-wrapper">
                <!-- Pokémon trước -->
                <div class="pokemon-detail-nav">
                    <button class="pokemon-detail-nav-button"
                        data-id="${previousId}">
                        <i class="bi bi-chevron-left"></i>
                    </button>

                    <div class="pokemon-detail-nav-text">
                        #${previousId} <br> Trước
                    </div>
                </div>

                <div class="pokemon-detail-main-card">
                    <div class="pokemon-detail-top">
                        <div class="pokemon-detail-image-box">
                            <img src="${image}" alt="${pokemon.name}">
                        </div>

                        <!-- ID + tên + hệ -->
                        <div>
                            <p class="pokemon-detail-id"> #${pokemon.id} </p>

                            <h1 class="pokemon-detail-name">
                                ${capitalize(pokemon.name)}
                            </h1>

                            <div class="pokemon-detail-types"> ${types} </div>
                        </div>
                        <!-- Thông tin tổng quan -->
                        <div class="pokemon-detail-summary">
                            <!-- Category -->
                            <div class="pokemon-detail-category">
                                <div class="pokemon-detail-category-title">
                                    <i class="bi bi-tag"></i> Category
                                </div>

                                <div class="pokemon-detail-category-value">
                                    ${category}
                                </div>
                            </div>
                            <!-- Grid thông tin -->
                            <div class="pokemon-detail-info-grid">
                                <!-- Chiều cao -->
                                <div class="pokemon-detail-info-item">
                                    <span class="pokemon-detail-info-label">
                                        Chiều cao
                                    </span>

                                    <span class="pokemon-detail-info-value">
                                        ${pokemon.height / 10} m
                                    </span>
                                </div>
                                <!-- Cân nặng -->
                                <div class="pokemon-detail-info-item">
                                    <span class="pokemon-detail-info-label">
                                        Cân nặng
                                    </span>

                                    <span class="pokemon-detail-info-value">
                                        ${pokemon.weight / 10} kg
                                    </span>
                                </div>
                                <!-- Giới tính -->
                                <div class="pokemon-detail-info-item">
                                    <span class="pokemon-detail-info-label">
                                        Giới tính
                                    </span>

                                    <span class="pokemon-detail-info-value">
                                        ${gender}
                                    </span>
                                </div>
                                <!-- Kinh nghiệm -->
                                <div class="pokemon-detail-info-item">
                                    <span class="pokemon-detail-info-label">
                                        Kinh nghiệm cơ bản
                                    </span>

                                    <span class="pokemon-detail-info-value">
                                        ${pokemon.base_experience || 0}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Hai nút chức năng -->
                    <div class="pokemon-detail-actions">
                        <!-- Nút Collection -->
                        <button id="addCollection" 
                            class="pokemon-detail-btn collection">
                            <i class="bi bi-grid"></i> Bộ sưu tập
                        </button>

                        <!-- Nút Favorite -->
                        <button id="addFavorite"
                            class="pokemon-detail-btn favorite">
                            <i class="bi bi-heart"></i> Yêu thích
                        </button>
                    </div>
                </div>

                <!-- Pokémon sau -->
                <div class="pokemon-detail-nav">
                    <button class="pokemon-detail-nav-button" data-id="${nextId}">
                        <i class="bi bi-chevron-right"></i>
                    </button>

                    <div class="pokemon-detail-nav-text">
                        #${nextId} <br> Tiếp theo
                    </div>
                </div>
            </div>

            <!-- PHẦN 2 CỘT -->
            <div class="pokemon-detail-content">
                <!-- CỘT TRÁI -->
                <div class="pokemon-detail-column">
                    <!-- Chỉ số -->
                    <h2 class="pokemon-detail-section-title">
                        <i class="bi bi-bar-chart-line"></i> Chỉ số cơ bản
                    </h2>
                    ${renderStats(pokemon.stats)}
                    
                    <!-- Khả năng ẩn -->
                    <div class="pokemon-detail-hidden-ability">
                        <h3 class="pokemon-detail-section-title">
                            <i class="bi bi-lock-fill"></i> Khả năng ẩn
                        </h3>

                        ${ hiddenAbility ? ` <button
                                        class="pokemon-detail-ability-button"
                                        data-url="${hiddenAbility.ability.url}">
                                        ${capitalize(hiddenAbility.ability.name)}
                                    </button> ` : `
                                    
                                    <p> Pokémon này không có khả năng ẩn. </p> `
                        }
                    </div>
                </div>

                <!-- CỘT PHẢI -->
                <div class="pokemon-detail-column">
                    <!-- Kỹ năng -->
                    <h2 class="pokemon-detail-section-title">
                        <i class="bi bi-star-fill"></i> Kỹ năng nổi bật
                    </h2>

                    <div class="pokemon-detail-abilities">
                        ${abilityButtons}
                    </div>

                    <!-- Dạng -->
                    <div class="pokemon-detail-forms">
                        <h2 class="pokemon-detail-section-title">
                            <i class="bi bi-arrow-repeat"></i> Dạng / Trạng thái
                        </h2>

                        <div class="pokemon-detail-form-list">
                            ${forms}
                        </div>
                    </div>
                </div>
            </div>

            <!-- TIẾN HÓA -->
            <div class="pokemon-detail-evolution-box">
                <h2 class="pokemon-detail-section-title">
                    <i class="bi bi-arrow-repeat"></i> Tiến hóa
                </h2>

                <div class="pokemon-detail-evolution-list">
                    ${evolution}
                </div>
            </div> `;

        // SỰ KIỆN NÚT TRƯỚC / SAU
        // Lấy tất cả nút chuyển Pokémon.
        document.querySelectorAll(".pokemon-detail-nav-button")
            .forEach(function (button) {
                // Gắn sự kiện click.
                button.addEventListener("click", function () {
                        // Lấy ID từ data-id.
                        const id = button.dataset.id;
                        // Chuyển sang Pokémon được chọn.
                        window.location.href = `./Pages/detail.html?id=${id}`;
                    }
                );
            });

        // GẮN CÁC EVENT CÒN LẠI
        // Gắn event cho Collection, Favorite, Ability, Form và Evolution.
        addDetailEvents(pokemon);
    } catch (error) {
        console.error("Lỗi Detail:", error);
        loading.textContent = "❌ Không thể tải thông tin Pokémon.";
    }
}

// CHẠY HÀM LOAD
// Bắt đầu tải dữ liệu Pokémon khi file JS chạy.
loadPokemonDetail();