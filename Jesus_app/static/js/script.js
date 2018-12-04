////////////////// First thing to do is present the initial list of fonts. They should be clickable
$.ajax({
  url: 'initial',
  dataType: 'json',
  type: 'GET',
  success: function(result) {
    fillFontList(result, 'fontList');
  }
});

////////////////// Function to fill the table with data
function fillFontList(result, tableName){

  // Build up a long string with the code required for the table
  var code = '';

  // Each font will add a new row
  for (var i = 0; i < result.length; i++) {

    code += '  <tr>';
    code += '    <td>' + '<img src=' + result[i] + '/>' + '</td>';
    code += '  </tr>';
  }

  // Insert this html code in the tbody element of the table
  d3.select('#'+tableName).html(code);

  // Attach a click event to every row of the table
  d3.select('#'+tableName)
    .selectAll('td')
    .on('click', function(){
      var clicked_font = d3.select(this).html();
      getResult(clicked_font);
    })
}

////////////////// Function to communicate with the backend
function getResult(clicked_font){
  $.ajax({
    url: 'neighbors',
    data: {'clicked_font': clicked_font},
    dataType: 'json',
    type: 'GET',
    success: function(result) {
      fillFontList(result.top5, 'fontTop10');
      fillFontList(result.random5, 'fontList');
    }
  });
}
