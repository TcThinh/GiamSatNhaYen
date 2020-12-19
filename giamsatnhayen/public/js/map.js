let Map = {}

const geocodeService = L.esri.Geocoding.geocodeService()
const stations = [];

let MapToAdd = {}


socket.on('load station infor', async fullData => {

    console.log(fullData)

    //Map = L.map('mapid').setView([9.902276, 105.160456], 11);
    Map = L.map('mapid').setView([fullData[1].coordinate.lat, fullData[1].coordinate.long], 11);
    L.tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=yhEEXEJruqOaORlZJgF1', {
        attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank >&copy; OpenStreetMap contributors</a>'

    }).addTo(Map) //4849398892


    MapToAdd = L.map('map-to-add').setView([fullData[1].coordinate.lat, fullData[1].coordinate.long], 11);
    L.tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=xn891X3FMKzPCbSK6HOE', {
        attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'

    }).addTo(MapToAdd)

    let innerHTML = ``

    console.log(fullData);

    for (let i = 0; i < fullData.length; i++) {
        //set data 
        stations.push(getStation(
                fullData[i].stationID, [fullData[i].coordinate.lat, fullData[i].coordinate.long],
                popup(
                    fullData[i].name, { temperature: '', humidity: '' },
                    '', '', `station_${fullData[i].stationID}_modal`
                ),
                Map
            ))
            //set infor station

        const valueComp = {}
        valueComp.detailAddress = await getDetailAddress(
            geocodeService, [fullData[i].coordinate.lat, fullData[i].coordinate.long]
        )
        innerHTML += renderModals(
            fullData[i],
            valueComp,
            renderTable(fullData[i].sensor)
        )
    }

var myMarker = undefined;

MapToAdd.on('click', event => {
        console.log("Coordinates: " + event.latlng.toString());
        if(myMarker === undefined){
            myMarker = L.marker(event.latlng, {draggable: true}).addTo(MapToAdd).on("dragend", function() {
                var coord = String(myMarker.getLatLng()).split(',')
                console.log(coord)
                var lat = coord[0].split('(')[1]
                document.getElementById('lat').value = lat
                var lng = coord[1].split(')')[0]
                document.getElementById('long').value = lng
                myMarker.bindPopup("Moved to: " + lat[1] + ", " + lng[0] + ".")
                getDetailAddress(geocodeService, [lat, lng]).then(address => {
                    console.log(address)
                    document.getElementById('detail-address').value = address.toString()
                })
                console.log(myMarker.getLatLng());
            });;
        }
})

    document.getElementById('container-modal').innerHTML = innerHTML
})




/*

data = {
    stationID: 1
    values: [
        {
            value: 29,
            measure: {
                unit: 'celcius', 
                thresholds: {
                    min: 25,
                    max: 30
                }
            }
        }
    ]
}

 */

socket.on('map', data => {
    stations.forEach(station => {
        if (station.stationID.toString() === data.stationID.toString()) {
            renderPopup(data, station, 'style="color: red"', 'style="color: red"')
        }
    })
})