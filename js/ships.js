var ships = (function(){
  function loadShips(){
    d3.csv("/data/smallest_ships.csv")
      .get(function(error, rows){
        showShips(rows);});
  }

  function showShips(rows){
    var markerList = [];
    
    rows.forEach(function(ship){
      var title = ship.ShipName;
      var marker = L.marker(L.latLng(ship.Latitude, ship.Longitude), { title: title });
    
      marker.bindPopup(title);
      markerList.push(marker);
    });
    
    maps.addMarkers(markerList);
  }

  return{
    loadShips: loadShips
  }
}());