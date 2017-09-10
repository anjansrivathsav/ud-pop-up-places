
function initMap() {

// initializing the map with latitude and longitude positions
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 17.9948584, lng: 79.580594},
    zoom: 13
  });

 // adding the bounds
  var bounds = new google.maps.LatLngBounds();

  // initializing the window
  var largeInfoWindow = new google.maps.InfoWindow();

// adding the good places in the warangal to the locations with latitude and longitudes
  var locations = [
    {title: 'Bhadrakali temple', location: {lat: 17.9948584, lng: 79.580594}, index: 0},
    {title: 's2 cinemas hall', location: {lat: 17.9761984, lng: 79.5983978}, index: 1},
    {title: 'Thousand pillar temple', location: {lat: 18.0037375, lng: 79.572564}, index: 2},
    {
      title: 'Mc donalds', location: {lat: 17.9962034, lng: 79.5485788}, index: 3
    },
    {
      title: 'Nit warangal', location: {lat: 17.9837335, lng: 79.5277655}, index: 4
    }];

//empty markers is created
  var markers = [];

  // adding the markerslist to the various positions
  function initMarkers() {
    // adding the markers
    for (var i = 0; i < locations.length; i++) {
      var marker = new google.maps.Marker({
        position: locations[i].location,
        map: map,
        title: locations[i].title,
        animation: google.maps.Animation.DROP,
        id: i
      });

      markers.push(marker);

      bounds.extend(marker.position);


      marker.addListener('click', function () {
          populateInfoWindow(this, largeInfoWindow);
      });
    }


    map.fitBounds(bounds);
  }

function refresh(markerList) {
    hide(markers);
    markerList().forEach(function (data) {
      markers[data.index].setMap(map);
    });
  }
  function hide(value) {
    for (var i = 0; i < value.length; i++) {
      value[i].setMap(null);
    }
  }

  function showwindow(markerIndex) {
    populateInfoWindow(markers[markerIndex], largeInfoWindow);
  }




  function populateInfoWindow(marker, infowindow) {

    if (infowindow.marker != marker) {
      infowindow.marker = marker;

      addLocationInfo(marker, infowindow);
      infowindow.open(map, marker);

      infowindow.addListener('closeclick', function () {
        infowindow.setMarker = null;
      });


    }
  }

  // fetching the data from foursquareapi  and adding it to the content
  function addLocationInfo(marker, infowindow) {

    var url = 'https://api.foursquare.com/v2/venues/search?v=20161016';
	url += '&client_id=' + 'ZTT1YZTZEOIQLVVFIFNI3IHNNERWZTS045E0X3GHWT0DWUIB';
	url += '&client_secret=' + 'NPB5KF0UWH555SGMJZWGR4HMHAJJWHPLCK2Q2ZUTTAVTZEMP';
	url += '&ll=' + marker.getPosition().lat() + ',' + marker.getPosition().lng();
	url += '&query=' + marker.title;

    // ajax request for the data to add in the content
    $.getJSON(url, function (data) {

      var place = data.response.venues[0];
      var markerdata = '<b><u>' + marker.title + '</u></b><br>';

// adding the various feilds to the content
        markerdata += '<u><b>Category:</b></u>' + place.categories[0].name + '<br>';

        markerdata += '<u><b>Address:</b></u>';

        markerdata += place.location.address + '<br>';


      markerdata += place.location.city + ',' + place.location.country;

      infowindow.setContent(markerdata);

    })
      .fail(function () {//Called when request fails
        infowindow.setContent("Error Loading Details");
      });

  }

  function MarkerListViewModel() {
    var self = this;

    self.list = ko.observable('');

    // initiallizing the list of markers
    self.markerList = locations;

    //filtered based on the value input
    self.markers = ko.computed(function () {
      var filter = self.list();
      if (filter === '') {
        return self.markerList;
      } else {
        var temp = self.markerList.slice();
        return temp.filter(function (marker) {
          return marker.title.toLowerCase().indexOf(filter.toLowerCase()) > -1;
        });
      function hide(tempList) {
    for (var i = 0; i < tempList.length; i++) {

      markers_l[i].setMap(null);

    }

  }

      }
    });

     self.refresh= function () {
      refresh(self.markers);
    };


    self.itemClicked = function (markerIndex) {
      showwindow(markerIndex);
    };
  }


  $(document).ready(function () {
    // initializing the markers
    initMarkers();

    var MLVM = new MarkerListViewModel();
    ko.applyBindings(MLVM);

     MLVM.list.subscribe(function () {
      MLVM.refresh();
    });

    $('.sidebar-toggle').click(function () {
      $('.option-box').toggleClass('opt-hide');
    });
  });
}

// error to load the map
mapLoadError = function() {
  alert('Google maps failed to load ');
};