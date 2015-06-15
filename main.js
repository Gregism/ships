var map = L.map('map').setView([51.505, -0.09], 2);
L.tileLayer('http://api.tiles.mapbox.com/v4/mapbox.outdoors/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiZ3JlZ2lzbSIsImEiOiJiNjMwMWE5MWUwOThjOGUxYjIxMzk5Njk3ODBkM2ZjZiJ9.WjgpibCLDnpbg3vjS0MLKw',{

}).addTo(map);

d3.csv("data/ships_regions.csv")
  .row(function(d){return d;})
  .get(function(error, rows){makeRegions(rows);});

d3.csv("data/ships_ports.csv")
  .row(function(d){return d;})
  .get(function(error, rows){ makePorts(rows); });

d3.csv("data/filtered_ships.csv")
  .row(function(d){return d;})
  .get(function(error, rows){makeLines(rows);});

function makeLines(rows){
  var ships = _.uniq(_.pluck(rows, 'ShipName'));

  $.each(ships, function(i, ship){
    if(i > 5) return;
    var coords = [];
    ships[i] = {'name': ship, 'data': _.where(rows, {ShipName:ship})};
    $.each(ships[i].data, function(i, obj){
      coords.push([+obj.Longitude, +obj.Latitude]);
    });
    ships[i].coordinates = coords;
    L.geoJson(lineString(coords),{
      "style": {
         "color": "orange",
        "weight": 2,
      },
    }).addTo(map);

    $.each(coords, function(j, coord){
      L.geoJson(point(coord, ships[i].data[j])).addTo(map);
    });
  });
}  

function makeRegions(rows){
  var regions = _.uniq(_.pluck(rows, 'region'));
  $.each(regions, function(i, region){
    var coords = [];
    regions[i] = {'name': region, 'data': _.where(rows, {region:region})};
    $.each(regions[i].data, function(i, obj){
      coords.push([+obj.latitude, +obj.longitude]);
    });
    regions[i].coordinates = coords;
    L.geoJson(polygon(coords),{
      "style": {
         "color": "blue",
        "weight": .5,
        "opacity": 0.05
      },
    }).addTo(map);
  });
}

function makePorts(rows){
  var ports = _.uniq(_.pluck(rows, 'port'));
  $.each(ports, function(i, port){
    var coords = [];
    ports[i] = {'name': port, 'data': _.where(rows, {port:port})};
    $.each(ports[i].data, function(i, obj){
      coords.push([+obj.latitude, +obj.longitude]);
    });
    ports[i].coordinates = coords;
    L.geoJson(polygon(coords),{
      "style": {
         "color": "red",
        "weight": 2,
        "opacity": 0.65
      },
    }).addTo(map);
  });
}