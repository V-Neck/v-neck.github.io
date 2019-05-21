// Vaughn Johnson, INFO 474, 2019-05-19

const source_url = "data/police_shootings.csv";

const START_YEAR = 2000;
const N_BINS = 5;

// Format Map
var margin = {top: 20, right: 20, bottom: 20, left: 20};
	width = 1000 - margin.left - margin.right,
	height = 800 - margin.top - margin.bottom,
	formatPercent = d3.format(".1%");

var projection = d3.geoAlbersUsa()
		.translate([width / 2, height / 2]);

var path = d3.geoPath();


var mapSVG = d3.select("#map").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
      
// Load Data
queue().defer(d3.json, "https://d3js.org/us-10m.v1.json")
       .defer(d3.csv,  "data/police_shootings.csv")
       .defer(d3.json,  "data/state_pops.json")
       .defer(d3.json, "https://gist.githubusercontent.com/mshafrir/2646763/raw/8b0dbb93521f5d6889502305335104218454c2bf/states_hash.json")
       .defer(d3.json, "https://gist.githubusercontent.com/wavded/1250983/raw/bf7c1c08f7b1596ca10822baeb8049d7350b0a4b/fipsToState.json")
       .defer(d3.json, "https://gist.githubusercontent.com/wavded/1250983/raw/bf7c1c08f7b1596ca10822baeb8049d7350b0a4b/stateCodeToFips.json")
       .await(ready);

function ready(error, us, shootings, state_pops, abv_to_state, fips_to_state, state_to_fips) {
    if (error) throw error;

    // Munge data
    for(var row in state_pops) {
      state_pops[row]['state_fips'] = state_to_fips[state_pops[row]['state_abb']];
    }

    for(var row in shootings) {
      shootings[row]['state'] = state_to_fips[shootings[row]['state']];
    }

    var state_year_counts = d3.nest()
                        .key(function(d){return d.state})
                        .key(function(d){return d.year})
                        .rollup(function(v) { return v.length; })
                        .object(shootings)

    var state_year_pops = d3.nest()
                            .key(function(d){return d.state_fips})
                            .key(function(d){return d.year})
                            .rollup(function(v){return +v[0].population})
                            .object(state_pops)

    var states = topojson.feature(us, us.objects.states).features;
    
    states.forEach(function(state) {
      state.properties.years = state_year_counts[state.id]
    });

    var number_killed = {};

    for(var state in state_year_counts) {
      for(var year in state_year_counts[state]) {
        if(typeof(number_killed[year]) == 'undefined') {
          number_killed[year] = [];
        }
        if(year in state_year_counts[state] && state in state_year_pops) {
           var frac_killed = state_year_counts[state][year]
                                  / state_year_pops[state][year];
           if (!Number.isNaN(frac_killed) && typeof(frac_killed) != 'undefined') {
              number_killed[year].push(frac_killed)
           }
        }
      }
    }

    // Build Visualization
    var color_years = {};

    for(var year in number_killed){
        if(+year <= 2016) {
          var killed = number_killed[year]
          color_years[year] = d3.scaleQuantile()
                              .domain(killed)
                              .range(d3.schemeReds[N_BINS])
        }
    }

    function get_state_color(d, year) {
      var frac_died = null
      if (d.properties.years[year] == null) {
        frac_died = 0;
      } else {
        frac_died = d.properties.years[year] / state_year_pops[d.id][year];
      }

      return color_years[year](frac_died)
    }

    var stateShapes = mapSVG.append("g")
          .attr("class", "states")
          .selectAll("path")
          .data(states)
          .enter().append("path")
          .attr("d", path)
          .style("stroke", "#fff")
          .style("stroke-width", "2")
          .attr("fill", function(d) {
            get_state_color(d, START_YEAR)
          })

    var legend_width = 100;

    
    mapSVG.append("g")
    .attr("x", 200)
    .append("text")
    .text("Deaths per million people")
    .attr("fill", "#000")
    .attr("y", 640)

    function update(year){
      slider.property("value", year);
      d3.select(".year").text(year);

      stateShapes.transition()
      .attr("fill", function(d) {
        return get_state_color(d, year)
      });

      var legned_data = [];
      var quantiles = [0].concat(color_years[year].quantiles())
                       .concat(Math.max.apply(Math, number_killed[year]))

      for (var i=0; i < N_BINS; i++) {
        legnend_datum = {"idx": i, 
                     "range": (Math.round(1e8 * quantiles[i])/1e2).toString() 
                              + "-" + (Math.round(1e8 * quantiles[i + 1])/1e2).toString(),
                     "color": color_years[year].range()[i]}
        legned_data.push(legnend_datum)
      }

      mapSVG.append("g")
      .selectAll("rect")
      .data(legned_data).enter()
      .append("rect")
      .attr("height", legend_width / 5)
      .attr("width", legend_width)
      .attr("y", 650)
      .attr("x", d => (d['idx'] * (legend_width + 1)))
      .style("fill", c => c['color'])


    mapSVG.append("g")
          .selectAll("text")
          .data(legned_data).enter()
          .append("text")
          .attr("class", "legend-text")
          .attr("y", 650 + legend_width / 7)
          .attr("x", d => (d['idx'] * legend_width + 5))
          .text(d => d.range)
          .attr("fill", "#fff")
    }
    
    var slider = d3.select(".slider")
          .append("input")
            .attr("type", "range")
            .attr("min", 2000)
            .attr("max", 2016)
            .attr("step", 1)
            .on("input", function() {
              var year = this.value;
              update(year);
     });
      
      update(START_YEAR);
  }