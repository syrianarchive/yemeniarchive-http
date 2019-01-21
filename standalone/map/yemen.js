const margin = {top: 10, left: 10, bottom: 10, right: 10};
const width = 800 - margin.left - margin.right;
const height = 700 - margin.top - margin.bottom;

const projectionYemen = d3.geoMercator()
    .center([55, 9.25])
    .scale(1320)
      .translate([width, height]);

const pathYemen = d3.geoPath()
    .projection(projectionYemen)
      .pointRadius(2);


const svg = d3.select('#viz')
      .append('svg')
      .attr('width', width)
      .attr('height', height);

const yemen = svg.append('g')
      .attr('transform', 'translate(-200,70)');


d3.json('./yemen.json').then((country) => {
  yemen.selectAll('.subunit')
    .data(topojson.feature(country, country.objects.subunits).features)
    .enter().append('path')
    .attr('class', function(d) { return 'subunit ' + d.id; })
    .attr('d', pathYemen);
  yemen.append('path')
    .datum(topojson.feature(country, country.objects.subunits))
    .attr('d', pathYemen)
    .attr('class', 'country');
  yemen.append('path')
    .datum(topojson.feature(country, country.objects.places))
    .attr('d', pathYemen)
    .attr('class', 'place');
  yemen.selectAll('.place-label')
    .data(topojson.feature(country, country.objects.places).features)
    .enter().append('text')
    .attr('class', 'place-label')
    .attr('transform', function(d) { return 'translate(' + projectionYemen(d.geometry.coordinates) + ')'; })
    .attr('x', function(d) { return d.geometry.coordinates[0] > -1 ? 6 : -6; })
    .attr('dy', '.35em')
    .style('text-anchor', function(d) { return d.geometry.coordinates[0] > -1 ? 'start' : 'end'; })
    .text(function(d) { return d.properties.name; });
  d3.json('data/drones.json', function(error, json) {
    dataset = json.strike
    yemen.selectAll('circle')
      .data(dataset).enter()
      .append('circle')
      .attr('class', 'strike')
      .attr('id', function(d) { return 'uid' + d.number })
      .attr('injuries', function(d) { if (d.country == 'Yemen' && getIntegerFromString(d['injuries'], 'average') > 0) { return 'yes' } else { return 'none' } })
      .attr('deaths', function(d) { if (d.country == 'Yemen' && getIntegerFromString(d['deaths'], 'average') > 0) { return 'yes' } else { return 'none' } })
      .attr('civilians', function(d) { if (d.country == 'Yemen' && getIntegerFromString(d['civilians'], 'average') > 0) { return 'yes' } else { return 'none' } })
      .attr('children', function(d) { if (d.country == 'Yemen' && getIntegerFromString(d['children'], 'average') > 0) { return 'yes' } else { return 'none' } })
      .attr('r', 3)
      .attr('transform', function(d) { return 'translate(' + projectionYemen([d.lon, d.lat]) + ')' } );
    yemen.selectAll('circle[deaths = none]').remove();
  });
});
