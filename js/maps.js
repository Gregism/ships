var maps = (function(){
  //Create map object
  var map = L.map('map');

  //Create map layer
  L.tileLayer(
    'http://api.tiles.mapbox.com/v4/mapbox.outdoors/{z}/{x}/{y}.png?access_token=' + access_token
    ,{}
  ).addTo(map);

  //Set center and zoom
  map.setView([18.45, -66], 4);

  return{
    map: map
  }
}());