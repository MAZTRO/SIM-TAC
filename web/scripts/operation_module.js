const headtabs = document.querySelectorAll('.HeadTab');
const tabs = document.querySelectorAll('.tab');

const priceInputLimit = document.querySelector('.price');

const marketHead = headtabs[0];
const limitHead = headtabs[1];

const marketTab = tabs[0];
const limitTab = tabs[1];

console.log(tabs);

marketHead.addEventListener('click', event => {
  marketHead.className = "HeadTab headOpen";
  limitHead.className = "HeadTab";
  limitTab.className = "tab";
  marketTab.className = "tab tabOpen";
  priceInputLimit.disabled = true;
  console.log("Market");
});

limitHead.addEventListener('click', event => {
  limitHead.className = "HeadTab headOpen";
  marketHead.className = "HeadTab";
  marketTab.className = "tab";
  limitTab.className = "tab tabOpen";
  priceInputLimit.disabled = false;
  console.log("Limit");
});