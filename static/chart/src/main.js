// Datafeed implementation, will be added later
import Datafeed from './datafeed.js';

window.tvWidget = new TradingView.widget({
    symbol: 'Bitfinex:BTC/USD', // default symbol
    interval: '2', // default interval
    timezone: "America/New_York",
    disabled_features: ["header_saveload", "header_compare", "header_screenshot", "header_fullscreen_button", /* "header_symbol_search" */],
    enabled_features: ["hide_left_toolbar_by_default", "countdown"],
    fullscreen: false, // displays the chart in the fullscreen mode
    container_id: 'tvChart',
    datafeed: Datafeed,
    autosize: true,
    library_path: 'chart/charting_library',
});
