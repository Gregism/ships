(function(){
  //var markers = L.markerClusterGroup({ chunkedLoading: true });
  //var historyMarkers = L.featureGroup([]);
  //var historyLines = L.featureGroup([]);
  // var progress = document.getElementById('progress');
  // var progressBar = document.getElementById('progress-bar');

  var map = L.map('map')
  //var ladenStatus = {"Unladen": "a00", "Laden": "0a0"};

  if(window.location.href.indexOf('?') > -1){
    getHistory(null, window.location.search.split('ship-input=')[1]);
   // map.setView([0, 0], 3);
  }else{
    map.setView([18.45, -66], 4);
  }

  L.tileLayer('http://api.tiles.mapbox.com/v4/mapbox.outdoors/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiZ3JlZ2lzbSIsImEiOiJiNjMwMWE5MWUwOThjOGUxYjIxMzk5Njk3ODBkM2ZjZiJ9.WjgpibCLDnpbg3vjS0MLKw',{

  }).addTo(map);

  $('form').on('submit', function(e){
    e.preventDefault();
  })

  $('#ship-input-btn').on('click', getHistory);
}());


    