const allLiveChart = []
const renderLiveChart = (data) => {
    data.forEach(station => {
        const ctxLiveChart = document.getElementById(`live-chart-${station.stationID}`).getContext('2d');
        const liveChart = new Chart(ctxLiveChart, {
            type: 'line',
            data: {
                labels: ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
                datasets: [{
                        label: 'Nhiệt Độ',
                        backgroundColor: 'rgb(141,148,160,0.5)',
                        borderColor: 'rgb(43,64,86)',
                        fill: true,
                        lineTension: 0.2,
                        pointRadius: 1,
                        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                    },
                    {
                        label: 'Độ Ẩm',
                        backgroundColor: 'rgb(142,216,219,0.5)',
                        borderColor: 'rgb(120,211,213)',
                        fill: true,
                        lineTension: 0.2,
                        pointRadius: 1,
                        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                    }
                ]
            },
            options: {
                animation: {
                    duration: 300
                },
                scales: {
                    xAxes: [{
                        ticks: {
                            display: false,
                        },
                        gridLines: {
                            display: false
                        }
                    }],
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                            suggestedMax: 100
                        },
                        gridLines: {
                            display: true
                        }
                    }]
                }
            }
        });
        allLiveChart.push({ stationID: station.stationID, liveChart })
    })
}

const renderLiveChartHTML = (data) => {
    let innerHTML = `
    <div class="live-chart-container">
        <div class="live-chart">
            <div class="nav-live-chart">
                <h3 style="float:left;">live chart</h3>
                <div style="float: right;" class="btn-group">
                    <select class="custom-select" onchange="displayChangeBlock()" id="select-change-block">`
    let count = 0
    data.forEach(station => {
        innerHTML += `<option ${ count++ == 0 ? 'selected' : '' } value="${station.stationID}">${station.name}</option>`
    })

    innerHTML +=
        `</select>
                </div>
            </div>`
    let i = 0
    data.forEach(station => {
        innerHTML +=
            `<div id="station_${station.stationID}" class="change-block" ${i++ == 0 ? 'style="display:block"': 'style="display:none"'}>
                <div class="line-chart">
                    <canvas id="live-chart-${station.stationID}"></canvas>
                </div>
                <div class="now-aver">
                    <div class="row now">
                        <div class="col" style="border-right:1px solid black; border-bottom:1px solid black;">
                            <div class="title-now">Nhiệt độ hiện tại</div>
                            <div class="img-data-sensor">
                                <div class="icon">
                                    <img src="../images/temperature.png">
                                </div>
                                <div class="data-sensor" id="now-temperature-${station.stationID}">_°C</div>
                            </div>
                        </div>
                        <div class="col" style="border-left:1px solid black; border-bottom:1px solid black;">
                            <div class="title-now">Ngưỡng nhiệt độ</div>
                            <div class="img-data-sensor">
                                <div class="icon">
                                    <img src="../images/temperature-sensor.png">
                                </div>
                                <div class="data-sensor" style="font-size:2.2rem; !important"id="threshold-temperature-${station.stationID}">_-_</div>
                            </div>
                        </div>
                    </div>
                    <div class="row aver">
                        <div class="col" style="border-right:1px solid black; border-top:1px solid black;">
                            <div class="title-now">Độ ẩm hiện tại</div>
                            <div class="img-data-sensor">
                                <div class="icon">
                                    <img src="../images/humidity.png">
                                </div>
                                <div class="data-sensor" id="now-humidity-${station.stationID}">_%</div>
                            </div>
                        </div>
                        <div class="col" style="border-left:1px solid black; border-top:1px solid black;">
                            <div class=" title-now ">Ngưỡng độ ẩm</div>
                            <div class="img-data-sensor">
                                <div class="icon">
                                    <img src="../images/humidity-sensor.png">
                                </div>
                                <div class="data-sensor" style="font-size:2.2rem; !important" id="threshold-humidity-${station.stationID}">_-_</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`
    })
    innerHTML += `
        </div>
    </div>`
    document.getElementById('container-live-chart').innerHTML = innerHTML
}

const setDisplay = (allChangeBlock, Onpos) => {
    for (let i = 0; i < allChangeBlock.length; i++) {
        allChangeBlock[i].style.display = "none"
    }
    allChangeBlock[Onpos].style.display = "block"
}

const displayChangeBlock = () => {
    const valueSelected = parseInt(document.getElementById('select-change-block').value)
    const allChangeBlock = document.getElementsByClassName('change-block')
    setDisplay(allChangeBlock, valueSelected - 1)
}

