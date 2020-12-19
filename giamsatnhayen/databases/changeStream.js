const Values = require('../models/Values')
const Threshold = require('../models/Threshold')
const Station = require('../models/Station')
const Unit = require('../models/Unit')
const Measure = require('../models/Measure')
const utils = require('../utils/common')
const Nexmo = require('Nexmo')
const changeStream = Values.model.watch();
const axios = require('axios');

global.COUNT = 0;
global.SEND_DATA_TO_MAP = 0;

const parse = async (fullData) => {
    const stationID = parseInt(fullData.stationID)
    fullData.stationName = (await Station.funcs.getStationByStationID(stationID)).name
    for (let i = 0; i < fullData.values.length; i++) {
        const threshold = await Threshold.funcs._convertSensorIDToThreshold(global.allThreshold, fullData.values[i].sensorID)
        const unitName = await Measure.funcs._convertMeasureIDtoUnitName(global.allMeasure, global.allUnit, fullData.values[i].measureID)
        fullData.values[i].measure = {
            unit: unitName,
            thresholds: {
                min: unitName === 'celcius' ? threshold[0].min : threshold[1].min,
                max: unitName === 'celcius' ? threshold[0].max : threshold[1].max
            }
        }
    }
}

module.exports = () => {
    changeStream.on('change', (change) => {
        Values.funcs.getValueByStationID(change.documentKey._id)
            .then(async (data) => {
                let fullData = utils.clone(data)
                await parse(fullData)
                const temp = fullData.values[0].value;
                const humi = fullData.values[1].value;

                global.io.emit('live chart', fullData)
                global.SEND_DATA_TO_MAP++;
                if (global.SEND_DATA_TO_MAP == 10) {
                    global.io.emit('map', fullData)
                    global.SEND_DATA_TO_MAP = 0

                    let warning = "";
                    // trạm 1 cảnh báo nhiệt độ quá ngưỡng, với mức nhiệt độ hiện tại là 31 độ C, bật chế độ tự động phun sương
                    if (temp > allThreshold[0].max || temp < allThreshold[0].min) { // nhiệt độ quá ngưỡng
                        warning = `nhiệt độ(${temp} độ C) quá ngưỡng`;
                    }
                    if (humi > allThreshold[1].max || humi < allThreshold[1].min) {
                        warning = `độ ẩm(${humi} %) quá ngưỡng`;
                    }
                    if ((temp > allThreshold[0].max || temp < allThreshold[0].min) && (humi > allThreshold[1].max || humi < allThreshold[1].min)) {
                        warning = `nhiệt độ(${temp} độ C) và độ ẩm(${humi} %) quá ngưỡng`;
                    }

                    if (warning != "") {
                        const message = `${fullData.stationName} cảnh báo ${warning} vào lúc (${fullData.values[0].date})`;
                        // const nexmo1 = new Nexmo({
                        //     apiKey: '1aaa818e',
                        //     apiSecret: 'j50omqYD0vhHW5EV',
                        // });
                        // const from1 = 'Vonage APIs';
                        // const to1 = '84947777039';


                        // const nexmo2 = new Nexmo({
                        //     apiKey: '7903b52d',
                        //     apiSecret: 'm27GHxjkV5GFSckY',
                        // });
                        // const from2 = 'Vonage APIs';
                        // const to2 = '84333123878';

                        // nexmo1.message.sendSms(from1, to1, message, { "type": "unicode" }, (err, response) => {
                        //     if (err) console.log('send message failed');
                        //     else console.log('send message success')
                        // });
                        // nexmo2.message.sendSms(from2, to2, message, { "type": "unicode" }, (err, response) => {
                        //     if (err) console.log('send message failed');
                        //     else console.log('send message success')
                        // });


                        const nexmo3 = new Nexmo({
                          apiKey: '9da12cfd',
                          apiSecret: 'KMriuxkLZ9bq1YXG',
                        });
                        
                        const from3 = 'Vonage APIs';
                        const to3 = '84915517804';
                        
                        nexmo3.message.sendSms(from3, to3, message, { "type": "unicode" }, (err, response) => {
                            if (err) console.log('send message failed');
                            else console.log('send message success')
                        });


                        const nexmo4 = new Nexmo({
                            apiKey: '3511ff1a',
                            apiSecret: 'HAxdUr4up8B9XnVk',
                          });
                          
                          const from4 = 'Vonage APIs';
                          const to4 = '84376833937';

                        nexmo4.message.sendSms(from4, to4, message, { "type": "unicode" }, (err, response) => {
                            if (err) console.log('send message failed');
                            else console.log('send message success')
                        });


                        const nexmo5 = new Nexmo({
                            apiKey: 'c9571636',
                            apiSecret: 'yUdgc66eHP7NYL1i',
                          });
                          
                          const from5 = 'Vonage APIs';
                          const to5 = '84916916965';

                          nexmo5.message.sendSms(from5, to5, message, { "type": "unicode" }, (err, response) => {
                            if (err) console.log('send message failed');
                            else console.log('send message success')
                        });

                        if (global.hostToSetThresholdsForEsp32 != "") {
                            axios.get(`http://${global.hostToSetThresholdsForEsp32}:80/get?statusMotor=1`)
                                .then(function (response) {
                                    console.log('send status motor success');
                                })
                                .catch(function (error) {
                                    console.log('send status motor failed');
                                })
                        }
                    }


                }


                // 
                //const message = `${fullData.stationName}`;

                // console.log(allThreshold);

                // console.log(message);




                // const nexmo = new Nexmo({
                //     apiKey: '7903b52d',
                //     apiSecret: 'm27GHxjkV5GFSckY',
                //   });

                //   const from = 'Vonage APIs';
                //   const to = '84333123878';
                //   const text = 'Hello from Vonage SMS API';

                //   nexmo.message.sendSms(from, to, message, { "type": "unicode" }, (err, response) => {
                //       if(err) console.log('failed');
                //       else console.log('success')
                //   });


                // const Nexmo = require('nexmo');

                // const nexmo = new Nexmo({
                //   apiKey: '1041320c',
                //   apiSecret: 'xpOjU4l6Zb4fp6zX',
                // });

                // const from = 'Vonage APIs';
                // const to = '84852915955';




                // const Nexmo = require('nexmo');

                // const nexmo = new Nexmo({
                //     apiKey: '16b89da8',
                //     apiSecret: '1lUGLvrOgYLBuDR7',
                // });

                // const from = 'Vonage APIs';
                // const to = '84824224700';

            })

        console.log("change change");
    });
}