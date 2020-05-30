/* data that is needed to make an order
    by User: 
        type (buy)
        price
        quantity
*/
import { widget } from './main.js';
import { LP } from './streaming.js';

export const addEvent = function (element) {
    element.addEventListener('click', () => {
        createOrder(LP, "1200.00 USDT");  
    });
}

function createOrderInActiveChart(data) {
    const order  = widget.activeChart().createOrderLine()
    order.setPrice(data.price);
    order.setQuantity(data.quantity);
    console.log("order ready")
    //order.setQuantity(data.quantity);
}

const createOrder = function (price, quantity) {
    // save data in sobject
    const orderData = Object();
    orderData['price'] = LP;
    orderData ['quantity'] = quantity;
    //console.log('that ', orderData.price)
    createOrderInActiveChart(orderData);
    return orderData;
}

/*here we  have two options first generate de complete order form
and send  to the api or send to the api and call it again with the
safe stored information*/


// send  Post order to the api

//  create order template

//  inner the order template in the view

/*const color = '#ff9f0a';
      const fontColor = '#fff';
      const n = widget.activeChart().createOrderLine({disableUndo: true})
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
    