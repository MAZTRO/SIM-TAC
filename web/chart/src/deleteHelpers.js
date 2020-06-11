import { userOrders, pendingOrders } from  './createOrderLine.js';

export const deleteOrder = function(id, isProgrammable) {
    /* Delete an specific order  calling deleteSpecific pasing properly obj */
    if (isProgrammable === 'false') {
        deleteSpecific(id, userOrders);
    } else {
        deleteSpecific(id, pendingOrders);
    }
}

export const deleteSpecific = function (id, ordersObject) {
    /* deletes order from active chart and object */
    console.log(ordersObject)
    ordersObject.forEach(element => {  
        if (id === element.id) {
            if (element.stopOrderId) {
                if (pendingOrders.length) {
                    element.stopOrderTemp.remove();
                    deleteSpecificPendingOrder(element.stopOrderId);
                }
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

export const  deletesOrdersbyButton = function(id) {
    const ordersTemplate = document.getElementById('operations_list');
    const orders = ordersTemplate.childNodes;
    for (let i = 4; i < orders.length; i++) {
        if (orders[i].cells[0].dataset.id === id) {
            deleteParenNode(orders[i]);
        }
    }
}

export const deleteParenNode = function(_order) {
    const order = _order.getElementsByTagName('td')[6];
    order.parentNode.remove();
}