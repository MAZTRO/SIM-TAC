import { setMarketOrder, setOrderProgrammable, pendingOrders } from './createOrderLine.js';
import { deleteOrder } from './deleteHelpers.js';

const buyButton = document.getElementById('buy');
const sellButton = document.getElementById('sell');
const stopLostButton = document.getElementById('stop');

const priceInput = document.querySelector('.priceStop');// for price stop Lost
const lotesInput = document.querySelector('.lotsMarket');

// Limit order inputs
const priceInputLimit = document.querySelector('.price');
const lotesInputLimit = document.querySelector('.lotsLimit');
const stopInputLimit = document.querySelector('.stopIn');


buyButton.addEventListener('click', () => {
    if (priceInputLimit.disabled) {
        setMarketOrder(priceInput.value, lotesInput.value, buyButton.dataset.type);
    } else {
        //console.log(typeof priceInputLimit.value)
        setOrderProgrammable(priceInputLimit.value, lotesInputLimit.value, buyButton.dataset.type, stopInputLimit.value);
    }
});

sellButton.addEventListener('click', () => {
    if (priceInputLimit.disabled) {
        console.log("creating market sell order")
        setMarketOrder(priceInput.value, lotesInput.value, sellButton.dataset.type);
    } else {
        console.log("creating limit sell order");
        setOrderProgrammable(priceInputLimit.value, lotesInputLimit.value, sellButton.dataset.type, stopInputLimit.value);
    }
});

stopLostButton.addEventListener('click', (event) => {
    if (priceInput.disabled) {
        priceInput.disabled = false;
        stopLostButton.classList.add('closeGreen');
    } else {
        priceInput.disabled = true;
        stopLostButton.classList.remove('closeGreen');
    }
});

export const addCloseEvent = function (element) {
    console.log("clossing order proocess activate");
    element.addEventListener('click', () => {
        deleteOrder(element.dataset.id, element.dataset.is);
        element.parentNode.parentNode.remove();
    });
}
