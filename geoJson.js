function polygon(coordinates){
  return {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "properties": {},
        "geometry": {
          "type": "Polygon",
          "coordinates": [
            coordinates
          ]
        }
      }
    ]
  };
}

function lineString(coordinates){
  return {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "properties": {},
        "geometry": {
          "type": "LineString",
          "coordinates": coordinates
        }
      }
    ]
  };
}

function point(coordinates, data){
  return {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
            title: 'Washington, D.C.',
            'marker-color': '#f86767',
            'marker-size': 'large',
            'marker-symbol': 'star',
            url: 'http://en.wikipedia.org/wiki/Washington,_D.C.'
        },
      "geometry": {
        "type": "Point",
        "coordinates": coordinates
      }
    }
  ]
}
}