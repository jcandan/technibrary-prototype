(function($){
  var rating_settings = {
    min: 0,
    max: 5,
    displayOnly: true,
    size: 'xs',
    filledStar: '<i class="fa fa-star"></i>',
    emptyStar: '<i class="fa fa-star-o"></i>'
  };

  var labels = {
    "types": "Types",
    "stars": "User Rating",
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

  // event listener for Compare button, show comparison table
  $('#compare-btn').click(function(ev) {
    // store items marked for comparison
    var checked_values = $('input[name=compare]:checked').map(function () {
      return this.value;
    }).get();

    // get list of objects for comparison
    var compared = items.filter(function(a) {
      return checked_values.indexOf(a.productid) > -1;
    })

    var compared_tpl = "<table class='table table-bordered table-striped table-responsive'>" +
      "<thead>" +
        "<tr>" +
          "<% var num_col = 12 / (items.length + 1); %>" +
          "<th class='col-sm-<%= num_col %>'></th>" +
          "<% _.each(items, function(item) { %>" +
            "<th class='col-sm-<%= num_col %>'>" +
              '<div class="social-buttons">' +
              '<button type="button" class="btn btn-primary fa fa-heart" data-favorite="<%= obj.productid %>" data-toggle="tooltip" data-placement="bottom" title="Add to favorites"></button>' +
              '<button type="button" class="btn btn-primary fa fa-share" data-share="<%= obj.productid %>" data-toggle="tooltip" data-placement="bottom" title="Share with friends"></button>' +
              '</div>' +
              "<img src='<% if(item.image) { %><%= item.image %><% } else { %>assets/images/default-product.png<% } %>' width='80%' class='img-thumbnail img-responsive' /><br /><a href='#'><h3><%= item.productlabel %></h3></a>" +
            "</th>" +
          "<% }); %>" +
        "</tr>" +
      "</thead>" +
      "<tbody>" +
        "<% _.each(labels, function(label, col) { %>" +
          "<tr>" +
            "<th scope='row' class='text-uppercase'><%= label %></th>" +
            "<% _.each(items, function(item){ %>" +
              "<% if(col == 'stars') { %>" +
                "<td><input name='<%= item.productid %>' id='<%= item.productid %>' class='item-rating' value='<%= item.stars %>' /></td>" +
              "<% } else { %>" +
                "<td><%= item[col] %></td>" +
              "<% } %>" +
            "<% }); %>" +
          "</tr>" +
        "<% }); %>" +
        "<tr>" +
          "<th scope='row' class='text-uppercase'>Learn more</th>" +
          "<% _.each(items, function(item){ %>" +
            "<td>Want to learn more?<br/><a href='#' id='product-btn' class='btn btn-primary' type='button'>VIEW PRODUCT</a></td>" +
          "<% }); %>" +
      "</tbody>" +
    "</table>";

    $(".modal-body").html(_.template(compared_tpl, {items: compared, labels: labels}));

    // initialize rating
    $('.item-rating').rating(rating_settings);
  });

  var item_template =
    '<div class="card">' +
    '<div class="card-container">' +
    '<div class="card-image col-sm-3">' +
    '<img src="<% if(obj.image) { %><%= obj.image %><% } else { %>assets/images/default-product.png<% } %>" class="img-thumbnail img-responsive" />' +
    '</div>' +
    '<div class="card-content col-sm-7">' +
    '<div class="checkbox"><label><input type="checkbox" name="compare" value="<%= obj.productid %>" data-product-label="<%= obj.productlabel %>"/>Compare</label></div>' +
    '<a href="#"><h3 class="card-title"><%= obj.productlabel %></h3></a>' +
    '<div class="type"><%= obj.type %></div>' +
    '<input name="<%= obj.productid %>" id="<%= obj.productid %>" class="item-rating" value="<%= obj.stars %>" />' +
    '<div class="pricing">' +
    '<span><%= obj.price %></span>' +
    '</div>' +
    '</div>' +
    '<div class="card-actions col-sm-2 pull-right">' +
    '<button type="button" class="close" data-hide="<%= obj.productid %>"  data-toggle="tooltip" data-placement="right" title="Hide this result from future searches">&times;</button>' +
    '<div class="social-buttons">' +
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
  var mySpreadsheet = 'https://spreadsheets.google.com/feeds/list/1z12MfVrQEPiLD0EzTNMgEe63jiezlAZZugasHq9REwU/od6/public/values?alt=json';

  // connect to Google Spreadsheet
  var items = [];
  $.getJSON(mySpreadsheet, function(data) {
    // build items object array
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
      facetContainer     : '<div class="facetsearch" id="<%= id %>"></div>',
      facetTitleTemplate : '<h4 class="facettitle"><%= title %></h4>',
      facetListContainer : '<ol class="list-unstyled facetlist"></ol>',
      deselectTemplate   : '<a type="button" class="deselectstartover btn btn-primary">Deselect all filters</a>',
      resultSelector  : '#results',
      facetSelector   : '#facets',
      resultTemplate  : item_template,
      orderByOptions  : {'price': 'Price', 'rating': 'Popularity'},
    }

    $.facetelize(settings);
    $('.bottomline').clone(true, true).prependTo($('#facets'));

    compareListUpdate();

    // initialize rating
    $('.item-rating').rating(rating_settings);

    $(settings.resultSelector).bind("facetedsearchresultupdate", function(){
      compareListUpdate();

      // initialize rating
      $('.item-rating').rating(rating_settings);
    });
  });

  // enable tooltips
  $('[data-toggle="tooltip"]').tooltip()
})(jQuery);

function compareListUpdate() {

  // update num results label
  $('.num-results-label').html($('.facettotalcount').html() + " for:");

  // scroll to top
  $("html, body").animate({ scrollTop: 0 });

  // clear items marked for comparison
  $('.compare-list-item').remove();
  $('input:checkbox[name=compare]').attr('checked', false);

  // event listener for each checkbox toggle
  $('input[name=compare]').unbind('change');
  $('input[name=compare]').change(function () {
    // list of checked boxes
    var checked_values = $('input[name=compare]:checked').map(function () {
      return this.value;
    }).get();

    // limit number of compared to 3
    if(checked_values.length > 3) {
      alert("That's too many to compare at once. Feel free to remove one or more marked for comparison before adding another.");
      // uncheck after notification
      $(this).attr('checked', false);
    }
    else {
      // valid, not more than 3. was it checked or unchecked?
      if(this.checked) {
        // checked. append a img to compare list
        $('#compare-list').append('<span class="compare-list-item" id="' + this.value + '"><img src="assets/images/default-product.png" width="30" height="30" class="img-thumbnail" /><a href="#" data-toggle="tooltip" data-placement="bottom" title="Remove ' + this.getAttribute('data-product-label') + ' from comparison" id="' + this.value + '">x</a></span>');
      }
      else {
        // unchecked. remove image from compare list
        $('.compare-list-item#' + this.value).remove();
      }
    }

    // event listener for each compare list item image click
    $('.compare-list-item a').click(function() {
      // clicked, remove from list and uncheck it's checkbox counterpart
      this.parentElement.remove();
      $('input:checkbox[name=compare][value=' + this.id + ']').attr('checked', false);
    });

    // ensure tooltips enabled on compare list items
    $('[data-toggle="tooltip"]').tooltip()
  });

  // ensure tooltips still enabled after results update
  $('[data-toggle="tooltip"]').tooltip()
}
