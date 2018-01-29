/**
 * Created by Manu Masson on 6/27/2017.
 *
 */

'use strict';

console.log('Starting app...');

const request = require('request'), Promise = require("bluebird"); //request for pulling JSON from api. Bluebird for Promises.

const express = require('express'),
    app = express(),
    http = require('http').Server(app),
    util = require('util');
var jsonFormat = require('json-format');
var fs = require('fs');

require('./settings.js')(); //Includes settings file.
// let db = require('./db.js'); //Includes db.js


let coinNames = [];
let LastResults = []; 
let focusGroup = [];
let id = 0;
let target = 0.0001;
let iteration = 1;

let coin_prices = {}, numberOfRequests = 0, results = []; // GLOBAL variables to get pushed to browser.

function getMarketData(market, coin_prices) {   //GET JSON DATA
    return new Promise(function (resolve, reject) {
        request(market.URL, function (error, response, body) {
            try {
                let data = JSON.parse(body);
                console.log("Success", market.marketName);
                if (market.marketName) {
                    let newCoinPrices = market.last(data, coin_prices, market.toBTCURL);
                    fs.writeFile('coinPrices.js', jsonFormat(coin_prices), function(err){
                        if (err) throw err;
                    })
                    numberOfRequests++;
                    if (numberOfRequests >= 1){
                        computePrices(coin_prices); 
                    } 
                    resolve(newCoinPrices);

                }
                else {
                    resolve(data);
                }

            } catch (error) {
                console.log("Error getting JSON response from", market.URL, error); //Throws error
                reject(error);
            }

        });


    });
}

