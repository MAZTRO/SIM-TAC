// Datafeed implementation, will be added later
import Datafeed from './datafeed.js';

export const widget = window.tvWidget = new TradingView.widget({
    symbol: 'Bitfinex:BTC/USD', // default symbol
    interval: '2', // default interval
    timezone: "America/New_York",
    width: '1000',
    height: '600',
    disabled_features: ["header_saveload", "header_compare", "header_screenshot", "header_fullscreen_button"],
    enabled_features: ["hide_left_toolbar_by_default", "countdown"],
    fullscreen: false, // displays the chart in the fullscreen mode
    container_id: 'tv_chart_container',
    datafeed: Datafeed,
    library_path: '../charting_library/',
});

//console.log(widget.chart());

