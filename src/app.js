import * as d3 from 'd3'
import legend from 'd3-svg-legend'
var _ = require('lodash');


d3.json('/data/STE11aAust.json',function(err, geojson){
    var projection = d3.geoEquirectangular()
    .scale(300)
    .translate([-150, 0]);
  
    var geoGenerator = d3.geoPath()
    .projection(projection);

    var color = d3.scaleLinear().range(["blue","red"]);

    var linear = d3.scaleLinear().range(["blue","red"]);

    var showValue = "Population ";

    var record=[];

    d3.csv('/data/sample.csv',(error, dataset) => {
        if(error){
            console.log(error);
        }
        color.domain(d3.extent(dataset, function(d){
            addRecord(d);
            return d[showValue];
        }));
        linear.domain(d3.extent(dataset, function(d){
            return d[showValue];
        }));

       
        
        
        update(geojson);
     
    })
    function addRecord(d){
        var obj = {key:d.states, value:d[showValue]};
        record.push(obj);
    }
   
    function getColor(data){
          var value=-1;
          record.forEach(function(d){
              if(data.properties.STATE_NAME==d.key){
                  value = d.value;
                  return;
              }
          });
          if(value==-1){
              return "none"
          }
          return color(value);
    }


  
    function update(geojson) {
        var map = d3.select('#content g.map')
          .selectAll('path')
          .data(geojson.features);

      
          var cells=_.map(record,
            function(d){
                return d.value;
            }
           );
        map.enter()
          .append('path')
          .attr('d', geoGenerator).style("fill",getColor);

          var colorLegend=legend.legendColor().shapeWidth(60).cells(cells).orient('horizontal').scale(linear);
          d3.select("#content g.legend").call(colorLegend);
      }
      
    
      
   
  
})




