### Entry point

```node main```

---
### main.js
Part of this file and setting.js is inherited from the NPM package.
2 functions ```getMarketData()``` and ```computePrices()``` are from the NPM package. First one is for creating an object with every crypto coin as its properties: ```{btc: { bittrex: 50usd, bitstamp: 50usd, ... }, ltc: {xxx: xxx}, ... }```. ```computePrices()``` is to detect price intersection of two exchanges and if the difference of prices between two different exchanges is higher than our target get order books and place orders.
```computePrices()``` indicates the coin and the exchanges where the difference between the last prices of the exchanges is higher than our wanted profit. For example, the difference is 1% for LTC between Bittrex and Bitstamp and the target is 0.5%. ```matchOrders()``` is the function I created to compare the bid orders and ask orders from respective exchanges. It compares both price and quantity to decide how many to buy or sell at what price.

---
### setting1.js & setting2.js
These files store exchange specific functions and properties.
setting1.js is for trading all pairs and setting2.js for only one designated pair.

---
### placeOrders.js & placeOrders_origin.js
API wrappers for exchanges for placing orders. 
In line 15 in main.js, include placeOrders.js for testing which will output results in log and output directories, while placeOrders_origin.js has code for placing actual orders.

---
### secondMatch.js
The function in the file receives those orders that hang in the market and cannot be executed as parameter. It then calls the updated orderbook api from the respective exchange to see whether oerders with better price come up. Then place the new orders to replace those old ones that are not executed. 