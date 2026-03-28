// ==================== SLIDER JS - INFINITE LOOP + DOTS ĐÚNG ====================
console.log("=== Infinite Slider với Clone & Dots sửa lỗi ===");

let active = 1;           // Bắt đầu từ slide thật thứ 1
let list, items, dots, prevBtn, nextBtn;
let isTransitioning = false;

function goToSlide() {
    if (isTransitioning) return;
    isTransitioning = true;

    list.style.transition = "left 0.6s ease";
    list.style.left = `-${items[active].offsetLeft}px`;

    // Cập nhật dots đúng (dựa trên slide thật, không phải active clone)
    let realIndex = (active - 1) % 5;
    if (realIndex < 0) realIndex = 4;        // ← Sửa lỗi này

    dots.forEach(dot => dot.classList.remove('active'));
    if (dots[realIndex]) dots[realIndex].classList.add('active');

    console.log(`→ Slide ${active} | Dot active: ${realIndex + 1}`);

    setTimeout(() => isTransitioning = false, 650);
}

// Xử lý Infinite Loop mượt mà
function handleInfiniteLoop() {
    // Next: từ slide clone cuối (6) → về slide 1
    if (active === 6) {
        setTimeout(() => {
            list.style.transition = "none";
            list.style.left = `-${items[1].offsetLeft}px`;
            active = 1;
            setTimeout(() => list.style.transition = "left 0.6s ease", 30);
        }, 620);
    }

    // Prev: từ slide 1 → về slide clone cuối (5)
    if (active === 0) {
        setTimeout(() => {
            list.style.transition = "none";
            list.style.left = `-${items[5].offsetLeft}px`;
            active = 5;
            setTimeout(() => list.style.transition = "left 0.6s ease", 30);
        }, 620);
    }
}

// Khởi tạo
window.addEventListener('load', function() {
    list     = document.querySelector('.slider .list');
    const originalItems = document.querySelectorAll('.slider .list .meals');

    // Tạo clone
    const firstClone = originalItems[0].cloneNode(true);
    const lastClone  = originalItems[originalItems.length - 1].cloneNode(true);

    list.appendChild(firstClone);           // clone slide 1 ở cuối
    list.insertBefore(lastClone, originalItems[0]); // clone slide 5 ở đầu

    items = document.querySelectorAll('.slider .list .meals');
    dots  = document.querySelectorAll('.slider .dots li');
    prevBtn = document.getElementById('prev');
    nextBtn = document.getElementById('next');

    console.log(`Tổng slides sau clone: ${items.length}`);

    // Nút Next
    nextBtn.onclick = function() {
        active++;
        goToSlide();
        handleInfiniteLoop();
    };

    // Nút Prev
    prevBtn.onclick = function() {
        active--;
        goToSlide();
        handleInfiniteLoop();
    };

    // Dots
    dots.forEach((dot, index) => {
        dot.onclick = () => {
            active = index + 1;        // +1 vì active bắt đầu từ 1
            goToSlide();
        };
    });

    // Khởi tạo
    list.style.left = `-${items[1].offsetLeft}px`;
    dots[0].classList.add('active');
});