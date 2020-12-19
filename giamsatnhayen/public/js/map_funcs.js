const getDetailAddress = (geocodeService, pos) => new Promise((resolve, reject) => {
    geocodeService.reverse().latlng(pos).run(function (error, result) {
        if (error) reject(error)
        else resolve(result.address.Match_addr)
    })
})

const popup = (title, value, cssTemp, cssHumi, modal) => {
    return `
    <h5 class="station-title" data-toggle="modal" data-target="#${modal}">${title}</h5>
    <table class="table temp">
        <thead>
            <tr>
                <th scope="col">ĐVĐ</th>
                <th scope="col">Giá Trị</th>
                <th scope="col">Đơn Vị</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td class="map-measure-title">Nhiệt Độ</td>
                <td ${cssTemp === undefined ? '' : cssTemp} class="map-values">${value.temperature === '' ? '__' : value.temperature}</td>
                <td ${cssTemp === undefined ? '' : cssTemp} class="map-unit">°C</td>
            </tr>
            <tr>
                <td class="map-measure-title">Độ Ẩm</td>
                <td ${cssHumi === undefined ? '' : cssHumi} class="map-values">${value.humidity === '' ? '__' : value.humidity}</td>
                <td ${cssHumi === undefined ? '' : cssHumi} class="map-unit">%</td>
            </tr>
        </tbody>
    </table>
    `
}

const getStation = (stationID, markerPos, contentPopup, map) => {
    const marker = L.marker(markerPos).addTo(map)
    const popup = new L.Popup({
        autoClose: false,
        closeOnClick: false,
        maxWidth: 300,
        maxHeight: 170
    }).setContent(contentPopup).setLatLng(markerPos)
    marker.bindPopup(popup).openPopup();
    return { stationID, marker, popup };
}

const renderPopup = (data, station, warningTemp, warningHumi) => {
    const thresholds = {
        temperature_min: data.values[0].measure.thresholds.min,
        temperature_max: data.values[0].measure.thresholds.max,
        humidity_min: data.values[1].measure.thresholds.min,
        humidity_max: data.values[1].measure.thresholds.max,
    }
    let temp = '_'
    let humi = '_'
    if (data.values[0].measure.unit === 'celcius') {
        temp = data.values[0].value
        humi = data.values[1].value
    } else {
        temp = data.values[1].value
        humi = data.values[0].value
    }

    let cssTemp = ''
    let cssHumi = ''
    cssTemp = (temp > thresholds.temperature_max ||
        temp < thresholds.temperature_min) ? warningTemp : ''
    cssHumi = (humi > thresholds.humidity_max ||
        humi < thresholds.humidity_min) ? warningHumi : ''

    station.popup.setContent(
        popup(`${data.stationName}`, {
            temperature: temp,
            humidity: humi
        },
            cssTemp,
            cssHumi,
            `station_${data.stationID}_modal`
        )
    );
    station.popup.update();
}

const renderModals = (station, valueComp, bonusHTML) => {
    return `
        <div class="modal fade" id="station_${station.stationID}_modal" tabindex="-1" role="dialog" aria-labelledby="station_${station.stationID}_modal" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">

                <div class="modal-header">
                    <h5 class="modal-title" id="${station._id}">Chi Tiết</h5>
                     <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                         <span aria-hidden="true">&times;</span>
                     </button>
                </div>

                <div class="modal-body">
                    <div class="input-group mb-3">
                        <div class="input-group-prepend">
                            <span class="input-group-text" id="basic-addon1${station._id}">Tên Trạm</span>
                        </div>
                        <input type="text" class="form-control" aria-label="Username" aria-describedby="basic-addon1${station._id}" value="${station.name}">
                    </div>

                    <div class="input-group mb-3">
                        <input type="text" class="form-control" value="[  ${station.coordinate.lat}, ${station.coordinate.long}  ]" aria-label="Recipient's username" aria-describedby="basic-addon2${station._id}">
                        <div class="input-group-append">
                            <span class="input-group-text" id="basic-addon2${station._id}">Tọa Độ</span>
                        </div>
                    </div>
                         
                    <div class="input-group mb-3">
                        <div class="input-group-prepend">
                            <span class="input-group-text">Địa Chỉ</span>
                        </div>
                        <textarea class="form-control" aria-label="With textarea">${valueComp.detailAddress}</textarea>
                    </div>

                    ${bonusHTML === undefined ? '' : bonusHTML}

                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    <button type="button" onclick="updateThreshold()" class="btn btn-success" style="background-color: #42A38B; border-color: #42A38B;">Save changes</button>
                </div>
            </div>
        </div>
     </div>
        `
}

//
/*
data = {
    sensor: [
        { 
            _id: 5f1faf22f7f86b131932a38d,
            name: 'dh11',
            stationID: 5f23e2a9d4846b1e3805a192,
            __v: 0,
            thresholds : [
                {
                    measure: 'temperature',
                    min: ,
                    max: ,
                }
            ]
        }
    ],
}
*/

const renderTable = (data) => {
    console.log("asdsadd")
    console.log(data)
    let table =
        `<table class="table">
        <thead>
            <tr>
                <th scope="col">#</th>
                <th scope="col">Cảm Biến</th>
                <th scope="col">Ngưỡng Nhiệt Độ</th>
                <th scope="col">Ngưỡng Độ Ẩm</th>
            </tr>
        </thead>
        <tbody>`
    let index = 0;
    if (data.length != 0) {
        data.forEach(sensor => {
            table +=
                `<tr>
            <th scope="row">${++index}</th>
            <td>${sensor.name}</td>`
            if (sensor.thresholds != undefined)
                table +=
                    `<td><input class="editThreshold" value="${sensor.thresholds[0].min === undefined ? _ : sensor.thresholds[0].min} - ${sensor.thresholds[0].max === undefined ? _ : sensor.thresholds[0].max}"></input></td>
                <td><input class="editThreshold" value="${sensor.thresholds[1].min === undefined ? _ : sensor.thresholds[1].min} - ${sensor.thresholds[1].max === undefined ? _ : sensor.thresholds[1].max}"></input></td>               
        </tr>`
        })
    }
    table += `</tbody></table>`
    return table
}

function updateThreshold() {
    const items = document.querySelectorAll('.editThreshold')
    const tempMin = parseFloat(items[0].value.split('-')[0].trim())
    const tempMax = parseFloat(items[0].value.split('-')[1].trim())
    const humiMin = parseFloat(items[1].value.split('-')[0].trim())
    const humiMax = parseFloat(items[1].value.split('-')[1].trim())

    console.log(tempMin)
    console.log(tempMax)
    console.log(humiMin)
    console.log(humiMax)

    // const xhr = new XMLHttpRequest();
    // xhr.open("POST", 'http://localhost:3000/thresholds/update', true);
    // xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    // xhr.onreadystatechange = function () {
    //     if (xhr.readyState == 4 && xhr.status == 200) {
    //         console.log(xhr.responseText); // 0, 1, 2 
    //     }
    // };
    // xhr.send(`sensorName=dh11&tempMin=${tempMin}&tempMax=${tempMax}&humiMin=${humiMin}&humiMax=${humiMax}`);

    const xhr = new XMLHttpRequest();
    xhr.open("GET", `http://${HOST_ESP32}:80/get?temperatureMin=${tempMin}&temperatureMax=${tempMax}`, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {

        }
    };
    xhr.send();
    document.getElementById('threshold-temperature-1').textContent = `${tempMin}-${tempMax}`
    document.getElementById('threshold-humidity-1').textContent = `${humiMin}-${humiMax}`
    alert('Thành Công !');

}