// ==================== SLIDER JS - INFINITE LOOP + DOTS ĐÚNG ====================
console.log("=== Infinite Slider với Clone & Dots sửa lỗi ===");

let active_member = 1;           // Bắt đầu từ slide thật thứ 1
let list_member, items_member, dots_member, prevBtn_member, nextBtn_member;
let isTransitioning_member = false;

function goToSlide_member() {
    if (isTransitioning_member) return;
    isTransitioning_member = true;

    list_member.style.transition = "left 0.6s ease";
    list_member.style.left = `-${items_member[active_member].offsetLeft}px`;

    // Cập nhật dots đúng (dựa trên slide thật, không phải active clone)
    let realIndex_member = (active_member - 1) % 5;
    if (realIndex_member < 0) realIndex_member = 4;        // ← Sửa lỗi này

    dots_member.forEach(dot_member => dot_member.classList.remove('active'));
    if (dots_member[realIndex_member]) dots_member[realIndex_member].classList.add('active');

    console.log(`→ Slide ${active_member} | Dot active: ${realIndex_member + 1}`);

    setTimeout(() => isTransitioning_member = false, 650);
}

// Xử lý Infinite Loop mượt mà
function handleInfiniteLoop_member() {
    // Next: từ slide clone cuối (6) → về slide 1
    if (active_member === 6) {
        setTimeout(() => {
            list_member.style.transition = "none";
            list_member.style.left = `-${items_member[1].offsetLeft}px`;
            active_member = 1;
            setTimeout(() => list_member.style.transition = "left 0.6s ease", 30);
        }, 620);
    }

    // Prev: từ slide 1 → về slide clone cuối (5)
    if (active_member === 0) {
        setTimeout(() => {
            list_member.style.transition = "none";
            list_member.style.left = `-${items_member[5].offsetLeft}px`;
            active_member = 5;
            setTimeout(() => list_member.style.transition = "left 0.6s ease", 30);
        }, 620);
    }
}

// Khởi tạo
window.addEventListener('load', function() {
    list_member     = document.querySelector('.member-sliders .list-member');
    const originalItems_member = document.querySelectorAll('.member-sliders .list-member .member');

    // Tạo clone
    const firstClone_member = originalItems_member[0].cloneNode(true);
    const lastClone_member  = originalItems_member[originalItems_member.length - 1].cloneNode(true);

    list_member.appendChild(firstClone_member);           // clone slide 1 ở cuối
    list_member.insertBefore(lastClone_member, originalItems_member[0]); // clone slide 5 ở đầu

    items_member = document.querySelectorAll('.member-sliders .list-member .member');
    dots_member  = document.querySelectorAll('.member-sliders .dots-members li');
    prevBtn_member = document.getElementById('prev-member');
    nextBtn_member = document.getElementById('next-member');

    console.log(`Tổng slides sau clone: ${items_member.length}`);

    // Nút Next
    nextBtn_member.onclick = function() {
        active_member++;
        goToSlide_member();
        handleInfiniteLoop_member();
    };

    // Nút Prev
    prevBtn_member.onclick = function() {
        active_member--;
        goToSlide_member();
        handleInfiniteLoop_member();
    };

    // Dots
    dots_member.forEach((dot_member, index) => {
        dot_member.onclick = () => {
            active_member = index + 1;        // +1 vì active bắt đầu từ 1
            goToSlide_member();
        };
    });

    // Khởi tạo
    list_member.style.left = `-${items_member[1].offsetLeft}px`;
    dots_member[0].classList.add('active');
});