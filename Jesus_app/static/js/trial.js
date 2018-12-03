
function select(category){ //if category is undefined, then you hit the clear case.
  // debugger;
  if (category === undefined || category === 'google' || category === 'other')
    {
      // debugger;
      $.ajax({
                url: 'toggle_model',
                data: {category},
                dataType: 'json',
                type: 'GET',
                complete: function()
                {
                  // debugger;
                  $.ajax({
                          url: 'initial',
                          dataType: 'json',
                          type: 'GET',
                          success: function(result)
                          {
                            fillFontList(result, 'fontList');
                          }
                         });
                }
            });
    }
  }

function fillFontList(result, fontList){

  // Build up a long string with the code required for the table
  var code = '';
  var x_coordinates = [0, 300, 150, 0, 300];
  var y_coordinates = [0, 0, 200, 400, 400];
  var cx = [150, 600, 370, 150, 600];
  var cy = [140, 140, 440, 740, 740];

  for (var i = 0; i < result.length; i++) {
    d3.select('#fontList')
    .append('circle')
    .attr('r', 120)
    .attr('cx', cx[i])
    .attr('cy', cy[i])
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
    .attr('x', x_coordinates[i])
    .attr('y', y_coordinates[i])
    .attr('transform', "scale(1.5)");
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

// rest of vars
var w = 900,
    h = 900,

    maxNodeSize = 50,
    x_browser = 20,
    y_browser = 25,
    root;
 
var vis;
// var force = d3.layout.force(); 


vis = d3.select('#vis-container').select('#right').append("svg").attr("width", w).attr("height", h);
 
//           <div class="control-group">
//             <button onclick="select('google')">
//                 Google Fonts
//             </button>
//             <button onclick="select('other')">
//                 Personalized Fonts
//             </button>
//             <button onclick="select()">
//                 Clear
//             </button>
//           </div>
// buttons = d3.select('div')
//             .attr('class', 'control-group')
//             .

 function on_thing_clicked(font_name) { //add eventhandler to each of the 5 circles
  // debugger;
  d3.json(font_name + '/neighbors', function(json) {
  root = json;
  root.fixed = true;
  var defs = vis.insert("svg:defs").data(["end"]);

  defs.enter().append("svg:path");
  // .attr("d", "M0,-5L10,0L0,5");
  // debugger;
  update();


function update() {

  // debugger;
  vis.selectAll("g").remove();
  var force = d3.layout.force(); 
  var nodes = flatten(root),
      links = d3.layout.tree().links(nodes);
  // debugger;
  var diagonal = d3.svg.diagonal()
                       .source(function(d) {return {"x":d.source.y, "y":d.source.x};})
                       .target(function(d){return {"x":d.target.y, "y":d.target.x};})
                       .projection(function(d) {return [d.y,d.x];});
  // debugger;
  // Restart the force layout.
  force.nodes(nodes)
        .links(links)
        .gravity(0.03)
        .charge(-1500)
        .linkDistance(function(d) { return d.target.distance *3;})
        .friction(0.5)
        .linkStrength(function(l, i) {return 1; })
        .size([w, h])
        .on("tick", tick)
        .start();


    // var drag = force.drag()
    //     .on(;

   var path = vis.selectAll("path.link")
      .data(links, function(d) { return d.target.id; });


      path.enter()
          .append('g')
          .attr('class', 'link');


      path.insert("svg:path")
          .attr('class', 'link')
               .attr('id', function(d){return 'path' + d.target.id;})
        // .attr("marker-end", "url(#end)")
               .style("stroke", "#eee")
               .style("stroke-width", 2)
               .attr('d', diagonal);


      path.append("svg:text")
          .append('textPath')
          .attr('xlink:href', function(d){return '#path'+d.target.id})
          // .attr('transform', function(d) {return "translate("+((d.source.y + d.target.y)/2) +
          //                                       "," + ((d.source.x + d.target.x)/2)+ ")";})
          .attr("x", function(d) { 
            var x= (d.target.y + d.source.y)/2
            return x;
          })
          .attr("y", function(d) { 
            var y= (d.target.x + d.source.x)/2
            return y;
          })
          .style('text-anchor', 'middle')
          .attr('startOffset', '60%')
          .attr('font-size', '20px')
          .text(function(d){return Math.ceil(d.target.distance);});


  path.exit().remove();
 
 
 
  // Update the nodes…
  var node = vis.selectAll("g.node")
      .data(nodes, function(d) {return d.id; });
 
 // debugger;
  // Enter any new nodes.
  var nodeEnter = node.enter().append("svg:g")
      .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })
      .on("click", click)
      .call(force.drag);
 
  // Append a circle
  nodeEnter.append("svg:circle")
      .attr("r", function(d) { return 80; })
      .attr('cx', function(d) {return d.id * 2;})
      .attr('cy', function(d) {return d.id *2;})
      .style("fill", "#eee");

 
   
  // Append images
  var images = nodeEnter.append("svg:image")
        .attr("xlink:href",  function(d) { return d.img;})
        .attr("x", function(d) { return d.id*2 - 100;})
        .attr("y", function(d) { return d.id*2 - 100;})
        .attr("height", 150)
        .attr("width", 150);
  


  // make the image grow a little on mouse over and add the text details on click
  var setEvents = images
          // Append hero text
          .on( 'click', function (d) {
              // d3.select("h1").html(d.hero); 
              // d3.select("h2").html(d.name); 
              // d3.select("h3").html ("Take me to " + "<a href='" + d.link + "' >"  + d.hero + " web page ⇢"+ "</a>" );
              var clicked_font = this.href.baseVal;
              var clicked_font_name = clicked_font.split('/')[3].split('.')[0];
              // debugger;
              on_thing_clicked(clicked_font_name);

           })

          .on( 'mouseenter', function() {
            // select element in current context
            d3.select( this )
              .transition()
              .attr("x", function(d) { return d.id*2 - 100;})
              .attr("y", function(d) { return d.id*2 - 100;})
              .attr("height", 300)
              .attr("width", 300);
          })
          // set back
          .on( 'mouseleave', function() {
            d3.select( this )
              .transition()
              .attr("x", function(d) { return d.id*2 - 100;})
              .attr("y", function(d) {return d.id*2 - 100;})
              .attr("height", 150)
              .attr("width", 150);
          });

  // Append hero name on roll over next to the node as well
  nodeEnter.append("text")
      .attr("class", "nodetext")
      .attr("x", x_browser -20)
      .attr("y", y_browser +15)
      .attr("fill", tcBlack)
      .text(function(d) { return d.name; });

  var parent_node = d3.selectAll('g.node');

  parent_node[parent_node.length -1][5].children[0].setAttribute('cy', 25);
  parent_node[parent_node.length -1][5].children[1].setAttribute('y', -70);
  parent_node[parent_node.length -1][5].children[2].setAttribute('y', y_browser + 35);


  // debugger;
 
  // Exit any old nodes.
  node.exit().remove();
 
 
  // Re-select for update.
  path = vis.selectAll("path.link");
  node = vis.selectAll("g.node");
  // debugger;
 
function tick() {
 
 
    path.attr("d", function(d) {
 // debugger;
     var dx = d.target.x - d.source.x,
           dy = d.target.y - d.source.y,
           dr = Math.sqrt(dx * dx + dy * dy);
           // debugger;
           cx = d.source.x
           cy = d.source.y + 100
           return   "M" + cx + "," 
            + cy
            + "L" 
            + d.target.x + "," 
            + d.target.y;
  });
    node.attr("transform", nodeTransform);    
  }
  // debugger;
}
// function dragstart(d) {
//   d3.select(this).classed("fixed", d.fixed = true);
// }

// function dbclick(d){
//   d3.select(this).classed('fixed', d.fixed=False)
// }
 
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
  font_name = d.img.split('/')[3].split('.')[0]

  on_thing_clicked(font_name);
  // debugger;
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

