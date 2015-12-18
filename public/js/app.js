$(document).foundation();

Parse.initialize("xfMgYWfJOTbqqSkeiMRlVZxW1xDE5X2yLNMeWnJj", "P9kIWs1glJqeyqemuZGQvElVtrL9337O49lvLFjy");	

var Checklist = Parse.Object.extend("Checklist");
var checklist = new Checklist();
var autocomplete;

$("form").submit(function(e){
	e.preventDefault();
  //Verifica se endereço está vazio
  
  var local = new Parse.GeoPoint({latitude: map.getCenter().lat(), longitude: map.getCenter().lng()});
  if(!primeiraVezClickMapa){
    var respostas = {};
    // Obtém todas as respostas e insere no dicionário respostas
    var peloMenosUmTrue = false;
    $("input[type=checkbox]").each(function(i,obj){
      respostas[obj.id] = obj.checked;
      if(obj.checked){
        peloMenosUmTrue = true;
      }
    });
    respostas['local'] = local;

    if(peloMenosUmTrue){
      //Salvar as respostas no BD do Parse como Objeto "Checklist"
      checklist.save(respostas).then(function(object){
        alert("Muito Obrigado! Suas respostas foram salvas");
        window.location.replace("/mapa.html");
      });
    }else{
      alert("Por favor, preencha o formulário");
    }
    
  }else{
    alert("Por favor, marque no mapa o local vistoriado");
  }
});

var enderecoInput = $("#endereco");
var enderecoBuscado = false;
//Define um listener para o click no input endereço para que seja obtida
//a localização atual da pessoa
enderecoInput.click(function(){
  if(!enderecoBuscado){
    enderecoBuscado = true;
    getLocation();
  }
});

//Função para obter a localização da pessoa pelo HTML5 e então converter
//as coordenadas em um endereço
function getLocation(){
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var coordenadas = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      enderecoInput.data("lat", coordenadas.lat);
      enderecoInput.data("lng", coordenadas.lng);

      var geocoder = new google.maps.Geocoder;
      geocoder.geocode({'location': coordenadas}, function(results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
          if (results[0]) {
            enderecoInput.val(results[0].formatted_address);
          }
        }
      });
    }, function() {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  }
}

var primeiraVezClickMapa = true;

function initMapaEscolherLocal(){
  var mapOptions = {
    center: {lat: -15.3795415, lng: -58.3551554},
    scrollwheel: false,
    zoom: 4,
    mapTypeControl: false,
    streetViewControl: false,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  map = new google.maps.Map(document.getElementById('mapaEscolherLocal'), mapOptions);

  $("#mapaEscolherLocal").mousedown(function(){
    if(primeiraVezClickMapa){
      // Try HTML5 geolocation.
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          var pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          map.setZoom(17);
          map.setCenter(pos);
        }, function() {
          handleLocationError(true, infoWindow, map.getCenter());
        });
      } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }
  primeiraVezClickMapa = false;
}
});
}

function initMap() {
  // Specify features and elements to define styles.
  var styleArray = [
  {
    "featureType": "administrative",
    "elementType": "labels.text.fill",
    "stylers": [
    {
      "color": "#444444"
    }
    ]
  },
  {
    "featureType": "landscape",
    "elementType": "all",
    "stylers": [
    {
      "color": "#f2f2f2"
    }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "all",
    "stylers": [
    {
      "visibility": "off"
    }
    ]
  },
  {
    "featureType": "poi.business",
    "elementType": "geometry.fill",
    "stylers": [
    {
      "visibility": "on"
    }
    ]
  },
  {
    "featureType": "road",
    "elementType": "all",
    "stylers": [
    {
      "saturation": -100
    },
    {
      "lightness": 45
    }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "all",
    "stylers": [
    {
      "visibility": "simplified"
    }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "labels.icon",
    "stylers": [
    {
      "visibility": "off"
    }
    ]
  },
  {
    "featureType": "transit",
    "elementType": "all",
    "stylers": [
    {
      "visibility": "off"
    }
    ]
  },
  {
    "featureType": "water",
    "elementType": "all",
    "stylers": [
    {
      "color": "#b4d4e1"
    },
    {
      "visibility": "on"
    }
    ]
  }
  ];

  var map = new google.maps.Map(document.getElementById('mapa'), {
    center: {lat: -15.3795415, lng: -58.3551554},
    zoom: 4,
    mapTypeControl: false,
    streetViewControl: false,
    styles: styleArray
  });

  var Checklist = Parse.Object.extend("Checklist");
  var query = new Parse.Query(Checklist);
  query.find({
    success: function(results) {
      // Do something with the returned Parse.Object values
      
      var circle = {
          path: google.maps.SymbolPath.CIRCLE,
          fillOpacity: 0.8,
          fillColor: "green",
          strokeOpacity: 1.0,
          strokeColor: "green",
          strokeWeight: 1.0,
          scale: 5.0
      };     
      for (var i = 0; i < results.length; i++) {
        var object = results[i];
        var coord = object.get("local");
        console.log(coord);
        var local = {lat: coord.latitude,lng: coord.longitude}
        var newCircle = new google.maps.Marker({
          icon: circle,
          position: local
        });
        newCircle.setMap(map);
      }
    },
    error: function(error) {
      alert("Error: " + error.code + " " + error.message);
    }
  });
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
    'Error: The Geolocation service failed.' :
    'Error: Your browser doesn\'t support geolocation.');
}	

