// ==================== FOOD DETAIL - RENDER TỪ GOOGLE SHEET ====================

const API_URL = "https://script.google.com/macros/s/AKfycbxXVs2tYNYrFk-QPX4scZPAOGRk1zU0P-v1eV4WCx_sA_6b9MZBvmpKZjYelminc278/exec";

document.addEventListener('DOMContentLoaded', async () => {
    const idParam     = getQueryParam('id');
    const nameParam   = getQueryParam('name');
    const category    = getQueryParam('category') || "cay";

    if (!idParam && !nameParam) {
        showError("Không tìm thấy tham số id hoặc name trong URL");
        return;
    }

    try {
        let url = `${API_URL}?category=${category}`;

        if (idParam) {
            url += `&id=${encodeURIComponent(idParam)}`;
        } else if (nameParam) {
            url += `&name=${encodeURIComponent(nameParam)}`;
        }

        const response = await fetch(url);
        const result = await response.json();

        if (!result.success) {
            showError(result.error || "Không tìm thấy món ăn");
            return;
        }

        const food = result.data;

        // Render phần chính với displayname và UPPERCASE
        renderMainInfo(food);

        // Render bảng chi tiết
        renderDetailTable(food);

        console.log("Đã load thành công món ăn:", food);

    } catch (error) {
        console.error(error);
        showError("Lỗi kết nối với server. Vui lòng thử lại sau.");
    }
});

// ==================== RENDER PHẦN TIÊU ĐỀ + ẢNH + MÔ TẢ ====================
function renderMainInfo(food) {
    // Dùng displayname và chuyển thành UPPERCASE
    const displayName = (food.displayname || food.title || "KHÔNG CÓ TÊN").toUpperCase();

    // Title & Display Name
    const titleEl = document.querySelector('.food-title');
    titleEl.innerHTML = displayName;        // ← Đã uppercase

    // Mô tả ngắn
    const descEl = document.querySelector('.food-describe');
    descEl.textContent = food.mota || food.describe || "Đang cập nhật mô tả...";

    // Ảnh
    const imgEl = document.querySelector('.food-img');
    if (imgEl) {
        imgEl.src = food.hinhanh || food.img || "imagine/default.jpg";
        imgEl.alt = displayName;
    }
}

// ==================== RENDER BẢNG CHI TIẾT ====================
function renderDetailTable(food) {
    const detailTable = document.querySelector('.infor-table');
    detailTable.innerHTML = '';

    const fields = [
        { label: "Tính-Vị-Kinh",          key: "tinhvikinh" },
        { label: "Công năng cổ truyền",   key: "congnangcotruyen" },
        { label: "Công năng hiện đại",    key: "congnanghiendai" },
        { label: "Các món ăn kèm hợp",    key: "monankem" },
        { label: "Các món ăn kèm không hợp", key: "monkhonghop" },
        { label: "Đối tượng phù hợp",     key: "doituongphuhop" },
        { label: "Đối tượng kiêng kị",    key: "doituongkhongphuhop" }
    ];

    let html = '';
    fields.forEach(field => {
        const value = food[field.key] || 'Chưa cập nhật';
        html += `
            <div class="infors">
                <p class="title-infor">${field.label}</p>
                <p class="infor">${value}</p>
            </div>
        `;
    });

    detailTable.innerHTML = html;
}

// ==================== HIỂN THỊ LỖI ====================
function showError(message) {
    document.querySelector('.food-title').innerHTML = "LỖI";
    document.querySelector('.food-describe').textContent = message;
}

// ==================== LẤY THAM SỐ TỪ URL ====================
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}