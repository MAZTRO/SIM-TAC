import  {  changeOrderState, createStopLossOrder, updateOrderChart } from './chartUpdates.js';
import { userOrders} from './createOrderLine.js';
import { LP } from './streaming.js';    
//export let currencies = {};
//export let money = 100000;

let money = window.localStorage.getItem('money');
if (money) {
    money = JSON.parse(money)
} else {
    window.localStorage.setItem('money', JSON.stringify(100000));
    money = JSON.parse(window.localStorage.getItem('money'));
}
//window.localStorage.setItem('money', JSON.stringify(100000));

export const activeFounds = function(lotes, orderType) {
    /* Verificates and make properly operation for found in order */
    let currencies = JSON.parse(window.localStorage.getItem('currencies'));
    const currency = window.tvWidget.activeChart().symbol().split(":")[1]; //symbol pair
    if (orderType === "Buy" || orderType === "buy") {
        
        if (money <= 0 || (money - lotes) < 0) {
            console.log("not enought founds");
            return;
        }
        // currencies will contains the currency user has in lotes price
        if (!currencies) {
            currencies = {};
            currencies[currency] = lotes;
            window.localStorage.setItem('currencies', JSON.stringify(currencies));
        
        } else {
            currencies[currency]  += lotes;
            window.localStorage.removeItem('currencies');
            window.localStorage.setItem('currencies', JSON.stringify(currencies));
        }
        money -= lotes;
        window.localStorage.setItem('money', JSON.stringify(money));

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
                    last = last * lotes;
                    if (last === 0) {
                        money += (lotes);
                    }
                    else if (last > 0) {
                        money += last + lotes;
                    }
                    else {
                        money -= lotes - last;
                    }
                    window.localStorage.removeItem('money');
                    window.localStorage.setItem('money', JSON.stringify(money));
                    currencies[currency] -= lotes;
                    window.localStorage.removeItem('currencies');
                    window.localStorage.setItem('currencies', JSON.stringify(currencies));
                })
            }
        }
        else {
            console.log('cant sell this quantity you only have: 0'  + ' in ' + currency);
            return;
        }
    }
    console.log(currencies);
    const cashItem = document.querySelector('.cash');
    cashItem.innerText = cashItem.textContent = JSON.parse(window.localStorage.getItem('money')).toLocaleString();//money.toLocaleString();
    return true;
}

export const growthOrder = function(price, quantity, orderType, stopPrice) {
    let bool = false;

    userOrders.forEach(el => {
        el.price = parseFloat(el.price)
        if (price.toFixed(1) === el.price.toFixed(1)) {
            if (el.stopOrder === 'NaN' && stopPrice != '') {
                el.stopOrder = stopPrice;
                changeOrderState(el, el.stopOrder, 3);
                createStopLossOrder(el, orderType);
            }
            bool = updateOrderChart(el, quantity, price, orderType);
            changeOrderState(el, el.quantity, 4);
            
            if (window.localStorage.getItem('userOrders')) window.localStorage.removeItem('userOrders');
            saveOrderCache('userOrders', userOrders);
    
        } else {
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

function saveOrderCache (reference, obj) {
    let eso = [];
    window.localStorage.setItem(reference, JSON.stringify(obj, function(key, val) {
    if (val != null && typeof val == "object") {
        if (eso.indexOf(val) >= 0) return;
        eso.push(val);
    }
    return val;
    }));
}
