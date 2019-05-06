//= require "country_code"

var xmlhttp = new XMLHttpRequest();
var url = "https://api.datacite.org/providers?page[size]=250";

xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        formatMembers(xmlhttp.responseText);
    }
};
xmlhttp.open("GET", url, true);
xmlhttp.send();

function humanize(str) {
  var words = str.match(/[A-Za-z][a-z]*/g) || [];

  return words.map(capitalize).join(" ");
}

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.substring(1);
}

function formatMembers(response) {
  var response = JSON.parse(response);
  var div = document.getElementById('memberslist');

  // response.meta.total;

  for (var i in response.data) {
    // don't show DataCite providers or members with missing logo
    if (["DATACITE", "DEMO", "SML"].includes(response.data[i].id.toUpperCase())) {
      continue;
    }

    if (response.data[i].attributes.country == null){
      country = '-';
    }
    else {
      country = getCountryName(response.data[i].attributes.country);
    }

    if (response.data[i].attributes.organizationType == null){
      orgType = '-';
    }
    else {
      orgType = humanize(response.data[i].attributes.organizationType);
    }

    if (response.data[i].attributes.focusArea == null){
      area = '-';
    }
    else {
      area = humanize(response.data[i].attributes.focusArea);
    }

    if (response.data[i].attributes.name == null){
      title = '-';
    }
    else {
      title = response.data[i].attributes.name;
    }

    if (response.data[i].attributes.website == null){
      website = 'Website N/A';
    }
    else {
      website = '<a href="' + response.data[i].attributes.website + '">' + response.data[i].attributes.website + '</a>';
    }

    if (response.data[i].attributes.logoUrl == null){
      image = '';
    }
    else {
      image = '<img style=\"height:100px\" src=\"' + response.data[i].attributes.logoUrl + '\"/>';
    }

    div.innerHTML +=
    '<div class=\"row thumbnail svc-item\">' +
      '<div class="col-md-3">' +
        image +
      '</div>' +
      '<div class="col-md-9 stakeholderdescription">' +
        '<h3>' + title + '</h3>' +
        '<div class=\"row\">' +
          '<div class="col-md-2"><strong>Country:</strong> ' +
            country +
          '</div>' +
          '<div class="col-md-3"><strong>Org Type:</strong> ' +
            orgType +
          '</div>' +
          '<div class="col-md-3"><strong>Focus Area:</strong> ' +
            area +
          '</div>' +
          '<div class="col-md-4"><strong>Website:</strong> ' +
            website +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>'
    ;
  }
}
