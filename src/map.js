// You can require libraries
const d3 = require('d3')

//Width and height
//Define quantize scale to sort data values into buckets of color

//Colors taken from colorbrewer.js, included in the D3 download
const w = 700;
const h = w / 2;
var path = d3.geoPath().projection(projection);

// Set the dimensions of the canvas / graph
var margin = { top: 20, right: 20, bottom: 50, left: 50 },
  width = w - margin.left - margin.right,
  height = h - margin.top - margin.bottom;

var svg = d3.select("#map1").append("svg").attr("width", '100%')
  .attr("height", '100%');
//.attr("transform", "translate(" + 20 + "," + 20 + ")");;
var projection = d3.geoAlbersUsa()
  .translate([50, 0])
  .scale([600]);//var projection = d3.geoAlbersUsa();//rotate([90, 0, 0]);
var center = projection([-118.0, 50.0]);

//Define what to do when panning or zooming
var zooming = function (d) {
  //Log out d3.event.transform, so you can see all the goodies inside
  // console.log(d3.event.transform);

  //New offset array
  var offset = [d3.event.transform.x, d3.event.transform.y];

  //Calculate new scale
  var newScale = d3.event.transform.k * 2000;

  //Update projection with new offset and scale
  projection.translate(offset)
    .scale(newScale);

  //Update all paths and circles
  //svg.selectAll("path")
  // .attr("d", path);

  svg.selectAll("circle")
    .attr("cx", function (d) {
      return projection([d.long, d.lat])[0];
    })
    .attr("cy", function (d) {
      return projection([d.long, d.lat])[1];
    });
}

//Then define the zoom behavior
var zoom = d3.zoom()
  .scaleExtent([0.2, 2.0])
  .translateExtent([[-1200, -700], [1200, 700]])
  .on("zoom", zooming);

//Create a container in which all zoom-able elements will live
var map = svg.append("g")
  .attr("id", "map")
  .call(zoom)  //Bind the zoom behavior
  .call(zoom.transform, d3.zoomIdentity  //Then apply the initial transform
    .translate(w / 2, h / 2)
    .scale(0.50)
    .translate(-center[0], -center[1]));

var path = d3.geoPath().projection(projection);
var data1;

var url = "https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json";

Promise.all([d3.json(url)]).then(function (data) {
  var world = data[0];
  //var places = data[1];

  // can change the colors of the map if needed
  svg.append("path")
    .attr("d", path(world))
    .style("fill", "white")
    .attr("stroke", "grey");

  /*d3.csv("trendsByLocation/trends_locations_government_shutdown.csv").then(function (data, error) {
    var filtered;
    if (error) {
      console.log(error);
    } else {
      filtered = data.filter(function (d) {
        //console.log("START" +dateStart)
        var d1 = new Date(dateStart);
        var d2 = new Date(dateEnd);
        var rowDate = new Date(d.date)
        //console.log("END"+d2);
        // console.log(d.date);
        return rowDate > d1 && rowDate < d2; //d["interest"]=== "12";
      });
      // console.log(filtered)
      data1 = filtered;
    }
  });

  window.setTimeout(function () {
    svg.selectAll("circle")
      .transition().duration(5000)

  }, 5000);*/
});


function addPoints(event, color, filtered, world) {

  var minCities = Math.min(filtered.length, 50);
  var forTextArray = [];
  svg.selectAll("circle").remove();
  svg.selectAll("text").remove();
  
  for (var i = 0; i < minCities; i++) {
    
    var latitude = parseFloat(filtered[i]["lat"]);
    var longitude = parseFloat(filtered[i]["long"]);
    var interest = parseInt(filtered[i]["average"]);
    console.log(filtered[i]
      )
    if (interest >= 85) { 
      forTextArray.push(filtered[i]);
    }
   
    

    svg.append("circle")
      .attr("cx", function (d) {
        if (projection([longitude, latitude]))
          return projection([longitude, latitude])[0];
        else
          console.log("ERROR: " + d)
          return 50
      })
      .attr("cy", function (d) {
        if (projection([longitude, latitude]))
          return projection([longitude, latitude])[1];
        else
          console.log("ERROR: " + d)
          return 50
      })
      .attr("r", function (d) {
        return Math.sqrt(interest) ;
      })
      .style("fill", color)
      .style("stroke", "gray")
      .style("stroke-width", 0.25)
      .style("opacity", function (d) {
          return interest*0.01  ;
      })
      //.style("opacity", 0.75);
      if (event === "NBA Finals") {
        event = "The NBA Finals";
      }
      else if (event === "Womens World Cup" ) {
        event = "FIFA Women's World Cup";
      } else if (event === "march madness" ) {
        event =  "NCAA Men's Division I Basketball Tournament";
      } else if (event === "Boeing 737 crash" ) {
        event =  "Boeing 737 crashes";
      } else if (event === "Lori Loughlin scandal") {
        event =  "Lori Loughlin college scandal"
      }
      /*
      if (interest >= 85) 
        svg.append("circle")
        .attr("cx", function (d) {
          if (projection([longitude, latitude]))
            return projection([longitude, latitude])[0];
          else
            return 50
        })
        .attr("cy", function (d) {
          if (projection([longitude, latitude]))
            return projection([longitude, latitude])[1];
          else
            return 50
        })
        .attr("r", function (d) {
          return 2 ;
        })
        .style("fill", "black")
*/
    svg.selectAll("circle")
      .append("title")
      .text(event + " in " + filtered[i]["geoName"].replace(" United States of America", "") + " average: " + interest);
  
     
    

    }

    
/*
    svg.selectAll("text")
      .data(forTextArray)
      .enter()
      .append("text") // append text
      .attr("x", function (d) {
        if (projection([parseFloat(d["long"]), parseFloat(d["lat"])]))
          return (projection([parseFloat(d["long"]), parseFloat(d["lat"])]))[0];
        else
          return 50
      })
      .attr("y", function (d) {
        if (projection([parseFloat(d["long"]), parseFloat(d["lat"])]))
          return (projection([parseFloat(d["long"]), parseFloat(d["lat"])]))[1];
        else
          return 50
      })
      .attr("dy", -8) // set y position of bottom of text
     .style("fill", "black") // fill the text with the colour black
     .attr("text-anchor", "middle") // set anchor y justification
     .text(function(d) {
      var place = d["city"];
      //place = place.substring(0, place.length - 3);
      //if (d["average"] >= 80)
        return place;
      }
      ); // define the text to display
*/
}



