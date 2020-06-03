document.onclick = function(event) {

  const btn_curr = document.querySelectorAll('.currencies button');
  const btn_time = document.querySelectorAll('div.times > button');

  const btn = event.srcElement.classList;

  if (btn[0] === 'btn' && btn[1] === 'currencies') {
    event.srcElement.className = 'btn btnToggleCurr';

    for (let i = 0; i < btn_curr.length; i++) {
      if (btn_curr[i].id !== event.srcElement.id) {
        btn_curr[i].className = "btn currencies";
      }
    }
  } else if (btn[0] === 'btn' && btn[1] === 'btnToggleCurr') {
    event.srcElement.className = 'btn currencies';
  }

  if (btn[0] === 'btn' && btn[1] === 'time') {
    event.srcElement.className = 'btn btnToggleTime';

    for (let j = 0; j < btn_time.length; j++) {
      if (btn_time[j].id !== event.srcElement.id) {
        btn_time[j].className = "btn time";
      }
    }
  } else if (btn[0] === 'btn' && btn[1] === 'btnToggleTime') {
    event.srcElement.className = 'btn time';
  }
};
