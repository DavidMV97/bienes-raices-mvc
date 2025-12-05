(function () {
    const lat = 3.4601173;
    const lng = -76.5214537;
    const map = L.map('map').setView([lat, lng], 13);
    let marker;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    marker = new L.marker([lat, lng], {
        draggable: true,
        autoPan: true
    }).addTo(map)

    // Detect pin movement 
    marker.on('moveend', function(e){
        marker = e.target;
        const position = marker.getLatLng();         
        map.panTo(new L.LatLng(position.lat, position.lng))
    })

})()