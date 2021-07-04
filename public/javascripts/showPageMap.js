

mapboxgl.accessToken = mapToken; //show.ejs
const map = new mapboxgl.Map({
  style: 'mapbox://styles/mapbox/streets-v11', // style URL
  container: 'map', // container ID
  zoom: 10 ,// starting zoom
  center: temple.geometry.coordinates, // starting position [lng, lat]
});

 //zoom buttons and compass
 map.addControl(new mapboxgl.NavigationControl());
 
new mapboxgl.Marker()
    .setLngLat(temple.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({offset:25})
        .setHTML(
            `<h3>${temple.name}</h3><p>${temple.location}</p>`
        )
       
    )
    .addTo(map)