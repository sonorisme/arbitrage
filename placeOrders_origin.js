//poloniex throw error, bittrex don't, but output false in its returned json.

//result = [ array buyPairs, array sellPairs, string title, string sellerMarket, string buyerMarket]
const config = require('./config.js');

const Promise = require('bluebird')
const request = require('request')
const Bittrex = require('bittrex-wrapper');
const bittrex = new Bittrex(config.credentials.bittrex.key , config.credentials.bittrex.secret);
const Poloniex = require('poloniex-api-node');
const poloniex = new Poloniex(config.credentials.poloniex.key, config.credentials.poloniex.secret);
// var key = 'your-key';
// var secret = 'your-secret';
// var client_id = 'your-bitstamp-user-id';
// var timeout = 10000;
// var host = 'www.your.bitstamp.net';
const Bitstamp = require('bitstamp');
const bitstamp = new Bitstamp(config.credentials.bitstamp.key , config.credentials.bitstamp.secret);

const secondMatch = require('./secondMatch_experiment');

//result: [buyPairs, sellPairs, title, holder['market1']['name'], holder['market2']['name']]
module.exports = function placeOrders(result, baseCoin){

	function wrapper(type, orders)){
		//orderAfter: [orders, Exchange, targetCoin]
		if (i < 1){
			if (type == 'buy'){
				let [ordersx, exchangex, targetCoinx] = secondMatch.weBuy(orders, result[3], result[2])
				//cancell all orders
				placeOrders([ordersx, 0, targetCoinx, exchangex, 0])
			} else {
				let [ordersx, exchangex, targetCoinx] = secondMatch.weSell(orders, result[4], result[2])			
				//cancell all orders
				placeOrders([0, ordersx, targetCoinx, 0, exchangex])
			}
			i++
		} else{
			//what to do with the rest of the open orders, param: orders is the updated true 
			//open orders
		}
	}
	switch(result[3]){
		case 'bittrex':
			// let failedOrders = [];
			// let i = 0;
			// let resultOfBuy = result[0].map(function(x){
			// 	return new Promise(function(res, rej){
			// 		let url = 'https://bittrex.com/api/v1.1/market/buylimit?apikey='+config.credentials.bittrex.key+'&market='+baseCoin+'-'+result[2]+'&quantity='+x[0]+'&rate='+x[1]+'&nonce='+i;;
			// 		i++;
			// 		request(url, function (error, response, body){
			// 			if (error){
			// 				rej(error);
			// 				return;
			// 			}
			// 			let data = JSON.parse(body);
			// 			if (!data.success){
			// 				failedOrders.push(x);
			// 			} 
			// 			res(data);
			// 		});
			// 	})
			// })
			
			// Promise.all(resultOfBuy).then(function(x){
			// 	orderResults = x;
			// 	failedOrdersOut = failedOrders;
			// 	console.log(orderResults, failedOrdersOut);
			// 	debugger;
			// }).catch(function(err){
				
			// 	throw err;
			// })

			// break;
			//let i = 0;
			if (true){
				let orderResults = [];
				let resultOfBuy = result[0].map(function(x){
					// return new Promise(function(res, rej){
					// 	bittrex.tradebuy({
					// 		MarketName: baseCoin+'-'+result[2],
					// 	  	OrderType: 'LIMIT',
					// 	  	Quantity: x[0],
					// 	  	Rate: x[1],
					// 	  	TimeInEffect: 'IMMEDIATE_OR_CANCEL', // supported options are 'IMMEDIATE_OR_CANCEL', 'GOOD_TIL_CANCELLED', 'FILL_OR_KILL'
					// 	  	ConditionType: 'NONE', // supported options are 'NONE', 'GREATER_THAN', 'LESS_THAN'
					// 	  	Target: 0, // used in conjunction with ConditionType
					// 	}, function( data, err ) {
					// 		if (err){

					// 			rej(err);
					// 			debugger;
					// 		}
					// 		res(data);
					// 	});

					// })

					return bittrex.marketBuyLimit(baseCoin+'-'+result[2], x[0], x[1]).then(function(y){
				 		if (y.error){
				 			throw new Error(y.error)
				 		}
				 		if (!y.success){
				 			throw new Error('Success state: ' + y.success + ', Reason: ' + y.message)
				 		}
				 		return y;
					})
					// .catch(function(e){
					// 	throw e;
					// });
				})
					
				
				Promise.all(resultOfBuy).then(function(z){
					orderResults = z;
				
					bittrex.marketGetOpenOrders(baseCoin+'-'+result[2]).then(function(y){
						//console.log(y)

						(function (){
							let i = 0;
							wrapper('buy', y)
						})()

						// let closure = (function (){
						// 	let i = 0;
						// 	return wrapper
						// })()
						// closure('buy', orders)


					}).catch(function(e){
						throw e;
					})
					// marketCancel(uuid) - Used to cancel a buy or sell order
					// uuid - required uuid of buy or sell order
				
				})
				// .catch(function(err){
					
				// 	throw err;
				
				// })
				
			}
			break;
		case 'bitstamp':
			if (true){
				let orderResults = [];
				let resultOfBuy = result[0].map(function(x){
					//currencyPair, rate, amount, fillOrKill, immediateOrCancel, postOnly [, callback])
					return new Promise(function(res, rej){
						bitstamp.buy(result[2].toLowerCase() + baseCoin.toLowerCase(), x[0], x[1], x[1] + 100, function(y){
			

							if (y.error || !y.success){
								throw new Error(y.error)
							}
							if (!y.success){
								throw new Error('Success state: ' + y.success)
							}

							res(y);
						});
					})
											
					// .catch((err) => {
					//   console.log(err);
					// });
				})
				Promise.all(resultOfBuy).then(function(z){
					orderResults = z;
					
					bitstamp.open_orders(result[2].toLowerCase() + baseCoin.toLowerCase(), function(y){
						//console.log(y)

						(function (){
							let i = 0;
							wrapper('buy', y)
						})()

						// let closure = (function (){
						// 	let i = 0;
						// 	return wrapper
						// })()
						// closure('buy', y)


					}).catch(function(e){
						throw e
					})
					//bitstamp.cancel_order(id, console.log)					
					
				})
				// .catch(function(err){
					
				// 	throw err;
				
				// })
				
			}
			break;
			

		case 'poloniex':
			if (true){
				let orderResults = [];
				let resultOfBuy = result[0].map(function(x){
					//currencyPair, rate, amount, fillOrKill, immediateOrCancel, postOnly [, callback])
					return poloniex.buy(baseCoin+'_'+result[2], x[1], x[0], false, false, false).then((y) => {
					  	if (y.error || !y.success){
					  		throw new Error(y.error)
					  	}
					  	if (!y.success){
					  		throw new Error('Success state: ' + y.success)
					  	}

					  	return y;
					})
					// .catch((err) => {
					//   console.log(err);
					// });
				})
				Promise.all(resultOfBuy).then(function(z){
					orderResults = z;
					
					poloniex.returnOpenOrders( baseCoin+'_'+result[2]).then(function(y){
						//console.log(y)

						(function (){
							let i = 0;
							wrapper('buy', y)
						})()

						// let closure = (function (){
						// 	let i = 0;
						// 	return wrapper
						// })()
						// closure('buy', y)



					}).catch(function(e){
						throw e
					})
					//cancelOrder(orderNumber [, callback])
					
					
				})
				// .catch(function(err){
					
				// 	throw err;
				
				// })
				
			}
			break;
			
		case 'bleutrade':
			break;
		default:
	}

	switch(result[4]){
		case 'bittrex':
			if (true){
				let orderResults = [];
				let resultOfSell = result[1].map(function(x){
					return bittrex.marketSellLimit(baseCoin+'-'+result[2], x[0], x[1]).then(function(y){
						if (y.error){
							throw new Error(y.error)
						}
						if (!y.success){
							throw new Error('Success state: ' + y.success  + ', Reason: '+ y.message)
						}
				 		return y;
					})
					// .catch(function(e){
					// 	throw e;
					// });
				})
					
				
				Promise.all(resultOfSell).then(function(z){
					orderResults = z;
				
					bittrex.marketGetOpenOrders(baseCoin+'-'+result[2]).then(function(orders){
						//console.log(orders)


						(function (){
							let i = 0;
							wrapper('sell', orders)
						})()

						// let closure = (function (){
						// 	let i = 0;
						// 	return wrapper
						// })()
						// closure('sell', orders)

					}).catch(function(e){
						throw e;
					})
				
					
					
				})
				// .catch(function(err){
					
				// 	throw err;
				
				// })

			}
			break;

		case 'bitstamp':
			if (true){
				let orderResults = [];
				let resultOfBuy = result[1].map(function(x){
					return new Promise(function(res, rej){
						bitstamp.sell(result[2].toLowerCase() + baseCoin.toLowerCase(), x[0], x[1], x[1] + 100, function(y){
							

							if (y.error || !y.success){
								throw new Error(y.error)
							}
							if (!y.success){
								throw new Error('Success state: ' + y.success)
							}

							res(y);
						});
					})
											
					// .catch((err) => {
					//   console.log(err);
					// });
				})
				Promise.all(resultOfBuy).then(function(z){
					orderResults = z;
					
					bitstamp.open_orders(result[2].toLowerCase() + baseCoin.toLowerCase(), function(orders){
						//console.log(orders)
						(function (){
							let i = 0;
							wrapper('sell', orders)
						})()

						// let closure = (function (){
						// 	let i = 0;
						// 	return wrapper
						// })()
						// closure('sell', orders)

					}).catch(function(e){
						throw e
					})
					//bitstamp.cancel_order(id, console.log)					
					
				})
				// .catch(function(err){
					
				// 	throw err;
				
				// })
				
			}
			break;
			
			
		case 'poloniex':
			if (true){
				let orderResults = [];
				let resultOfSell = result[1].map(function(x){
					//currencyPair, rate, amount, fillOrKill, immediateOrCancel, postOnly [, callback])
					return poloniex.sell(baseCoin+'_'+result[2], x[1], x[0], false, false, false).then((y) => {
					  	if (y.error || !y.success){
				 			throw new Error(y.error)
				 		}
				 		if (!y.success){
				 			throw new Error('Success state: ' + y.success)
				 		}
					  	return y;
					})
					// .catch((err) => {
					//   console.log(err);
					// });
				})
				Promise.all(resultOfSell).then(function(z){
					orderResults = z;
				
					poloniex.returnOpenOrders( baseCoin+'_'+result[2]).then(function(orders){
						//console.log(orders)

						(function (){
							let i = 0;
							wrapper('sell', orders)
						})()

						// let closure = (function (){
						// 	let i = 0;
						// 	return wrapper
						// })()
						// closure('sell', orders)
					}).catch(function(e){
						throw e
					})	
					
				})
				// .catch(function(err){
					
				// 	throw err;
				
				// })
			}
			break;
				
		case 'bleutrade':
			break;
		default:

	}
}