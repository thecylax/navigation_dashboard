var count = 0;
var markers = [];
var totalDistance = 0;


var latlong = [-25.432, -49.247]
var mymap = L.map('mapid').setView(latlong, 13);
L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v10/tiles/256/{z}/{x}/{y}?access_token={accessToken}', {
    accessToken: 'pk.eyJ1IjoiY3lsYXgiLCJhIjoiY2l1ZmYxdmdxMDBkbDJvcDRjYzg0eHN1NCJ9.0DSzwUnu3ew-okLTsg8VXA',
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
}).addTo(mymap);


// var circle = L.circle(latlong, {
//     color: 'red',
//     fillColor: '#f03',
//     fillOpacity: 0.5,
//     radius: 500
// }).addTo(mymap);

function onMapClick(e) {
    count++;
    markers.push(e.latlng);
    var coordinates = [e.latlng.lat, e.latlng.lng];
    L.marker(coordinates, {title: '#'+count}).addTo(mymap);
    if(count != 1) {
	totalDistance += e.latlng.distanceTo(markers[count-2]);
	$('#distance').val(totalDistance.toFixed(2));
    }
    var buffer = $('#waypoints').val();
    $('#waypoints').val(buffer + '#' + count + '\t' + e.latlng.lat + '\t\t' + e.latlng.lng+'\n');
}

function traceRoute() {
    var polyline = L.polyline(markers, {color: 'red'}).addTo(mymap);    
}

function setAllMap(map) {
    for (var i = 0; i < markers.length; i++) {
	markers[i].setMap(map);
    }
}
// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
    setAllMap(null);
}
mymap.on('click', onMapClick);
