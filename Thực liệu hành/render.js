// ==================== THỰC PHƯƠNG SLIDER - THEO THỂ LOẠI ====================

const API_URL = "https://script.google.com/macros/s/AKfycbw-0UrJzRtcTiNDeIEPrXptf4mH-t32WqBZfi2ywoqItle1VJiNLcV2_L2yaCAdJUH2/exec";

// ==================== BIẾN TOÀN CỤC ====================
let currentCategory = "cay";
let active = 1;
let list, items, dots, prevBtn, nextBtn;
let isTransitioning = false;

// ==================== LẤY DỮ LIỆU TỪ GOOGLE SHEET ====================
async function loadFoodsByCategory(category) {
    try {
        const response = await fetch(`${API_URL}?category=${category}`);
        const result = await response.json();

        if (result.success) {
            return result.data;           // Trả về mảng món ăn từ Sheet
        } else {
            console.error("Lỗi từ Sheet:", result.error);
            return [];
        }
    } catch (error) {
        console.error("Không thể kết nối với Google Sheet:", error);
        return [];
    }
}

async function renderMeals(category) {
    currentCategory = category.toLowerCase();

    const foodList = document.getElementById('food-list');
    foodList.innerHTML = '';

    const foods = await loadFoodsByCategory(category);

    console.log(`🔍 Loaded ${foods.length} items for category "${category}"`, foods); // ← giúp debug

    if (foods.length === 0) {
        foodList.innerHTML = `<p style="padding: 60px 20px; text-align: center; color: #ff9800;">
            Không có dữ liệu cho loại "${category}"<br>
            <small>Kiểm tra tên sheet và Deploy lại Apps Script</small>
        </p>`;
        return;
    }

    foods.forEach((meal, index) => {
        const tenMon = meal.name || meal.tenmon || "Không có tên";
        const moTa   = meal.desc || meal.mota || meal.describe || "Đang cập nhật mô tả...";
        const hinhAnh = meal.img || meal.hinhanh || meal.image || "imagine/default.jpg";
        const idmeal = meal.id || meal.idmeal || meal.id || "meal" + index;

        const mealHTML = `
            <div class="meal">
                <img src="${hinhAnh}" class="food-list-img" alt="${tenMon}">
                <div class="meal-title">
                    <p class="meal-name">${tenMon}</p>
                    <p class="meal-describe">${moTa}</p>
                    <a class="find-more-meal" 
                       href="food_detail.html?name=${encodeURIComponent(tenMon)}&category=${encodeURIComponent(currentCategory)}&id=${encodeURIComponent(idmeal)}">
                        Tìm hiểu thêm
                    </a>
                </div>
            </div>
        `;
        foodList.innerHTML += mealHTML;
    });

    initSlider();
}

// ==================== KHỞI TẠO SLIDER (CLONE + EVENT) ====================
function initSlider() {
    list = document.querySelector('.food-slider .food-list');
    
    // Xóa clone cũ nếu có (tránh clone chồng clone)
    document.querySelectorAll('.food-list .meal.clone').forEach(clone => clone.remove());

    const originalItems = Array.from(document.querySelectorAll('.food-list .meal'));

    if (originalItems.length < 2) {
        console.warn("Không đủ món để làm slider");
        return;
    }

    // Tạo clone
    const firstClone = originalItems[0].cloneNode(true);
    const lastClone  = originalItems[originalItems.length - 1].cloneNode(true);
    
    firstClone.classList.add('clone');
    lastClone.classList.add('clone');

    list.appendChild(firstClone);           // clone đầu vào cuối
    list.insertBefore(lastClone, originalItems[0]); // clone cuối vào đầu

    items = document.querySelectorAll('.food-list .meal');
    dots  = document.querySelectorAll('.food-slider .dots li');
    prevBtn = document.getElementById('prev');
    nextBtn = document.getElementById('next');

    active = 1;   // reset về slide thật đầu tiên

    // Reset style
    list.style.transition = "none";
    list.style.left = `-${items[1].offsetLeft}px`;

    // Xóa active dot cũ
    dots.forEach(dot => dot.classList.remove('active'));
    dots[0].classList.add('active');

    // Gán lại sự kiện (quan trọng!)
    nextBtn.onclick = () => {
        if (isTransitioning) return;
        active++;
        goToSlide();
        handleInfiniteLoop();
    };

    prevBtn.onclick = () => {
        if (isTransitioning) return;
        active--;
        goToSlide();
        handleInfiniteLoop();
    };

    dots.forEach((dot, index) => {
        dot.onclick = () => {
            active = index + 1;
            goToSlide();
        };
    });

    console.log(`Khởi tạo slider cho ${currentCategory} - ${items.length} items`);
}

// ==================== Các hàm goToSlide và handleInfiniteLoop giữ nguyên ====================
function goToSlide() {
    if (isTransitioning) return;
    isTransitioning = true;

    list.style.transition = "left 0.6s ease";
    list.style.left = `-${items[active].offsetLeft}px`;

    // === SỬA Ở ĐÂY ===
    let realIndex = (active - 1) % (items.length - 2);
    if (realIndex < 0) realIndex += (items.length - 2);   // Xử lý số âm

    dots.forEach(dot => dot.classList.remove('active'));
    if (dots[realIndex]) {
        dots[realIndex].classList.add('active');
    }

    setTimeout(() => isTransitioning = false, 650);
}

function handleInfiniteLoop() {
    const totalReal = items.length - 2; // trừ 2 clone

    if (active === totalReal + 1) {        // đang ở clone cuối
        setTimeout(() => {
            list.style.transition = "none";
            list.style.left = `-${items[1].offsetLeft}px`;
            active = 1;
            setTimeout(() => list.style.transition = "left 0.6s ease", 30);
        }, 620);
    }

    if (active === 0) {                    // đang ở clone đầu
        setTimeout(() => {
            list.style.transition = "none";
            list.style.left = `-${items[totalReal].offsetLeft}px`;
            active = totalReal;
            setTimeout(() => list.style.transition = "left 0.6s ease", 30);
        }, 620);
    }
}

// ==================== DOMContentLoaded ====================
// Trong DOMContentLoaded
document.querySelectorAll('.food-type-item').forEach(item => {
    item.addEventListener('click', async () => {
        document.querySelectorAll('.food-type-item').forEach(el => el.classList.remove('active'));
        item.classList.add('active');

        let category = item.getAttribute('data-category');
        if (category) {
            category = category.toLowerCase();        // ← quan trọng
            await renderMeals(category);
        }
    });
});

// Load mặc định
renderMeals("cay");;