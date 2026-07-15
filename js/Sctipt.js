/* =========================================================================
   sctipt.js  -- Global controller for مكتبة جرير
   Loaded on every page. All page-specific blocks below are guarded so this
   single file can safely run on index.html, login.html, register.html,
   cartproducts.html and favorites.html without throwing errors.
   ========================================================================= */

/* -------------------------------------------------------------------------
   0) BACK TO TOP BUTTON (all pages)
   ------------------------------------------------------------------------- */
(function initBackToTop() {
    const btn = document.querySelector(".GoTOHome");
    if (!btn) return;

    window.addEventListener("scroll", () => {
        if (window.scrollY > 100) {
            btn.classList.add("show");
        } else {
            btn.classList.remove("show");
        }
    });

    // The link points to "/", override it so it never navigates away
    btn.addEventListener("click", (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
})();

/* -------------------------------------------------------------------------
   1) HERO SLIDER (index.html only)
   ------------------------------------------------------------------------- */
(function initHeroSlider() {
    const slider = document.querySelector(".slider");
    const slides = document.querySelectorAll(".slide");
    const dotsContainer = document.querySelector(".dots");
    const nextBtn = document.querySelector(".hero-slider > .next");
    const prevBtn = document.querySelector(".hero-slider > .prev");

    if (!slider || !slides.length || !dotsContainer || !nextBtn || !prevBtn) return;

    let currentIndex = 0;
    let autoSlide;

    slides.forEach((slide, index) => {
        const dot = document.createElement("span");
        dot.classList.add("dot");
        if (index === 0) dot.classList.add("active");
        dot.addEventListener("click", () => {
            currentIndex = index;
            updateSlider();
        });
        dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll(".dot");

    function updateSlider() {
        slider.style.transform = `translateX(-${currentIndex * 100}%)`;
        dots.forEach((dot) => dot.classList.remove("active"));
        dots[currentIndex].classList.add("active");
    }

    nextBtn.addEventListener("click", () => {
        currentIndex = (currentIndex + 1) % slides.length;
        updateSlider();
    });

    prevBtn.addEventListener("click", () => {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        updateSlider();
    });

    function startSlider() {
        autoSlide = setInterval(() => {
            currentIndex = (currentIndex + 1) % slides.length;
            updateSlider();
        }, 1900);
    }
    function stopSlider() {
        clearInterval(autoSlide);
    }

    slider.parentElement.addEventListener("mouseenter", stopSlider);
    slider.parentElement.addEventListener("mouseleave", startSlider);
    startSlider();
})();

/* -------------------------------------------------------------------------
   2) PRODUCT ROW CAROUSELS (index.html only, safe no-op elsewhere)
   ------------------------------------------------------------------------- */
(function initRowCarousels() {
    const rowWrappers = document.querySelectorAll(".slider-wrapper");

    rowWrappers.forEach((wrapper) => {
        const row = wrapper.querySelector(".products-row");
        const prevBtn = wrapper.querySelector(".prod-prev");
        const nextBtn = wrapper.querySelector(".prod-next");
        if (!row || !prevBtn || !nextBtn) return;

        nextBtn.addEventListener("click", () => {
            const productCard = row.querySelector(".product-card");
            if (productCard) {
                row.scrollBy({ left: productCard.clientWidth + 15, behavior: "smooth" });
            }
        });

        prevBtn.addEventListener("click", () => {
            const productCard = row.querySelector(".product-card");
            if (productCard) {
                row.scrollBy({ left: -(productCard.clientWidth + 15), behavior: "smooth" });
            }
        });
    });
})();

/* -------------------------------------------------------------------------
   3) BURGER MENU / SIDEBAR (index.html only)
   ------------------------------------------------------------------------- */
(function initBurgerMenu() {
    const burgerMenuBtn = document.getElementById("burgerMenuBtn");
    const closeSidebarBtn = document.getElementById("closeSidebarBtn");
    const sidebarMenu = document.getElementById("sidebarMenu");

    if (!burgerMenuBtn || !closeSidebarBtn || !sidebarMenu) return;

    burgerMenuBtn.addEventListener("click", () => sidebarMenu.classList.add("active"));
    closeSidebarBtn.addEventListener("click", () => sidebarMenu.classList.remove("active"));

    document.addEventListener("click", (event) => {
        if (!sidebarMenu.contains(event.target) && !burgerMenuBtn.contains(event.target)) {
            sidebarMenu.classList.remove("active");
        }
    });
})();

/* =========================================================================
   4) SHARED DATA HELPERS (users / cart / favorites) -- used on every page
   ========================================================================= */
function isLoggedIn() {
    return !!localStorage.getItem("username");
}

function requireLogin(message) {
    if (!isLoggedIn()) {
        alert(message || "يرجى تسجيل الدخول أولاً");
        window.location.href = "login.html";
        return false;
    }
    return true;
}

function getCart() {
    return JSON.parse(localStorage.getItem("cartProducts")) || [];
}
function saveCart(cart) {
    localStorage.setItem("cartProducts", JSON.stringify(cart));
}

function getFavorites() {
    return JSON.parse(localStorage.getItem("favProducts")) || [];
}
function saveFavorites(favs) {
    localStorage.setItem("favProducts", JSON.stringify(favs));
}

/* Adds a product to the cart, or increases its quantity if it's already there */
function addOrIncrementCart(productData) {
    let cart = getCart();
    const existing = cart.find((item) => item.name === productData.name);

    if (existing) {
        existing.quantity = (existing.quantity || 1) + 1;
    } else {
        cart.push({ ...productData, quantity: 1 });
    }

    saveCart(cart);
}

/* Changes the quantity of a cart item by `delta`; removes it if it hits 0 */
function changeCartQty(name, delta) {
    let cart = getCart();
    const item = cart.find((i) => i.name === name);
    if (!item) return;

    item.quantity = (item.quantity || 1) + delta;

    if (item.quantity <= 0) {
        cart = cart.filter((i) => i.name !== name);
    }

    saveCart(cart);
}

function removeFromCartByName(name) {
    let cart = getCart();
    cart = cart.filter((i) => i.name !== name);
    saveCart(cart);
}

function cartTotalQty() {
    return getCart().reduce((sum, item) => sum + (item.quantity || 1), 0);
}

function priceToNumber(priceStr) {
    return parseInt(String(priceStr).replace(/[^0-9]/g, "")) || 0;
}

function cartTotalPrice() {
    return getCart().reduce((sum, item) => sum + priceToNumber(item.price) * (item.quantity || 1), 0);
}

/* -------------------------------------------------------------------------
   5) HEADER / SESSION STATE (all pages)
   ------------------------------------------------------------------------- */
function updateBadges() {
    const favBadge = document.getElementById("fav-badge");
    const cartBadge = document.getElementById("cart-badge");

    const favItems = getFavorites();
    const cartQty = cartTotalQty();

    if (favBadge) {
        favBadge.textContent = favItems.length;
        favBadge.style.display = favItems.length > 0 ? "inline-block" : "none";
    }
    if (cartBadge) {
        cartBadge.textContent = cartQty;
        cartBadge.style.display = cartQty > 0 ? "inline-block" : "none";
    }
}

function initHeaderSession() {
    const linksList = document.querySelector("#links");
    const userInfoList = document.querySelector("#user_info");
    const userSpan = document.querySelector("#user");
    const logoutBtn = document.querySelector("#logout");
    const username = localStorage.getItem("username");

    if (username) {
        if (linksList) linksList.style.display = "none";
        if (userInfoList) userInfoList.style.display = "flex";
        if (userSpan) userSpan.textContent = username;
    } else {
        if (linksList) linksList.style.display = "flex";
        if (userInfoList) userInfoList.style.display = "none";
    }

    if (logoutBtn) {
        logoutBtn.addEventListener("click", function (e) {
            e.preventDefault();
            localStorage.removeItem("username");
            window.location.reload();
        });
    }
}

/* -------------------------------------------------------------------------
   6) MINI CART DROPDOWN (header cart icon, all pages that have it)
   ------------------------------------------------------------------------- */
function renderMiniCart() {
    const miniCartItems = document.getElementById("miniCartItems");
    if (!miniCartItems) return;

    const cart = getCart();

    if (cart.length === 0) {
        miniCartItems.innerHTML = `<p class="mini-cart-empty">السلة فارغة</p>`;
        return;
    }

    miniCartItems.innerHTML = cart
        .map(
            (item) => `
        <div class="mini-cart-item">
            <img src="${item.img}" alt="${item.name}">
            <div class="mini-cart-info">
                <p class="mini-cart-name">${item.name}</p>
                <p class="mini-cart-price">${item.price}</p>
                <div class="mini-cart-qty">
                    <button class="qty-decrease" data-name="${item.name}">-</button>
                    <span>${item.quantity || 1}</span>
                    <button class="qty-increase" data-name="${item.name}">+</button>
                </div>
            </div>
        </div>`
        )
        .join("");
}

function initMiniCartDropdown() {
    const cartIconLink = document.getElementById("cartIconLink");
    const dropdown = document.getElementById("miniCartDropdown");
    if (!cartIconLink || !dropdown) return;

    cartIconLink.addEventListener("click", function (e) {
        e.preventDefault(); // don't navigate straight away, show the dropdown instead
        const isOpen = dropdown.classList.contains("show");
        if (!isOpen) renderMiniCart();
        dropdown.classList.toggle("show", !isOpen);
    });

    dropdown.addEventListener("click", function (e) {
        const increaseBtn = e.target.closest(".qty-increase");
        const decreaseBtn = e.target.closest(".qty-decrease");

        if (increaseBtn) {
            changeCartQty(increaseBtn.dataset.name, 1);
            renderMiniCart();
            updateBadges();
        }
        if (decreaseBtn) {
            changeCartQty(decreaseBtn.dataset.name, -1);
            renderMiniCart();
            updateBadges();
        }
    });

    // Close the dropdown when clicking anywhere outside of it
    document.addEventListener("click", function (e) {
        if (!cartIconLink.parentElement.contains(e.target)) {
            dropdown.classList.remove("show");
        }
    });
}

/* -------------------------------------------------------------------------
   7) PRODUCT CARD WISHLIST / CART BUTTONS (index.html product grids)
   ------------------------------------------------------------------------- */
function initProductCards() {
    const productCards = document.querySelectorAll(".product-card");
    if (!productCards.length) return;

    const favorites = getFavorites();

    productCards.forEach((card) => {
        const heartBtn = card.querySelector(".fa-heart");
        const cartBtn = card.querySelector(".fa-cart-shopping");

        const productImg = card.querySelector(".product-img img")?.src || "";
        const productName = card.querySelector(".product-name")?.textContent.trim() || "";
        const productDesc = card.querySelector(".product-desc")?.textContent.trim() || "";
        const productPrice = card.querySelector(".product-price")?.textContent.trim() || "";

        const productData = { img: productImg, name: productName, desc: productDesc, price: productPrice };

        if (heartBtn) {
            heartBtn.style.cursor = "pointer";

            if (favorites.some((item) => item.name === productName)) {
                heartBtn.classList.remove("fa-regular");
                heartBtn.classList.add("fa-solid");
                heartBtn.style.color = "red";
            }

            heartBtn.addEventListener("click", () => {
                if (!requireLogin("يرجى تسجيل الدخول أولاً لتتمكن من إضافة المنتجات للمفضلة!")) return;

                let currentFavs = getFavorites();
                const index = currentFavs.findIndex((item) => item.name === productName);

                if (index === -1) {
                    currentFavs.push(productData);
                    heartBtn.classList.remove("fa-regular");
                    heartBtn.classList.add("fa-solid");
                    heartBtn.style.color = "red";
                } else {
                    currentFavs.splice(index, 1);
                    heartBtn.classList.remove("fa-solid");
                    heartBtn.classList.add("fa-regular");
                    heartBtn.style.color = "";
                }

                saveFavorites(currentFavs);
                updateBadges();
            });
        }

        if (cartBtn) {
            cartBtn.style.cursor = "pointer";
            cartBtn.addEventListener("click", () => {
                if (!requireLogin("يرجى تسجيل الدخول أولاً لتتمكن من الشراء!")) return;

                addOrIncrementCart(productData);
                updateBadges();
                renderMiniCart();
                alert(`تمت إضافة "${productName}" إلى عربة التسوق!`);
            });
        }
    });
}

/* -------------------------------------------------------------------------
   9) PRODUCT SEARCH (index.html only, safe no-op elsewhere)
   Filters every ".product-card" on the page by its ".product-name" text as
   the user types, so only matching products stay visible. Works across all
   product rows/carousels at once.
   ------------------------------------------------------------------------- */
function initProductSearch() {
    const searchInput = document.querySelector(".search-input");
    const searchButton = document.querySelector(".search-button");
    if (!searchInput) return; // this page has no search box, nothing to do

    const productsSection = document.querySelector(".products-section");

    // Build a small "no results" message once, hidden until it's needed
    let noResultsMsg = document.getElementById("search-no-results");
    if (!noResultsMsg && productsSection) {
        noResultsMsg = document.createElement("p");
        noResultsMsg.id = "search-no-results";
        noResultsMsg.style.cssText = "text-align:center; padding:40px 20px; font-size:18px; color:#666; display:none;";
        productsSection.parentNode.insertBefore(noResultsMsg, productsSection);
    }

    function normalize(text) {
        return (text || "").trim().toLowerCase();
    }

    function runSearch() {
        const query = normalize(searchInput.value);
        const rowContainers = document.querySelectorAll(".row-container");
        let totalVisible = 0;

        rowContainers.forEach((container) => {
            const cards = container.querySelectorAll(".product-card");
            let visibleInRow = 0;

            cards.forEach((card) => {
                const nameEl = card.querySelector(".product-name");
                const name = normalize(nameEl ? nameEl.textContent : "");
                const matches = query === "" || name.includes(query);

                card.style.display = matches ? "" : "none";
                if (matches) visibleInRow++;
            });

            // Hide an entire row/carousel if none of its products match
            container.style.display = visibleInRow > 0 ? "" : "none";
            totalVisible += visibleInRow;
        });

        if (noResultsMsg) {
            if (query !== "" && totalVisible === 0) {
                noResultsMsg.textContent = `لا توجد نتائج مطابقة لـ "${searchInput.value.trim()}"`;
                noResultsMsg.style.display = "block";
                if (productsSection) productsSection.style.display = "none";
            } else {
                noResultsMsg.style.display = "none";
                if (productsSection) productsSection.style.display = "";
            }
        }
    }

    // Live search: filters as the user types
    searchInput.addEventListener("input", runSearch);

    // Also trigger on button click / Enter key for anyone who prefers that
    if (searchButton) {
        searchButton.addEventListener("click", (e) => {
            e.preventDefault();
            runSearch();
        });
    }
    searchInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            runSearch();
        }
    });
}

/* -------------------------------------------------------------------------
   8) INIT -- runs on every page once the DOM is ready
   ------------------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
    initHeaderSession();
    updateBadges();
    initMiniCartDropdown();
    initProductCards();
    initProductSearch();
});