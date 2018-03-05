module.exports = {
	tradeOnlyPair: 1,
    target: 0.0001,//For setting baseline for the gap between last price of 2 exchanges
    wantedProfit: 0.5,// two way exchange fees are normally 0.5%, should be higher than 0.5 to cover the exchange fees
    baseCoin: 'BTC',
    targetCoin: 'LTC',
    orderNumber: 500, //Exchange api retrun 500 orders in orderbook in maximum 
    feeRate: 0.0025,// Exchange fee rate 0.0025
    budget: 10,//BTC, limit of each transaction
    interval: 10000, // Call api every 10 sec
    credentials: {
    	bittrex: {
    		key: "111",
    		secret: "111"
    	},
    	poloniex: {
    		key: "111",
    		secret: "111"
    	},
    	bleutrade: {
    		key: "111",
    		secret: "111"
    	},
    	bitstamp: {
    		key: "111",
    		secret: "111",
    		client: 'ddddd'
    	}
    } 
}