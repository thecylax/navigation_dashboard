// General purpose vars
var count = 0;
var markers = [];
var totalDistance = 0;
var centralLatLng = [-25.432, -49.247] // Curitiba
var routes = [];
var header = 'wp\tlatitude\t\t\t\tlongitude\n'

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
function reCenter() {
    mymap.setView(centralLatLng, 13);
}

function updateWaypointList() {
    $('#waypoints').val(header);
    
    for (var i = 0; i < markers.length; i++) {
     	var lat = markers[i]._latlng.lat;
     	var lng = markers[i]._latlng.lng;
     	$('#waypoints').val($('#waypoints').val() + '#' + i + '\t' + lat + '\t\t' + lng+'\n');
    }
}

function updateMarkerBadge(n) {
    $('#mkcount').html(n)
}

function onMapClick(e) {
    
    updateMarkerBadge(count + 1);
    markers.push(L.marker(e.latlng, {title: '#' + count}));
    markers[count].addTo(mymap);
    if(count > 0) {
	totalDistance += e.latlng.distanceTo(markers[count-1]._latlng);
	$('#distance').val(totalDistance.toFixed(2));
    }
    updateWaypointList();
    count++;
}

function traceRoute() {
    var points = []
    for (var i = 0; i < markers.length; i++) {
	points.push(markers[i]._latlng);
    }
    routes.push(L.polyline(points, {color: 'red'}).addTo(mymap));
}

function toggleMarkers() {
    if($('#mkshow span').hasClass('glyphicon-eye-open')) {
	$('#mkshow').html('<span class="glyphicon glyphicon-eye-close"></span>');
	for (var i = 0; i < markers.length; i++) {
	    markers[i].remove();
	} 
    }
    else {
	$('#mkshow').html('<span class="glyphicon glyphicon-eye-open"></span>');
	for (var i = 0; i < markers.length; i++) {
	    markers[i].addTo(mymap);
	}
    }
}

function removeLastMarker() {
    if (markers.length) {
	markers.pop().remove();
	count--;
	updateMarkerBadge(count);
	updateWaypointList();
    }
    if (routes.length)
	routes.pop().remove();
}

// ****** Main ****** //
L.control.layers(baseMaps).addTo(mymap);
mymap.on('click', onMapClick);


