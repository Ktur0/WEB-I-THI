function renderCategories() {
    console.log('Đang render danh sách các loại thực phẩm...');
    const lists = document.querySelectorAll('.food-type-item');
    console.log('Danh sách các loại thực phẩm:');
    console.log(lists);
    lists.forEach(list => {
        console.log(list);
        list.addEventListener('click', () => {
            lists.forEach(item => item.classList.remove('active'));
            list.classList.add('active');
        });
    });
}
window.onload = () => {
    renderCategories();
    
  };