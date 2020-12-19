document.getElementById('add-station').addEventListener('click', event => {
    const lat = document.getElementById('lat').value
    const long = document.getElementById('long').value
    const detailAddress = document.getElementById('detail-address').value
    const stationName = document.getElementById('add-station-name').value

    addStation({ lat, long, detailAddress, stationName })
})

const addStation = (infor) => {
    const xhttp = new XMLHttpRequest();

    xhttp.open(
        'POST',
        'http://localhost:3000/stations/add',
        true
    )

    xhttp.setRequestHeader(
        'Content-type',
        'application/x-www-form-urlencoded'
    )

    xhttp.send(`lat=${infor.lat}&long=${infor.long}&detailAdress=${infor.detailAddress}&stationName=${infor.stationName}`)

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            alert("Thêm thành công !")
            document.getElementById('lat').value = ""
            document.getElementById('long').value = ""
            document.getElementById('detail-address').value = ""
            document.getElementById('add-station-name').value = ""
            const data = JSON.parse(this.responseText)

            let innerHTML = ``
            //set data 
            stations.push(getStation(
                data.stationID, [data.coordinate.lat, data.coordinate.long],
                popup(
                    data.name, { temperature: '', humidity: '' },
                    '', '', `station_${data.stationID}_modal`
                ),
                Map
            ))
            //set infor station

            const valueComp = {}
            getDetailAddress(
                geocodeService, [data.coordinate.lat, data.coordinate.long]
            ).then(data => {
                console.log(data)
                valueComp.detailAddress = data
            })
            innerHTML += renderModals(
                data,
                valueComp
            )
            document.getElementById('container-modal').innerHTML = innerHTML
        }
    };
}