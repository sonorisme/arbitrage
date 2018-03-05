// var request = require('request'),
// jsonFormat = require('json-format');
// var	url = 'https://bittrex.com/api/v1.1/public/getorderbook?market=BTC-LTC&type=both';

// request(url, function (error, response, body) {
//     try {
//         let data = JSON.parse(body);
//         console.log( jsonFormat(data.result));
 		

//     } catch (error) {
//         console.log("Error getting JSON response from", url, error); //Throws error
//         reject(error);
//     }

// });
// let baseCoin = 'BTC';
// let Promise = require('bluebird'), request = require('request'), jsonFormat = require('json-format');
// (function(type, targetCoin){
//             let url = '';
//             if (type == 'buy'){
//                 url = 'https://bittrex.com/api/v1.1/public/getorderbook?market=' + baseCoin + '-' + targetCoin.toUpperCase() + '&type=buy';
//             } else {
//                 url = 'https://bittrex.com/api/v1.1/public/getorderbook?market=' + baseCoin + '-' + targetCoin.toUpperCase() + '&type=sell';

//             }
//             return new Promise(function (resolve, reject) {
//                 request(url, function (error, response, body) {
//                     try {
//                         let data = JSON.parse(body);
//                         let orders = [];
//                         console.log("Success: " + type);
//                         if (data.result.length > 3){
//                             orders.push(data.result[0], data.result[1], data.result[2]);
//                         } else {
//                             data.result.map(x => orders.push(x));
//                         }
//                         resolve(orders);
//                     } catch (error) {
//                         console.log("Error getting JSON response from", url, error); //Throws error
//                         reject(error);
//                     }

//                 });
//             });
//         })('buy', 'XRP').then(function(results){
//         	console.log(jsonFormat(results));
//         }).catch( e => console.log(e));
// var arr = [1,2,3,4,5,6];
// var i = 0;
// arr.forEach(function (a, x){
//     if (i == 3){
//         arr.splice(i, 1);
//     }
//     //console.log(arr[i]);
//     console.log(x);
//     i++
// })
// var request = require('request'),
// jsonFormat = require('json-format');
// var	url = 'https://bittrex.com/api/v1.1/public/getorderbook?market=BTC-LTC&type=buy';

// request(url, function (error, response, body) {
//     try {
//         let data = JSON.parse(body);
//         console.log( jsonFormat(data.result.length));
 		

//     } catch (error) {
//         console.log("Error getting JSON response from", url, error); //Throws error
//         reject(error);
//     }

// });

//testing 怎么不动原始对象或array，复制一个新的，改变其值
// var newobject = {
// 	'a' : 1,
// 	'b' : 2
// }
// var c = newobject;
// c.a = 2;
// c.b = 3;
// console.log(newobject.a, newobject.b);

// new Promise(function(res, rej){
// 	throw new Error('111111');
// }).catch(function(e){
// 	throw 'ccccccccccc' +e
// }).then(x => console.log('aadddddd' + x)).catch(e => console.log('fffffff'+e)).catch(e => console.log('this also work'))
// var x = {
// 	a: 'aaaaa',
// 	b: 'bbb',
// 	c: 'ccccc'
// }
// for (var y of x){
// 	console.log(y)
// }
// var y = Object.entries(x)
// console.log(y)
//throw error能终止所有function的运行 
// function a(){
// 	console.log(1);
// 	b()
// 	console.log('33333333333')
// }
// function b(){
// 	c()
// 		console.log(2);
// 		a()

// }
// function c(){
// 	throw new Error('11111')
// 	console.log(3)
// }

// a()
// const Bitstamp = require('bitstamp');
// const bitstamp = new Bitstamp('dddddd', 'ssssssss');
// bitstamp.buy('ltcbtc', 11, 11, 12, function(a, b){
// 	console.log(typeof a);
// 	console.log('dddddddd' + b)
// })
// function x (){
// 	return 555555555
// }

// function y(){
// 	return [x(), 111,222]
// }
// console.log(y());