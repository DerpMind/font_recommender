$.ajax({
  url: 'initial',
  dataType: 'json',
  type: 'GET',
  success: function(result){
    // debugger;
    fillFontList(result, 'fontList')
  }

  });
function fillFontList(result, fontList){

  // Build up a long string with the code required for the table
  var code = '';

  for (var i = 0; i < result.length; i++) {
    d3.select('#fontList')
    .append('circle')
    .attr('r', 40)
    .attr('cx', i*100+100)
    .attr('cy', i*100+100)
    .style('fill', '#eee');
    // .insert("svg:image")
    // .attr('xlink:href', result[i])
    // .attr('x', i*100+100)
    // .attr('y', i*100+100)
    // .attr('transform', "scale(0.5)");

  }
  for (var i = 0; i < result.length; i++ ){
    d3.select('#fontList')
    .append("svg:image")
    .attr('xlink:href', result[i])
    .attr('x', i*200+100)
    .attr('y', i*200+100)
    .attr('transform', "scale(0.5)");
  }
  // Each font will add a new row
  // debugger;
  // for (var i = 0; i < result.length; i++) {

  //   code += '<img src=' + result[i] + ' />';
  // }

  // // Insert this html code in the tbody element of the table
  // d3.select('#fontList').html(code);

  // Attach a click event to every row of the table
  d3.select('#fontList')
    .selectAll('image')
    .on('click', function(){
      // debugger;
      var clicked_font = this.href.baseVal;
      // debugger;
      getResult(clicked_font);

    })
}

////////////////// Function to communicate with the backend
function getResult(clicked_font){
  $.ajax({
    url: 'neighbors',
    data: {'clicked_font': clicked_font, 'trial': true},
    dataType: 'json',
    type: 'GET',
    success: function(result) {
      debugger;
      fillFontList(result.top5, 'fontTop10');
      fillFontList(result.random5, 'fontList');
    }
  });
}

// var tcBlack = "#130C0E";


var w = 1296,
    h = 1000,
    maxNodeSize = 50,
    x_browser = 20,
    y_browser = 25,
    root;
 
var vis;
var force = d3.layout.force(); 

vis = d3.select("#vis-container").append("svg").attr("width", w).attr("height", h);

 function on_thing_clicked(font_name) { //add eventhandler to each of the 5 circles
  d3.json(font_name + '/neighbors', function(json) {
  root = json;
  root.fixed = true;
  // debugger;
  var defs = vis.insert("svg:defs").data(["end"]);

  defs.enter().append("svg:path")
  .attr("d", "M0,-5L10,0L0,5");

  update();


function update() {
  var nodes = flatten(root),
      links = d3.layout.tree().links(nodes);
 
  // Restart the force layout.
  force.nodes(nodes)
        .links(links)
        .gravity(0.05)
    .charge(-1500)
    .linkDistance(function(d) { return d.target.distance})
    .friction(0.5)
    .linkStrength(function(l, i) {return 1; })
    .size([w, h])
    .on("tick", tick)
        .start();
        // debugger;
 
   var path = vis.selectAll("path.link")
      .data(links, function(d) { return d.target.id; });
 
    path.enter().insert("svg:path")
      .attr("class", "link")
      // .attr("marker-end", "url(#end)")
      .style("stroke", "#eee")
      .style("stroke-width", 2);
 // debugger;
 
  // Exit any old paths.
  path.exit().remove();
 
 
 
  // Update the nodes…
  var node = vis.selectAll("g.node")
      .data(nodes, function(d) { return d.id; });
 
 
  // Enter any new nodes.
  var nodeEnter = node.enter().append("svg:g")
      .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
      .on("click", click)
      .call(force.drag);
 
  // Append a circle
  nodeEnter.append("svg:circle")
      .attr("r", function(d) { return 20; })
      .style("fill", "#eee");
 
   
  // Append images
  var images = nodeEnter.append("svg:image")
        .attr("xlink:href",  function(d) { return d.img;})
        .attr("x", function(d) { return -25;})
        .attr("y", function(d) { return -25;})
        .attr("height", 200)
        .attr("width", 400);
  
  // make the image grow a little on mouse over and add the text details on click
  var setEvents = images
          // Append hero text
          .on( 'click', function (d) {
              d3.select("h1").html(d.hero); 
              d3.select("h2").html(d.name); 
              d3.select("h3").html ("Take me to " + "<a href='" + d.link + "' >"  + d.hero + " web page ⇢"+ "</a>" ); 
           })

          .on( 'mouseenter', function() {
            // select element in current context
            d3.select( this )
              .transition()
              .attr("x", function(d) { return -60;})
              .attr("y", function(d) { return -60;})
              .attr("height", 400)
              .attr("width", 800);
          })
          // set back
          .on( 'mouseleave', function() {
            d3.select( this )
              .transition()
              .attr("x", function(d) { return -25;})
              .attr("y", function(d) { return -25;})
              .attr("height", 200)
              .attr("width", 400);
          });

  // Append hero name on roll over next to the node as well
  nodeEnter.append("text")
      .attr("class", "nodetext")
      .attr("x", x_browser)
      .attr("y", y_browser +15)
      .attr("fill", tcBlack)
      .text(function(d) { return d.name; });
 
 
  // Exit any old nodes.
  node.exit().remove();
 
 
  // Re-select for update.
  path = vis.selectAll("path.link");
  node = vis.selectAll("g.node");
 
function tick() {
 
 
    path.attr("d", function(d) {
 // debugger;
     var dx = d.target.x - d.source.x,
           dy = d.target.y - d.source.y,
           dr = Math.sqrt(dx * dx + dy * dy);
           // debugger;
           return   "M" + d.source.x + "," 
            + d.source.y 
            + "L" 
            + d.target.x + "," 
            + d.target.y;
  });
    node.attr("transform", nodeTransform);    
  }
}

 
/**
 * Gives the coordinates of the border for keeping the nodes inside a frame
 * http://bl.ocks.org/mbostock/1129492
 */ 
function nodeTransform(d) {
  d.x =  Math.max(maxNodeSize, Math.min(w - (d.imgwidth/2 || 16), d.x));
    d.y =  Math.max(maxNodeSize, Math.min(h - (d.imgheight/2 || 16), d.y));
    return "translate(" + d.x + "," + d.y + ")";
   }
 
/**
 * Toggle children on click.
 */ 
function click(d) {
  if (d.children) {
    d._children = d.children;
    d.children = null;
  } else {
    d.children = d._children;
    d._children = null;
  }
 
  update();
}
 
 
/**
 * Returns a list of all nodes under the root.
 */ 
function flatten(root) {
  var nodes = []; 
  var i = 0;
 
  function recurse(node) {
    if (node.children) 
      node.children.forEach(recurse);
    if (!node.id) 
      node.id = ++i;
    nodes.push(node);
  }
 
  recurse(root);
  return nodes;
} 