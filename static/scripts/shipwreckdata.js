// Strings to reference the data locations
shipDataRaw = "/static/data/ShipwrecksWAM_002.geojson"
sharkDataClean = "/static/data/sharks_cleaned.csv"

// Create new empty layers for ships and each shark species. These will contain the markers. 
var layers = {
        ships: new L.LayerGroup(),
        blacktip: new L.LayerGroup(),
        blue: new L.LayerGroup(),
        bull: new L.LayerGroup(),
        bronzeWhaler: new L.LayerGroup(),
        dusky: new L.LayerGroup(),
        greyNurse: new L.LayerGroup(),
        hammerhead: new L.LayerGroup(),
        mako: new L.LayerGroup(),
        tiger: new L.LayerGroup(),
        unknown: new L.LayerGroup(),
        white: new L.LayerGroup()
};
// Access the leaflet library and create a gps coordinate grid, the variable map, to plot the data to.
// the empty layers are added to the map, they will be filled later.
var map = L.map("map", {
    center: [-31.98,115.70],
    zoom: 12,
    worldCopyJump: "True",
    layers: [
        layers.ships,
        layers.blacktip,
        layers.blue,
        layers.bull,
        layers.bronzeWhaler,
        layers.dusky,
        layers.greyNurse,
        layers.hammerhead,
        layers.mako,
        layers.tiger,
        layers.white,
        layers.unknown
    ]
});

// Get the background map from the leaflet API, and add it to the gps coordinate grid
var streetMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
tileSize: 512,
maxZoom: 18,
zoomOffset: -1,
id: "mapbox/streets-v11",
accessToken: API_KEY
}).addTo(map);

// Set up an object to reference each layer. This will be used to create the toggle control
var overlays = {
    "Ships": layers.ships,
    "Blacktip": layers.blacktip,
    "Blue": layers.blue,
    "Bull": layers.bull,
    "Bronze Whaler": layers.bronzeWhaler,
    "Dusky": layers.dusky,
    "Grey Nurse": layers.greyNurse,
    "Hammerhead": layers.hammerhead,
    "Mako": layers.mako,
    "Tiger": layers.tiger,
    "White": layers.white,
    "species unknown": layers.unknown
    };

 
// Use the overlay object to create a control panel for each layer, and add it to the map
// This allows toggling of which layer we want to display
L.control.layers(null,overlays,{
    collapsed: false
}).addTo(map);

let shipMarker = L.icon({
    iconUrl: "/static/images/icons8-historic-ship-50.png",
    iconSize: [13,13],
    iconAnchor: [5,5],
    popupAnchr: [-10,-20]
})

// Add ships to the map by filling the previously created ship layer
let shipData = d3.json(shipDataRaw).then((rawData)=> {
    var ships = L.geoJSON(rawData.features, {
        pointToLayer: function (feature, latlng) {
            return L.marker(latlng, {
                icon: shipMarker
            })
        }
    });
    ships.addTo(map);
    ships.addTo(layers['ships'])
});

// Set up icon references for each shark species
var customIcon = L.Icon.extend({
options: {
    iconSize: [25,25],
    iconAnchor: [13,13],
    popupAnchor: [-24,-50]
}
});

var customMarkers = {
    blacktip: new customIcon({iconUrl: "/static/images/black-shark-24.png" }),
    blue: new customIcon({ iconUrl: "/static/images/blue-shark-24.png" }),
    bull: new customIcon({iconUrl: "/static/images/yellow-shark-24.png" }),
    bronzeWhaler: new customIcon({iconUrl: "/static/images/orange-shark-24.png" }),
    dusky: new customIcon({iconUrl: "/static/images/brown-shark-24.png" }),
    greyNurse: new customIcon({iconUrl: "/static/images/gray-shark-24.png" }),
    hammerhead: new customIcon({iconUrl: "/static/images/green-shark-24.png" }),
    mako: new customIcon({iconUrl: "/static/images/pink-shark-24.png" }),
    tiger: new customIcon({iconUrl: "/static/images/purple-shark-24.png" }),
    unknown: new customIcon({iconUrl: "/static/images/red-shark-24.png" }),
    white: new customIcon({iconUrl: "/static/images/white-shark-24.png" })
};

// Add sharks to the map by filling the previously created species layers
let sharkData = d3.csv(sharkDataClean).then((sharkData)=> {

    // create an empty variable to hold the shark species
    // this will be filled for each report by the logic path
    var sharkSpecies = "";

    // iterate through every shark report in the data set
    for (var i = 0; i < sharkData.length; i++) {

        // Logic path to determine which species layer to add the marker to
        if (sharkData[i].SightingSpeciesValue == "bronze whaler") {
            sharkSpecies = "bronzeWhaler";
        }
        else if (sharkData[i].SightingSpeciesValue == "grey nurse") {
            sharkSpecies = "greyNurse";
        }
        else if (sharkData[i].SightingSpeciesValue == "unknown sp.") {
            sharkSpecies = "unknown";
        }
        else {
            sharkSpecies = sharkData[i].SightingSpeciesValue;
        }

        // get the latitude and longitude of the report
        var lat = parseFloat(sharkData[i].LocationY);
        var lon = parseFloat(sharkData[i].LocationX);

        // place a new marker on the map, in the correct species layer 
        var placeMarker = L.marker([lat,lon],{
            icon: customMarkers[sharkSpecies]
        })
        placeMarker.addTo(map);
        placeMarker.addTo(layers[sharkSpecies]);
    }
    initialView(map);
})

