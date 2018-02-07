'use strict';

/**
 * @ngdoc function
 * @name genieBubbleApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the genieBubbleApp
 */
angular.module('genieBubbleApp')
  .controller('MainCtrl', function ($rootScope) {
    
    $rootScope.selectedView = "demo1";

Array.prototype.contains = function(v) {
  for(var i = 0; i < this.length; i++) {
      if(this[i] === v) return true;
  }
  return false;
};

var headerheight = document.getElementsByClassName("header")[0].clientHeight

var width = window.innerWidth,
  height = window.innerHeight - headerheight,
  padding = 1.5, // separation between same-color nodes
  clusterPadding = 6, // separation between different-color nodes
  maxRadius = 12;


var data = []


var colors = ["#d5d5d5","rgb(0,177,223)"];

for(var i = 0;i<10;i++){
  var radius = 20;

  data.push({text:"Skill "+i,Id:i,color:colors[i%2],size:(((i%3)*radius)+radius)});
}

data.forEach(function(d) {
  d.size = +d.size;
});


var cs = [];
data.forEach(function(d){
      if(!cs.contains(d.Level)) {
          cs.push(d.Level);
      }
});

var n = data.length, // total number of nodes
  m = cs.length; // number of distinct clusters

//create clusters and nodes
var clusters = new Array(m);
var nodes = [];
for (var i = 0; i<n; i++){
  nodes.push(create_nodes(data,i));
}

var force = genie.layout.force()
  .nodes(nodes)
  .size([width, height])
  .gravity(.02)
  .charge(0)
  .on("change", change)
  .start();


var svg = genie.select("#bubbleview")
  .attr("width", width)
  .attr("height", height);


var node = svg.selectAll("circle")
  .data(nodes)
  .enter().append("g").call(force.drag);


node.append("circle")
  .style("fill", function (d) {
    console.log(d)
  return d.color;
  })
  .attr("r", function(d){return d.radius})
  

node.append("text")
    .attr("dy", ".3em")
    .style("text-anchor", "middle")
    .text(function(d) { return d.text.substring(0, d.radius / 3); });




function create_nodes(data,node_counter) {
var i = cs.indexOf(data[node_counter].Level),
    r = Math.sqrt((i + 1) / m * -Math.log(Math.random())) * maxRadius,
    d = {
      cluster: i,
      radius: data[node_counter].size*1.5,
      text: data[node_counter].text,
      x: Math.cos(i / m * 2 * Math.PI) * 200 + width / 2 + Math.random(),
      y: Math.sin(i / m * 2 * Math.PI) * 200 + height / 2 + Math.random(),
      color:data[node_counter].color
    };
if (!clusters[i] || (r > clusters[i].radius)) clusters[i] = d;
return d;
};



function change(e) {
  node.each(cluster(10 * e.alpha * e.alpha))
      .each(collide(.5))
  .attr("transform", function (d) {
      var k = "translate(" + d.x + "," + d.y + ")";
      return k;
  })

}

// Move d to be adjacent to the cluster node.
function cluster(alpha) {
  return function (d) {
      var cluster = clusters[d.cluster];
      if (cluster === d) return;
      var x = d.x - cluster.x,
          y = d.y - cluster.y,
          l = Math.sqrt(x * x + y * y),
          r = d.radius + cluster.radius;
      if (l != r) {
          l = (l - r) / l * alpha;
          d.x -= x *= l;
          d.y -= y *= l;
          cluster.x += x;
          cluster.y += y;
      }
  };
}

// Resolves collisions between d and all other circles.
function collide(alpha) {
  var quadtree = genie.geom.quadtree(nodes);
  return function (d) {
      var r = d.radius + maxRadius + Math.max(padding, clusterPadding),
          nx1 = d.x - r,
          nx2 = d.x + r,
          ny1 = d.y - r,
          ny2 = d.y + r;
      quadtree.visit(function (quad, x1, y1, x2, y2) {
          if (quad.point && (quad.point !== d)) {
              var x = d.x - quad.point.x,
                  y = d.y - quad.point.y,
                  l = Math.sqrt(x * x + y * y),
                  r = d.radius + quad.point.radius + (d.cluster === quad.point.cluster ? padding : clusterPadding);
              if (l < r) {
                  l = (l - r) / l * alpha;
                  d.x -= x *= l;
                  d.y -= y *= l;
                  quad.point.x += x;
                  quad.point.y += y;
              }
          }
          return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
      });
  };
}
  });
