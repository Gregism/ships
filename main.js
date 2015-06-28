var map = L.map('map')
if(window.location.href.indexOf('?') > -1){
  getHistory(null, window.location.search.split('ship-input=')[1]);
 // map.setView([0, 0], 3);
}else{
  map.setView([18.45, -66], 5);
}

L.tileLayer('http://api.tiles.mapbox.com/v4/mapbox.outdoors/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiZ3JlZ2lzbSIsImEiOiJiNjMwMWE5MWUwOThjOGUxYjIxMzk5Njk3ODBkM2ZjZiJ9.WjgpibCLDnpbg3vjS0MLKw',{

}).addTo(map);

$('form').on('submit', function(e){
  e.preventDefault();
})

$('#ship-input-btn').on('click', getHistory);

function getHistory(e, shipInput){
  if($('#ship-input').val().toLowerCase() === "all"){
      d3.json("Ships.aspx")
        .get(function(error, rows){makeShips(rows);});
     return false;
  }
  
  $.ajax({
    url: 'HistPos.aspx',
    data: {"imo": shipInput || $('#ship-input').val()},
    success: function (result){
     makeLines(result);
    },
    error: function(error){
      console.log(error);
    },
    datatype: 'json'
  });
}

var progress = document.getElementById('progress');
var progressBar = document.getElementById('progress-bar');

function updateProgressBar(processed, total, elapsed, layersArray) {
  if (elapsed > 1000) {
    // if it takes more than a second to load, display the progress bar:
    progress.style.display = 'block';
    progressBar.style.width = Math.round(processed/total*100) + '%';
  }

  if (processed === total) {
    // all markers processed - hide the progress bar:
    progress.style.display = 'none';
  }
}

var markers = L.markerClusterGroup({ chunkedLoading: true, chunkProgress: updateProgressBar });
var historyMarkers = L.featureGroup([]);
var historyLines = L.featureGroup([]);

// $.ajax({
//   url: 'ShipList.aspx',
//   success: function (result){console.log(result)},
//   datatype: 'json'
// });

d3.json("Regions.aspx")
  //.row(function(d){return d;})
  .get(function(error, rows){makeRegions(rows);});

d3.json("Ports.aspx")
  //.row(function(d){return d;})
  .get(function(error, rows){ makePorts(rows); });

// d3.json("Ships.aspx")
//   //.row(function(d){return d;})
//   .get(function(error, rows){makeShips(rows);});

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
  var markerList = [];
  removeMarkers();
  
  $.each(rows, function(i, ship){
    var title = ship.ShipName;
    var marker = L.marker(L.latLng(ship.Position.Latitude, ship.Position.Longitude), { title: title });
    //marker.valueOf()._icon.style.backgroundColor = '#' + ladenStatus[ship.LadenStatus];
    marker.bindPopup(title);
    markerList.push(marker);

    // var coord = [+ship.Position.Longitude, +ship.Position.Latitude];
    // var icon = L.MakiMarkers.icon({icon: "marker", color: (function(){
    //     if(ship.LadenStatus){
    //       return '#'+ladenStatus[ship.LadenStatus]
    //     }
    //     return '#00b'
    //   })(), size: "s"});
    //   L.rotatedMarker([coord[1],coord[0]], {
    //     icon: icon,
    //     angle: ship.Heading+180 || 180
    //   }).addTo(map);
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
}

function makePorts(rows){
  $.each(rows, function(i, port){
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



  