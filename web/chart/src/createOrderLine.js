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

function orderCase (price, orderType) {
    /*
        ordercase buy or sell
        if price doesn't comes from user is a market order
        if price comes from user input is a programable order 
    */
    let isProgrammable = false;
    if (!price) {
        createOrder(LP, '1200', orderType, isProgrammable);
    }
    else {
        isProgrammable = true;
        createOrder(price, '1200', orderType, isProgrammable);
    }
}

export const createOrder = function (price, quantity, orderType, isProgrammable) {
    /* create order in active chart called order */
    const order  = window.tvWidget.activeChart().createOrderLine();
    order.setPrice(price);
    order.setQuantity(quantity);
    // save order in object, return an order object  info   
    const orderObject = saveOrder(order, orderType, price, isProgrammable);
    createOrderTemplate(orderObject); // Create order in template orders
}

function saveOrder (order, orderType, price, isProgrammable) {
    /*
        * save order in proper object data for orders
        * orderObject: order based in the order data
     */
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
        pendingOrders.push(orderObject); // pendingOrders: programmable orders
    }
    else {
        orderObject['state'] = 'success';
        userOrders.push(orderObject); // userOrders: market orders
    }
    return orderObject;
}

function createOrderTemplate(orderObject) {
    /* create orden template */
    const HTMLString = cp(orderObject); // object string for table
    const orderElement = createTemplate(HTMLString); // convert the string in html tag
    ordersTemplate.append(orderElement); //append element in ordersTemplate <div>
    const closeOrderButton = document.getElementById(`closeOrderButton-${count}`); 
    addCloseEvent(closeOrderButton);
}


function cp (el) {
    /* create order string  baed in html tag*/
    return (
        `<p class="" data-id='${el.id}' data-type='${el.type}' data-state='${el.state}'>
            order type: ${el.type} - price: ${el.price} - 
            quantity: ${el.quantity} - id: ${el.id} - <span class="orderState">state: ${el.state}</span>
            <button id="closeOrderButton-${++count}" data-id='${el.id}' 
            data-is='${el.programmable}'> x </button>
        </p>`
    )
}

function createTemplate (HTMLString) {
    /* create a html->body tree to put inside the HTML string */
    const html = document.implementation.createHTMLDocument()
    html.body.innerHTML = HTMLString // change this parts is insecure
    return html.body.children[0]
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
            const index = ordersObject.indexOf(element); // get the index of the object
            element.orr._active = false; //put inactive the order in the chart
            setTimeout(() => element.orr.remove(), 1000); // remove the order of the chart
            if (index > -1) ordersObject.splice(index, 1); // deletes the order of the object
        }
    });
}

export const pendingOrdersReview = function () {
    /* 
        Update pending orders to complete succesfully orders
        if a price in a prending order is equal to last pice the oerder must be taked
    */
    priceInput.placeholder = LP.toFixed(1); //updates real price in price order input 
    pendingOrders.forEach(element =>  {
        if (element.price == LP) {
            element.isProgrammable = false;
            element.state = "success"
            changeOrderState(element); //change the order template state to success
            userOrders.push(element); // push the order to sucess orders
            pendingOrders.splice(pendingOrders.indexOf(element), 1); // deletes order from pending
        }
    });
}

function changeOrderState(element) {
    /* modify the order template once it needs pass order to success */
    const order = ordersTemplate.childNodes;
    for (const x in order) {
        if ((x >= 1) && (order[x].dataset.id == element.id)) {
            order[x].dataset.state = "success"; // updates data-state from html tag object
            const state = order[x].getElementsByTagName('span')[0]; //get the element that content the order state
            state.innerText = state.textContent = element.state; // change the order state
        }
    }
}

/*****/
export const founds = function () {
    /* show the user found in chas item input */
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
