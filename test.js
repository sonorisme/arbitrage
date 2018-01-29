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
var arr = [1,2,3,4,5,6];
var i = 0;
arr.forEach(function (a, x){
    if (i == 3){
        arr.splice(i, 1);
    }
    //console.log(arr[i]);
    console.log(x);
    i++
})