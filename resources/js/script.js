jQuery(function($){
    var jqxhr = $.getJSON( "data/data.json", function() {
      console.log("successfully parsed json.")
    })
      .fail(function() {
          console.log('error parsing json.');
      });
});
