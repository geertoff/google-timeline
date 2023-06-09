function initModal() {
    // als de site is geladen wordt een bericht getoond
    $('.modal').css('display', 'block');

    // button die zorgt dat de button verdwijnt
    $('.closeBtn').on('click', function () {
        $('.modal').css('display', 'none');
    });

    // buiten klikken zorgt ervoor dat modal verdwijnt
    $(window).on('click', function (click) {
        // jquery selectors bestaat uit een array, vandaar [0]
        if (click.target == $('.modal')[0]) {
            $('.modal').css('display', 'none');
        }
    });

}

function buildLayerSwitcher() {
    // ophalen van alle lagen uit de map
    var mapLayers = map.getLayers().getArray();
    $.each(mapLayers, function (i, layer) {

        // als de laag een basemap is
        if (layer.values_.type == 'basemap') {
            // opbouwen List-item met radio button
            let liTekst = '<li><input type="radio" id="' + layer.ol_uid + '" name="' + layer.values_.type + '" value="' + layer.ol_uid + '"';
            if (layer.values_.visible) {
                liTekst += " checked>";
            } else {
                liTekst += ">";
            }
            // zorgt ervoor dat je ook op de tekst kan klikken

            liTekst += '<label class="layer-thumbnail ' + layer.values_.title + '" for="' + layer.ol_uid + '"></label></li>';
            // voeg de list-item toe aan de UL
            $('#basemaplayers').append(liTekst);
        } else if (layer.values_.type == 'overlay') { // als de laag een overlay laag is
            // opbouwen LI-item met een checkbox
            let liTekst = '<li><label class="switch"><input type="checkbox" id="' + layer.ol_uid + '" name="' + layer.ol_uid + '" value="' + layer.ol_uid + '" class="overlayswitch"';
            // Zorgen dat checkbox van zichtbare laag is aangevinkt
            if (layer.values_.visible) {
                liTekst += " checked>";
            } else {
                liTekst += ">";
            }
            liTekst += '<span class="slider"></span>'
            liTekst += '<div class="small text overlay-position">' + layer.values_.title + ' </div></label></li>';
            $('#overlaylayers').append(liTekst);
        }
    });

    $('input[type=radio][name=basemap]').on('change', function () {
        let ol_uid = this.value;

        map.getLayers().forEach(function (layer) {
            // als het ol_uid van de laag gelijk is aan de ol_uid van de radio button
            // maak dan de laag zichtbaar
            if (layer.ol_uid == ol_uid) {
                layer.setVisible(true);
            } else if (layer.values_.type == 'basemap') {
                layer.setVisible(false);
            }
        });
    });

    // Zorgen dat veranderen checkbox overlay laag worden afgehandeld
    $('input[type=checkbox][class=overlayswitch]').on('change', function () {
        // bewaar de waarde van de geselecteerde checkbox
        let ol_uid = this.value;

        // loop alle lagen langs
        map.getLayers().forEach(function (layer) {
            // als het ol_uid van de laag gelijk is aan de ol_uid van de checkbox
            if (layer.ol_uid == ol_uid) {
                // als de laag zichtbaar is maak hem dan niet zichtbaar
                if (layer.getVisible()) {
                    layer.setVisible(false);
                    // anders maak hem wel zichtbaar    
                } else {
                    layer.setVisible(true);
                }
            }
        });
    });
}

function variableSwitcher(switcher) {
    if (switcher.checked) {
        $('.unit').html('uur');
        $('.time-switch').show();
        $('.distance-switch').hide();
        huidigeEenheid = 'time';

    } else {
        $('.unit').html('km');
        $('.time-switch').hide();
        $('.distance-switch').show();
        huidigeEenheid = 'dist';
    }
    // als de switcher wordt gebruikt moet de functie weer worden aangeroepen
    highlightHexagon();
}

function highlightHexagon() {
    // als het niet de hoogste waarde heeft moet de class worden vervangen naar hexagon
    $('#ov').removeClass('hexagonGreen');
    $('#ov').addClass('hexagon');

    $('#walk').removeClass('hexagonGreen');
    $('#walk').addClass('hexagon');

    $('#car').removeClass('hexagonGreen');
    $('#car').addClass('hexagon');

    $('#bike').removeClass('hexagonGreen');
    $('#bike').addClass('hexagon');

    if (huidigeEenheid == 'dist') {
        $('#' + hoogsteNaamDist).removeClass('hexagon');
        $('#' + hoogsteNaamDist).addClass('hexagonGreen');

    } else {
        $('#' + hoogsteNaamTime).removeClass('hexagon');
        $('#' + hoogsteNaamTime).addClass('hexagonGreen');
    }
}

function filterActivitys() {
    let cqlText;
    let activity_names = [];

    $('#filtermenu').find('input[type=checkbox]:checked').each(function (i, checkbox) {

        cqlText = 'activity_type in (';
        activity_names.push(checkbox.name);

        // als er meerdere checkboxes zijn geselecteerd
        $.each(activity_names, function (i, activity) {
            if (activity_names.length > 1) {
                cqlText += "\'" + activity + "\',"

            } else {
                cqlText += "\'" + activity + "\'"
            }
        });
    });
    //  verwijderen van , op de laatste waarde
    if (activity_names.length > 1) {
        cqlText = cqlText.slice(0, cqlText.length - 1);
    }
    cqlText += ')';
    //  als er features zijn
    if (activity_names.length > 0) {
        routeSource.updateParams({
            'cql_filter': cqlText
        });
    } else {
        routeSource.updateParams({
            'cql_filter': 'activity_type in (\'bestaat niet\')'
        });
    }

}

function ovActivity() {
    // als de filter OV actief is 
    if ($('#filter-ov').prop('checked')) {
        let postData = {
            'url': 'https://gmd.has.nl/geoserver/engineer_2021_540231185/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=engineer_2021_540231185:transitpoint&outputFormat=application%2Fjson'
        }

        $.ajax({
            url: 'php/geoproxycurl.php',
            method: 'post',
            data: postData,
            dataType: 'json'
        }).done(function (data) {
            transitlineLayer.setVisible(true);
            transitSource.addFeatures(new ol.format.GeoJSON().readFeatures(data, {
                dataProjection: 'EPSG:4326',
                featureProjection: 'EPSG:3857'
            }));

        });

    } else {
        transitSource.clear();
        transitlineLayer.setVisible(false);
    }
}