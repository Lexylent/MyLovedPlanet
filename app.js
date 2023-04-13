// Laden der Daten aus Local Storage
var places = JSON.parse(localStorage.getItem("places")) || [];


// Fülle das Dropdown-Menü mit Optionen für jeden Ort
var select = document.getElementById("places");
for (var i = 0; i < places.length; i++) {
  var option = document.createElement("option");
  option.text = places[i].name;
  select.add(option);
}

// Funktion zum Zentrieren der Karte auf den ausgewählten Ort
select.addEventListener("change", function () {
  var index = select.selectedIndex;
  var place = places[index];
  map.setView(place.coords, 13);
  updateSelectedMarker();
});

// Event-Listener für das Hinzufügen von Orten
document.getElementById("add-place").addEventListener("click", function() {
  
// Wert des Eingabefelds auslesen
var input = document.getElementById("place-name").value;

// Überprüfen, ob der Ort bereits in der Liste vorhanden ist
if (places.some(place => place.name === input)) {
  alert("Ort bereits in der Liste");
  return;
  }

// Anfrage an die Nominatim-API senden, um Koordinaten zu ermitteln
fetch("https://nominatim.openstreetmap.org/search?q=" + input + "&format=json")
    .then(response => response.json())
    .then(data => {
      if (data.length > 0) {

// Koordinaten des ersten Ergebnisses auslesen
var lat = parseFloat(data[0].lat);
var lng = parseFloat(data[0].lon);

// Neuen Ort zur Liste hinzufügen
places.push({ name: input, coords: [lat, lng] });

// Neue Option zum Dropdown-Menü hinzufügen
var option = document.createElement("option");
option.text = input;
select.add(option);

// Karte auf den neuen Ort zentrieren und Marker aktualisieren
map.setView([lat, lng], 13);
updateSelectedMarker();
} else {
alert("Ort nicht gefunden");
}
})
.catch(error => console.error(error));
});

// Event-Listener für das Entfernen von Orten
document.getElementById("remove-place").addEventListener("click", function() {
  
  // Index des ausgewählten Elements auslesen
  var index = select.selectedIndex;

  // Option aus dem Dropdown-Menü entfernen
  select.remove(index);

  // Ort aus der Liste entfernen
  places.splice(index, 1);

  // Marker aus der Karte entfernen, wenn ein Marker für den zu löschenden Ort existiert
  if (selectedMarker) {
    selectedMarker.remove();
    selectedMarker = null;
  }
});

// Erstelle eine neue Leaflet Karte und zentriere sie auf die Koordinaten
var map = L.map("map").setView([48.6478, 9.4523], 13);

// Füge eine neue Kachel-Layer hinzu, die OpenStreetMap verwendet, mit einer Maximalzoomstufe von 18 und einem
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:"Map data © <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, " +
  "<a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>",
  maxZoom: 18,
  }).addTo(map);
  
// Variable für den ausgewählten Marker
var selectedMarker = null;
  
/*function updateSelectedMarker() {
  // Überprüfen, ob ein Ort ausgewählt ist
  if (select.selectedIndex >= 0) {
    // Marker entfernen, falls vorhanden
    if (selectedMarker !== null) {
      selectedMarker.removeFrom(map);
    }

    // Index des ausgewählten Elements auslesen
    var index = select.selectedIndex;

    // Marker für den ausgewählten Ort erstellen und hinzufügen
    var place = places[index];
    selectedMarker = L.marker(place.coords).addTo(map);
    
  }
}*/
 // Überprüfen, ob ein Ort ausgewählt ist
function updateSelectedMarker() {
  var index = select.selectedIndex;
  if (index >= 0) {
  var place = places[index];
  var coords = place.coords;

    // Erstelle einen neuen Marker an den Koordinaten des ausgewählten Orts
    selectedMarker = L.marker(coords).addTo(map);
    //selectedMarker.bindPopup(place.name).openPopup();
    // Aktualisiere den Popup-Text mit dem Namen und den Koordinaten des Orts
    selectedMarker.bindPopup(place.name + "<br> Koordinaten: " + coords[0] + ", " + coords[1]).openPopup();
  }
}

/*function addPlace() {
  // Ausgewählte Koordinaten erhalten
  const coords = selectedCoords || [defaultCoords.lat, defaultCoords.lng];

  // Ort aus Eingabefeld oder Dropdown-Menü erhalten
  const placeName = document.getElementById("place-name").value || document.getElementById("places").value;

  // Bild aus Eingabefeld erhalten und als Data-URL laden
  const photoUpload = document.getElementById("photo-upload");
  const file = photoUpload.files[0];
  const reader = new FileReader();
  reader.onload = function() {
    const photoUrl = reader.result;

    // Ort zum Dropdown-Menü hinzufügen
    const option = document.createElement("option");
    option.text = placeName;
    option.value = coords.join(",");
    const select = document.getElementById("places");
    select.add(option);

    // Marker zum Ort hinzufügen
    const marker = L.marker(coords).addTo(map);
    marker.bindPopup(placeName + "<br> Koordinaten: " + coords[0] + ", " + coords[1] + "<br> <img src='" + photoUrl + "' width='200'>");

    // Popup schließen
    document.getElementById("popup").style.display = "none";
  };
  reader.readAsDataURL(file);
}*/

// Event-Listener für Bild-Upload definieren
const inputElement = document.getElementById('photo-upload');
inputElement.addEventListener('change', handlePhotoUpload);

function handlePhotoUpload(event) {
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = function() {
    const photoUrl = reader.result;
    selectedMarker.bindPopup(place.name + "<br> Koordinaten: " + coords[0] + ", " + coords[1] + "<br><img src='" + photoUrl + "'/>").openPopup();
  };
}

function uploadPhoto() {
  const file = document.getElementById('photo-upload').files[0];
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = function() {
    const photoUrl = reader.result;
    const uploadButton = document.getElementById('upload-photo');
    uploadButton.addEventListener('click', uploadPhoto);

    selectedMarker.bindPopup(place.name + "<br> Koordinaten: " + coords[0] + ", " + coords[1] + "<br><img src='" + photoUrl + "'/>").openPopup();
  };
}


window.addEventListener("beforeunload", function() {
  localStorage.setItem("places", JSON.stringify(places));
});

// Speichern der Daten in Local Storage
localStorage.setItem("places", JSON.stringify(places));


/*const http = require('http');

const server = http.createServer((req, res) => {  
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello, world!');
});

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000/');
});
*/
 