mapboxgl.accessToken = mapToken;
    const map = new mapboxgl.Map({
        container: 'map', // container ID
        style:"mapbox://styles/mapbox/streets-v12",
        center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
        zoom: 9 // starting zoom
});

const marker = new mapboxgl.Marker({ color: 'red'})
.setLngLat(listing.geometry.coordinates)
.setPopup(new mapboxgl.Popup({offset: 25})
.setHTML('<p>Exact Location provided after booking.</p>')
.setMaxWidth("320px"))
.addTo(map);


map.addControl(
    new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl
    })
);
