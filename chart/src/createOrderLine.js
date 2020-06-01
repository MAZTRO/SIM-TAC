/* data that is needed to make an order
    by User: 
        type (buy)
        price
        quantity
*/
import { widget } from './main.js';
import { LP } from './streaming.js'; // import last price each time the socket update a tick
const ordersTemplate = document.getElementById('ordersTemplate');
let userOrders  = [];
let count = 0;

const createOrder = function (price, quantity) {
    const orderData = Object(); // save data in sobject
    orderData['price'] = LP;
    orderData ['quantity'] = quantity;
    createOrderInActiveChart(orderData); // Create order in chart
}

function createOrderInActiveChart(data) {
    const order  = widget.activeChart().createOrderLine() // set the new order on the chart
    order.setPrice(data.price);
    order.setQuantity(data.quantity);
    const orderObject = saveOrder(data, order);
    const HTMLString = cp(orderObject);
    const orderElement = createTemplate(HTMLString);
    ordersTemplate.append(orderElement);
    const closeOrderButton = document.getElementById(`closeOrderButton-${count}`);
    addCloseEvent(closeOrderButton);
    //order.onCancel("onCancel evert", deleteOrder);
}

function saveOrder (data, order) {
    const orderObject = {
        type: 'buy',
        id : order._line._id,
        price: data.price,
        quantity: data.quantity,
        orr: order
    }
    userOrders.push(orderObject);
    return orderObject;
}

function deleteOrder (id) {
    // this function has to delete the with the correct id
    userOrders.forEach(element => {
        if (id === element.id) {
            element.orr._active = false;
            setTimeout(() => element.orr.remove(), 1000);
            const index = userOrders.indexOf(element);
            if (index > -1) {
                userOrders.splice(index, 1);
            }
        }
    });
}

function createTemplate (HTMLString) {
    const html = document.implementation.createHTMLDocument()
    html.body.innerHTML = HTMLString
    return html.body.children[0]
}

function cp (el) {
    return (
        `<p class="" data-id='${el.id}' data-type='${el.type}'>
            order type: ${el.type} - price: ${el.price} - quantity: ${el.quantity}
            <button id="closeOrderButton-${++count}" data-id='${el.id}'> x </button>
        </p>`
    )
}

export const addOpenEvent = function (element) {
    element.addEventListener('click', () => {
        //Quantity must be set by the user in this case we set it by default
        createOrder(LP, "1200.00 USDT");  
    });
}
const addCloseEvent = function (element, id) {
    element.addEventListener('click', () => {
        deleteOrder(element.dataset.id);
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