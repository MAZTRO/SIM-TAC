/* data that is needed to make an order
    by User: 
        type (buy)
        price
        quantity
*/
import { widget } from './main.js';
// import last price each time the socket update a tick
import { LP } from './streaming.js';
let userOrders  = [];

export const addEvent = function (element) {
    element.addEventListener('click', () => {
        //Quantity must be set by the user in this case we set it by default
        createOrder(LP, "1200.00 USDT");  
    });
}

export const addCloseEvent = function (element) {
    element.addEventListener('click', () => {
        deleteOrder(userOrders);
    });
}

function createOrderInActiveChart(data) {
    // set the new order on the chart
    const order  = widget.activeChart().createOrderLine()
    order.setPrice(data.price);
    order.setQuantity(data.quantity);

    const  orderId = order._line._id;
    userOrders.push({
        id : orderId,
        price: data.price,
        quantity: data.quantity,
        orr: order
    });
    
    order.onCancel("onCancel evert", function(text) {
        this._active = false;
        setTimeout(() => this.remove(), 1500); 
    });
}

const createOrder = function (price, quantity) {
    const orderData = Object(); // save data in sobject
    orderData['price'] = LP;
    orderData ['quantity'] = quantity;
    createOrderInActiveChart(orderData); // Create order in chart
}

function deleteOrder (userOrders) {
    // this function has to delete the with the correct id
   userOrders.forEach(element => {
        console.log(element.orr)
        element.orr._active = false;
        setTimeout(() => element.orr.remove(), 1000); 
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
      .setPrice(bars[bars.length - 1].close) 
      .setQuantity("221.235 USDT")
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