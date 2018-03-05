// const Poloniex = require('poloniex-api-node');
// const poloniex = new Poloniex('myKey', 'mySecret');
// const Bittrex = require('bittrex-wrapper');
// const bittrex = new Bittrex('YOUR API KEY', 'YOUR API SECRET');


// poloniex.buy('BTC_LTC', 111, 111, 1, true, false).then((y) => {
// 					  	if (y.error || !y.success){
// 					  		console.log('dddddddddddd');
// 					  		throw new Error(y.error)
// 					  	}
// 					  	if (!y.success){
// 					  		console.log(ddddddddddd)
// 					  		throw new Error('Success state: ' + y.success)
// 					  	}

// 					  	return y;
// 					}).catch(function(e){
// 						console.log(e)
// 					})
// var x = bittrex.marketBuyLimit('BTC-LTC', 111, 111).then(function(y){
// 				 		if (y.error){
				 			
// 				 			throw new Error(y.error)
// 				 		}
// 				 		if (!y.success){
// 				 			throw new Error('Success state: ' + y.success)
// 				 		}
// 				 		console.log(y)
// 				 		return y;
// 					})
// x.catch(function(e){console.log(e)})
// poloniex.buy('BTC_LTC', 11, 11, false, false, false).then((order) => {
// 				  return order;
// 				}).catch((err) => {
// 				  console.log(err);
// 				});
// var x, y, z;
// var i = 0;
// var aa = [x,y,z].map(function(x){
// 	if (i ==1){
// 		x = new Promise(function(res, rej){
// 			throw new Error('ddddsdfsfsf')
// 			console.log('continue?')
// 		})
// 		i++
// 		return x;
// 	} else{
// 		x = new Promise(function(res, rej){
// 			console.log(i)
// 			res('55555555')
// 		})
// 		i++
// 		return x;
// 	}

// })




// Promise.all(aa).catch(function(e){console.log('this is it: '+ e)})
// setTimeout(function(){
// 	console.log(x, y, z)
// 	console.log(aa)
// }, 3000)

// var z = new Promise(function(res, rej){
// 	throw new Error('ddddsdfsfsf')
// 	console.log('continue?')
// }).then(function(x){
// 	console.log('must not work')
// })
// var y = new Promise(function(res, rej){
// 	setTimeout(function(){console.log('2is working')}, 3000)
// 	//throw new Error('aaaaddddsdfsfsf')
// })

// Promise.all([z, y]).then(function(x){

// }).catch(function(x){
// 	console.log('this is fallback:'+x)
// })

// function test(x, y){
// 	function lll(){
// 		console.log(x, y)
// 	}
// 	if (x == 5){
// 		x = 2
// 		lll()
// 	} else{
// 		x++
// 		y--
// 		test(x,y);
// 	}
// }
// test(0, 0)
// function a(x, y){
// 	b(x, y)
// }

// function b(r,t){
// 		console.log(r,t)
// 	}
// a(6,7)
