module.exports = {
	tradeOnlyPair: 1,
    target: 0.0001,//for comparing last price
    wantedProfit: 0.3,// two way exchange fees are normally 0.5%
    baseCoin: 'BTC',
    targetCoin: 'LTC',
    orderNumber: 500,
    feeRate: 0.0001,//0.0025
    budget: 10,//BTC
    interval: 10000,
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