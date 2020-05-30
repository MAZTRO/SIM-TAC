import { parseFullSymbol } from './helpers.js';
import { widget } from './main.js';

const channelToSubscription = new Map();
const socket = io('wss://streamer.cryptocompare.com');
export let LP;

socket.on('connect', () => {
  console.log('[socket] Connected');
});

socket.on('disconnect', (reason) => {
  console.log('[socket] Disconnect', reason);
});

socket.on('error', (error) => {
  console.log('[socket] Error', error);
});

export function subscribeOnStream(symbolInfo, resolution, onRealtimeCallback, subscribeUID, onResetCacheNeededCallback, lastDailyBar) {
  const parsedSymbol = parseFullSymbol(symbolInfo.full_name);
  const channelString = `0~${parsedSymbol.exchange}~${parsedSymbol.fromSymbol}~${parsedSymbol.toSymbol}`;
  const handler = {
    id: subscribeUID,
    callback: onRealtimeCallback,
    callback2: onResetCacheNeededCallback
  };
  let subscriptionItem = channelToSubscription.get(channelString);
  if (subscriptionItem) {
    subscriptionItem.handler.push(handler);
    return;
  }
  subscriptionItem = {
    subscribeUID,
    resolution,
    lastDailyBar,
    handlers: [handler],
  };
  channelToSubscription.set(channelString, subscriptionItem);
  console.log('[subscribeBars]: Subscribe to streaming. Channel:', channelString);
  socket.emit('SubAdd', {subs: [channelString]});
}

function lPrice (lPrice) {
  const lastPrice = lPrice;
  //console.log(`LAST: ${lastPrice}`)
  return lastPrice;
}


export function unsubscribeFromStream(subscribeUID) {
  for (const channelString of channelToSubscription.keys()) {
    const subscriptionItem = channelToSubscription.get(channelString);
    const handlerIndex = subscriptionItem.handlers.findIndex(handler => handler.id === subscribeUID);
    
    if (handlerIndex !== -1) {
      subscriptionItem.handlers.splice(handlerIndex, 1);
      if (subscriptionItem.handlers.length === 0) {
        console.log('[unsubscribeBars]: Unsubscribe from streaming. Channel:', channelString);
        socket.emit('SubRemove', {subs: [channelString]});
        channelToSubscription.delete(channelString);
        break;
      }
    }
  }
}

socket.on('m', data => {
  //console.log('[socket] Message:', data);
 
  const [
    eventTypeStr,
    exchange,
    fromSymbol,
    toSymbol,
    ,
    ,
    tradeTimeStr,
    ,
    tradePriceStr,
  ] = data.split('~');

  if (parseInt(eventTypeStr) !== 0) {
    return;
  }

  const tradePrice = parseFloat(tradePriceStr);
  const tradeTime = parseInt(tradeTimeStr);
  const channelString = `0~${exchange}~${fromSymbol}~${toSymbol}`;
  const subscriptionItem = channelToSubscription.get(channelString);
  if (subscriptionItem === undefined) {
    return;
  }
  const lastDailyBar = subscriptionItem.lastDailyBar;
  const nextDailyBartime = getNextBartime(lastDailyBar.time);

  let bar;
  if (tradeTime >= nextDailyBartime) {
    bar = {
      ...lastDailyBar,
      high: Math.max(lastDailyBar.high, tradePrice),
      low: Math.min(lastDailyBar.low, tradePrice),
      close: tradePrice
    };
  } else {
    bar = {
      ...lastDailyBar,
      high: Math.max(lastDailyBar.high, tradePrice),
      low: Math.min(lastDailyBar.low, tradePrice),
      close: tradePrice,
    }
    console.log('[socket] Update the latest bar by price', tradePrice);
    LP = lPrice(tradePrice);

  }
  
  subscriptionItem.lastDailyBar = bar;
  subscriptionItem.handlers.forEach(handler => {
    handler.callback(bar);
    //handler.callback2;
  });
 // widget.activeChart().resetData();
});

function getNextBartime(barTime) {
  const date = new Date(barTime * 1000);
  date.setDate(date.getDate() + 1);
  return date.getTime() / 1000;
}


// get resolution and bar.time

