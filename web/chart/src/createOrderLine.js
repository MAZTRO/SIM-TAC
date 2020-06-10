import { LP } from './streaming.js'; // import last price each time the socket update a tick
/* import { LP } from './streaming.js'; */ // import last price each time the socket update a tick

//const ordersTemplate = document.querySelector('.operations_list');
const ordersTemplate = document.getElementById('operations_list');
const cashItem = document.querySelector('.cash');

// Market order inputs
const priceInput = document.querySelector('.priceStop');// for price stop Lost
const lotesInput = document.querySelector('.lotsMarket');
const lastPrice = document.querySelector('.idOp');
const stopLostButton = document.getElementById('stop');

// Limit order inputs
const priceInputLimit = document.querySelector('.price');
const lotesInputLimit = document.querySelector('.lotsLimit');
const stopInputLimit = document.querySelector('.stopIn');

const buyButton = document.getElementById('buy');
const sellButton = document.getElementById('sell');

let userOrders  = [];
let pendingOrders = [];
let currencies = {};
let money = 100000
let count = 0;

function setMarketOrder(stopPrice, lotes, orderType) {
    lotes  = (lotes * 10);
    if (!activeFounds(lotes, orderType)) return;
    if (growthOrder(LP, lotes, orderType, stopPrice)) return;
    createOrder(LP, lotes, orderType, false, stopPrice);
}

function setOrderProgrammable (price, lotes, orderType, stopPrice) {
    lotes  = (lotes * 10); // get the dollas quantity of the order
    createOrder(price, lotes, orderType, true, stopPrice);
}

function activeFounds (lotes, orderType) {
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
            currencies[currency] -= lotes;
            money += lotes;
            console.log(currencies)
        }
        else {
            console.log('cant sell this quantity you only have: 0'  + ' in ' + currency);
            return;
        }
    }
    console.log(currencies);
    cashItem.innerText = cashItem.textContent = money.toLocaleString();
    return true;
}

function growthOrder(price, quantity, orderType, stopPrice) {
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
        } else {
            bool = updateOrderChart(el, quantity, price, orderType);
            changeOrderState(el, el.price, 2);
            changeOrderState(el, el.quantity, 4);
        }
    });
    return bool;
}

function updateOrderChart(el, quantity, price, orderType) {
    if (orderType == 'sell') el.quantity -= (quantity / 10);
    else if (orderType == 'buy') el.quantity += (quantity / 10);
    
    if (el.quantity === 0) {
        el.orr.remove();
        deletesOrdersTemplates(el);
        deleteSpecificPendingOrder(el.stopOrderId);
        userOrders.splice(userOrders.indexOf(el), 1);
    }
    else {
        
        el.orr.setQuantity(el.quantity);
        if (el.stopOrderTemp) {
            el.stopOrderTemp.setQuantity(el.quantity);
            changeOrderState(el.stopOrderTemp._line, el.quantity, 4);
        }
        el.orr.setPrice((el.price + price) / 2);
        el.price = el.orr.getPrice().toFixed(1);
    }
    return true;
}

function deletesOrdersTemplates(el) {
    const orders = ordersTemplate.childNodes;
    for (let i = 4; i < orders.length; i++) {
        if (orders[i + 1]) {
            if (orders[i + 1].cells[0].dataset.id === el.stopOrderId) {
                deleteParenNode(orders[i + 1]);
                el.stopOrderTemp.remove();
            }
        }
        if (orders[i].cells[0].dataset.id === el.id) {
            deleteParenNode(orders[i]);
        }
    }
}

function  deleteParenNode (_order) {
    const order = _order.getElementsByTagName('td')[6];
    order.parentNode.remove();
}

function changeOrderState(element, text, index) {
    /* modify the order template once it needs pass order to success */
    let id;
    if (element._id) id = element._id;
    else id = element.id;
    const orders = ordersTemplate.childNodes;
    for (let i = 4; i < orders.length; i++) {
        if (orders[i].cells[0].dataset.id === id) {
            const order = orders[i].getElementsByTagName('td')[index]; 
            order.innerText = order.textContent = text;
            return order;
        }
    }
}

const createOrder = function (price, quantity, orderType, prog, stopPrice) {
    /* create order in active chart called order */
    const order  = window.tvWidget.activeChart().createOrderLine();
    order.setPrice(price);
    order.setQuantity(quantity / 10);
    prog ? order.setText("Cover limit order") : order.setText("Cover market order") 
    const orderObject = saveOrder(order, orderType, price, prog, stopPrice) ; // save order in object, return an order object  info  
    createOrderInChart(orderObject, order); // create order in chart
    createRowTable(orderObject); // crete row in table orders

    if (orderObject.stopOrder != 'NaN' && orderObject.stopOrder != "esaCosa") {
        createStopLossOrder(orderObject, orderType);
    } else return (orderObject);
}

function createOrderInChart(obj, order) {
    const buyColor = '#19af3a';
    const sellColor = "#d14141";
    (obj.type === "buy") ? orderStyleChart(order, buyColor, obj) : orderStyleChart(order, sellColor, obj);
}

function orderStyleChart (order, color, obj) {
    order.setLineColor(color).setBodyTextColor(color).setBodyBorderColor(color);                
    order.setQuantityBorderColor(color).setQuantityTextColor(color);
    order.setLineStyle(2).setQuantityBackgroundColor("#fff");
}