/*

data = [
    {
        stationID: 1,
        name: "Tram 1",
        values: {
            average: {
                temperature: {
                    labels: [Mon, Tue, Wed, Thur, Fri, Sta, Sun],
                    data: [1,2,3,4,5,6,7],
                },
                humidity: {
                    labels: [Mon, Tue, Wed, Thur, Fri, Sta, Sun],
                    data: [1,2,3,4,5,6,7],
                }
            },
            thresholds: {
                temperature: {
                    average: 23,
                    over: 10
                },
                humidity: {
                    average: 23,
                    over: 5
                }
            }

        }
    }
]

*/

const renderStaticChartHTML = (data) => {
    let innerHTML =
        `<div class="title-static-chart" style="width: 20%;">
    <div class="form-group">
        <select class="custom-select" onchange="displayStaticCharts()" id="select-static-chart-block">`
    let count = 0
    data.forEach(station => {
        innerHTML += `<option ${ count++ == 0 ? 'selected' : '' } value="${station.stationID}">${station.name}</option>`
    })

    innerHTML += `
            </select>
        </div>
    </div>`

    let i = 0;
    data.forEach(station => {
        const thresholds = station.values.thresholds
        innerHTML += `
        <div class="static-chart-change-block" ${i++ == 0 ? 'style="display:block"': 'style="display:none"'}>
        <div class="static-chart">
            <div class="wrapper-chart">
                <canvas id="week-chart-${station.stationID}"></canvas>
            </div>
        </div>`

        innerHTML += `
        <div class="thresholds">
            <div class="wrapper">
                <span>Nhiệt độ ( số lần )</span>
                <div class="progress">
                    <div style="color:black;"class="progress-bar bg-info progress-bar-striped progress-bar-animated" role="progressbar" style="width: ${(thresholds.temperature.countMeasure)}%" aria-valuenow="${thresholds.temperature.countMeasure} " aria-valuemin="0" aria-valuemax="10000">${thresholds.temperature.countMeasure}</div>
                </div>
                <span>Vượt ngưỡng</span>
                <div class="progress">
                    <div style="color:black;" class="progress-bar bg-danger progress-bar-striped progress-bar-animated" role="progressbar" style="width: ${thresholds.temperature.over/thresholds.temperature.countMeasure}/%" aria-valuenow="${(thresholds.temperature.over)}" aria-valuemin="0" aria-valuemax="10000">${thresholds.temperature.over}</div>
                </div>
                <span>Độ ẩm ( số lần )</span>
                <div class="progress">
                    <div style="color:black;" class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style="width: ${(thresholds.humidity.countMeasure)}%" aria-valuenow="${thresholds.humidity.countMeasure}" aria-valuemin="0" aria-valuemax="10000">${thresholds.humidity.countMeasure}</div>
                </div>
                <span>Vượt ngưỡng</span>
                <div class="progress">
                    <div style="color:black;" class="progress-bar bg-danger progress-bar-striped progress-bar-animated" role="progressbar" style="width: ${thresholds.humidity.over/thresholds.humidity.countMeasure}%" aria-valuenow="${(thresholds.humidity.over)/10}" aria-valuemin="0" aria-valuemax="10000">${station.values.thresholds.humidity.over}</div>
                </div>
            </div>
        </div>
        </div>
        `
    })
    document.querySelector('.thresholds-static-chart').innerHTML = innerHTML
}

const renderStaticChart = (data) => {
    data.forEach(station => {
        const ctx = document.getElementById(`week-chart-${station.stationID}`).getContext('2d');
        const chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: station.values.average.temperature.labels.reverse(),
                datasets: [{
                        label: 'Nhiệt Độ',
                        backgroundColor: 'rgb(141,148,160,0.5)',
                        borderColor: 'rgb(43,64,86)',
                        fill: true,
                        lineTension: 0,
                        pointRadius: 4,
                        data: station.values.average.temperature.data.reverse()
                    },
                    {
                        label: 'Độ Ẩm',
                        backgroundColor: 'rgb(142,216,219,0.5)',
                        borderColor: 'rgb(120,211,213)',
                        fill: true,
                        lineTension: 0,
                        pointRadius: 4,
                        data: station.values.average.humidity.data.reverse()
                    }
                ]
            },
            options: {
                animation: {
                    duration: 300
                }
            }
        });
    })
}

const displayStaticCharts = () => {
    const valueSelected = parseInt(document.getElementById('select-static-chart-block').value)
    const allChangeBlock = document.getElementsByClassName('static-chart-change-block')
    setDisplay(allChangeBlock, valueSelected - 1)
}