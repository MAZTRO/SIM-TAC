var scroll = new SmoothScroll();

const btnFeatures = document.querySelector('.Features');
const btnAboutUs = document.querySelector('.AboutUs');
const btnContactUs = document.querySelector('.ContactUs');
const btnUP = document.querySelector('#up');
const btnArrow = document.querySelector('.arrow');


btnArrow.addEventListener('click', e => {
  var anchor = document.querySelector('#features');
  scroll.animateScroll(anchor);
});

btnFeatures.addEventListener('click', e => {
  var anchor = document.querySelector('#features');
  scroll.animateScroll(anchor);
});

btnAboutUs.addEventListener('click', e => {
  var anchor = document.querySelector('#aboutussection');
  scroll.animateScroll(anchor);
});


btnContactUs.addEventListener('click', e => {
  var anchor = document.querySelector('#contacUsSection');
  scroll.animateScroll(anchor);
});

btnUP.addEventListener('click', e => {
  console.log(window.scrollY);
  scroll.animateScroll(0);
});

window.onscroll = function (){
  var scroll = document.documentElement.scrollTop || document.body.scrollTop;
  console.log(scroll);
  if(scroll > 800){
    console.log(btnUP.classList);
    btnUP.className = 'UP TO';
  } else {
    btnUP.className = 'UP';
  }
}
