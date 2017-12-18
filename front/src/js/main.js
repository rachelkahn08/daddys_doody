var MapModule = (function() {
  var map,
      service,
      infowindow;

  var totalProcessed = 0;

  var app = {};
  app.status = {
    ready: 0,
    searching: 0,
    processing: 0,
    sorting: 0,
  }

  var shared = {},
      nearbyLocations = {
        'all': [],
      };

  var typesOfPlaces = ['store', 'gym', 'local_government_office', 'movie_theater', 'museum', 'park', 'restaurant', 'store', 'zoom', 'gym', 'church', 'cafe', 'bank', 'aquarium', 'gas_station', 'laundry', 'mosque', 'synagogue', 'transit_station', 'establishment', 'food', 'place_of_worship', ];

  // initialize map centered on user location 

  function getLocation() {

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
              var latitude = parseInt(position.coords.latitude),
                  longitude = parseInt(position.coords.longitude);

              position = {
                lat: latitude,
                lng: longitude,
              };

              console.log(position);

              initMap(position);

          }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, map.getCenter());
    }
  }

  function initMap(pos) {

    map = new google.maps.Map(document.getElementById('map'), {
         center: pos,
         zoom: 15,
    });

    // infoWindow = new google.maps.InfoWindow;
    // infoWindow.setPosition(pos);
    // infoWindow.setContent('');
    // infoWindow.open(map);

    // google.maps.event.addListenerOnce(map, 'tilesloaded', function() {
    //   AnimationsModule.hideLoader();
    // });

    service = new google.maps.places.PlacesService(map);
    
    app.status.searching = true;

    for (var i = 0; i < typesOfPlaces.length + 1; i++) {
      var request = {
        location: pos,
        radius: '10000',
        type: typesOfPlaces[i]
      };
      
      if (i == typesOfPlaces.length) {
        app.status.searching = false;
       
      } else if (i < typesOfPlaces.length) {
        service.nearbySearch(request, processSearchResults);
      }
    } 
  }

  function processSearchResults(results, status) {

    if (status == google.maps.places.PlacesServiceStatus.OK) {
      app.status.processing = true;

      for (var i = 0; i < results.length + 1; i++) {
        
        if (i == results.length) {
          app.status.processing = false;
          
            // ServerModule.init(nearbyLocations.all);
        } else if (i < results.length) {
          var place = results[i];
          nearbyLocations.all.push(results[i]);
          categorizeResults(results[i]);
        } 
      }
    }
  }

  function categorizeResults(result) {
    app.status.sorting= true;
    AnimationsModule.hideLoader();
    addMarkers(result);

    for (var i = 0; i < result.types.length; i++) {

      if (i == result.types.length) {

          if (!app.status.searching && !app.status.processing && !app.status.sorting) {
            // ServerModule.init(locations.all);
            
          }
      } else if (i < result.types.length) {
        var resultType = result.types[i];

        if ( !nearbyLocations[resultType] ) {
          nearbyLocations[resultType] = [];
          nearbyLocations[resultType].push(result);
        } else if ( !nearbyLocations[resultType].includes(result) ) {
            nearbyLocations[resultType].push(result);
        }
      } 
    }
    
  }

  function addMarkers(place) {

      var marker = new google.maps.Marker({
        position: new google.maps.LatLng(place[1], place[2]),
        map: map
      });

      google.maps.event.addListener(marker, 'click', (function (marker) {
        return function () {
          infowindow.setContent(place.name);
          infowindow.open(map, marker);
        }
      })(marker));
  }

  function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
  }

  shared.initModule = function() {
    getLocation();
  }

  return shared;
}());

var InteractionsModule = (function() {
  var shared = {};

  

  return shared;
}());

var ServerModule = (function() {
  var shared = {};

  shared.getLocations = function(query) {
      $.ajax({
        url: 'http://localhost:1357/' + query.url,
        type: 'GET',
        dataType: 'json',
        data: query.data,
        success: function(response) {
          console.log(response);
        },
        error: function(response) {
          console.log('error!!!!' + response);
        }
      });
  }


  shared.init = function(data) {
    console.log(data);
    console.log('server init');
  }

  return shared;
}());

var AnimationsModule = (function() {
  var shared = {};
  var loaderBars = waitingIcon.children;
  var loaderAnimation;
  var loaderPaused;

  shared.startLoader = function() {
    loaderAnimation = new TimelineMax;

    loaderAnimation.staggerFrom(loaderBars, 1.4, {
        opacity: 1,
        repeat: -1,
        repeatDelay: 0.1,
        ease: Linear.easeNone,
        startAt: {opacity: 0},
    }, 0.1);
  }

  shared.hideLoader = function() {
      var pause = new TweenMax.to(waitingMask, 0.1, {
      opacity: 0,
      onComplete: function() {
        loaderAnimation.paused(true);
        waitingMask.style.display = 'none';
      },
    });
  }


  return shared;

}());

window.onload = function() {
  AnimationsModule.startLoader();
  MapModule.initModule(); 
}
 
/*
WHAT NEEDS TO HAPPEN
1) load maps api:
  a) create map
  b) populate with nearby locations
  c) compare to mongodb for locations that have been marked
  d) apply marker icons depending on true, false, undefined
2) query mysql db
  a) narrow search by distance


*/