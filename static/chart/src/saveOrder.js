import {userOrders, pendingOrders} from './createOrderLine.js';

let templates = [];
export { templates };

export const saveOrder = function(order, orderType, price, isProgrammable, stopPrice, flag, short) {
  /*
  * save order in proper object data for orders
  * orderObject: order based in the order data
  */
  price = parseFloat(price);
  const _id = order._line._id;
  let state;
  isProgrammable ? state = 'pending' : state = 'success';

  //console.log(order)
  if (stopPrice === '') stopPrice = 'NaN';
  const orderObject = {
    id : _id,
    orr: order,
    price: price.toFixed(1),
    programmable: isProgrammable,
    quantity: order.getQuantity(),
    symbol: window.tvWidget.activeChart().symbol().split(":")[1],
    type: orderType,
    short: short,
    stopOrder:  stopPrice,
    stopOrderId: '',
    stopOrderTemp: '',
    GL: 0.0
  }
  let template;
  if (!flag) {
    template = {
      id: _id,
      type: orderType,
      price: price.toFixed(1),
      stopOrder: stopPrice,
      quantity: order._data.quantityText,
      state: state,
      GL: 0.0,
      short: short
    };
  }
  if (isProgrammable) {
    orderObject['state'] = 'pending';
    pendingOrders.push(orderObject); // pendingOrders: programmable orders

    if (!flag) {
      templates.push(template);
      let cache = window.localStorage.getItem('pendingOrders');
      if (cache) {
        let eso = JSON.parse(cache);
        eso.push(template);
        window.localStorage.setItem('pendingOrders', JSON.stringify(eso));
      } else {
        window.localStorage.setItem('pendingOrders', JSON.stringify(templates));
      }
    }
  } else {
    orderObject['state'] = 'success';
    userOrders.push(orderObject); // userOrders: market orders
    if (window.localStorage.getItem('userOrders')) window.localStorage.removeItem('userOrders');
    saveOrderCache('userOrders', userOrders);
  }
  return orderObject;
}

function saveOrderCache (reference, obj) {
  let eso = [];
  window.localStorage.setItem(reference, JSON.stringify(obj, function(key, val) {
    if (val != null && typeof val == "object") {
      if (eso.indexOf(val) >= 0) return;
      eso.push(val);
    }
    return val;
  }));
}
