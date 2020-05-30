line({ id = 'price', text = 'Price', color = '#ff9f0a', price, quantity, fontColor = '#fff', lineStyle = 2, lineLength = 25 }) {
    if (this.lines.has(id)) this.deleteLine(id)             
    // Creating line from scratch            
    const widget = this.widget.chart().createOrderLine()
    .setText(text)
    .setPrice(price)                
    .setQuantity(quantity)                
    .onModify(res => res) // Need for dragging                 

    // Customize color                
    .setLineColor(color)                
    .setBodyTextColor(fontColor)                
    .setBodyBorderColor(color)                
    .setBodyBackgroundColor(color)                 
    .setQuantityBorderColor(color)                
    .setQuantityTextColor(fontColor)                
    .setQuantityBackgroundColor(color)                 
    .setCancelButtonBorderColor(color)                
    .setCancelButtonBackgroundColor(color)                
    .setCancelButtonIconColor(fontColor)                 
    .setLineLength(lineLength) // Margin right 25%                
    .setLineStyle(lineStyle)             
    this.lines.set(id, widget)            
     return widget // return for    orderLine func() 
},    

deleteLine(id) {            
    this.lines.get(id).remove()            
    this.lines.delete(id)        
},        

deleteLines() {            
    this.lines.forEach((value, key) =>      
    this.deleteLine(key))        
}


// in JS 
import { widget } from '../../public/charting_library/charting_library.min';
const tvWidget = new widget(widgetOptions);

// if in HTML
<script type="text/javascript" src="charting_library/charting_library/charting_library.min.js"></script>
var widget = new TradingView.widget({})