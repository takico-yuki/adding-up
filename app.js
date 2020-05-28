'use strict';
//node.jsに用意されたモジュールとなるオブジェクトの呼び出し
const fs = require('fs');               //node.js fileSystem モジュール
const readline = require('readline');   //node.sj readLine   モジュール

const rs = fs.createReadStream('./popu-pref.csv');  //node.js createReadStreamオブジェクト
const rl = readline.createInterface({
                                    input:rs,
                                    output:{}
                                    });             //node.js createInterfaceオブジェクト
const prefectureDataMap = new Map();       //key:都道府県 value:集計データオブジェクト
rl.on('line',lineString => {               //lineStringはparameterで一行ずつ読み取ったデータ
    //カンマでデータを分ける
    const columns = lineString.split(',');
    const year = parseInt(columns[0]);
    const prefecture = columns[1];
    const popu = parseInt(columns[3]);
    if(year === 2010 || year === 2015 ){
        let value = prefectureDataMap.get(prefecture);
       //valueの初期値keyとvalueを設定
       //人口のデータをまとめて入れる
        if(!value){
            value = {
                popu10:0,
                popu15:0,
                change:null
            };
        };
        //年事での分岐させて格納
       if(year === 2010){
           value.popu10 = popu;
       } 
       if(year === 2015){
           value.popu15 = popu;
       }
       prefectureDataMap.set(prefecture,value);
    }
});
rl.on('close',() => {
    //人口増加率の計算
    for(let [key,value] of prefectureDataMap){
        value.change = value.popu15/value.popu10;
    }

    const rankingArray = Array.from(prefectureDataMap).sort((pair1,pair2) => {
        return pair2[1].change - pair1[1].change;
    });
    
    const rankingStrings = rankingArray.map(([key , value]) =>{
        return(
            key + ':' + value.popu10 + '=>' + value.popu15 + '変化率' + value.change 
        );
    });
    console.log(rankingStrings);
});