import  {  changeOrderState, createStopLossOrder, updateOrderChart } from './chartUpdates.js';
import { userOrders} from './createOrderLine.js';
import { setCacheForElement } from './locaStorage.js';
import { LP } from './streaming.js';

let money = JSON.parse(window.localStorage.getItem('money'));
if (!money) {
  window.localStorage.setItem('money', JSON.stringify(100000));
  money = JSON.parse(window.localStorage.getItem('money'))
}

export const activeFounds = function(lotes, orderType) {
  /* Verificates and make properly operation for found in order */
  let currencies = JSON.parse(window.localStorage.getItem('currencies'));
  const currency = window.tvWidget.activeChart().symbol().split(":")[1]; //symbol pair
  if (orderType === "Buy" || orderType === "buy") {
    let shortCurrencies = JSON.parse(window.localStorage.getItem('shortCurrencies'));
    if (shortCurrencies) {
      shortCurrencies[currency] -= lotes;
      window.localStorage.removeItem('shortCurrencies');
      window.localStorage.setItem('shortCurrencies', JSON.stringify(shortCurrencies));
      let _money = JSON.parse(window.localStorage.getItem('money'));
      if (_money)  {
        if (userOrders.length) {
          userOrders.forEach(el => {
            let last = (LP - el.price);
            last = last * lotes;
            last = last.toFixed();
            last = parseInt(last);
            if (last > 0) {
              console.log(`entro dddddd ${last}`);
              _money -= last;
            } else if (last < 0) {
              console.log(`entro eeeeee ${last}`);
              last = last * (-1);
              _money += last;
            }
          });
          window.localStorage.removeItem('money');
          window.localStorage.setItem('money', JSON.stringify(_money));
        }
      }
    } else {
      if (money <= 0 || (money - lotes) < 0) {
        console.log("not enought founds");
        return;
      }
      // currencies will contains the currency user has in lotes price
      if (!currencies) {
        currencies = {};
        currencies[currency] = lotes;
        window.localStorage.setItem('currencies', JSON.stringify(currencies));
      } else {
        currencies[currency]  += lotes;
        window.localStorage.setItem('currencies', JSON.stringify(currencies));
      }
    }
  } else {
    // sell a currency if the user had bought
    let _currencies = JSON.parse(window.localStorage.getItem('currencies'));
    let _money = JSON.parse(window.localStorage.getItem('money'));
    if (_currencies) {
      if (_currencies.hasOwnProperty(currency)) {
        if (lotes > _currencies[currency]) {
          console.log('cant sell this quantity you only have: ' + _currencies[currency] + ' in ' + currency);
          return;
        }
        if (userOrders.length) {
          userOrders.forEach(el => {
            let last = (LP - el.price);
            last = last * lotes;
            last = last.toFixed();
            if (last > 0) {
              last = parseInt(last);
              _money += last;
            } else if (last < 0) {
              last = parseInt(last * (-1));
              _money -= last;
            }
            _currencies[currency] -= lotes;
            console.log(window.localStorage.getItem('money'));
            setCacheForElement([[_money, 'money'], [_currencies, 'currencies']]);
            });
          }
        }
      } else {
        if (_money <= 0 || (_money - lotes) < 0) {
          console.log("not enought founds");
          return;
        }
        let shortCurrencies = JSON.parse(window.localStorage.getItem('shortCurrencies'));
        if (!shortCurrencies) {
          shortCurrencies = {};
          shortCurrencies[currency] = lotes;
          window.localStorage.removeItem('shortCurrencies');
          window.localStorage.setItem('shortCurrencies', JSON.stringify(shortCurrencies));
        } else {
          shortCurrencies[currency] += lotes;
          window.localStorage.removeItem('shortCurrencies');
          window.localStorage.setItem('shortCurrencies', JSON.stringify(shortCurrencies));
        }
      }
    }
    const cashItem = document.querySelector('.cash');
    cashItem.innerText = cashItem.textContent = JSON.parse(window.localStorage.getItem('money')).toLocaleString();//money.toLocaleString();
    return true;
}

export const growthOrder = function(price, quantity, orderType, stopPrice, short) {
  let bool = false;
  userOrders.forEach(el => {
    el.price = parseFloat(el.price)
    if (price.toFixed(1) === el.price.toFixed(1) && short === el.short) {
      if (el.stopOrder === 'NaN' && stopPrice != '') {
        el.stopOrder = stopPrice;
        changeOrderState(el, el.stopOrder, 3);
        createStopLossOrder(el, orderType);
      }
      bool = updateOrderChart(el, quantity, price, orderType, el.short);
      changeOrderState(el, el.quantity, 4);
      if (window.localStorage.getItem('userOrders')) window.localStorage.removeItem('userOrders');
      saveOrderCache('userOrders', userOrders);
    } else {
      if (el.stopOrder === 'NaN' && stopPrice != '') {
        el.stopOrder = stopPrice;
        createStopLossOrder(el, orderType);
      }
      bool = updateOrderChart(el, quantity, price, orderType, short);
      changeOrderState(el, el.price, 2);
      changeOrderState(el, el.quantity, 4);
    }
  });
  return bool;
}

export const saveOrderCache = function (reference, obj) {
  let eso = [];
  window.localStorage.setItem(reference, JSON.stringify(obj, function(key, val) {
    if (val != null && typeof val == "object") {
      if (eso.indexOf(val) >= 0) return;
      eso.push(val);
    }
    return val;
  }));
}

export const updateMoney = function (last, lotes, _money) {
  if (last.toFixed(1) > 0) {
    _money += last;
  } else if (last.toFixed(1) < 0) {
    _money += last;
  }
  return _money;
}

export const updateMoney2 = function (last, lotes, _money) {
  if (last.toFixed(1) > 0) {
    _money -= last;
  } else if (last.toFixed(1) < 0) {
    last = last * (-1);
    _money += last;
  }
  return _money;
}
