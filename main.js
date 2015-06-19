var map = L.map('map').setView([51.505, -0.09], 2);
L.tileLayer('http://api.tiles.mapbox.com/v4/mapbox.outdoors/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiZ3JlZ2lzbSIsImEiOiJiNjMwMWE5MWUwOThjOGUxYjIxMzk5Njk3ODBkM2ZjZiJ9.WjgpibCLDnpbg3vjS0MLKw',{

}).addTo(map);

d3.json("data/regions.json")
  //.row(function(d){return d;})
  .get(function(error, rows){makeRegions(rows);});

d3.json("data/ports.json")
  //.row(function(d){return d;})
  .get(function(error, rows){ makePorts(rows); });

d3.json("data/all_ships.json")
  //.row(function(d){return d;})
  .get(function(error, rows){makeShips(rows);});

ladenStatus = {"Unladen": "a00", "Laden": "0a0"};

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
  $.each(rows, function(i, ship){
    console.log(ship);
    var coord = [+ship.Position.Longitude, +ship.Position.Latitude];
    var icon = L.MakiMarkers.icon({icon: "marker", color: (function(){
        if(ship.LadenStatus){
          return '#'+ladenStatus[ship.LadenStatus]
        }
        return '#00b'
      })(), size: "s"});
      L.rotatedMarker([coord[1],coord[0]], {
        icon: icon,
        angle: ship.Heading+180 || 180
      }).addTo(map);
  });
}

function makeLines(rows){
  var ships = _.uniq(_.pluck(rows, 'ShipName'));

  $.each(ships, function(i, ship){
    var coords = [];
    ships[i] = {'name': ship, 'data': _.where(rows, {ShipName:ship})};
    $.each(ships[i].data, function(i, obj){
      coords.push([+obj.Longitude, +obj.Latitude]);
    });
    ships[i].coordinates = coords;
    // L.geoJson(lineString(coords),{
    //   "style": {
    //      "color": "orange",
    //     "weight": 2,
    //   },
    // }).addTo(map);

    $.each(coords, function(j, coord){
      var icon = L.MakiMarkers.icon({icon: "marker", color: (function(){
        if(ladenStatus[ships[i].data[j].LaidenState]){
          return '#'+ladenStatus[ships[i].data[j].LaidenState]
        }
        return '#00b'
      })(), size: "s"});
      L.rotatedMarker([coord[1],coord[0]], {
        icon: icon,
        angle: +ships[i].data[j].Heading+180 || 180
      }).addTo(map);

    //   L.Marker(new L.LatLng(37.9, -77), {
    //     icon: L.icon({
    //       "iconUrl": 'https://www.mapbox.com/maki/renders/marker-12@2x.png',
    //       "iconSize": [12, 12],
    //     }),
    //     "angle": ships[i].data[j].Heading,
    //     "style": {
    //        "color": ladenStatus[ships[i].data[j].LaidenState],
    //       "weight": 2,
    //   },
    // }).addTo(map);
    });
  });
}  

function makeRegions(rows){
  $.each(rows, function(i, region){
    var coords = [];
    $.each(region.Points, function(i, obj){
        coords.push([+obj.Longitude, +obj.Latitude]);
      });
      L.geoJson(polygon(coords),{
        "style": {
           "color": "blue",
          "weight": 0.5,
          "opacity": 0.05
        },
      }).addTo(map);
  });
  // var regions = _.uniq(_.pluck(rows, 'region'));
  // $.each(regions, function(i, region){
  //   var coords = [];
  //   regions[i] = {'name': region, 'data': _.where(rows, {region:region})};
  //   $.each(regions[i].data, function(i, obj){
  //     coords.push([+obj.latitude, +obj.longitude]);
  //   });
  //   regions[i].coordinates = coords;
  //   L.geoJson(polygon(coords),{
  //     "style": {
  //        "color": "blue",
  //       "weight": .5,
  //       "opacity": 0.05
  //     },
  //   }).addTo(map);
  // });
}

function makePorts(rows){
  $.each(rows, function(i, port){
    console.log(port)
    var coords = [];
    $.each(port.Points, function(i, obj){
        coords.push([+obj.Longitude, +obj.Latitude]);
      });
      L.geoJson(polygon(coords),{
        "style": {
           "color": "red",
          "weight": 2,
          "opacity": 0.65
        },
      }).addTo(map);
  });
}