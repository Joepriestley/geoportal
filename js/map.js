//initialize map

var map = L.map('map').setView([7.0, -1.09], 7);

//Add osm title to map
var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

//adding scale
L.control.scale({position:"bottomright"}).addTo(map);

//google street map
var googleStreets = L.tileLayer('http://{s}.google.com/vt?lyrs=m&x={x}&y={y}&z={z}',{
    maxZoom: 20,
    subdomains:['mt0','mt1','mt2','mt3']
}).addTo(map);

//google hybrid map
var googleHybrid = L.tileLayer('http://{s}.google.com/vt?lyrs=s,h&x={x}&y={y}&z={z}',{
    maxZoom: 20,
    subdomains:['mt0','mt1','mt2','mt3']
});

//google saitellite map
var googleSat = L.tileLayer('http://{s}.google.com/vt?lyrs=s&x={x}&y={y}&z={z}',{
    maxZoom: 20,
    subdomains:['mt0','mt1','mt2','mt3']
})//.addTo(map);

//google terrain map
var googleTerrain = L.tileLayer('http://{s}.google.com/vt?lyrs=p&x={x}&y={y}&z={z}',{
    maxZoom: 20,
    subdomains:['mt0','mt1','mt2','mt3']
}).addTo(map);


//ar marker= L.marker([7,-1.09]).addTo(map);

//Adding style to  region layer
var regionStyle={
	color:"red",
	opacity:0.5,
	weight:1,
};

//Adding style to healthFacility layer

healthStyle={
	color:"brown",
	opacity:0.9,
	weight:0.5,

}

//Adding style to healthFacility layer

railwayStyle={
	color:"brown",
	opacity:1,
	weight:5,

}


//Adding style to makers in health facility

var healthFacilityStyle={
	radius:"3",
	fillColor:"green",
	color:"red",
	weight:0.8,
}

//Adding popup to region layer
 var regionlayer= L.geoJSON(regions,{

 	style:regionStyle,

 	onEachFeature:function (feature, layer) {

 		//calculating the area of each region
 		area=(turf.area(feature)/1000000).toFixed(2);

//showing the center of each region
 		 center_lng=turf.center(feature).geometry.coordinates[0].toFixed(2);
 		 center_lat=turf.center(feature).geometry.coordinates[1].toFixed(2);


 		label=`Name: ${feature.properties.region}<br>`
 		label+=`Area: ${area}<br>`
 		label+=`Identity: ${feature.properties.id}<br>`
 		label+=`Center:Lng: ${center_lng},Lat:${center_lat}<br>`
 		

 		layer.bindPopup(label)
 	}
 	}).addTo(map);


//Add Geojson layers

 var healthlayer= L.geoJSON(health,{

 	style:healthStyle,
//health facility popups
 	onEachFeature:function (feature, layer) {
 		label=`Name:${feature.properties.name}<br>`
 		label+=`Amenity:${feature.properties.amenity}<br>`
 		label+=`Health Care:${feature.properties.healthcare}<br>`

 		 layer.bindPopup(label)
 	},

 	pointToLayer:function(feature, latlng) {
    return L.circleMarker(latlng,healthFacilityStyle);

}})//.addTo(map);



var railwaylayer= L.geoJSON(railway,{

	style:railwayStyle,

	//railway popups
 	onEachFeature:function (feature, layer) {
 		label1=`Name:${feature.properties.railway}`
 		

 		 layer.bindPopup(label1)
 	},



}).addTo(map);


//ADDING WMS LAYERS
//rivers wms
var riverwms = L.tileLayer.wms("http://localhost:8080/geoserver/Geospatial/wms", {
    layers: 'Geospatial:rivers',
    format: 'image/png',
    transparent: true,
    attribution: "Weather data © 2012 IEM Nexrad"
});

//treecover wms
var treecover = L.tileLayer.wms("http://localhost:8080/geoserver/Geospatial/wms", {
    layers: 'Geospatial:Savannah_tree_cover',
    format: 'image/png',
    transparent: true,
    attribution: "Weather data © 2012 IEM Nexrad"
});



//Adding multiple basemaps
var baseLayers = {
    "Open Street Map": osm,
    "Google Street Map":googleStreets,
    "Google Hybrid Map":googleHybrid,
    "Google Saitellite Map":googleSat,
    "Google Terrain Map":googleTerrain
};


var overlays = {
    //"Marker": marker,
    "The sixteen Regions": regionlayer,
    "Health Facilities": healthlayer,
    "Railway lines": railwaylayer,
    "Rivers":riverwms,
    "Tree Cover":treecover,
};

//add layer control to map
L.control.layers(baseLayers, overlays, {collapsed:true} ).addTo(map);

// Add leaflet browser print to map
L.control.browserPrint({position: 'topleft', title: 'Print ...'}).addTo(map);

//Mouse move coordinate
map.on("mousemove", function(e){
	$("#coordinate").html(`Lat:${e.latlng.lat.toFixed(5)} , Lng:${e.latlng.lng.toFixed(5)}`);
});
