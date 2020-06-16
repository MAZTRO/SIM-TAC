let scroll = new SmoothScroll();
/* get the position of browser */
let position;

/* menu buttons */
const btnFeatures = document.querySelector('.Features');
const btnAboutUs = document.querySelector('.AboutUs');
const btnContactUs = document.querySelector('.ContactUs');
const btnUP = document.querySelector('#up');
const btnArrow = document.querySelector('.arrow');


btnArrow.addEventListener('click', e => {
  let anchor = document.querySelector('#features');
  scroll.animateScroll(anchor);
});

btnFeatures.addEventListener('click', e => {
  let anchor = document.querySelector('#features');
  scroll.animateScroll(anchor);
});

btnAboutUs.addEventListener('click', e => {
  let anchor = document.querySelector('#aboutussection');
  scroll.animateScroll(anchor);
});


btnContactUs.addEventListener('click', e => {
  let anchor = document.querySelector('#FAQ');
  scroll.animateScroll(anchor);
});

btnUP.addEventListener('click', e => {
  scroll.animateScroll(0);
});

window.onscroll = function (){
  position = document.documentElement.scrollTop || document.body.scrollTop;
  console.log(position);

  /* Button to go up */
  if(position > 700){
    btnUP.className = 'UP TO';
  } else {
    btnUP.className = 'UP';
  }


  /* change size of header */
  const header = document.getElementsByTagName('header');

  if(position > 680){
    header[0].className = 'small';
  } else {
    header[0].className = 'big';
  }
}