//data is coin prices, {btc: { bittrex: 50usd, xxx: 50usd }, ltc: {xxx: xxx}}
async function computePrices(data) {
    results = [];

    function loopData() {
        return new Promise(function (resolve, reject) {

            if (numberOfRequests >= 2) {

                for (let coin in data) {

                    if (Object.keys(data[coin]).length > 1) {
                        //coinNames: global empty array
                        if (coinNames.includes(coin) == false) coinNames.push(coin);
                        let arr = [];
                        for (let market in data[coin]) {
                            arr.push([data[coin][market], market]);//price and exchange name, [[30usd, bittrex], [...]]
                        }
                        arr.sort(function (a, b) {
                            return a[0] - b[0];
                        });
                        for (let i = 0; i < arr.length; i++) {
                            for (let j = i + 1; j < arr.length; j++) {

                                if ( arr[i][0] >= arr[j][0]){
                                    results.push(
                                        {
                                            coin: coin,
                                            spread: (arr[i][0] - arr[j][0]) / arr[j][0],
                                            time: new Date(),
                                            market2: {
                                                name: arr[i][1],
                                                last: arr[i][0]
                                            },
                                            market1: {
                                                name: arr[j][1],
                                                last: arr[j][0]
                                            }

                                        }
                                    )
                                } else {
                                    results.push(
                                        {//TODO, shouldnt have to create duplicate object for same markets
                                            coin: coin,
                                            spread: (arr[j][0] - arr[i][0]) / arr[i][0],
                                            time: new Date(),
                                            market2: {
                                                name: arr[j][1],
                                                last: arr[j][0]
                                            },
                                            market1: {
                                                name: arr[i][1],
                                                last: arr[i][0]
                                            }

                                        }
                                    )
                                }

                                if (focusGroup.length > 0){
                                 
                                    for (let i = focusGroup.length - 1; i >= 0; i--){
                                        if (focusGroup[i][0] == results[results.length - 1].coin && focusGroup[i][1] == results[results.length - 1].market1.name && focusGroup[i][2] == results[results.length - 1].market2.name) {
                                            focusGroup.splice(i, 1);
                                            console.log('Deleted from Watch list: ' + focusGroup.length);
                                        }
                                        else if (focusGroup[i][0] == results[results.length - 1].coin && focusGroup[i][1] == results[results.length - 1].market2.name && focusGroup[i][2] == results[results.length - 1].market1.name) {

                                            if (focusGroup[i][3] > target) {
                                                let indexHolder = i;//if fs.appendFile, i is not sync
                                                let holder = results[results.length - 1] //don't edite the intersection file
                                                holder.id = focusGroup[i][4];
                                                holder.timeOfIntersec = (results[results.length - 1].time - focusGroup[i][5]) / 1000 + ' sec ago';
                                                // fs.appendFile('buytime.js', jsonFormat(holder), function(err){
                                                //     if (err) throw err;
                                                //     console.log('index: ' + i + ', array length: ' + focusGroup.length + ', holder: ' + indexHolder);
                                                //     focusGroup.splice(i, 1);
                                        
                                                //     console.log('deleted from Watch list(buy time): ' + focusGroup.length);
                                                //     console.log('Buy time!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
                                                // })
                                                //console.log(jsonFormat(focusGroup));
                                                //console.log(jsonFormat(holder));
                                                //console.log('this is the message: '+jsonFormat(focusGroup[i]));
                                                //console.log('index: ' + i + ', array length: ' + focusGroup.length + ', holder: ' + indexHolder);
                                                //debugger;
                                                if (focusGroup[i] == undefined){
                                                    console.log('index is ' + i + ", focusGroup is: " + jsonFormat(focusGroup));
                                                    debugger;
                                                }
                                             
                                                focusGroup.splice(i, 1);
                                                //debugger;
                                                //console.log(jsonFormat(focusGroup));
                                                
                                                console.log('deleted from Watch list(buy time): ' + focusGroup.length);

                                                let promiseHolder1, promiseHolder2;
                                                markets.map(function (a){
                                                    if (a.marketName == holder.market2.name){
                                                        promiseHolder1 = a.orderBook('buy', holder.coin).then(function(x){
                                                            holder['top 3 buy orders'] = x;
                                                            
                                                            //fs.appendFileSync('buytime.js', jsonFormat(holder));
                                                        }).catch( function (e){
                                                            throw e;
                                                            console.log('wrong with fetching orderbook: ' + e);
                                                        })
                                                    } else if (a.marketName == holder.market1.name){
                                                        promiseHolder2 = a.orderBook('sell', holder.coin).then(function(x){
                                                            holder['top 3 sell orders'] = x;
                                                            //fs.appendFileSync('buytime.js', jsonFormat(holder));
                                                        }).catch( function (e){
                                                            throw e;
                                                            console.log('wrong with fetching orderbook: ' + e);
                                                        })
                                                    }
                                                })
                                                Promise.all([promiseHolder1, promiseHolder2]).then(function(x){
                                                    
                                                    fs.appendFileSync('buytime.js', jsonFormat(holder));
                                                   
                                                    console.log('Buy time!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
                                                    
                                                }).catch(e => console.log(e));
                                                                                                
                                            }
                                        } 
                                    }
                                  
                                    // focusGroup.forEach(function(element){
                                    //     if (element[0] == results[results.length - 1].coin && element[1] == results[results.length - 1].market1.name && element[2] == results[results.length - 1].market2.name) {
                                    //         deleteFromGroup.push([0, i]);
                                    //         // focusGroup.splice(i, 1);
                                    //         // console.log('Deleted from Watch list: ' + focusGroup.length);
                                    //     }
                                    //     else if (element[0] == results[results.length - 1].coin && element[1] == results[results.length - 1].market2.name && element[2] == results[results.length - 1].market1.name) {

                                    //         if (element[3] > target) {
                                    //             let indexHolder = i;//if fs.appendFile, i is not sync
                                    //             let holder = results[results.length - 1] //don't edite the intersection file
                                    //             holder.id = element[4];
                                    //             holder.timeOfIntersec = (results[results.length - 1].time - element[5]) / 1000 + ' sec ago';
                                    //             // fs.appendFile('buytime.js', jsonFormat(holder), function(err){
                                    //             //     if (err) throw err;
                                    //             //     console.log('index: ' + i + ', array length: ' + focusGroup.length + ', holder: ' + indexHolder);
                                    //             //     focusGroup.splice(i, 1);
                                        
                                    //             //     console.log('deleted from Watch list(buy time): ' + focusGroup.length);
                                    //             //     console.log('Buy time!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
                                    //             // })
                                    //             //console.log(jsonFormat(focusGroup));
                                    //             //console.log(jsonFormat(holder));
                                    //             let promiseHolder1, promiseHolder2;
                                    //             markets.map(function (a){
                                    //                 if (a.marketName == holder.market2.name){
                                    //                     promiseHolder1 = a.orderBook('buy', holder.coin).then(function(x){
                                    //                         holder['top 3 buy orders'] = x;
                                                            
                                    //                         //fs.appendFileSync('buytime.js', jsonFormat(holder));
                                    //                     }).catch( function (e){
                                    //                         throw e;
                                    //                         console.log('wrong with fetching orderbook: ' + e);
                                    //                     })
                                    //                 } else if (a.marketName == holder.market1.name){
                                    //                     promiseHolder2 = a.orderBook('sell', holder.coin).then(function(x){
                                    //                         holder['top 3 sell orders'] = x;
                                    //                         //fs.appendFileSync('buytime.js', jsonFormat(holder));
                                    //                     }).catch( function (e){
                                    //                         throw e;
                                    //                         console.log('wrong with fetching orderbook: ' + e);
                                    //                     })
                                    //                 }
                                    //             })
                                    //             Promise.all([promiseHolder1, promiseHolder2]).then(function(x){
                                                    
                                    //                 fs.appendFileSync('buytime.js', jsonFormat(holder));
                                    //                 //console.log('index: ' + i + ', array length: ' + focusGroup.length + ', holder: ' + indexHolder);
                                    //                 //debugger;
                                    //                 if (focusGroup[i] == undefined){
                                    //                     console.log('index is ' + i + ", focusGroup is: " + jsonFormat(focusGroup));
                                    //                     debugger;
                                    //                 }
                                    //                 console.log(focusGroup[i][4]);
                                    //                 focusGroup.splice(i, 1);
                                    //                 //debugger;
                                    //                 //console.log(jsonFormat(focusGroup));
                                                    
                                    //                 console.log('deleted from Watch list(buy time): ' + focusGroup.length);
                                    //                 console.log('Buy time!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
                                                    
                                    //             }).catch(e => console.log(e));
                                                                                                
                                    //         }
                                    //     } else {
                                    //         i++;
                                    //     }
                                    // })
                                }

                                for (var q = 0; q < LastResults.length; q++ ){
                                    if (LastResults[q].coin == results[results.length - 1].coin){    
                                        if (LastResults[q].market2.name == results[results.length - 1].market1.name && LastResults[q].market1.name == results[results.length - 1].market2.name && results[results.length - 1].spread > 0){
                                            results[results.length - 1].id = id;
                                            id++;
                                            focusGroup.push([results[results.length - 1].coin, results[results.length - 1].market2.name,results[results.length - 1].market1.name, results[results.length - 1].spread, id - 1, results[results.length - 1].time]);
                                            console.log('Added in Whatch List: ' + focusGroup.length);
                                            fs.appendFile('intersection.js', jsonFormat([LastResults[q], results[results.length - 1]]), function(err){
                                                if (err) throw err;
                                                console.log('Price reversed!!!!!!!!!!!!');
                                                
                                            })
                                        }
                                    }                              
                                }
                               
                                // db.insert({
                                //     coin: coin,
                                //     lastSpread: arr[i][0] / arr[j][0],
                                //     market1: {
                                //         name: arr[i][1],
                                //         last: arr[i][0]
                                //     },
                                //     market2: {
                                //         name: arr[j][1],
                                //         last: arr[j][0]
                                //     }
                                // })

                            }
                        }

                    }
                }
                results.sort(function (a, b) {
                    return a.spread - b.spread;
                });
                resolve();
            }
        })
    }

    await loopData();

    LastResults = results;

    fs.writeFile('APIResults.js', jsonFormat(results), function (err) {
      if (err) throw err;
    });
}


(async function main() {
    console.log('Iteration: ' + iteration);
    iteration++;
    let arrayOfRequests = [];

    for (let i = 0; i < markets.length; i++) {
        arrayOfRequests.push(getMarketData(markets[i], coin_prices));
    }

    await Promise.all(arrayOfRequests.map(p => p.catch(e => e)))

        .then(results => computePrices(coin_prices))

        .catch(e => console.log(e));

    setTimeout(main, 10000);
})();
