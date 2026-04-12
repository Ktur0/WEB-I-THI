// ==================== FOOD DETAIL - RENDER TỪ DATA ====================

const data_main = {
    "Thịt lợn xào hành gừng": {
        title: "THỊT LỢN XÀO HÀNH GỪNG",
        displayName: "THỊT LỢN XÀO <br> HÀNH GỪNG",
        describe: "Món ăn này kết hợp thịt heo giàu protein với hành và gừng có tính ấm, giúp tăng cường sức khỏe, cải thiện tuần hoàn máu và hỗ trợ tiêu hóa. Đây là một lựa chọn thực phẩm bổ dưỡng, phù hợp cho những người muốn duy trì sức khỏe tốt và phòng ngừa bệnh tật.",
        img: "imagine/thịt heo xào gừng.png"
    },
    "Cá lóc kho tiêu": {
        title: "CÁ LÓC KHO TIÊU",
        displayName: "CÁ LÓC <br> KHO TIÊU",
        describe: "Món ăn này sử dụng cá lóc giàu Albumin và protein, kết hợp với tiêu đen chứa Piperine giúp kích thích vị giác và tăng cường hấp thu dưỡng chất. Với tính bình và tác dụng bổ tỳ, lợi thủy, đây là món ăn hỗ trợ tốt cho hệ tiêu hóa.",
        img: "imagine/thịt heo xào gừng.png"   // thay bằng ảnh thật sau
    }
    // Thêm món khác vào đây...
};

const food_detail = {
    "Thịt lợn xào hành gừng": {
        tinhvikinh: "Bình - Tân, Vào Tỳ, Vị",
        congnangcotruyen: "Kiện tỳ, tán hàn, ấm vị.",
        congnanghiendai: "Cung cấp Protein, Gingerol hỗ trợ tiêu hóa, giảm đầy hơi.",
        monankem: "Cơm trắng, rau luộc.",
        monkhonghop: "Không ăn cùng tôm đại phong (dễ dị ứng).",
        doituongphuhop: "Người tiêu hóa kém, sợ lạnh.",
        doituongkhongphuhop: "Người đang sốt cao."
    },
    "Cá lóc kho tiêu": {
        tinhvikinh: "Bình - Tân, Vào Tỳ, Thận",
        congnangcotruyen: "Bổ tỳ, lợi thủy, hành khí.",
        congnanghiendai: "Cung cấp Albumin, Piperine giúp tăng hấp thu dưỡng chất.",
        monankem: "Canh rau muống.",
        monkhonghop: "Không kho cùng các loại dược liệu đắng.",
        doituongphuhop: "Người mới ốm dậy, phụ nữ sau sinh.",
        doituongkhongphuhop: "Người đang táo bón nặng."
    },
};

document.addEventListener('DOMContentLoaded', () => {
    const foodName = getQueryParam('name');

    if (!foodName) {
        document.querySelector('.food-title').innerHTML = "Không tìm thấy món ăn";
        document.querySelector('.food-describe').textContent = "Vui lòng kiểm tra lại đường dẫn.";
        return;
    }

    const foodData = data_main[foodName];
    const foodDetail = food_detail[foodName];

    // Kiểm tra dữ liệu có tồn tại không
    if (!foodData) {
        document.querySelector('.food-title').innerHTML = "Món ăn không tồn tại";
        document.querySelector('.food-describe').textContent = `Không tìm thấy thông tin cho món: ${foodName}`;
        return;
    }

    // Render thông tin chính (title, describe, ảnh)
    document.querySelector('.food-title').innerHTML = foodData.displayName || foodData.title || foodName.toUpperCase();
    document.querySelector('.food-describe').textContent = foodData.describe;

    const imgElement = document.querySelector('.food-img');
    if (imgElement && foodData.img) {
        imgElement.src = foodData.img;
    }

    // Render bảng thông tin chi tiết
    const detailTable = document.querySelector('.infor-table');
    detailTable.innerHTML = '';   // Xóa nội dung cũ

    if (foodDetail) {
        const renderDetail = `
            <div class="infors">
                <p class="title-infor">Tính-Vị-Kinh</p>
                <p class="infor">${foodDetail.tinhvikinh || 'Chưa cập nhật'}</p>
            </div>
            <div class="infors">
                <p class="title-infor">Công năng cổ truyền</p>
                <p class="infor">${foodDetail.congnangcotruyen || 'Chưa cập nhật'}</p>
            </div>
            <div class="infors">
                <p class="title-infor">Công năng hiện đại</p>
                <p class="infor">${foodDetail.congnanghiendai || 'Chưa cập nhật'}</p>
            </div>
            <div class="infors">
                <p class="title-infor">Các món ăn kèm hợp</p>
                <p class="infor">${foodDetail.monankem || 'Chưa cập nhật'}</p>
            </div>
            <div class="infors">
                <p class="title-infor">Các món ăn kèm không hợp</p>
                <p class="infor">${foodDetail.monkhonghop || 'Chưa cập nhật'}</p>
            </div>
            <div class="infors">
                <p class="title-infor">Đối tượng phù hợp</p>
                <p class="infor">${foodDetail.doituongphuhop || 'Chưa cập nhật'}</p>
            </div>
            <div class="infors">
                <p class="title-infor">Đối tượng kiêng kị</p>
                <p class="infor">${foodDetail.doituongkhongphuhop || 'Chưa cập nhật'}</p>
            </div>
        `;
        detailTable.innerHTML = renderDetail;
    } else {
        detailTable.innerHTML = `<p style="color:#ff9800; padding:20px;">Chưa có thông tin chi tiết cho món ăn này.</p>`;
    }

    console.log("Đã render chi tiết món:", foodName);
});

// Hàm lấy tham số từ URL
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}