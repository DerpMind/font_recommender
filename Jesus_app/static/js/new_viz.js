
function select(category){ //if category is undefined, then you hit the clear case.
  if(category === 'google' || category === 'other'){
    $.ajax({url: 'toggle_model',
            data: {category},
            dataType: 'json',
            type: 'GET',
            complete: function(){
              $.ajax({url: 'initial',
                      dataType: 'json',
                      type: 'GET',
                      success: function(result){
                        fillFontList(result, 'fontList');}
              });
            }
    });
  }
  else{
    clear();
    d3.select("#fontList").selectAll("circle").remove();
    d3.select("#fontList").selectAll("image").remove();
  }
}


function fillFontList(result, fontList){

  var x_coordinates = [0, 300, 150, 0, 300];
  var y_coordinates = [0, 0, 200, 400, 400];
  var cx = [150, 600, 370, 150, 600];
  var cy = [140, 140, 440, 740, 740];

  for (var i = 0; i < result.length; i++){
    d3.select('#fontList')
    .append('circle')
    .attr('r', 120)
    .attr('cx', cx[i])
    .attr('cy', cy[i])
    .style('fill', '#eee');
  }

  for (var i = 0; i < result.length; i++ ){
    d3.select('#fontList')
    .append("svg:image")
    .attr('xlink:href', result[i])
    .attr('x', x_coordinates[i])
    .attr('y', y_coordinates[i])
    .attr('transform', "scale(1.5)");
  }

  d3.select('#fontList')
    .selectAll('image')
    .on('click', function(){
      var clicked_font = this.href.baseVal;
      var clicked_font_name = clicked_font.split('/')[3].split('.')[0]
      clear();
      on_node_clicked(clicked_font_name);
    });
}


function getResult(clicked_font){
  $.ajax({
    url: 'neighbors',
    data: {'clicked_font': clicked_font, 'trial': true},
    dataType: 'json',
    type: 'GET',
    success: function(result) {
      fillFontList(result.top5, 'fontTop10');
    }
  });
}



