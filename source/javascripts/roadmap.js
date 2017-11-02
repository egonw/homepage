/*global d3 */

// construct query string
var api_url = 'https://api.datacite.org';
var github_url = 'https://github.com/datacite/datacite';
var query_url = encodeURI(api_url + "/milestones");

// load the data from the DataCite API
if (query_url) {
  d3.json(query_url)
    .get(function(error, json) {
      if (error) { return console.warn(error); }

      var data = d3.nest()
        .key(function(d) { return d.attributes.year + ' Q' + d.attributes.quarter; })
        .entries(json.data);

      roadmapResult(data);
  });
}

// add milestones to page
function roadmapResult(data) {

  if (typeof data === "undefined" || data.length === 0) {
    d3.select("#content").append("h1")
      .attr("class", "alert alert-info")
      .text("No milestones found.");
    return;
  }

  for (var i=0; i<data.length; i++) {
    var quarter = data[i];

    d3.select("#content").append("h1")
      .text(quarter.key);

    for (var j=0; j<quarter.values.length; j++) {
      var milestone = quarter.values[j]

      if (milestone.attributes.released !== null) {
        d3.select("#content").append("h3")
          .attr("class", "milestone")
          .attr("id", "milestone-" + milestone.id)
          .append("a")
          .attr("href", function() { return encodeURI(github_url + "/milestone/" + milestone.id); })
          .html(milestone.attributes.title + ' <span class="label label-released small">Released ' + formattedDate(milestone.attributes.released.substring(0, 10)) + '</span>');

        d3.select("#content").append("div")
          .attr("class", "released")
          .html(milestone.attributes.description);
      } else {
        d3.select("#content").append("h3")
          .attr("class", "milestone")
          .attr("id", "milestone-" + milestone.id)
          .append("a")
          .attr("href", function() { return encodeURI(github_url + "/milestone/" + milestone.id); })
          .html(milestone.attributes.title);

        d3.select("#content").append("div")
          .html(milestone.attributes.description);
      }
    }
  }
}
