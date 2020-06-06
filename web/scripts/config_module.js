const operationList = document.getElementsByTagName('tr');

for (let  i = 1; i < operationList.length; i++) {
  if (operationList[i].cells[2].textContent === 'Buy') {
    operationList[i].cells[2].style.color = "rgb(25, 175, 58)";
  } else if (operationList[i].cells[2].textContent === 'Sell') {
    operationList[i].cells[2].style.color = "rgb(209, 65, 65)";
  }
}
