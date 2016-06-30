jQuery(function($){
    var jqxhr = $.getJSON( "data/data.json", function(data) {
        $.get("templates/product.hbs", function(hbs) {
            var template = Handlebars.compile(hbs);
            $('#products').html(template(data));
        })
    })
      .fail(function() {
          console.log('error parsing json.');
      });

    $('#compare-btn').click(function(ev){
        var checked_values = $('input[name=compare]:checked').map(function() {
            return this.value;
        }).get();
        console.log(checked_values);
   });
});
