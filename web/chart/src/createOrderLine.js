import { growthOrder, activeFounds, saveOrderCache } from './ordersHelpers.js';
import { createStopLossOrder, changeOrderState } from './chartUpdates.js';
import { createOrderInChart, createRowTable } from './ordersTemplatesHelpers.js';
import { saveOrder } from './saveOrder.js';
import { LP } from './streaming.js'; // import last price each time the socket update a tick

const lastPriceInput = document.querySelector('.idOp');
let count = 0;
let userOrders  = [];
let pendingOrders = [];

export { userOrders, pendingOrders };

export const  setMarketOrder  = function(stopPrice, lotes, orderType) {
    lotes  = (lotes * 10);
    if (!activeFounds(lotes, orderType)) return;
    if (growthOrder(LP, lotes, orderType, stopPrice)) return;
    createOrder(LP, lotes, orderType, false, stopPrice);
}

export const setOrderProgrammable = function(price, lotes, orderType, stopPrice) {
    lotes  = (lotes * 10); // get the dollas quantity of the order
    createOrder(price, lotes, orderType, true, stopPrice);
}

export const createOrder = function (price, quantity, orderType, prog, stopPrice, flag) {
    /* create order in active chart called order */
    if (flag) {
        const order = window.tvWidget.activeChart().createOrderLine();
        order.setPrice(price);
        order.setQuantity(quantity);
        prog ? order.setText("Cover limit order") : order.setText("Cover market order") ;
        const orderObject = saveOrder(order, orderType, price, prog, stopPrice, flag);
        createOrderInChart(orderObject, order); // create order in chart
        createRowTable(orderObject);  // create row in table orders
    }
    else {
        const order = window.tvWidget.activeChart().createOrderLine();
        order.setPrice(price);
        order.setQuantity(quantity / 10);
        prog ? order.setText("Cover limit order") : order.setText("Cover market order") ;
        const orderObject = saveOrder(order, orderType, price, prog, stopPrice); // save order in object, return an order object  info
        createOrderInChart(orderObject, order); // create order in chart
        createRowTable(orderObject);  // create row in table orders

        if (orderObject.stopOrder != 'NaN' && orderObject.stopOrder != "esaCosa") {
            createStopLossOrder(orderObject, orderType);
        } else return (orderObject);
    }
    //createRowTable(orderObject);  // create row in table orders
}

export const pendingOrdersReview = function () {
    /* 
        Update pending orders to complete succesfully orders
        if a price in a prending order is equal to last pice the oerder must be taked
    */
    lastPriceInput.placeholder = LP.toFixed(1);

    if (count < 1) {
        let cache2 = window.localStorage.getItem('userOrders');
        if (cache2) {
            cache2 = JSON.parse(cache2);
            cache2.forEach(el => {
                createOrder(el.price, el.quantity, el.type, false, el.stopOrder, true);
            })
        }
        let cache = window.localStorage.getItem('pendingOrders');
        if (cache) {
            cache = JSON.parse(cache);
            cache.forEach(el => {
                createOrder(el.price, el.quantity, el.type, true, el.stopOrder, true);
            })
        }
        count++;
    }

    //updates real price in price order input
    if (userOrders.length) {
        GLverificate();
    }
    if (pendingOrders.length) {
        pendingOrders.filter(element => {
            if (element.price == LP) {
                if (!activeFounds((element.quantity * 10), element.type)) return;
                element.isProgrammable = false;
                element.programmable = false;
                element.state = "success";
                changeOrderState(element, element.state, 5, true); //change the order template state to success
                userOrders.push(element); // push the order to sucess orders
                pendingOrders.splice(pendingOrders.indexOf(element), 1); // deletes order from pending

                let pending = window.localStorage.getItem('pendingOrders');
                if (pending) {
                    pending = JSON.parse(pending);

                    pending.filter(el => {
                        const pr = parseInt(element.price);
                        const elPrice = parseInt(el.price);
                        if (pr.toFixed() === elPrice.toFixed()) {
                            const index = pending.indexOf(el);
                            if (index > -1) pending.splice(index, 1);
                            window.localStorage.setItem('pendingOrders', JSON.stringify(pending));
                        }
                    });
                }

                let usersOr = window.localStorage.getItem('userOrders');
                if (usersOr) {
                    usersOr = JSON.parse(usersOr);
                } else {
                    usersOr = [];
                    usersOr.push(element);
                    if (window.localStorage.getItem('userOrders')) window.localStorage.removeItem('userOrders')
                    saveOrderCache('userOrders', usersOr);
                }
            }
        });
    }
}

function GLverificate () {
    userOrders.forEach(el => {
        let last = (LP - el.price).toFixed(1);
        if (el.type === "buy" || el.type === "Buy") {
            const element = changeOrderState(el, last, 6);
            if (last > 0) {
                element.classList.remove('redFont');
                element.classList.add('greenFont');

            } else if (last < 0){
                element.classList.remove('greenFont')
                element.classList.add('redFont');
            } else {
                element.classList.remove('greenFont');
                element.classList.remove('redFont');
            }
        }
    });
}

export const founds = function () {
    /* show the user found in chas item input */
    const p = document.createElement('p');
    const cashItem = document.querySelector('.cash');
    let found = JSON.parse(window.localStorage.getItem('money'));
    console.log(found);
    if (found) cashItem.appendChild(document.createTextNode(found.toLocaleString()));
    else cashItem.appendChild(document.createTextNode(money.toLocaleString()));
}

/*other methos that can set to the order line on th chart
      const color = '#ff9f0a';
      const fontColor = '#fff';
      //.setText("Buy Line")
      //.setLineLength(1)
      //.setLineStyle(3)
      .onModify(res => res)
      //.setLineColor(color)
      /*.setBodyTextColor(fontColor)
      .setBodyBorderColor(color)
      .setBodyBackgroundColor(color)
      .setQuantityBorderColor(color)
      .setQuantityTextColor(fontColor)
      .setQuantityBackgroundColor(color)
      .setCancelButtonBorderColor(color)
      .setCancelButtonBackgroundColor(color)
      .setCancelButtonIconColor(fontColor)
      .setLineLength(25) // Margin right 25%
      .setLineStyle(2)
      //n.lines.set(id, widget)
      console.log(n)*/