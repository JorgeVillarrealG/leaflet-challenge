/* console.log("test") */
// Create a map object
var myMap = L.map("map", {
    center: [37.77181060099331, -122.39350862336504],
    zoom: 5
  });
  
  // Adding tile layer
  L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/light-v10",
    accessToken: API_KEY
  }).addTo(myMap);


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
/* Read Data */
url="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
d3.json(url).then(data=>{
    /* console.log(data) */
    /* Iterate on geojson features */
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
})
.catch(e=>{
    console.log(e)
})

// Set up the legend
let legend = L.control({ 
    position: "bottomright"
 });
 let limits=[0,1,2,3,4,5]
 let colors=["#FFEDA0","#FEB24C","#FC4E2A","#E31A1C","#BD0026","#800026"]

legend.onAdd = function() {
    let div = L.DomUtil.create("div", "info legend");
    let labels = [];

    // Add min & max
    let legendInfo = "<p>Magnitudes</p>" +
    "<div class=\"labels\">" +
        "<div class=\"min\">" + limits[0] + "</div>" +
        "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
    "</div>";

    div.innerHTML = legendInfo;

    // add the scale of colors with the values considered inside
    limits.forEach(function(limit, index) {
        labels.push("<li style=\"background-color: " + colors[index] + "\">"+limit+"</li>");
    });

    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    return div;
};

// Adding legend to the map
legend.addTo(myMap);