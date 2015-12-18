$(document).foundation();

Parse.initialize("xfMgYWfJOTbqqSkeiMRlVZxW1xDE5X2yLNMeWnJj", "P9kIWs1glJqeyqemuZGQvElVtrL9337O49lvLFjy");	
// var TestObject = Parse.Object.extend("TestObject");
// var testObject = new TestObject();
// testObject.save({foo: "bar"}).then(function(object) {
//   alert("yay! it worked");
// });

var Checklist = Parse.Object.extend("Checklist");
var checklist = new Checklist();
var autocomplete;

$("form").submit(function(e){
	e.preventDefault();
  //Verifica se endereço está vazio
  if(!$("#endereco").val()){
    alert("Por gentileza, preencha o campo endereço");
  }else{
    var place = autocomplete.getPlace();
    var possibleStreetNumber = place['address_components'][0];
    if(possibleStreetNumber['types'][0] == "street_number" || enderecoInput.data("lat")){
      var respostas = {};
      // Obtém todas as respostas e insere no dicionário respostas
      $("input[type=checkbox]").each(function(i,obj){
         respostas[obj.id] = obj.checked;
      });
      
      //Salvar as respostas no BD do Parse como Objeto "Checklist"
      // checklist.save(respostas).then(function(object){
      //     alert("Muito Obrigado! Suas respostas foram salvas");
      // });
    }else{
      alert("O endereço parece incompleto. Lembre-se de inserir o número");
    }

    
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

function initAutocomplete() {
  // Create the autocomplete object, restricting the search to geographical
  // location types.
  autocomplete = new google.maps.places.Autocomplete(
      (document.getElementById('endereco')),
      {types: ['geocode']});

  // When the user selects an address from the dropdown, populate the address
  // fields in the form.
  //autocomplete.addListener('place_changed', atualizarCoordenadas);
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

  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -15.3795415, lng: -58.3551554},
    scrollwheel: false,
    zoom: 4,
    mapTypeControl: false,
    streetViewControl: false,
    styles: styleArray
  });

  var infoWindow = new google.maps.InfoWindow({map: map});

  // Try HTML5 geolocation.
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      infoWindow.setPosition(pos);
      infoWindow.setContent('Location found.');
      map.setCenter(pos);
    }, function() {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
                        'Error: The Geolocation service failed.' :
                        'Error: Your browser doesn\'t support geolocation.');
}	

