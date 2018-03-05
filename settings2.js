//
// let boilerPlateMarket =
// {
//     marketName: '',
//     URL: '', //URL To Fetch API From.
//     toBTCURL: false, //URL, if needed for an external bitcoin price api.
//     last: function (data, coin_prices) { //Get the last price of coins in JSON data
//         return new Promise(function (res, rej) {
//             try {
//                 for (x in / of data) {
//                     price = ...;
//                     coin_prices[coinName][marketName] = price;
//                 }
//                 res(coin_prices);
//             }
//             catch (err) {
//                 rej(err);
//             }
//
//         })
//     },
//
//
// }
let request = require('request');
let jsonFormat = require('json-format');
var cryptos = require("./cryptos.js");
var config = require('./config.js');
let baseCoin = config.baseCoin//'BTC';
let orderNumber = config.orderNumber //500
let baseCoinPrice = new Promise(function (res, rej) {
    request("https://api.coinmarketcap.com/v1/ticker/" + cryptos[baseCoin], function (error, response, body) {
            
        try {
            let data = JSON.parse(body);
            console.log("getting base coin price: ", data[0]['price_usd']);
            res(data[0]['price_usd'])

        } catch (error) {
            console.log("Error getting JSON response for base coin price!"); //Throws error
            rej(error);
        }

    });
});


