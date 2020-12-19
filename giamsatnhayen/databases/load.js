const Station = require('../models/Station')
const Coordinate = require('../models/Coordinate')
const Sensor = require('../models/Sensor')
const Values = require('../models/Values')
const Threshold = require('../models/Threshold')
const utils = require('../utils/common')
const Unit = require('../models/Unit')
const Measure = require('../models/Measure')

const insertCoordinate = (allStation, allCoordinate) => {
    const result = []
    for (let i = 0; i < allStation.length; i++) {
        const coor = Coordinate.funcs._getCoordinateByID(allCoordinate, allStation[i].coordinateID)
        allStation[i].coordinate = {
            lat: coor.lat,
            long: coor.long
        }
        result.push(allStation[i])
    }
    return result;
}

const getAllSensorForAllStation = (allStation) => {
        const promises = []
        for(let i = 0; i < allStation.length; i++)
            promises.push(Sensor.funcs.getSensorByStationID(allStation[i]._id))      
        return Promise.all(promises)
}

const insertAllThesholdForAllSensor = async(fullData) => {
    const tempData = utils.clone(fullData)
    for (let i = 0; i < tempData.length; i++) {
        if (tempData[i].sensor != null) {
            for (let j = 0; j < tempData[i].sensor.length; j++) {
                tempData[i].sensor[j].thresholds = await Threshold.funcs.getThresholdBySensorID(tempData[i].sensor[j]._id)
            }
        }
    }
    return tempData
}

const loadMap = () => {
    let allStation = null
    let dataAfterInsert = null
    Station.funcs.getAllStation()
    .then(allStationData => {
        allStation = utils.clone(allStationData)
        return Coordinate.funcs.getAllCoordinate()
    })
    .then(allCoordinateData => {
        if(allStation != null && allCoordinateData != null){
            dataAfterInsert = insertCoordinate(allStation, allCoordinateData)
            return getAllSensorForAllStation(allStation)
        }
    })
    .then(async afterGetAllSensor => {
        for(let i = 0; i < afterGetAllSensor.length; i++)
            dataAfterInsert[i].sensor = afterGetAllSensor[i]
        global.io.emit('load station infor', await insertAllThesholdForAllSensor(dataAfterInsert))
    })
    .catch(err => {
        console.log(err)
    })    
}

const loadLiveChart = async () => {
    Station.funcs.getAllStation()
    .then(allStationData => {
        global.io.emit('load live chart', allStationData)
    })
    
}

const loadStaticChart = async () => {
    const allStation = utils.clone(global.allStation)
    const now = (await utils.timeNow()).split(',')[0]
    const nearestDates = await utils.nearestAmountDates(7, now) // 7 days nearest
    const allValues = utils.clone((await Values.funcs.getAllData()))
    const averForAllStation = []
    for (let i = 0; i < allStation.length; i++) {
        const aver = {
            temperature: {
                countMeasure: 0,
                aver: [],
                overThreshold: 0
            },
            humidity: {
                countMeasure: 0,
                aver: [],
                overThreshold: 0
            }
        }
        for (let j = 0; j < nearestDates.length; j++) {
            const averTemp = await Values.funcs.getAverageByDate(allValues[i], 'temperature', allStation[i].stationID, nearestDates[j])
            const averHumi = await Values.funcs.getAverageByDate(allValues[i], 'humidity', allStation[i].stationID, nearestDates[j])
            aver.temperature.aver.push(averTemp.aver)
            aver.humidity.aver.push(averHumi.aver)
            aver.temperature.countMeasure += averTemp.countMeasure
            aver.humidity.countMeasure += averHumi.countMeasure
            aver.temperature.overThreshold += averTemp.overTheshold
            aver.humidity.overThreshold += averHumi.overTheshold
        }

        averForAllStation.push(aver)
    }
    for (let i = 0; i < allStation.length; i++) {
        allStation[i].values = {
            average: {
                temperature: {
                    labels: nearestDates,
                    data: averForAllStation[i].temperature.aver,
                },
                humidity: {
                    labels: nearestDates,
                    data: averForAllStation[i].humidity.aver,
                }
            },
            thresholds: {
                temperature: {
                    countMeasure: averForAllStation[i].temperature.countMeasure,
                    over: averForAllStation[i].temperature.overThreshold
                },
                humidity: {
                    countMeasure: averForAllStation[i].humidity.countMeasure,
                    over: averForAllStation[i].humidity.overThreshold
                }
            }
        }
    }
    global.io.emit('load static chart', allStation)
}

const insertStationName = async (allValue) => {
    for (let i = 0; i < allValue.length; i++) {
        allValue[i].stationName = (await Station.funcs.getStationByStationID(allValue[i].stationID)).name
    }
}

const spliceArrayValue = async (allValue, amount) => {
    for (let i = 0; i < allValue.length; i++) {
        allValue[i].values = allValue[i].values.slice(0, amount)
    }
}

const loadTable = async () => {
    const allValue = utils.clone((await Values.funcs.getAllData()))
    await spliceArrayValue(allValue, 50)
    for (let i = 0; i < allValue.length; i++) {
        allValue[i].stationName = await Station.funcs._convertStationIDToName(global.allStation, allValue[i].stationID)
        for (let j = 0; j < allValue[i].values.length; j++) {
            const item = allValue[i].values[j]
            allValue[i].values[j].sensorName = await Sensor.funcs._convertSensorIDToName(global.allSensor, item.sensorID)
            allValue[i].values[j].measure = await Measure.funcs._convertMeasureIDToName(global.allMeasure, item.measureID)
            allValue[i].values[j].unit = await Measure.funcs._convertMeasureIDtoUnitName(global.allMeasure, global.allUnit, item.measureID)
        }

    }
    console.log(allValue)
    global.io.emit('table', allValue)
}

module.exports = {
    loadMap,
    loadLiveChart,
    loadStaticChart,
    loadTable
}