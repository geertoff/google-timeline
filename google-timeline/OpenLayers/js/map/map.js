function initMap() {
    map = new ol.Map({
        target: 'map',
        layers: [],
        view: new ol.View({
            center: ol.proj.fromLonLat([5.290349, 51.820801]),
            zoom: 11,
            maxZoom: 16
        }),
        controls: [] //verwijdert de standaard controls
    });

}