function on_node_clicked(font_name){
  d3.json(font_name+"/neighbors", function(error, root){
      var w = window.innerWidth*0.68*0.95;
      var h = Math.ceil(w*0.9);
      var oR = 0;
      var nTop = 0;
      var x_coords = [];

      var tooltip = d3.select("#mainBubble")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

      var svgContainer = d3.select("#mainBubble")
      .style("height", h+"px");

      var svg = d3.select("#mainBubble")
      .append("svg")
      .attr("class", "mainBubbleSVG")
      .attr("width", 1000)
      .attr("height", 800)
      .on("mouseleave", function() { return resetBubbles(); });

      var bubbleObj = svg.selectAll(".parentBubble")
      .data(root.children)
      .enter()
      .append("g")
      .attr("id", "parentImgandTxt")

      nTop = root.children.length;
      oR = w/(1+3*nTop); 

      // h = Math.ceil(w/nTop*2); 

      svgContainer.style("height", h+"px");

      //generates parent image
      bubbleObj.append("image")
      .attr("class", "parentBubble")
      .attr("id", "parentImg")
      .attr("xlink:href", function(d){ return d.img; })
      .attr("x", function(d,i) { return (oR*(3*(1+i)-1) - 300); })
      .attr("y", ((h+oR)/3)-200)
      .attr("width", oR)
      .attr("height", oR)
      .style("opacity", 0.7)
      .style("border", "5px solid black")
      .on("mouseover", function(d, i){ return activateBubble(d,i); })
      .on("mouseleave", function(){ return resetBubbles(); }); 

      //generates parent text
      bubbleObj.append("text")
      .attr("class", "parentTxt")
      .attr("x", function(d, i) { return (oR*(3*(1+i)-1)-300); })
      .attr("y", ((h+oR)/3)-200)
      .style("fill", "black") // #1f77b4
      .attr("font-size", 14)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("alignment-baseline", "middle")
      .text(function(d) { return d.name})     
      .on("mouseover", function(d,i) { return activateBubble(d,i); })
      .on("mouseleave", function(){ return resetBubbles(); }); 

      //generates children images and texts 
      for(var iB = 0; iB < nTop; iB++){
          var childBubbles = svg.selectAll(".childBubble")
          .data(root.children[0].children)
          .enter()
          .append("g");

          childBubbles.append("image")
          .attr("class", "childBubble")
          .attr("id", function(d,i) { return "childBubbleImg_" + i; })
          .attr("xlink:href", function(d){ return d.img;})
          .attr("width", oR/2)
          .attr("height", oR/2)
          .attr("x", function(d,i) { 
            var x = (oR*(3*(iB+1)-1) + oR*1.5*Math.cos((i-1)*45/180*3.1415926) - 250);
            // x_coords.push(x);
            return x; })
          .attr("y", function(d,i) { return ((h+oR)/3 +        oR*1.5*Math.sin((i-1)*45/180*3.1415926) - 100); })
          .attr("cursor","pointer")
          .style("opacity", 0.7)
          .on("mouseover", function(d,i){ activateChildBubble.call(this, d,i); })
          .on("mouseleave", function(){ return resetBubbles(); })
          .on("click", function(d){
            var clicked_font = this.href.baseVal;
            var clicked_font_name =clicked_font.split("/")[3].split(".")[0];
            clear();
            on_node_clicked(clicked_font_name);
          }); 

          childBubbles.append("text")
          .attr("class", "childBubbleTxt")
          .attr("id", function(d,i){ return "childBubbleTxt_" + i; })
          .attr("x", function(d,i) { 
            var x = (oR*(3*(iB+1)-1) + oR*1.5*Math.cos((i-1)*45/180*3.1415926) - 200); 
            x_coords.push(x);
            return x; })
          .attr("y", function(d,i) { return ((h+oR)/3 +        oR*1.5*Math.sin((i-1)*45/180*3.1415926) - 100); })
          .style("opacity",0.7)
          .attr("text-anchor", "middle")
          .style("fill", "black") 
          .attr("font-size", 9)
          .attr("cursor","pointer")
          .attr("dominant-baseline", "middle")
          .attr("alignment-baseline", "middle")
          .text(function(d) { return d.name})
          .on("mouseover", function(d,i){ activateChildTxt.call(this, d, i); })
          .on("mouseleave", function(d){
            var txt_id_selected = this.id;

            var t = svg.transition()
            .duration(d3.event.altKey ? 7500 : 350);

            tooltip.transition()
            .duration(500)
            .style("opacity", 0);
          });
      }
  //mouse-overed parent image and text animation
      function activateBubble(d,i){

        var t = svg.transition()
        .duration(d3.event.altKey ? 7500 : 350);

        //enlargens and darkens parent photo
        t.selectAll(".parentBubble")
        .attr("height", oR*1.5)
        .attr("width", oR*1.5)
        .style("opacity", 1);

        //enlargens, darkens, and slides parent text
        t.selectAll(".parentTxt")
        .attr("x", (oR*2 - 0.6*oR*(-1)-300))
        .attr("font-size", 14*1.5)
        .attr("font-weight", "bold");

        //shrinks and lightens child images
        t.selectAll(".childBubble")
        .attr("width", oR/3.0)
        .attr("height", oR/3.0)
        .style("opacity", 0.2)                
      }


      //mouse-overed child image animation
      function activateChildBubble(d,i){

        var t = svg.transition()
        .duration(d3.event.altKey ? 7500 : 350);

        //shrinks and opaques the parent img
        t.selectAll(".parentBubble")
        .attr("height", oR*0.7)
        .attr("width", oR*0.7)
        .style("opacity", 0.2);

        //shrinks the parent text
        t.select(".parentTxt")
        .attr("font-size", 7);

        var id_selected = this.id

        //largens selected child image
        var img_selected = t.select("#"+id_selected)
        .attr("width", oR)
        .attr("height", oR)
        .style("opacity", 1);
        
        var txt_id_x = img_selected
        .map(function(d){ return {"id": d[0].nextSibling.getAttribute("id"),
         "x": d[0].nextSibling.getAttribute("x")}});

        var txt_id_selected = txt_id_x[0].id;
        var txt_x_selected = txt_id_x[0].x;

        //largens selected child txt
        var txt_elem = t.select('#'+txt_id_selected)
        .attr("font-size", 14)
        .attr("font-weight", "bold");
        // .attr("x", (+txt_x_selected+60));

        //ensures text doesn't get shifted more than once before
        //bubbles reset
        // debugger;
        if(+txt_x_selected < (x_coords[i] + 10)){
          txt_elem.attr("x", +txt_x_selected + 100); }
        
        //de-emphasize on other child nodes
        t.selectAll(".childBubble")
        .attr("width", function(){
          var s = id_selected;
          return s !== this.id ? oR/3.0 : oR;
        })
        .attr("height", function(){
          var s = id_selected;
          return s !== this.id ? oR/3.0 : oR;
        })
        .style("opacity", function(){
          var s = id_selected;
          return s !== this.id ? 0.2 : 1;
        });

        t.selectAll(".childBubbleTxt")
        .attr("font-size", function(){
          var s = txt_id_selected;
          return s !== this.id ? 6 : 14;
        });
      }


      //mouse-overed child text animation with tooltip
      function activateChildTxt(d,i){ 
        var txt_id_selected = this.id;
        var txt_x_selected = this.getAttribute("x");

        var t = svg.transition()
        .duration(d3.event.altKey ? 7500 : 350);

        //enlargens text
        var txt_selected = t.select('#'+txt_id_selected)
        .attr("text-weight", "bold")
        .attr("font-size", 14);

        //keeps the image associated to selected text enlarged  
        var img_id_x_y = txt_selected
        .map(function(d){ return {"id": d[0].previousSibling.getAttribute("id"),
          "x": d[0].previousSibling.getAttribute("x"),
          "y": d[0].previousSibling.getAttribute("y")} });

        var img_id_selected = img_id_x_y[0].id;
        var img_x = img_id_x_y[0].x;
        var img_y = img_id_x_y[0].y;

        t.select("#"+img_id_selected)
        .attr("width", oR)
        .attr("height", oR)
        .style("opacity", 1);

        //keeps parent small
        t.selectAll(".parentBubble")
        .attr("height", oR*0.7)
        .attr("width", oR*0.7)
        .style("opacity", 0.2);
        t.select(".parentTxt")
        .attr("font-size", 7);

        //keeps other images and their texts small
        t.selectAll(".childBubble")
        .attr("width", function(){
          var s = img_id_selected;
          return s !== this.id ? oR/3.0 : oR;
        })
        .attr("height", function(){
          var s = img_id_selected;
          return s !== this.id ? oR/3.0 : oR;
        })
        .style("opacity", function(){
          var s = img_id_selected;
          return s !== this.id ? 0.2 : 1;
        });

        t.selectAll(".childBubbleTxt")
        .attr("font-size", function(){
          var s = txt_id_selected;
          return s !== this.id ? 6 : 14;
        });

        //trigger tooltip animation when mouse-over the child text 
        tooltip.transition()
        .duration(200)
        .style("opacity", .9);

        tooltip.html("Distance from selected font: " + Math.ceil(d.distance))
        .style("left", (+img_x+40)+"px")
        .style("top", (+img_y-50) +"px");   
      }


      //resets all dimensions and colors of nodes
      function resetBubbles(){
        w = window.innerWidth*0.68*0.95;
        oR = w/(1+3*nTop);
         
        // h = Math.ceil(w/nTop*2);
        svgContainer.style("height",h+"px");

             
        svg.attr("width", w);
        svg.attr("height",h);       
         
        var t = svg.transition()
        .duration(650);
           
        t.select("#parentImg")
        .attr("width", oR)
        .attr("height", oR)
        .attr("x", function(d, i) {return (oR*(3*(1+i)-1)-300); })
        .attr("y", ((h+oR)/3)-200)
        .style("opacity", 0.7);

        t.select(".parentTxt")
        .attr("font-size", 14)
        .attr("font-weight", "normal")
        .attr("x", function(d, i) {return (oR*(3*(1+i)-1)-300); })
        .attr("y", ((h+oR)/3)-200);
       
        for(var k = 0; k < nTop; k++) 
        {
          t.selectAll(".childBubbleTxt")
          .attr("x", function(d,i) {return (oR*(3*(k+1)-1) + oR*1.5*Math.cos((i-1)*45/180*3.1415926) - 200); })
          .attr("y", function(d,i) {return ((h+oR)/3 +        oR*1.5*Math.sin((i-1)*45/180*3.1415926) - 100); })
          .attr("font-size", 9)
          .attr("font-weight", "normal")
          .style("opacity",0.7);

          t.selectAll(".childBubble")
          .attr("height",  oR /2.0)
          .attr("width", oR/2.0)
          .style("opacity",0.5)
          .attr("x", function(d,i) {return (oR*(3*(k+1)-1) + oR*1.5*Math.cos((i-1)*45/180*3.1415926) - 250); })
          .attr("y", function(d,i) {return ((h+oR)/3 +        oR*1.5*Math.sin((i-1)*45/180*3.1415926) - 100); });
        }
      }
      window.onresize = resetBubbles;
  });

}

function clear(){
  d3.select("#parentImgandTxt").remove();
  d3.selectAll(".childBubble").remove();
  d3.selectAll(".childBubbleTxt").remove();
}