var color1;
var event1;

function updateData(event, color, dateStart, dateEnd) {
  event1 = event;
  color1 = color;
  svg.selectAll("circle").remove();
  svg.selectAll("text").remove();
  if (event != "-1") {
    //console.log(event)
    if (event === "The NBA Finals") {
      event = "NBA Finals";
    }
    else if (event === "FIFA Women's World Cup") {
      event = "Womens World Cup";
    } else if (event === "NCAA Men's Division I Basketball Tournament") {
      event = "march madness";
    } else if (event === "Boeing 737 crashes") {
      event = "Boeing 737 crash";
    } else if (event === "Lori Loughlin college scandal") {
      event = "Lori Loughlin scandal";
    } else if (event === "California earthquake") {
      event = "California Earthquake";
    }
    if (event != undefined) {
      // replace all spaces with underscores
      eventFile = event.replace(/ /g, '_');
      fileName = "trendsByLocation/trends_locations_" + eventFile + ".csv"
      console.log(fileName);

      // var arr = [{"shape":"square","color":"red","used":1,"instances":1},{"shape":"square","color":"red","used":2,"instances":1},{"shape":"circle","color":"blue","used":0,"instances":0},{"shape":"square","color":"blue","used":4,"instances":4},{"shape":"circle","color":"red","used":1,"instances":1},{"shape":"circle","color":"red","used":1,"instances":0},{"shape":"square","color":"blue","used":4,"instances":5},{"shape":"square","color":"red","used":2,"instances":1}];

      d3.csv(fileName).then(function (data, error) {
        var filtered;
        if (error) {
          // console.log(error + "fnaj");
        } else {
          console.log(dateStart)
          filtered = data.filter(function (d) {
            var d1 = new Date(dateStart);
            var d2 = new Date(dateEnd);
            var rowDate = new Date(d.date)
            //console.log("END"+d2);
            // console.log(d.date);
            return rowDate >= d1 && rowDate <= d2 && d["interest"]>30; //d["interest"]=== "12";

          });
          console.log(filtered);
          data1 = filtered;

          var helper = {};
          var result = filtered.reduce(function (r, o) {
            var key = o.geoName;

            if (!helper[key]) {
              helper[key] = Object.assign({}, o); // create a copy of o
              r.push(helper[key]);
              helper[key].count = 1;
              helper[key].average = (parseInt(helper[key].interest) + 0.0) / helper[key].count;
            } else {
              helper[key].interest = parseInt(o.interest) + parseInt(helper[key].interest);
              helper[key].count += 1;
              helper[key].average = helper[key].interest / helper[key].count;
            }

            return r;
          }, []);

          console.log(result);

          /*
          var filtered1; 
          filtered1 = filtered.filter(function(d){
            var data1 = d3.nest()
            .key(function(d) { return d.geoName;})
            .rollup(function(d) { 
                return d3.sum(d, function(g) {return g.value; });
            }).entries(filtered1);
          });
  
          console.log(filtered1);
          */

          addPoints(event, color, result);
        }
      });
    }
  }
}
var dateStart = new Date(2019, 1 - 1, 1);
var dateEnd = new Date(2019, 12 - 1, 31);

function updateTime1(event) {
  dateStart = d3.timeFormat('%Y-%m-%d')(event[0]);
  dateEnd = d3.timeFormat('%Y-%m-%d')(event[1]);
  updateData(event1, color1, dateStart, dateEnd);
  //console.log("DATE"+dateEnd);
}

window.updateTime1 = updateTime1;
window.updateData = updateData;
