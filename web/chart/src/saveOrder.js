import {userOrders, pendingOrders} from './createOrderLine.js';

export const saveOrder = function(order, orderType, price, isProgrammable, stopPrice) { 
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