function addLegend(map) {
    var legend = L.control({position:"bottomleft"});

    legend.onAdd = function(myMap) {
        var div = L.DomUtil.create("div", "legend");
        div.innerHTML += '<i><img src="/static/images/icons8-historic-ship-50.png"></i><span>Ships</span><br>';
        div.innerHTML += '<i><img src="/static/images/black-shark-24.png"></i><span>Blacktip</span><br>';
        div.innerHTML += '<i><img src="/static/images/blue-shark-24.png"></i><span>Blue</span><br>';
        div.innerHTML += '<i><img src="/static/images/yellow-shark-24.png"></i><span>Bull</span><br>';
        div.innerHTML += '<i><img src="/static/images/orange-shark-24.png"></i><span>Bronze Whaler</span><br>';
        div.innerHTML += '<i><img src="/static/images/brown-shark-24.png"></i><span>Dusky</span><br>';
        div.innerHTML += '<i><img src="/static/images/gray-shark-24.png"></i><span>Grey Nurse</span><br>';
        div.innerHTML += '<i><img src="/static/images/green-shark-24.png"></i><span>Hammerhead</span><br>';
        div.innerHTML += '<i><img src="/static/images/pink-shark-24.png"></i><span>Mako</span><br>';
        div.innerHTML += '<i><img src="/static/images/purple-shark-24.png"></i><span>Tiger</span><br>';
        div.innerHTML += '<i><img src="/static/images/white-shark-24.png"></i><span>White</span><br>';
        div.innerHTML += '<i><img src="/static/images/red-shark-24.png"></i><span>species unknown</span><br>';

        return div;
    }
    legend.addTo(map);
}
// functions to generate the initial map view, and then control each button click
function shipsOnly() {
    layers.blacktip.removeFrom(map)
    layers.blue.removeFrom(map)
    layers.bull.removeFrom(map)
    layers.bronzeWhaler.removeFrom(map)
    layers.dusky.removeFrom(map)
    layers.greyNurse.removeFrom(map)
    layers.hammerhead.removeFrom(map)
    layers.mako.removeFrom(map)
    layers.tiger.removeFrom(map)
    layers.white.removeFrom(map)
    layers.unknown.removeFrom(map)
    layers.ships.addTo(map)
}

function knownSharksOnly() {
    layers.blacktip.addTo(map)
    layers.blue.addTo(map)
    layers.bull.addTo(map)
    layers.bronzeWhaler.addTo(map)
    layers.dusky.addTo(map)
    layers.greyNurse.addTo(map)
    layers.hammerhead.addTo(map)
    layers.mako.addTo(map)
    layers.tiger.addTo(map)
    layers.white.addTo(map)
    layers.unknown.removeFrom(map)
    layers.ships.removeFrom(map)
}

function initialView() {
    layers.blacktip.removeFrom(map)
    layers.blue.removeFrom(map)
    layers.bull.removeFrom(map)
    layers.bronzeWhaler.removeFrom(map)
    layers.dusky.removeFrom(map)
    layers.greyNurse.removeFrom(map)
    layers.hammerhead.removeFrom(map)
    layers.mako.removeFrom(map)
    layers.tiger.addTo(map)
    layers.white.removeFrom(map)
    layers.unknown.removeFrom(map)
    layers.ships.addTo(map)
}

function shipsSharks() {
    layers.blacktip.addTo(map)
    layers.blue.addTo(map)
    layers.bull.addTo(map)
    layers.bronzeWhaler.addTo(map)
    layers.dusky.addTo(map)
    layers.greyNurse.addTo(map)
    layers.hammerhead.addTo(map)
    layers.mako.addTo(map)
    layers.tiger.addTo(map)
    layers.white.addTo(map)
    layers.unknown.removeFrom(map)
    layers.ships.addTo(map)
}
// Functions to control the Jaws theme song on the Shark Tracker page
var jawsSong = new Audio("/static/audio/Jaws-theme-song.mp3");

function playJaws() {
    jawsSong.play();
}

function stopJaws() {
    jawsSong.pause();
    jawsSong.currentTime=0;
}

d3.selectAll("#both").on('click', playJaws);

addLegend(map);

d3.selectAll("#ships-only").on('click', shipsOnly);
d3.selectAll("#sharks-only").on('click', knownSharksOnly);
d3.selectAll("#both").on('click', shipsSharks);
d3.selectAll("#click-me").on('click', playJaws);
d3.selectAll("#nevermind").on('click', stopJaws); 





