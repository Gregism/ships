var maps = (function(){
  //Create map object
  var map = L.map('map');
  var markers = L.markerClusterGroup({ chunkedLoading: true });

  //Create map layer
  L.tileLayer(
    'http://api.tiles.mapbox.com/v4/mapbox.outdoors/{z}/{x}/{y}.png?access_token=' + access_token
    ,{}
  ).addTo(map);

  function addMarkers(markerList){
    // markers.addLayers(markerList);
    // map.addLayer(markers);
    markerList.forEach(function(marker){
      marker.addTo(map);
    })
  }

  //Set center and zoom
  map.setView([29, -95], 4);

  ships.loadShips();

  return{
    map: map,
    markers: markers,
    addMarkers: addMarkers
  }
}());