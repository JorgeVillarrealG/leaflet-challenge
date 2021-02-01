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


/* Get Data */
let markers=[]
function markerSize(mag){
    return mag*20000
}
function coordinates(coordinates){
    array=[coordinates[1],coordinates[0]]
    return array
}
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
url="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
d3.json(url).then(data=>{
    console.log(data)
    data["features"].forEach(d=>{
       /*  console.log(coordinates(d.geometry.coordinates)) */
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
/* var legend = L.control({position: 'bottomleft'});
legend.onAdd = function () {

var div = L.DomUtil.create('div', 'info legend');
labels = ['<strong>Categories</strong>'],
categories = ['Road Surface','Signage','Line Markings','Roadside Hazards','Other'];

    for (var i = 0; i < categories.length; i++) {

            div.innerHTML += 
            labels.push(
                '<i class="circle" style="background:' + getColor(categories[i]) + '"></i> ' +
            (categories[i] ? categories[i] : '+'));

        }
        div.innerHTML = labels.join('<br>');
    return div;
    }; */

/* let legend=L.control({position:"bottomright"})
legend.onAdd=function(myMap){
    let div =L.DomUtil.create("div","info legend"),
    categories=[0,1,2,3,4,5];
    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < categories.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(categories[i]) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
} */
/* legend.addTo(myMap) */