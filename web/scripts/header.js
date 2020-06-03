const topBar = document.querySelector('.top-bar');
const medBar = document.querySelector('.med-bar');
const botBar = document.querySelector('.bot-bar');

const userMenu = document.querySelector('.userMenu');
const menuSlide = document.querySelector('.menuSlideClose');

userMenu.addEventListener('click', event => {
  if (userMenu.className === 'userMenu') {
    menuSlide.className = 'menuSlideOpen';
    userMenu.className = 'userMenuOpen';
    console.log('MENU OPEN');
    console.log(menuSlide.className);
  } else {
    menuSlide.className = 'menuSlideClose';
    userMenu.className = 'userMenu';
    console.log('MENU CLOSE');
  }
});


