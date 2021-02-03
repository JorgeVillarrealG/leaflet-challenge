/* Marker size function */
let markers=[]
function markerSize(mag){
    return mag*20000
}
/* Extrat Coordinates function */
function coordinates(coordinates){
    array=[coordinates[1],coordinates[0]]
    return array
}
/* Set color Function */
function getColor(feature){
    let color=""
    let magnitude=feature.properties.mag
    if(magnitude>5){
        color="#800026"
    } else if(magnitude>4){
        color="#BD0026"
    } else if(magnitude>3){
        color="#E31A1C"
    } else if(magnitude>2){
        color="#FC4E2A"
    } else if(magnitude>1){
        color="#FEB24C"
    } else {
        color="#FFEDA0"
    }
    return color
}

  
  // Adding tile layer
let grayMap=L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/light-v10",
    accessToken: API_KEY
  })

let darkMap=L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
tileSize: 512,
maxZoom: 18,
zoomOffset: -1,
id: "dark-v10",
accessToken: API_KEY
})

let earthquakeMarkers=[]
url="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
d3.json(url).then(data=>{
    console.log(data)
    /* Iterate on geojson features */
    earthquakeMarkers.push(
        data["features"].forEach(d=>{
            /*  console.log(coordinates(d.geometry.coordinates)) */
            /* Create circles */
              L.circle(coordinates(d.geometry.coordinates),{
                 stroke:false,
                 fillOpacity:.75,
                 color:getColor(d),
                 fillColor:getColor(d),
                 radius:markerSize(d.properties.mag)
                 }).bindPopup(`<h3>Type: ${d.properties.type}</h3> <hr> <h3>Location: ${d.properties.place}</h3> <hr> <h3>Mag: ${d.properties.mag}</h3>`).addTo(myMap)
         })
    )
})
.catch(e=>{
    console.log(e)
})
let geoData="static/data/tectonic.geojson"
let geojson

d3.json(geoData).then(data=>{
   geojson= L.geoJson(data,{
        style:{
            color:"yellow",
            fillColor:"yellow",
            fillOpacity:".5",
            weight:"2"
        }
    }).addTo(myMap)
}).catch(e=>{
    console.log(e)
})

/* let mainlayer=L.layerGroup(earthquakesUltra) */
let baseMaps={
    "Light Map":grayMap,
    "Dark Map": darkMap
}
let overlayMaps={
    "Earthquakes":earthquakeMarkers,
    "Tectonic Plates":geojson
}
// Create a map object
var myMap = L.map("map", {
    center: [37.77181060099331, -122.39350862336504],
    zoom: 5,
    layers:[grayMap,earthquakeMarkers]
  });
L.control.layers(baseMaps,overlayMaps,{
    collapsed:false
}).addTo(myMap)