module.exports = {
    loadAllData: (req, res, next) => {
        require('../databases/connection')()
        .then((connection) => {
            console.log('mongodb connected !')
            Promise.all([
                require('../models/Measure').funcs.getAllMeasure(),
                require('../models/Unit').funcs.getAllUnit(),
                require('../models/Threshold').funcs.getAllThreshold(),
                require('../models/Sensor').funcs.getAllSensor(),
                require('../models/Station').funcs.getAllStation(),
                require('../models/Coordinate').funcs.getAllCoordinate()
            ])
            .then(datas => {

                global.allMeasure = datas[0]
                global.allUnit = datas[1]
                global.allThreshold = datas[2]
                global.allSensor = datas[3]
                global.allStation = datas[4]
                global.allCoordinate = datas[5]
                res.render('dashboard')
            })
            .catch(errors => {
                console.log(errors)
            })


        })
        .catch((err) => console.log(err))
    },
    renderPage: (req, res, next) => {
        res.render('/dashboard')
    }
}