function initLayers() {
    // Functie om lagen toe te voegen aan kaart
    //  Esri donkere laag
    var Esri_WorldDarkGrayCanvas = new ol.layer.Tile({
        source: new ol.source.XYZ({
            url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
            attributions: ['Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ']
        }),
        title: 'greybasemap',
        type: 'basemap',
        maxZoom: 16
    });
    map.addLayer(Esri_WorldDarkGrayCanvas);
    Esri_WorldDarkGrayCanvas.setVisible(true);

    // Kleuren basemap
    var CartoDB = new ol.layer.Tile({
        source: new ol.source.XYZ({
            url: 'http://{1-4}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png',
            attributions: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        }),
        title: 'colourbasemap', //Aangeven dat het een kleuren basemap is dan wordt de css aangepast
        type: 'basemap'
    });
    map.addLayer(CartoDB);
    CartoDB.setVisible(false);

    // Heatmap
    var waypointSource = new ol.source.Vector();
    var waypointHeatmap = new ol.layer.Heatmap({
        source: waypointSource,
        title: 'Heatmap',
        type: 'overlay',
        opacity: 0.8,
        blur: 15,
        radius: 4,
    });
    map.addLayer(waypointHeatmap);
    waypointHeatmap.setVisible(true);

    // Link met de data van de waypoints, deze wordt onderwater verstuurd naar de server via de proxycurl
    let postDataWP = {
        'url': 'https://gmd.has.nl/geoserver/engineer_2021_540231185/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=engineer_2021_540231185:waypoint&outputFormat=application%2Fjson'
    };

    $.ajax({
        url: 'php/geoproxycurl.php',
        dataType: 'json',
        data: postDataWP,
        method: 'post'
    }).done(function (data) {
        waypointSource.addFeatures(new ol.format.GeoJSON().readFeatures(data, {
            dataProjection: 'EPSG:4326',
            featureProjection: 'EPSG:3857'
        }));
    });


    // WFS-laag met plekken die zijn bezocht
    var placevisitSource = new ol.source.Vector();
    var placevisitLayer = new ol.layer.Vector({
        source: placevisitSource,
        title: 'Plaatsen',
        type: 'overlay',
        declutter: true,
    });

    // schaalafhankelijke labeling bij placevisit
    map.on('postrender', function () {
        let zoomLevel = map.getView().getZoom();

        if (Esri_WorldDarkGrayCanvas.getVisible()) { //als de donkere basemap actief is
            if (zoomLevel < 13) { //als de kaart binnnen dit zoomniveau is
                placevisitLayer.setStyle(placevisitStyleDark);
            } else {
                placevisitLayer.setStyle(function (feature) {
                    labelStyleDark.getText().setText(feature.get('name')); //de label van het punt
                    return [placevisitStyleDark, labelStyleDark]
                })
            }
        } else if (CartoDB.getVisible()) {
            if (zoomLevel < 13) { //als de kaart binnnen dit zoomniveau is
                placevisitLayer.setStyle(placevisitStyle);
            } else {
                placevisitLayer.setStyle(function (feature) {
                    labelStyle.getText().setText(feature.get('name'));
                    return [placevisitStyle, labelStyle]
                })
            }
        }
    });
    map.addLayer(placevisitLayer);
    placevisitLayer.setVisible(false);

    let postDataPV = {
        'url': 'https://gmd.has.nl/geoserver/engineer_2021_540231185/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=engineer_2021_540231185:placevisit&outputFormat=application%2Fjson'
    };

    $.ajax({
        url: 'php/geoproxycurl.php',
        dataType: 'json',
        data: postDataPV,
        method: 'post'
    }).done(function (data) {
        placevisitSource.addFeatures(new ol.format.GeoJSON().readFeatures(data, {
            dataProjection: 'EPSG:4326',
            featureProjection: 'EPSG:3857'
        }));
    });


    // WMS routelijnen voor actvitieiten wandelen, fietsen en auto
    routeSource = new ol.source.ImageWMS({
        url: 'https://gmd.has.nl/geoserver/engineer_2021_540231185/wms?',
        params: {
            'layers': 'activity_routes',
            'cql_filter': 'activity_type in (\'bestaat niet\')' //de parameter moet altijd gevuld zijn
        }
    });

    var routeLayer = new ol.layer.Image({
        source: routeSource,
        title: 'Route',
    });
    map.addLayer(routeLayer);


    // WMS laag voor transit lijnen
    var transitlineSource = new ol.source.ImageWMS({
        url: 'https://gmd.has.nl/geoserver/engineer_2021_540231185/wms?',
        params: {
            'layers': 'transit_line'
        }
    });

    transitlineLayer = new ol.layer.Image({
        source: transitlineSource,
    });
    map.addLayer(transitlineLayer);
    transitlineLayer.setVisible(false);



    // WFS laag met transit points
    transitSource = new ol.source.Vector();
    var clusterSource = new ol.source.Cluster({
        source: transitSource,
        distance: 45
    });

    var clusterLayer = new ol.layer.AnimatedCluster({
        name: 'Cluster',
        source: clusterSource,
        style: function (feature) {
            // het aantal features die in de buurt aanezig zijn
            let size = feature.get('features').length;
            style = new ol.style.Style({
                image: new ol.style.Circle({
                    radius: Math.sqrt(size) + 10,
                    stroke: new ol.style.Stroke({
                        color: '#fff'
                    }),
                    fill: new ol.style.Fill({
                        color: 'rgba(240, 219, 84, 0.9)'
                    })
                }),
                text: new ol.style.Text({
                    font: '16px Calibri,sans-serif',
                    text: size.toString(),
                    fill: new ol.style.Fill({
                        color: 'black'
                    })
                })
            });
            return style;
        }

    });
    map.addLayer(clusterLayer);

}