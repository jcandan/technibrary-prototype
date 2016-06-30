jQuery(function($){
    var jqxhr = $.getJSON( "assets/data/data.json", function(data) {
        $.get("assets/templates/product.hbs", function(hbs) {
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
        jqxhr.complete(function(){
            var all_products = jqxhr.responseJSON.products;
            var products = [];
            $.each(checked_values, function(key, val) {
                products.push(all_products[val]);
            });

            $.get("assets/templates/comparison_table.hbs", function(hbs) {
              var template = Handlebars.compile(hbs);
              $('.modal-body').html(template(products));
            });
        });
   });
});
