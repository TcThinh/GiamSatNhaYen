/*
data = [
    {
        stationName: 'tram 1',
        values: [
            sensorName: 'dh11',
            measure: 'temperature'
            unit: 'celcius',
            date: '8/3/2020'
        ]
    }
]
*/

socket.on('table', data => {
    console.log(data)
    let innerHTML = `<div class="wrapper table-wrapper-scroll-y my-custom-scrollbar">
        <table class="table">
            <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Trạm</th>
                    <th scope="col">Cảm biến</th>
                    <th scope="col">Giá trị</th>
                    <th scope="col">Đại lượng đo</th>
                    <th scope="col">Đơn vị đo</th>
                    <th scope="col">Thời gian</th>
                </tr>
            </thead>
            <tbody>`
    let index = 1
    data.forEach(station => {
        station.values.forEach(values => {
            innerHTML += `
                <tr>
                    <th scope="row">${index++}</th>
                    <td>${station.stationName}</td>
                    <td>${values.sensorName}</td>
                    <td>${values.value}</td>
                    <td>${values.measure}</td>
                    <td>${values.unit}</td>
                    <td>${values.date}</td>
                </tr>`
        })
    })
    innerHTML += `</tbody></table></div>`
    document.getElementById('table').innerHTML = innerHTML
})