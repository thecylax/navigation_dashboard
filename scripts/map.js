// General purpose vars
var count = 0;
var markers = [];
var totalDistance = 0;
var centralLatLng = [-25.432, -49.247] // Curitiba

// mapbox specific vars
var mapboxToken = 'pk.eyJ1IjoiY3lsYXgiLCJhIjoiY2l1ZmYxdmdxMDBkbDJvcDRjYzg0eHN1NCJ9.0DSzwUnu3ew-okLTsg8VXA';
var mapboxUrl1 = 'https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?access_token={accessToken}';
var mapboxUrl2 = 'https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v10/tiles/256/{z}/{x}/{y}?access_token={accessToken}';
var mapboxAttribution = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>';

var terrain = L.tileLayer(mapboxUrl1, {accessToken: mapboxToken, attribution: mapboxAttribution}),
    satellite = L.tileLayer(mapboxUrl2, {accessToken: mapboxToken, attribution: mapboxAttribution});

var mymap = L.map('mapid', {
    center: centralLatLng,
    zoom: 13,
    layers: [terrain, satellite]
});
var baseMaps = {
    "Terreno": terrain,
    "Satélite": satellite
};

// var circle = L.circle(centralLatLng, {
//     color: 'red',
//     fillColor: '#f03',
//     fillOpacity: 0.5,
//     radius: 500
// }).addTo(mymap);


// Functions
function updateMarkBadge(n) {
    $('#markscount').html(n)
}

function onMapClick(e) {
    count++;
    updateMarkBadge(count);
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


// Main
L.control.layers(baseMaps).addTo(mymap);
mymap.on('click', onMapClick);
