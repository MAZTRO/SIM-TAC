/* data that is needed to make an order
    by User: 
        type (buy)
        price
        quantity
*/
// import { widget } from './main.js';
import { LP } from './streaming.js'; // import last price each time the socket update a tick
const ordersTemplate = document.querySelector('.ordersTemplate');
const cashItem = document.querySelector('.cash');
const priceInput = document.querySelector('.value');
const buyButton = document.getElementById('buy');
const sellButton = document.getElementById('sell');

let userOrders  = [];
let pendingOrders = [];
let money = 5000;
let count = 0;

/* Create order in the chart and correc objct assignement */
function orderCase (price, orderType) {
    let isProgrammable = false;
    if (!price) {
        const price = LP;
        createOrder(LP, '1200', orderType, isProgrammable);
    }
    else {
        isProgrammable = true;
        createOrder(price, '1200', orderType, isProgrammable);
    }
}

export const createOrder = function (price, quantity, orderType, isProgrammable) {
    const order  = window.tvWidget.activeChart().createOrderLine();
    order.setPrice(price);
    order.setQuantity(quantity);
    //order.onCancel("onCancel evert", deleteOrder);
    const orderObject = saveOrder(order, orderType, price, isProgrammable);
    createOrderTemplate(orderObject); // Create order in chart
}

function saveOrder (order, orderType, price, isProgrammable) {
    const orderObject = {
        type: orderType,
        id : order._line._id,
        price: price,
        quantity: order._data.quantityText,
        orr: order,
        programmable: isProgrammable
    }
    if (isProgrammable) {
        orderObject['state'] = 'pending';
        pendingOrders.push(orderObject);
    }
    else {
        orderObject['state'] = 'success';
        userOrders.push(orderObject);
    }
    return orderObject;
}

/* create orden template */
function createOrderTemplate(orderObject) {
    const HTMLString = cp(orderObject);
    const orderElement = createTemplate(HTMLString);
    ordersTemplate.append(orderElement);
    const closeOrderButton = document.getElementById(`closeOrderButton-${count}`);
    addCloseEvent(closeOrderButton);
}


function cp (el) {
    return (
        `<p class="" data-id='${el.id}' data-type='${el.type}' data-state='${el.state}'>
            order type: ${el.type} - price: ${el.price} - 
            quantity: ${el.quantity} - id: ${el.id} - state: ${el.state}
            <button id="closeOrderButton-${++count}" data-id='${el.id}' 
            data-is='${el.programmable}'> x </button>
        </p>`
    )
}

function createTemplate (HTMLString) {
    const html = document.implementation.createHTMLDocument()
    html.body.innerHTML = HTMLString
    return html.body.children[0]
}

/* Delete an specific order */
function deleteOrder (id, isProgrammable) {
    if (isProgrammable === 'false') {
        deleteSpecific(id, userOrders);
    } else {
        deleteSpecific(id, pendingOrders);
    }
}

function deleteSpecific(id, ordersObject) {
    ordersObject.forEach(element => {
        if (id === element.id) {
            const index = ordersObject.indexOf(element);
            element.orr._active = false;
            setTimeout(() => element.orr.remove(), 1000);
            if (index > -1) {
                ordersObject.splice(index, 1);
            }
        }
    });
}

/* Update pending orders */
export const pendingOrdersReview = function () {
    priceInput.placeholder = LP.toFixed(2);
    pendingOrders.forEach(element =>  {
        if (element.price == LP) {
            element.isProgrammable = false;
            userOrders.push(element);
            changeOrderState(element);
            pendingOrders.splice(pendingOrders.indexOf(element), 1);
        }
    });
}

function changeOrderState(element) {
    const oT = ordersTemplate.childNodes;
    for (const x in oT) {
        if (x >= 1) {
            if (oT[x].dataset.id == element.id) {
                console.log(oT[x].dataset.state)
                oT[x].dataset.state = "success";
                console.log(oT[x].dataset.state)
            }
        }
    }
}
/*****/
export const foundsTemplate = function () {
    const HTMLString = `<p>$ ${money}<p>`;
    const template = createTemplate(HTMLString)
    cashItem.append(template);
}
//function founds() {}

/* buttons events open and close */
buyButton.addEventListener('click', () => {
    orderCase(priceInput.value, buyButton.dataset.type);  
});

sellButton.addEventListener('click', () => {
    orderCase(priceInput.value, sellButton.dataset.type);
});

const addCloseEvent = function (element) {
    element.addEventListener('click', () => {
        deleteOrder(element.dataset.id, element.dataset.is);
        element.parentNode.remove();
    });
}
/*here
we  have two options first generate de complete order form
and send  to the api or send to the api and call it again with the
safe stored information*/


// send  Post order to the api

//  create order template

//  inner the order template in the view    


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
