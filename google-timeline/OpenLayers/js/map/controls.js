function initControls() {
    //  Maken van overviewmap control

    var DarkGrayCanvasOverview = new ol.layer.Tile({
        source: new ol.source.XYZ({
            url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
            attributions: ['Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ']
        }),
        title: 'greybasemap',
        type: 'basemap'
    });
    DarkGrayCanvasOverview.setVisible(true);

    // WMS-laag voor overview map met daarin de placevisits
    var placevisitOverviewSource = new ol.source.ImageWMS({
        url: 'https://gmd.has.nl/geoserver/engineer_2021_540231185/wms',
        params: {
            'LAYERS': 'engineer_2021_540231185:placevisit_overview'
        }

    });

    var placevisitLayerOverview = new ol.layer.Image({
        source: placevisitOverviewSource,
    });
    placevisitLayerOverview.setVisible(true);

    // functie voor het maken van iconen van ionicon voor de buttons
    function createIcon(symbol) {
        // element ion-icon aanmaken. dit is de service die wordt gebruikt voor het aanmaken van een icoon
        iconName = document.createElement('ion-icon');
        // de soort icon aangeven
        iconName.setAttribute('name',  symbol)
        return iconName
    }
     
    var overviewMapControl = new ol.control.OverviewMap({
        className: 'ol-overviewmap go-overview',
        layers: [DarkGrayCanvasOverview, placevisitLayerOverview],
        collapsed: false,
        collapseLabel: createIcon('eye-off'),
        label: createIcon('eye')
    });
    map.addControl(overviewMapControl);

    var zoomControl = new ol.control.Zoom({
        className: 'go-zoom',
        delta: 2,
        zoomInLabel: createIcon('add'),
        zoomOutLabel: createIcon('remove') 
    });
    map.addControl(zoomControl);

   var attributionControl = new ol.control.Attribution({
        label: createIcon('information'),
        collapseLabel: createIcon('arrow-forward')
    }); 
    map.addControl(attributionControl);
}