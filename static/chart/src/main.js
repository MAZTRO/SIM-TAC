// Datafeed implementation, will be added later
import Datafeed from './datafeed.js';

window.tvWidget = new TradingView.widget({
    symbol: 'Bitfinex:BTC/USD', // default symbol
    interval: '5', // default interval
    timezone: "America/New_York",
    disabled_features: ["header_saveload", "header_compare", "header_screenshot", "header_fullscreen_button"],
    enabled_features: ["hide_left_toolbar_by_default", "countdown"],
    fullscreen: false,
    container_id: 'tvChart',
    datafeed: Datafeed,
    autosize: true,
    library_path: 'static/chart/charting_library/',
});
