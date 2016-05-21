jQuery(function($){
    var jqxhr = $.getJSON( "data/data.json", function(data) {
        $.get("templates/product.tpl", function(tpl) {
            var template = Handlebars.compile(tpl);
            $('#products').html(template(data));
        })
    })
      .fail(function() {
          console.log('error parsing json.');
      });
});
