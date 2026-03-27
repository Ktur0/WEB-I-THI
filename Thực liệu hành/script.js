document.addEventListener('DOMContentLoaded', () => {

    // Slider begin
    const CaroS = document.querySelector('.Carousel-slider');
    const CaroSlider = new MicroSlider(CaroS, { indicators: true, indicatorText: '' });
    const hammer = new Hammer(CaroS);
    const CaroSTimer = 2000;
    let CaroAutoplay = setInterval(() =>  CaroSlider.next(), CaroSTimer);
    
    // Mouseenter Event 
    CaroS.onmouseenter = function(e) {
        clearInterval(CaroAutoplay);
        console.log(e.type + ' mouse onmouseenter detected');
    };

    //Mouseleave Event 
    CaroS.onmouseleave = function(e) {
        clearInterval(CaroAutoplay);
        CaroAutoplay = setInterval(() => CaroSlider.next(), CaroSTimer);
        console.log(e.type + ' mouse onmouseleave detected');
    };

    // Mouseclick Event 
    CaroS.onclick = function(e) { 
        clearInterval(CaroAutoplay);
        console.log(e.type + 'mouse onclick detected');
    };

    // Gesture Tap Event 
    hammer.on('tap', function(e){
        clearInterval(CaroAutoplay);
        console.log(e.type + 'getsure detected')
    });

    // Getsure Swipe Event 
    hammer.on('swipe', function(e){
        clearInterval(CaroAutoplay);
        CaroAutoplay = setInterval(() => CaroSlider.next(), CaroSTimer);
        console.log(e.type + 'getsure detected');
    });

    let slideLink = document.querySelectorAll('.slider-item');
    if (slideLink && slideLink !== null && slideLink.length>0){
        slideLink.forEach( el => el.addEventListener('click', e => {
            //e.preventDefault();
            let href= el.dataset.href;
            let target = el.dataset.target;
            if (href != '#' && el.classList.contains('active')) window.location.href = href;;
            
        }));
    }
    if (slideLink && slideLink !== null && slideLink.length>0){
        slideLink.forEach( el => el.addEventListener('touchend', e => {
            //e.preventDefault();
            let href= el.dataset.href;
            let target = el.dataset.target;
            if (href != '#' && el.classList.contains('active')) window.location.href = href;;
            
        }));
    }
    // Slider end 

    // Click menu
    const menus = document.querySelectorAll('.menu');
    menus.forEach(menu => {
    menu.addEventListener('click',(e) => {
      console.log('click');
      e.preventDefault(); // Ngăn reload
      window.scrollTo({
          top: 0,
          behavior: 'smooth' // cuộn mượt
      });
    })});
});