import  {  changeOrderState, createStopLossOrder, updateOrderChart } from './chartUpdates.js';
import { userOrders} from './createOrderLine.js';
import { LP } from './streaming.js';
export let currencies = {};
export let money = 100000;


export const activeFounds = function(lotes, orderType) {
    /* Verificates and make properly operation for found in order */
    const currency = window.tvWidget.activeChart().symbol().split(":")[1]; //symbol pair
    console.log(orderType)
    if (orderType === "Buy" || orderType === "buy") {
        if (money <= 0 || (money - lotes) < 0) {
            console.log("not enought founds");
            return;
        }
        // currencies will contains the currency user has in lotes price
        if (!currencies.hasOwnProperty(currency)) {
            currencies[currency] = lotes;

        } else currencies[currency]  += lotes;
        money -= lotes;
    }
    else {
        // sell a currency if the user had bought
        if (currencies.hasOwnProperty(currency)) {
            if (lotes > currencies[currency]) {
                console.log('cant sell this quantity you only have: ' + currencies[currency] + ' in ' + currency);
                return;
            }
        if (userOrders.length) {
            userOrders.forEach(el => {
                let last = (LP - el.price);
                currencies[currency] -= lotes;
                console.log(lotes + last)
                money += (lotes + last);
            })
        }
            console.log(currencies)
        }
        else {
            console.log('cant sell this quantity you only have: 0'  + ' in ' + currency);
            return;
        }
    }
    console.log(currencies);
    const cashItem = document.querySelector('.cash');
    cashItem.innerText = cashItem.textContent = money.toLocaleString();
    return true;
}

export const growthOrder = function(price, quantity, orderType, stopPrice) {
    let bool = false;
    userOrders.forEach(el => {
        el.price = parseFloat(el.price)
        if (price.toFixed(1) === el.price.toFixed(1)) {
            console.log(el.stopOrder + ' ' + 'stop' + stopPrice)
            if (el.stopOrder === 'NaN' && stopPrice != '') {
                el.stopOrder = stopPrice;
                console.log('happens')
                changeOrderState(el, el.stopOrder, 3);
                createStopLossOrder(el, orderType);
            }
            bool = updateOrderChart(el, quantity, price, orderType);
            changeOrderState(el, el.quantity, 4);
        } else {
            console.log(el.stopOrder + ' ' + 'stop' + stopPrice)
            if (el.stopOrder === 'NaN' && stopPrice != '') {
                console.log(el);
                el.stopOrder = stopPrice;
                createStopLossOrder(el, orderType);
            }
            bool = updateOrderChart(el, quantity, price, orderType);
            changeOrderState(el, el.price, 2);
            changeOrderState(el, el.quantity, 4);
        }
    });
    return bool;
}