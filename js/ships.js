var ships = (function(){
  L.RotatedMarker = L.Marker.extend({
    options: {
    angle: 0
    },
    _setPos: function (pos) {
      L.Marker.prototype._setPos.call(this, pos);
      if (L.DomUtil.TRANSFORM) {
      // use the CSS transform rule if available
      this._icon.style[L.DomUtil.TRANSFORM] += ' rotate(' + this.options.angle + 'deg)';
      } else if(L.Browser.ie) {
      // fallback for IE6, IE7, IE8
      var rad = this.options.angle * (Math.PI / 180),
      costheta = Math.cos(rad),
      sintheta = Math.sin(rad);
      this._icon.style.filter += ' progid:DXImageTransform.Microsoft.Matrix(sizingMethod=\'auto expand\', M11=' +
      costheta + ', M12=' + (-sintheta) + ', M21=' + sintheta + ', M22=' + costheta + ')';
      }
    }
  });
  
  L.rotatedMarker = function (pos, options) {
    return new L.RotatedMarker(pos, options);
  };

  function makeShips(rows){
    var markerList = [];
    removeMarkers();
    
    $.each(rows, function(i, ship){
      var title = ship.ShipName;
      var marker = L.marker(L.latLng(ship.Position.Latitude, ship.Position.Longitude), { title: title });
    
      marker.bindPopup(title);
      markerList.push(marker);
    });

    markers.addLayers(markerList);
    map.addLayer(markers);
  }

  function removeMarkers(){
    markers.clearLayers();
    historyMarkers.clearLayers();
    historyLines.clearLayers();
  }

  function makeLines(ship){
    var coords = [];
    var markerList = [];
    
    removeMarkers();
    $.each(ship.Positions, function(i, obj){
      coords.push([+obj.Longitude, +obj.Latitude]);
    });
     historyLines = L.geoJson(lineString(coords),{
        "style": {
           "color": "orange",
          "weight": 2,
        },
      }).addTo(map);
      
      $.each(coords, function(j, coord){
        var icon = L.MakiMarkers.icon({icon: "marker", color: (function(){
          if(ship.LadenStatuses[j]){
            return '#'+ladenStatus[ship.LadenStatuses[j]]
          }
          return '#00b'
        })(), size: "s"});
        
        var marker = L.rotatedMarker([coord[1],coord[0]], {
          icon: icon,
          angle: ship.Headings[j]+180 || 180
        });
        
        markerList.push(marker);
      });
      historyMarkers = L.featureGroup(markerList).addTo(map);
      
     // var bounds = L.latLngBounds(markerList);
      map.fitBounds(historyMarkers.getBounds());
          
  }

  function makePolygons(rows, settings){
    $.each(rows, function(i, port){
      var coords = [];
      $.each(port.Points, function(i, obj){
          coords.push([+obj.Longitude, +obj.Latitude]);
        });
        L.geoJson(polygon(coords),{
          "style": {
             "color": settings.color,
            "weight": settings.weight,
            "opacity": settings.opacity
          },
        }).addTo(map);
    });
  }
  
  return{

  }
}());