function saveOrder (order, orderType, price, isProgrammable, stopPrice) {
    /*
        * save order in proper object data for orders
        * orderObject: order based in the order data
     */
    price = parseFloat(price);

    if (stopPrice === '') stopPrice = 'NaN';
    const orderObject = {
        id : order._line._id,
        orr: order,
        price: price.toFixed(1),
        programmable: isProgrammable,
        quantity: order.getQuantity(),
        symbol: window.tvWidget.activeChart().symbol().split(":")[1],
        type: orderType,
        stopOrder:  stopPrice,
        stopOrderId: '',
        stopOrderTemp: '',
        GL: 0.0
    }

    if (isProgrammable) {
        orderObject['state'] = 'pending';
        pendingOrders.push(orderObject); // pendingOrders: programmable orders
    }
    else {
        orderObject['state'] = 'success';
        userOrders.push(orderObject); // userOrders: market orders
    }
    return orderObject;
}

function createStopLossOrder(orderObject, orderType) {
    if (orderType === 'buy') orderType = 'sell'
    else if (orderType === 'sell') orderType = 'buy';
    const obstop = createOrder(orderObject.stopOrder, orderObject.quantity, orderType, true, "esaCosa");
    orderObject.stopOrderId  = obstop.id;
    orderObject.stopOrderTemp = obstop.orr;
}

function createRowTable (el) {
    let tr = document.createElement('tr');
    el.type  = el.type[0].toUpperCase() + el.type.slice(1);
    const ob = [['id', el.id], ['type', el.type], ['price', el.price],
    ['stop', el.stopOrder], ['quantity', el.quantity], ['state', el.state],
    ['GL', el.GL]];

    for (let i = 0; i <= ob.length; i++) {
        let td = document.createElement('td');
        if (i == ob.length) {
            tr.appendChild(createCloseOrderButton(el, td));
            ordersTemplate.appendChild(tr);
            return
        }
        else {
            td.dataset[ob[i][0]] = ob[i][1];
            td.appendChild(document.createTextNode(ob[i][1]));
            if (i == 1) {
                if (ob[i][1] === 'Buy') td.classList.add('greenFont');
                else td.classList.add('redFont');
                //.log(td)green
            }
            tr.appendChild(td);
        }
    }
}

function GLverificate () {
    userOrders.forEach(el => {
        let last = (LP - el.price).toFixed(1);
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
    });
}

function createCloseOrderButton(el, td) {
    let close = document.createElement('button');
    close.id = `closeOrderButton-${++count}`;
    close.dataset.is = el.programmable;
    close.dataset.id = el.id;
    close.classList.add('remove');
    addCloseEvent(close);
    td.appendChild(close);
    return td;
}

function deleteOrder (id, isProgrammable) {
    /* Delete an specific order  calling deleteSpecific pasing properly obj */
    if (isProgrammable === 'false') {
        deleteSpecific(id, userOrders);
    } else {
        deleteSpecific(id, pendingOrders);
    }
}

function deleteSpecific(id, ordersObject) {
    /* deletes order from active chart and object */
    ordersObject.forEach(element => {
        if (id === element.id) {
            if (element.stopOrderId) {
                element.stopOrderTemp.remove()
                deleteSpecificPendingOrder(element.stopOrderId);
            }
            const index = ordersObject.indexOf(element); // get the index of the object
            element.orr.remove(); // remove the order of the chart
            if (index > -1) ordersObject.splice(index, 1); // deletes the order of the object
        }
    });
}


function deleteSpecificPendingOrder(id) {
    for (const x in pendingOrders) {
        if (pendingOrders[x].id === id) {
            deletesOrdersbyButton(id)
            pendingOrders.splice(pendingOrders.indexOf(pendingOrders[x]), 1);

        }
    }
}

function deletesOrdersbyButton(id) {x
    const orders = ordersTemplate.childNodes;
    for (let i = 4; i < orders.length; i++) {
        if (orders[i].cells[0].dataset.id === id) {
            deleteParenNode(orders[i]);
        }
    }
}

export const pendingOrdersReview = function () {
    /* 
        Update pending orders to complete succesfully orders
        if a price in a prending order is equal to last pice the oerder must be taked
    */
   lastPrice.placeholder = LP.toFixed(1); //updates real price in price order input
    if (userOrders.length) {
        GLverificate();
    }
    if (pendingOrders.length) {
        pendingOrders.filter(element => {
            if (element.price == LP) {
                if (!activeFounds(element.quantity, element.type)) return;
                element.isProgrammable = false;
                element.state = "success";
                changeOrderState(element, element.state, 5); //change the order template state to success
                userOrders.push(element); // push the order to sucess orders
                pendingOrders.splice(pendingOrders.indexOf(element), 1); // deletes order from pending
            }
        });
    }
}

export const founds = function () {
    /* show the user found in chas item input */
    const p = document.createElement('p');
    cashItem.appendChild(document.createTextNode(money.toLocaleString()));
}


/* buttons events open and close */
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
        console.log(sellButton.dataset.type )
        setMarketOrder(priceInput.value, lotesInput.value, sellButton.dataset.type);
    } else {
        console.log(priceInputLimit.value);
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

const addCloseEvent = function (element) {
    element.addEventListener('click', () => {
        deleteOrder(element.dataset.id, element.dataset.is);
        element.parentNode.parentNode.remove();
    });
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