var history = (function(){}(
  if(window.location.href.indexOf('?') > -1){
    getHistory(null, window.location.search.split('ship-input=')[1]);
  }else{
    map.setView([18.45, -66], 4);
  }

  function getHistory(e, shipInput){
    if($('#ship-input').val().toLowerCase() === "all"){
        d3.json("Ships.aspx")
          .get(function(error, rows){ships.makeShips(rows);});
       return false;
    }
    
    $.ajax({
      url: 'HistPos.aspx',
      data: {"imo": shipInput || $('#ship-input').val()},
      success: function (result){
       ships.makeLines(result);
      },
      error: function(error){
        console.log(error);
      },
      datatype: 'json'
    });
  }

  return{
    getHistory: getHistory
  }
));
