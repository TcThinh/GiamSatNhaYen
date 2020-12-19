 const socket = io('http://localhost:3000');

socket.on('hostEsp32', data => {
    HOST_ESP32 = data;
})

 socket.on('load live chart', data => {
     renderLiveChartHTML(data)
     renderLiveChart(data)
 })

 socket.on('load static chart', data => {
     console.log("static")
     console.log(data)
     renderStaticChartHTML(data)
     renderStaticChart(data)
 })

 socket.on('live chart', data => {
     for (let i = 0; i < allLiveChart.length; i++) {
         if (data !== undefined && allLiveChart[i].stationID.toString() == data.stationID) {
             let temp = '_'
             let humi = '_'
             let thres_temp = []
             let thres_humi = []

             if (data.values[0].measure.unit === 'celcius') {
                 temp = data.values[0].value
                 humi = data.values[1].value
                 thres_temp.push(data.values[0].measure.thresholds)
                 thres_humi.push(data.values[1].measure.thresholds)
             } else {
                 temp = data.values[1].value
                 humi = data.values[0].value
                 thres_temp.push(data.values[1].measure.thresholds)
                 thres_humi.push(data.values[0].measure.thresholds)
             }
             // update now and threshold 
             document.getElementById(`now-temperature-${data.stationID}`).textContent = `${temp}°C`
             document.getElementById(`now-humidity-${data.stationID}`).textContent = `${humi}%`
             document.getElementById(`threshold-temperature-${data.stationID}`).textContent = `${thres_temp[0].min}-${thres_temp[0].max}`
             document.getElementById(`threshold-humidity-${data.stationID}`).textContent = `${thres_humi[0].min}-${thres_humi[0].max}`
                 //chart update
             allLiveChart[i].liveChart.data.labels.shift()
             allLiveChart[i].liveChart.data.labels.push(data.values[0].date + '')
             allLiveChart[i].liveChart.data.datasets[0].data.shift()
             allLiveChart[i].liveChart.data.datasets[0].data.push(temp)
             allLiveChart[i].liveChart.data.datasets[1].data.shift()
             allLiveChart[i].liveChart.data.datasets[1].data.push(humi)
             allLiveChart[i].liveChart.update()
             break;
         }
     }
 })