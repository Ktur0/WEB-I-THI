// ==================== THỰC PHƯƠNG SLIDER - THEO THỂ LOẠI ====================

const data = {
    cay: [
        { name: "Thịt lợn xào hành gừng", desc: "Món ăn này kết hợp thịt heo giàu protein với hành và gừng có tính ấm...", img: "imagine/thịt lợn xào gừng nền.png" },
        { name: "Cá lóc kho tiêu", desc: "Món ăn này giúp kích thích vị giác và tăng cường hấp thu dưỡng chất.", img: "imagine/ga-xao-sa-ot.jpg" },
        { name: "Cá basa chiên giòn", desc: "Cá basa tẩm bột chiên giòn ăn kèm tương ớt.", img: "imagine/ca-basa-chien.jpg" },
        { name: "Bò xào tiêu đen", desc: "Thịt bò mềm thơm với vị tiêu cay đặc trưng.", img: "imagine/bo-xao-tieu-den.jpg" },
        { name: "Tôm rim cay", desc: "Tôm tươi rim với ớt và gia vị cay.", img: "imagine/tom-rim-cay.jpg" }
    ],
    chua: [
        { name: "Canh chua cá lóc", desc: "Món canh chua thanh mát, giàu vitamin từ rau củ.", img: "imagine/canh-chua-ca-loc.jpg" },
        // Thêm 4 món khác tương tự
        { name: "Canh chua tôm", desc: "...", img: "" },
        { name: "Salad chua ngọt", desc: "...", img: "" },
        { name: "Gỏi cuốn chua", desc: "...", img: "" },
        { name: "Cá kho chua ngọt", desc: "...", img: "" }
    ],
    man: [ /* thêm 5 món mặn */ ],
    dang: [ /* thêm 5 món đắng */ ],
    ngot: [ /* thêm 5 món ngọt */ ]
};

// ==================== BIẾN TOÀN CỤC ====================
let currentCategory = "cay";
let active = 1;
let list, items, dots, prevBtn, nextBtn;
let isTransitioning = false;

// ==================== RENDER DANH SÁCH MÓN ĂN ====================
function renderMeals(category) {
    currentCategory = category;

    const foodList = document.getElementById('food-list');
    foodList.innerHTML = '';   // xóa sạch

    data[category].forEach(meal => {
        const mealHTML = `
            <div class="meal">
                <img src="${meal.img}" class="food-list-img" alt="${meal.name}">
                <div class="meal-title">
                    <p class="meal-name">${meal.name}</p>
                    <p class="meal-describe">${meal.desc}</p>
                    <a class="find-more-meal" href="food_detail.html?name=${encodeURIComponent(meal.name)}">Tìm hiểu thêm</a>
                </div>
            </div>
        `;
        foodList.innerHTML += mealHTML;
    });

    // Sau khi render xong → khởi tạo lại slider hoàn toàn
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

    const realIndex = (active - 1) % (items.length - 2); // trừ 2 clone
    dots.forEach(dot => dot.classList.remove('active'));
    if (dots[realIndex]) dots[realIndex].classList.add('active');

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
document.addEventListener('DOMContentLoaded', () => {
    // Click category
    document.querySelectorAll('.food-type-item').forEach(item => {
        item.addEventListener('click', () => {
            document.querySelectorAll('.food-type-item').forEach(el => el.classList.remove('active'));
            item.classList.add('active');

            const category = item.getAttribute('data-category');
            renderMeals(category);
        });
    });

    // Load mặc định
    renderMeals('cay');   // sẽ tự gọi initSlider() bên trong
});