let markets = [

    // {
    //     marketName: 'cryptowatchAPI',
    //     URL: 'https://api.cryptowat.ch/markets/summaries', //URL To Fetch API From.
    //     toBTCURL: false, //URL, if needed for an external bitcoin price api.
    //
    //     last: function (data, coin_prices, toBTCURL) { //Where to find the last price of coin in JSON data
    //         return new Promise(function (res, rej) {
    //             try {
    //                 data = data.result;
    //                 for (let key in data) {
    //                     let marketPair = key.split(':');
    //                     let market = marketPair[0], pair = marketPair[1];
    //                     let indexOfBTC = pair.indexOf('btc');
    //                     if (indexOfBTC > 0 && !pair.includes('future') && !market.includes('qryptos') && !market.includes('quoine') && !market.includes('poloniex')) {
    //                         if(marketNames.indexOf(market) === -1 ){
    //                             marketNames.push([[market], ['']]);
    //                             console.log(marketNames);
    //                         }
    //                         let coin = pair.replace(/btc/i, '').toUpperCase();
    //                         let price = data[key].price.last;
    //                         if(price > 0) {
    //                             if (!coin_prices[coin]) coin_prices[coin] = {};
    //                             coin_prices[coin][market] = price;
    //
    //                         }
    //                     }
    //                 }
    //                 res(coin_prices);
    //             }
    //             catch (err) {
    //                 console.log(err);
    //                 rej(err)
    //             }
    //         })
    //     }
    //
    // },
    {
        marketName: 'bittrex',
        URL: 'https://bittrex.com/api/v1.1/public/getmarketsummaries',
        toBTCURL: false,
        pairURL : '',
        last: function (data, coin_prices) { //Where to find the last price of coin in JSON data
            return new Promise(function (res, rej) {
                try {
                    for (let obj of data.result) {
                        if(obj["MarketName"].includes(baseCoin + '-')) {
                            let coinName = obj["MarketName"].replace(baseCoin + "-", '');
                            if (!coin_prices[coinName]) coin_prices[coinName] = {};
                            coin_prices[coinName].bittrex = obj.Last;
                        }
                    }
                    res(coin_prices);
                }
                catch (err) {
                    console.log(err);
                    rej(err);
                }

            })
        },
        orderBook: function(type, targetCoin){
            let url = '';
            if (type == 'buy'){
                url = 'https://bittrex.com/api/v1.1/public/getorderbook?market=' + baseCoin + '-' + targetCoin.toUpperCase() + '&type=buy';
            } else {
                url = 'https://bittrex.com/api/v1.1/public/getorderbook?market=' + baseCoin + '-' + targetCoin.toUpperCase() + '&type=sell';

            }
            return new Promise(function (resolve, reject) {
                request(url, function (error, response, body) {
                    try {
                        let data = JSON.parse(body);
                        let orders = [];
                        console.log("Success: Retrieving orders - " + type);
                        if (data.result.length > orderNumber){
                            for (let i = 0; i < orderNumber; i++){
                                orders.push(data.result[i]);
                            }
                        } else {
                            data.result.map(x => orders.push(x));
                        }
                        //console.log('bitttttttttttttttt' + jsonFormat(orders));
                        resolve(orders);
                    } catch (error) {
                        console.log("Error getting JSON response from", url, error); //Throws error
                        reject(error);
                    }

                });
            });
        }
    },



    // {
    //     marketName: 'btc38',
    //     URL: 'http://api.btc38.com/v1/ticker.php?c=all&mk_type=cny',
    //     toBTCURL: false,
    //     pairURL : '',
    //     last: function (data, coin_prices, toBTCURL) { //Where to find the last price of coin in JSON data
    //         return new Promise(function (res, rej) {
    //             let priceOfBTC = data.btc.ticker.last;
    //             try {
    //                 for (let key in data) {
    //                     let coinName = key.toUpperCase();
    //                     let price = data[key]['ticker'].last;
    //                     if (!coin_prices[coinName]) coin_prices[coinName] = {};

    //                     coin_prices[coinName]["btc38"] = data[key]['ticker'].last / priceOfBTC;
    //                 }
    //                 res(coin_prices);
    //             }

    //             catch (err) {
    //                 console.log(err);
    //                 rej(err)
    //             }
    //         })
    //     }
    // },

    // {
    //     marketName: 'jubi',
    //     URL: 'https://www.jubi.com/api/v1/allticker/', //URL To Fetch API From.
    //     toBTCURL: false, //URL, if needed for an external bitcoin price api.
    //     pairURL : '',
    //     last: function (data, coin_prices, toBTCURL) { //Where to find the last price of coin in JSON data
    //         return new Promise(function (res, rej) {
    //             let coinOfChoice = baseCoin.toLowerCase();
    //             let priceOfBTC = data[coinOfChoice].last;
    //             if (!priceOfBTC) {
    //                 throw console.log('wrong with jubi!!!');
    //             }
    //             console.log(priceOfBTC);
    //             try {
    //                 for (let key in data) {
    //                     let coinName = key.toUpperCase();
    //                     let price = data[key].last;
    //                     if (!coin_prices[coinName]) coin_prices[coinName] = {};

    //                     coin_prices[coinName]["jubi"] = data[key].last / priceOfBTC;
    //                 }
    //                 res(coin_prices);
    //             }

    //             catch (err) {
    //                 console.log(err);
    //                 rej(err)
    //             }
    //         })
    //     },
    // },


    {
        marketName: 'poloniex',
        URL: 'https://poloniex.com/public?command=returnTicker',
        toBTCURL: false,
        pairURL : '',
        last: function (data, coin_prices) { //Where to find the last price of coin in JSON data
            return new Promise(function (res, rej) {
                try {
                    for (var obj in data) {
                        if(obj.includes(baseCoin + '_')&&obj!=="BTC_EMC2") {
                            let coinName = obj.replace(baseCoin + "_", '');
                            if (!coin_prices[coinName]) coin_prices[coinName] = {};
                            coin_prices[coinName].poloniex = data[obj].last;
                        }
                    }
                    res(coin_prices);
                }
                catch (err) {
                    console.log(err);
                    rej(err);
                }

            })
        },
        orderBook: function(type, targetCoin){
            let url = 'https://poloniex.com/public?command=returnOrderBook&currencyPair=' + baseCoin + '_' + targetCoin.toUpperCase() + '&depth=' + orderNumber;
      
            return new Promise(function (resolve, reject) {
                request(url, function (error, response, body) {
                    try {
                        let data = JSON.parse(body);
                        let orders = [];
                        console.log("Success: Retrieving orders - " + type);
                        if (type == 'buy'){
                            let x = [];
                            for (var i = 0; i < data.bids.length; i++){
                                x[i] = {};
                                x[i].Quantity = data.bids[i][1];
                                x[i].Rate = data.bids[i][0];
                                orders.push(x[i]);
                            }
                            
                        } else {
                       
                            let x = [];
                            for (var i = 0; i < data.asks.length; i++){
                                x[i] = {};
                                x[i].Quantity = data.asks[i][1];
                                x[i].Rate = data.asks[i][0];
                                orders.push(x[i]);
                            }
                            
                        }
                        //console.log('Poooooooooooooooo' + jsonFormat(orders));
                        
                        resolve(orders);
                    } catch (error) {
                        console.log("Error getting JSON response from", url, error); //Throws error
                        reject(error);
                    }

                });
            });
        }

    },
    
 //    {
	// 	marketName: 'cryptopia',
	// 	URL: 'https://www.cryptopia.co.nz/api/GetMarkets/BTC', //URL To Fetch API From.
	// 	toBTCURL: false, //URL, if needed for an external bitcoin price api.
 //        pairURL : '',
 //        last: function (data, coin_prices) { //Get the last price of coins in JSON data
	// 		return new Promise(function (res, rej) {
	// 			try {
	// 				for (let obj of data.Data) {
	// 					if(obj["Label"].includes('/' + baseCoin)) {
	// 						let coinName = obj["Label"].replace("/" + baseCoin, '');
	// 						if (!coin_prices[coinName]) coin_prices[coinName] = {};
	// 						coin_prices[coinName].cryptopia = obj.LastPrice;
 //                        }
 //                    }
 //                    res(coin_prices);
					
 //                }
 //                catch (err) {
 //                    console.log(err);
 //                    rej(err);
 //                }

 //            })
	// 	},
	// },
    
 //    {
	// 	marketName: 'bleutrade',
	// 	URL: 'https://bleutrade.com/api/v2/public/getmarketsummaries', //URL To Fetch API From.
	// 	toBTCURL: false, //URL, if needed for an external bitcoin price api.
 //        pairURL : '',
 //        last: function (data, coin_prices) { //Get the last price of coins in JSON data
	// 		return new Promise(function (res, rej) {
	// 			try {
	// 				for (let obj of data.result) {
	// 					if(obj["MarketName"].includes('_' + baseCoin)) {
	// 						let coinName = obj["MarketName"].replace("_" + baseCoin, '');
	// 						if (!coin_prices[coinName]) coin_prices[coinName] = {};
	// 						coin_prices[coinName].bleutrade = obj.Last;
 //                        }
 //                    }
 //                    res(coin_prices);
					
 //                }
 //                catch (err) {
 //                    console.log(err);
 //                    rej(err);
 //                }

 //            })
	// 	},
 //        orderBook: function(type, targetCoin){
 //            let url = '';
 //            let buyOrSell = ''
 //            if (type == 'buy'){
 //                url = 'https://bleutrade.com/api/v2/public/getorderbook?market=' + targetCoin.toUpperCase() + '_' + baseCoin + '&type=buy&depth=' + orderNumber;
 //                buyOrSell = 'buy';
 //            } else {
 //                url = 'https://bleutrade.com/api/v2/public/getorderbook?market=' + targetCoin.toUpperCase() + '_' + baseCoin + '&type=sell&depth=' + orderNumber;
 //                buyOrSell = 'sell';
 //            }
 //            return new Promise(function (resolve, reject) {
 //                request(url, function (error, response, body) {
 //                    try {
 //                        let data = JSON.parse(body);
 //                        let orders = [];
 //                        console.log("Success: Retrieving orders - " + type);
 //                        //console.log(data.result[buyOrSell].length);
                        
 //                        if (data.result[buyOrSell].length > orderNumber){
 //                            for (let i = 0; i < orderNumber; i++){
 //                                orders.push(data.result[buyOrSell][i]);
 //                            }
 //                            orders.push(data.result[buyOrSell][0], data.result[buyOrSell][1], data.result[buyOrSell][2]);
 //                        } else {
 //                            data.result[buyOrSell].map(x => orders.push(x));
 //                        }
 //                        //console.log('bitttttttttttttttt' + jsonFormat(orders));
 //                        resolve(orders);
 //                    } catch (error) {
 //                        console.log("Error getting JSON response from", url, error); //Throws error
 //                        reject(error);
 //                    }

 //                });
 //            });
 //        }
	// },
	
	// {

 //        marketName: 'kraken', // kraken has no one size fits all market summery so each pair has to be entered as param in GET - will need to add new coins as they are added to exchange
 //        URL: 'https://api.kraken.com/0/public/Ticker?pair=DASHXBT,EOSXBT,GNOXBT,ETCXBT,ETHXBT,ICNXBT,LTCXBT,MLNXBT,REPXBT,XDGXBT,XLMXBT,XMRXBT,XRPXBT,ZECXBT', //URL To Fetch API From.
 //        toBTCURL: false, //URL, if needed for an external bitcoin price api.
 //        pairURL : '',
 //        last: function (data, coin_prices) { //Get the last price of coins in JSON data
 //            return new Promise(function (res, rej) {
 //                try {
 //                    for (let key in data.result) {
 //                        let arr = key.match(/DASH|EOS|GNO|ETC|ETH|ICN|LTC|MLN|REP|XDG|XLM|XMR|XRP|ZEC/); // matching real names to weird kraken api coin pairs like "XETCXXBT" etc 
 //                        let name = key;
 //                        let matchedName = arr[0];
 //                        if (matchedName === "XDG") { //kraken calls DOGE "XDG" for whatever reason
 //                            let matchedName = "DOGE";
 //                            var coinName = matchedName;
 //                        } else {
 //                            var coinName = matchedName;
 //                        }

 //                        if (!coin_prices[coinName]) coin_prices[coinName] = {};
                        
 //                        coin_prices[coinName].kraken = data.result[name].c[0];

 //                    }
 //                    res(coin_prices);

 //                }
 //                catch (err) {
 //                    console.log(err);
 //                    rej(err);
 //                }

 //            })
 //        },
 //    },

];

let marketNames = [];
for(let i = 0; i < markets.length; i++) { // Loop except cryptowatch
    marketNames.push([[markets[i].marketName], [markets[i].pairURL]]);
}
console.log("Markets:", marketNames);
module.exports = function () {
    var xx;
    this.markets = markets;
    this.marketNames = marketNames;
    baseCoinPrice.then(function(x){
        this.baseCoinPrice = x;
    })
};
//markets = array of object
//marketnames = array of array [name. url]