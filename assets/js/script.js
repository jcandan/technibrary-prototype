(function($){
  var labels = {
    "types": "Types",
    "stars": "User Rating",
    "url": "Url",
    "price": "Price",
    "platforms": "Platforms",
    "usecase": "Use Case",
    "fieldofstudy": "Field of Study",
    "gradelevel": "Grade Level",
    "description": "Description",
    "pros": "Best Feature",
    "cons": "Worst Feature",
    "summary": "The Final Word",
  };

  $('#compare-btn').click(function(ev) {
    var checked_values = $('input[name=compare]:checked').map(function () {
      return this.value;
    }).get();

    var compared = items.filter(function(a) {
      return checked_values.indexOf(a.productid) > -1;
    })

    var compared_tpl = "<table class='table table-bordered table-responsive'>" +
      "<thead>" +
        "<tr>" +
          "<th></th>" +
          "<% _.each(items, function(item) { %>" +
            "<th><%= item.productlabel %></th>" +
          "<% }); %>" +
        "</tr>" +
      "</thead>" +
      "<tbody>" +
        "<% _.each(labels, function(label, col) { %>" +
          "<tr>" +
            "<th scope='row' class='text-uppercase'><%= label %></th>" +
            "<% _.each(items, function(item){ %>" +
              "<td><%= item[col] %></td>" +
            "<% }); %>" +
          "</tr>" +
        "<% }); %>" +
      "</tbody>" +
    "</table>";

    $(".modal-body").html(_.template(compared_tpl, {items: compared, labels: labels}));
  });

  var item_template =
    '<div class="card">' +
    '<div class="card-container">' +
    '<div class="card-image col-sm-3">' +
    '<img src="assets/images/default-product.png" width="100%" height="100%" class="img-thumbnail" />' +
    '</div>' +
    '<div class="card-content col-sm-7">' +
    '<div class="checkbox"><label><input type="checkbox" name="compare" value="<%= obj.productid %>" />Compare</label></div>' +
    '<a href="#"><h3 class="card-title"><%= obj.productlabel %></h3></a>' +
    '<div class="pricing">' +
    '<span><%= obj.price %></span>' +
    '</div>' +
    '</div>' +
    '<div class="card-actions col-sm-2 pull-right">' +
    '<button type="button" class="close" data-hide="<%= obj.productid %>">&times;</button>' +
    '<div class="result-buttons">' +
    '<button type="button" class="btn btn-primary fa fa-heart" data-favorite="<%= obj.productid %>" data-toggle="tooltip" data-placement="bottom" title="Add to favorites"></button>' +
    '<button type="button" class="btn btn-primary fa fa-share" data-share="<%= obj.productid %>" data-toggle="tooltip" data-placement="bottom" title="Share with friends"></button>' +
    '</div>' +
    '</div>' +
    '</div>' +
    '<div class="pros-cons">' +
    '<p><strong>Pros:</strong> <%= obj.pros %></p>' +
    '<p><strong>Cons:</strong> <%= obj.cons %></p>' +
    '</div>' +
    '</div><div class="clearfix"></div>' +
    '<hr />';

  // Define spreadsheet URL.
  var mySpreadsheet = 'https://spreadsheets.google.com/feeds/list/1wrOPUAxTewDOBvY5iInMEEkXZiIF6yervNQbW7dTX1Q/od6/public/values?alt=json';

  // build items object array
  var items = [];
  $.getJSON(mySpreadsheet, function(data) {
    $.each(data.feed.entry,function(key,val){
      var row = {};

      $.each(val, function(key, val) {
        var col = key.replace('gsx$', '');
        var value = val['$t'];

        if(value) {
          // strings containing a double quote should be assigned as a whole.
          if(value.indexOf('"') > -1) {
            value = value.replace(/"/g, '');
          }
          // otherwise, check for commas and split into an array with elements trimmed.
          else if(value.indexOf(',') > -1) {
            value = value.split(',').map(function(e){ return e.trim(); });
          }
        }

        row[col] = value;
      });

      items.push(row);
    });

    settings = {
      items           : items,
      facets          : {
        'platforms'       : 'Platforms',
        'usecase'         : 'Use Cases',
        'fieldofstudy'    : 'Field of Study',
        'gradelevel'      : 'Grade Level',
        'stars'           : 'Rating'
      },
      facetContainer     : '<div class=facetsearch id=<%= id %> ></div>',
      facetTitleTemplate : '<h4 class=facettitle><%= title %></h4>',
      facetListContainer : '<ol class="list-unstyled facetlist"></ol>',
      listItemTemplate   : '<li><a class=facetitem id="<%= id %>"><%= name %> <span class=facetitemcount>(<%= count %>)</span></a></li>',
      resultSelector  : '#results',
      facetSelector   : '#facets',
      resultTemplate  : item_template,
      orderByOptions  : {'price': 'Price', 'rating': 'Popularity'},
    }

    $.facetelize(settings);

    $('input[name=compare]').change(function () {
      var checked_values = $('input[name=compare]:checked').map(function () {
        return this.value;
      }).get();

      if(checked_values.length > 3) {
        alert("That's too many to compare at once. Feel free to remove one or more marked for comparison before adding another.");
        $(this).attr('checked', false);
      }
    });

  });
  $('[data-toggle="tooltip"]').tooltip()
})(jQuery);
