import  {  changeOrderState, createStopLossOrder, updateOrderChart } from './chartUpdates.js';
import { userOrders} from './createOrderLine.js';
import { setCacheForElement } from './locaStorage.js';
import { LP } from './streaming.js';    
//export let currencies = {};
//export let money = 100000;

let money = JSON.parse(window.localStorage.getItem('money'));
if (!money) {
    window.localStorage.setItem('money', JSON.stringify(100000));
    money = JSON.parse(window.localStorage.getItem('money'))
}

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
            console.log(currencies);
            window.localStorage.setItem('currencies', JSON.stringify(currencies));
            console.log(window.localStorage.getItem('currencies'))
        
        } else {
            currencies[currency]  += lotes;
            window.localStorage.setItem('currencies', JSON.stringify(currencies));
        }
        let _money = JSON.parse(window.localStorage.getItem('money'));
        if (_money)  {
            _money -= lotes;
            window.localStorage.setItem('money', JSON.stringify(_money));
        }

    }
    else {
        // sell a currency if the user had bought
        let _currencies = JSON.parse(window.localStorage.getItem('currencies'));
        if (_currencies) {
            if (_currencies.hasOwnProperty(currency)) {
                if (lotes > _currencies[currency]) {
                    console.log('cant sell this quantity you only have: ' + _currencies[currency] + ' in ' + currency);
                    return;
                }
                if (userOrders.length) {
                    let _money = JSON.parse(window.localStorage.getItem('money'));
                    console.log(_money);
                
                    userOrders.forEach(el => {
                        let last = (LP - el.price);
                        last = last * lotes;
                        if (last === 0 || last === 0.0 || last === -0.0) {
                            _money += lotes;

                        }
                        else if (last > 0) {
                            _money += last + lotes;
                        }
                        else {
                            const res = lotes + last;
                            _money += res;
                        }
                        _currencies[currency] -= lotes;
                        setCacheForElement([[_money, 'money'], [_currencies, 'currencies']]);
                    })
                }
            }
        }
        else {
            console.log('cant sell this quantity you only have: 0'  + ' in ' + currency);
            return;
        }
    }
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

export const saveOrderCache = function (reference, obj) {
    let eso = [];
    window.localStorage.setItem(reference, JSON.stringify(obj, function(key, val) {
    if (val != null && typeof val == "object") {
        if (eso.indexOf(val) >= 0) return;
        eso.push(val);
    }
    return val;
    }));
}