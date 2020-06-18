import { userOrders, pendingOrders } from  './createOrderLine.js';
import { LP } from './streaming.js';

export const deleteOrder = function(price, isProgrammable) {
    /* Delete an specific order  calling deleteSpecific pasing properly obj */
    if (isProgrammable === 'false') {
        console.log("here")
        deleteSpecific(price, userOrders);
    } else {
        deleteSpecific(price, pendingOrders);
    }
}

export const deleteSpecific = function (price, ordersObject) {
    /* deletes order from active chart and object */
    ordersObject.forEach(element => {
        if (price === element.price) {
            if (element.stopOrderId) {
                if (pendingOrders.length) {
                    deleteSpecificPendingOrder(element.stopOrder, element.stopOrderTemp);
                }
            }
            console.log(element);
            let money = JSON.parse(window.localStorage.getItem('money'));
            
            if (money) {
                const currency = window.tvWidget.activeChart().symbol().split(":")[1];

                if (element.short && !element.programmable) {
                    let shortCurrencies = JSON.parse(window.localStorage.getItem('shortCurrencies'));
                    shortCurrencies[currency] -= element.quantity * 10;
                    if (shortCurrencies[currency] === 0) window.localStorage.removeItem('shortCurrencies');
                    else window.localStorage.setItem('shortCurrencies', JSON.stringify(shortCurrencies));
                }
                else {

                    let  currencies = JSON.parse(window.localStorage.getItem('currencies'));
                    if (currencies) {
                        console.log(element.quantity);
                        currencies[currency] -= element.quantity * 10;
                        if (currencies[currency] === 0) window.localStorage.removeItem('currencies');
                        else window.localStorage.setItem('currencies', JSON.stringify(currencies));
                    }

                }
                let last = (LP - element.price);
                last = last * (element.quantity * 10);
                money += ((element.quantity * 10) + last);
                console.log(money)
                window.localStorage.setItem('money', JSON.stringify(money));
                console.log(window.localStorage.getItem('money'));
                const cashItem = document.querySelector('.cash');
                cashItem.innerText = cashItem.textContent = money.toLocaleString();

            }

            const index = ordersObject.indexOf(element); // get the index of the object
            element.orr.remove(); // remove the order of the chart
            if (index > -1) ordersObject.splice(index, 1); // deletes the order of the object
            let cache = window.localStorage.getItem('userOrders');
            if (cache) {
                window.localStorage.removeItem('userOrders');
            }

            let pendingCache = window.localStorage.getItem('pendingOrders');
            if (pendingCache) {
                pendingCache = JSON.parse(pendingCache);

                pendingCache.filter(el => {
                    const pr = parseInt(element.price);
                    const elPrice = parseInt(el.price);
                    if (pr.toFixed() === elPrice.toFixed()) {
                        const index = pendingCache.indexOf(el);
                        if (index > -1) pendingCache.splice(index, 1);
                        window.localStorage.setItem('pendingOrders', JSON.stringify(pendingCache));
                        console.log(JSON.parse(window.localStorage.getItem('pendingOrders')));
                    }
                });
            }
        }
    });
}

function deleteSpecificPendingOrder(price, stopOrder) {
    for (const x in pendingOrders) {
        const pr = parseInt(pendingOrders[x].price);
        price = parseInt(price);
        if (pr.toFixed() === price.toFixed()) {
            deletesOrdersbyButton(price);
            stopOrder.remove();

            let cache = window.localStorage.getItem('pendingOrders');
            if (cache) {
                cache = JSON.parse(cache);

                cache.filter(el => {
                    let elPrice = parseInt(el.price);
                    if (pr.toFixed() === elPrice.toFixed()) {
                        const index = cache.indexOf(el);
                        if (index > -1) cache.splice(index, 1);
                        window.localStorage.setItem('pendingOrders', JSON.stringify(cache));
                    }
                });
            }
            pendingOrders.splice(pendingOrders.indexOf(pendingOrders[x]), 1);
        }
    }
}

export const  deletesOrdersbyButton = function(price) {
    const ordersTemplate = document.getElementById('operations_list');
    const orders = ordersTemplate.childNodes;
    for (let i = 4; i < orders.length; i++) {
        let pr = parseInt(orders[i].cells[2].dataset.price);
        if (pr.toFixed() === price.toFixed()) {
            deleteParenNode(orders[i]);
        }
    }
}

export const deleteParenNode = function(_order) {
    const order = _order.getElementsByTagName('td')[6];
    order.parentNode.remove();
}