import { addCloseEvent } from './eventButtons.js';
let count = 0;

export const createOrderInChart = function(obj, order) {
    const buyColor = '#19af3a';
    const sellColor = "#d14141";
    (obj.type === "buy") ? orderStyleChart(order, buyColor, obj) : orderStyleChart(order, sellColor, obj);
}

export const createRowTable = function(el) {
    let tr = document.createElement('tr');
    el.type  = el.type[0].toUpperCase() + el.type.slice(1);
    const ob = [['id', el.id], ['type', el.type], ['price', el.price],
    ['stop', el.stopOrder], ['quantity', el.quantity], ['state', el.state],
    ['GL', el.GL]];

    for (let i = 0; i <= ob.length; i++) {
        let td = document.createElement('td');
        if (i == ob.length) {
            tr.appendChild(createCloseOrderButton(el, td));
            const ordersTemplate = document.getElementById('operations_list');
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

function orderStyleChart (order, color, obj) {
    order.setLineColor(color).setBodyTextColor(color).setBodyBorderColor(color);                
    order.setQuantityBorderColor(color).setQuantityTextColor(color);
    order.setLineStyle(2).setQuantityBackgroundColor("#fff");
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

