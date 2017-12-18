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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIE1hcE1vZHVsZSA9IChmdW5jdGlvbigpIHtcbiAgdmFyIG1hcCxcbiAgICAgIHNlcnZpY2UsXG4gICAgICBpbmZvd2luZG93O1xuXG4gIHZhciB0b3RhbFByb2Nlc3NlZCA9IDA7XG5cbiAgdmFyIGFwcCA9IHt9O1xuICBhcHAuc3RhdHVzID0ge1xuICAgIHJlYWR5OiAwLFxuICAgIHNlYXJjaGluZzogMCxcbiAgICBwcm9jZXNzaW5nOiAwLFxuICAgIHNvcnRpbmc6IDAsXG4gIH1cblxuICB2YXIgc2hhcmVkID0ge30sXG4gICAgICBuZWFyYnlMb2NhdGlvbnMgPSB7XG4gICAgICAgICdhbGwnOiBbXSxcbiAgICAgIH07XG5cbiAgdmFyIHR5cGVzT2ZQbGFjZXMgPSBbJ3N0b3JlJywgJ2d5bScsICdsb2NhbF9nb3Zlcm5tZW50X29mZmljZScsICdtb3ZpZV90aGVhdGVyJywgJ211c2V1bScsICdwYXJrJywgJ3Jlc3RhdXJhbnQnLCAnc3RvcmUnLCAnem9vbScsICdneW0nLCAnY2h1cmNoJywgJ2NhZmUnLCAnYmFuaycsICdhcXVhcml1bScsICdnYXNfc3RhdGlvbicsICdsYXVuZHJ5JywgJ21vc3F1ZScsICdzeW5hZ29ndWUnLCAndHJhbnNpdF9zdGF0aW9uJywgJ2VzdGFibGlzaG1lbnQnLCAnZm9vZCcsICdwbGFjZV9vZl93b3JzaGlwJywgXTtcblxuICAvLyBpbml0aWFsaXplIG1hcCBjZW50ZXJlZCBvbiB1c2VyIGxvY2F0aW9uIFxuXG4gIGZ1bmN0aW9uIGdldExvY2F0aW9uKCkge1xuXG4gICAgLy8gVHJ5IEhUTUw1IGdlb2xvY2F0aW9uLlxuICAgIGlmIChuYXZpZ2F0b3IuZ2VvbG9jYXRpb24pIHtcbiAgICAgICAgICBuYXZpZ2F0b3IuZ2VvbG9jYXRpb24uZ2V0Q3VycmVudFBvc2l0aW9uKGZ1bmN0aW9uKHBvc2l0aW9uKSB7XG4gICAgICAgICAgICAgIHZhciBsYXRpdHVkZSA9IHBhcnNlSW50KHBvc2l0aW9uLmNvb3Jkcy5sYXRpdHVkZSksXG4gICAgICAgICAgICAgICAgICBsb25naXR1ZGUgPSBwYXJzZUludChwb3NpdGlvbi5jb29yZHMubG9uZ2l0dWRlKTtcblxuICAgICAgICAgICAgICBwb3NpdGlvbiA9IHtcbiAgICAgICAgICAgICAgICBsYXQ6IGxhdGl0dWRlLFxuICAgICAgICAgICAgICAgIGxuZzogbG9uZ2l0dWRlLFxuICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKHBvc2l0aW9uKTtcblxuICAgICAgICAgICAgICBpbml0TWFwKHBvc2l0aW9uKTtcblxuICAgICAgICAgIH0sIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaGFuZGxlTG9jYXRpb25FcnJvcih0cnVlLCBpbmZvV2luZG93LCBtYXAuZ2V0Q2VudGVyKCkpO1xuICAgICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gQnJvd3NlciBkb2Vzbid0IHN1cHBvcnQgR2VvbG9jYXRpb25cbiAgICAgIGhhbmRsZUxvY2F0aW9uRXJyb3IoZmFsc2UsIGluZm9XaW5kb3csIG1hcC5nZXRDZW50ZXIoKSk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gaW5pdE1hcChwb3MpIHtcblxuICAgIG1hcCA9IG5ldyBnb29nbGUubWFwcy5NYXAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21hcCcpLCB7XG4gICAgICAgICBjZW50ZXI6IHBvcyxcbiAgICAgICAgIHpvb206IDE1LFxuICAgIH0pO1xuXG4gICAgLy8gaW5mb1dpbmRvdyA9IG5ldyBnb29nbGUubWFwcy5JbmZvV2luZG93O1xuICAgIC8vIGluZm9XaW5kb3cuc2V0UG9zaXRpb24ocG9zKTtcbiAgICAvLyBpbmZvV2luZG93LnNldENvbnRlbnQoJycpO1xuICAgIC8vIGluZm9XaW5kb3cub3BlbihtYXApO1xuXG4gICAgLy8gZ29vZ2xlLm1hcHMuZXZlbnQuYWRkTGlzdGVuZXJPbmNlKG1hcCwgJ3RpbGVzbG9hZGVkJywgZnVuY3Rpb24oKSB7XG4gICAgLy8gICBBbmltYXRpb25zTW9kdWxlLmhpZGVMb2FkZXIoKTtcbiAgICAvLyB9KTtcblxuICAgIHNlcnZpY2UgPSBuZXcgZ29vZ2xlLm1hcHMucGxhY2VzLlBsYWNlc1NlcnZpY2UobWFwKTtcbiAgICBcbiAgICBhcHAuc3RhdHVzLnNlYXJjaGluZyA9IHRydWU7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHR5cGVzT2ZQbGFjZXMubGVuZ3RoICsgMTsgaSsrKSB7XG4gICAgICB2YXIgcmVxdWVzdCA9IHtcbiAgICAgICAgbG9jYXRpb246IHBvcyxcbiAgICAgICAgcmFkaXVzOiAnMTAwMDAnLFxuICAgICAgICB0eXBlOiB0eXBlc09mUGxhY2VzW2ldXG4gICAgICB9O1xuICAgICAgXG4gICAgICBpZiAoaSA9PSB0eXBlc09mUGxhY2VzLmxlbmd0aCkge1xuICAgICAgICBhcHAuc3RhdHVzLnNlYXJjaGluZyA9IGZhbHNlO1xuICAgICAgIFxuICAgICAgfSBlbHNlIGlmIChpIDwgdHlwZXNPZlBsYWNlcy5sZW5ndGgpIHtcbiAgICAgICAgc2VydmljZS5uZWFyYnlTZWFyY2gocmVxdWVzdCwgcHJvY2Vzc1NlYXJjaFJlc3VsdHMpO1xuICAgICAgfVxuICAgIH0gXG4gIH1cblxuICBmdW5jdGlvbiBwcm9jZXNzU2VhcmNoUmVzdWx0cyhyZXN1bHRzLCBzdGF0dXMpIHtcblxuICAgIGlmIChzdGF0dXMgPT0gZ29vZ2xlLm1hcHMucGxhY2VzLlBsYWNlc1NlcnZpY2VTdGF0dXMuT0spIHtcbiAgICAgIGFwcC5zdGF0dXMucHJvY2Vzc2luZyA9IHRydWU7XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmVzdWx0cy5sZW5ndGggKyAxOyBpKyspIHtcbiAgICAgICAgXG4gICAgICAgIGlmIChpID09IHJlc3VsdHMubGVuZ3RoKSB7XG4gICAgICAgICAgYXBwLnN0YXR1cy5wcm9jZXNzaW5nID0gZmFsc2U7XG4gICAgICAgICAgXG4gICAgICAgICAgICAvLyBTZXJ2ZXJNb2R1bGUuaW5pdChuZWFyYnlMb2NhdGlvbnMuYWxsKTtcbiAgICAgICAgfSBlbHNlIGlmIChpIDwgcmVzdWx0cy5sZW5ndGgpIHtcbiAgICAgICAgICB2YXIgcGxhY2UgPSByZXN1bHRzW2ldO1xuICAgICAgICAgIG5lYXJieUxvY2F0aW9ucy5hbGwucHVzaChyZXN1bHRzW2ldKTtcbiAgICAgICAgICBjYXRlZ29yaXplUmVzdWx0cyhyZXN1bHRzW2ldKTtcbiAgICAgICAgfSBcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBjYXRlZ29yaXplUmVzdWx0cyhyZXN1bHQpIHtcbiAgICBhcHAuc3RhdHVzLnNvcnRpbmc9IHRydWU7XG4gICAgQW5pbWF0aW9uc01vZHVsZS5oaWRlTG9hZGVyKCk7XG4gICAgYWRkTWFya2VycyhyZXN1bHQpO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCByZXN1bHQudHlwZXMubGVuZ3RoOyBpKyspIHtcblxuICAgICAgaWYgKGkgPT0gcmVzdWx0LnR5cGVzLmxlbmd0aCkge1xuXG4gICAgICAgICAgaWYgKCFhcHAuc3RhdHVzLnNlYXJjaGluZyAmJiAhYXBwLnN0YXR1cy5wcm9jZXNzaW5nICYmICFhcHAuc3RhdHVzLnNvcnRpbmcpIHtcbiAgICAgICAgICAgIC8vIFNlcnZlck1vZHVsZS5pbml0KGxvY2F0aW9ucy5hbGwpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChpIDwgcmVzdWx0LnR5cGVzLmxlbmd0aCkge1xuICAgICAgICB2YXIgcmVzdWx0VHlwZSA9IHJlc3VsdC50eXBlc1tpXTtcblxuICAgICAgICBpZiAoICFuZWFyYnlMb2NhdGlvbnNbcmVzdWx0VHlwZV0gKSB7XG4gICAgICAgICAgbmVhcmJ5TG9jYXRpb25zW3Jlc3VsdFR5cGVdID0gW107XG4gICAgICAgICAgbmVhcmJ5TG9jYXRpb25zW3Jlc3VsdFR5cGVdLnB1c2gocmVzdWx0KTtcbiAgICAgICAgfSBlbHNlIGlmICggIW5lYXJieUxvY2F0aW9uc1tyZXN1bHRUeXBlXS5pbmNsdWRlcyhyZXN1bHQpICkge1xuICAgICAgICAgICAgbmVhcmJ5TG9jYXRpb25zW3Jlc3VsdFR5cGVdLnB1c2gocmVzdWx0KTtcbiAgICAgICAgfVxuICAgICAgfSBcbiAgICB9XG4gICAgXG4gIH1cblxuICBmdW5jdGlvbiBhZGRNYXJrZXJzKHBsYWNlKSB7XG5cbiAgICAgIHZhciBtYXJrZXIgPSBuZXcgZ29vZ2xlLm1hcHMuTWFya2VyKHtcbiAgICAgICAgcG9zaXRpb246IG5ldyBnb29nbGUubWFwcy5MYXRMbmcocGxhY2VbMV0sIHBsYWNlWzJdKSxcbiAgICAgICAgbWFwOiBtYXBcbiAgICAgIH0pO1xuXG4gICAgICBnb29nbGUubWFwcy5ldmVudC5hZGRMaXN0ZW5lcihtYXJrZXIsICdjbGljaycsIChmdW5jdGlvbiAobWFya2VyKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgaW5mb3dpbmRvdy5zZXRDb250ZW50KHBsYWNlLm5hbWUpO1xuICAgICAgICAgIGluZm93aW5kb3cub3BlbihtYXAsIG1hcmtlcik7XG4gICAgICAgIH1cbiAgICAgIH0pKG1hcmtlcikpO1xuICB9XG5cbiAgZnVuY3Rpb24gaGFuZGxlTG9jYXRpb25FcnJvcihicm93c2VySGFzR2VvbG9jYXRpb24sIGluZm9XaW5kb3csIHBvcykge1xuICAgIGluZm9XaW5kb3cuc2V0UG9zaXRpb24ocG9zKTtcbiAgICBpbmZvV2luZG93LnNldENvbnRlbnQoYnJvd3Nlckhhc0dlb2xvY2F0aW9uID9cbiAgICAgICAgJ0Vycm9yOiBUaGUgR2VvbG9jYXRpb24gc2VydmljZSBmYWlsZWQuJyA6XG4gICAgICAgICdFcnJvcjogWW91ciBicm93c2VyIGRvZXNuXFwndCBzdXBwb3J0IGdlb2xvY2F0aW9uLicpO1xuICAgIGluZm9XaW5kb3cub3BlbihtYXApO1xuICB9XG5cbiAgc2hhcmVkLmluaXRNb2R1bGUgPSBmdW5jdGlvbigpIHtcbiAgICBnZXRMb2NhdGlvbigpO1xuICB9XG5cbiAgcmV0dXJuIHNoYXJlZDtcbn0oKSk7XG5cbnZhciBJbnRlcmFjdGlvbnNNb2R1bGUgPSAoZnVuY3Rpb24oKSB7XG4gIHZhciBzaGFyZWQgPSB7fTtcblxuICBcblxuICByZXR1cm4gc2hhcmVkO1xufSgpKTtcblxudmFyIFNlcnZlck1vZHVsZSA9IChmdW5jdGlvbigpIHtcbiAgdmFyIHNoYXJlZCA9IHt9O1xuXG4gIHNoYXJlZC5nZXRMb2NhdGlvbnMgPSBmdW5jdGlvbihxdWVyeSkge1xuICAgICAgJC5hamF4KHtcbiAgICAgICAgdXJsOiAnaHR0cDovL2xvY2FsaG9zdDoxMzU3LycgKyBxdWVyeS51cmwsXG4gICAgICAgIHR5cGU6ICdHRVQnLFxuICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxuICAgICAgICBkYXRhOiBxdWVyeS5kYXRhLFxuICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcbiAgICAgICAgfSxcbiAgICAgICAgZXJyb3I6IGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ2Vycm9yISEhIScgKyByZXNwb25zZSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICB9XG5cblxuICBzaGFyZWQuaW5pdCA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICBjb25zb2xlLmxvZyhkYXRhKTtcbiAgICBjb25zb2xlLmxvZygnc2VydmVyIGluaXQnKTtcbiAgfVxuXG4gIHJldHVybiBzaGFyZWQ7XG59KCkpO1xuXG52YXIgQW5pbWF0aW9uc01vZHVsZSA9IChmdW5jdGlvbigpIHtcbiAgdmFyIHNoYXJlZCA9IHt9O1xuICB2YXIgbG9hZGVyQmFycyA9IHdhaXRpbmdJY29uLmNoaWxkcmVuO1xuICB2YXIgbG9hZGVyQW5pbWF0aW9uO1xuICB2YXIgbG9hZGVyUGF1c2VkO1xuXG4gIHNoYXJlZC5zdGFydExvYWRlciA9IGZ1bmN0aW9uKCkge1xuICAgIGxvYWRlckFuaW1hdGlvbiA9IG5ldyBUaW1lbGluZU1heDtcblxuICAgIGxvYWRlckFuaW1hdGlvbi5zdGFnZ2VyRnJvbShsb2FkZXJCYXJzLCAxLjQsIHtcbiAgICAgICAgb3BhY2l0eTogMSxcbiAgICAgICAgcmVwZWF0OiAtMSxcbiAgICAgICAgcmVwZWF0RGVsYXk6IDAuMSxcbiAgICAgICAgZWFzZTogTGluZWFyLmVhc2VOb25lLFxuICAgICAgICBzdGFydEF0OiB7b3BhY2l0eTogMH0sXG4gICAgfSwgMC4xKTtcbiAgfVxuXG4gIHNoYXJlZC5oaWRlTG9hZGVyID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgcGF1c2UgPSBuZXcgVHdlZW5NYXgudG8od2FpdGluZ01hc2ssIDAuMSwge1xuICAgICAgb3BhY2l0eTogMCxcbiAgICAgIG9uQ29tcGxldGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICBsb2FkZXJBbmltYXRpb24ucGF1c2VkKHRydWUpO1xuICAgICAgICB3YWl0aW5nTWFzay5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgfSxcbiAgICB9KTtcbiAgfVxuXG5cbiAgcmV0dXJuIHNoYXJlZDtcblxufSgpKTtcblxud2luZG93Lm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICBBbmltYXRpb25zTW9kdWxlLnN0YXJ0TG9hZGVyKCk7XG4gIE1hcE1vZHVsZS5pbml0TW9kdWxlKCk7IFxufVxuIFxuLypcbldIQVQgTkVFRFMgVE8gSEFQUEVOXG4xKSBsb2FkIG1hcHMgYXBpOlxuICBhKSBjcmVhdGUgbWFwXG4gIGIpIHBvcHVsYXRlIHdpdGggbmVhcmJ5IGxvY2F0aW9uc1xuICBjKSBjb21wYXJlIHRvIG1vbmdvZGIgZm9yIGxvY2F0aW9ucyB0aGF0IGhhdmUgYmVlbiBtYXJrZWRcbiAgZCkgYXBwbHkgbWFya2VyIGljb25zIGRlcGVuZGluZyBvbiB0cnVlLCBmYWxzZSwgdW5kZWZpbmVkXG4yKSBxdWVyeSBteXNxbCBkYlxuICBhKSBuYXJyb3cgc2VhcmNoIGJ5IGRpc3RhbmNlXG5cblxuKi8iXX0=
