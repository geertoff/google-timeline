function hexagonStatistics() {
    // statistieken kaart 

    map.on('moveend', function(evt) { //als de kaart eindigt met bewegen gaat de volgende functie af 
        // ophalen van de coordinaten in een array 
        let mapExtent = map.getView().calculateExtent();
        // splitsen van de array in twee losse punten. De rechterpunt staat nu in de variabele 'mapExtent'
        mapExtentLeft = mapExtent.splice(0, 2);
        // linkercoordinaat converteren naar EPSG: 4326
        let coordinatesLeft = ol.proj.toLonLat(mapExtentLeft);
        // extraheren van de losse coordinaten
        let leftX = coordinatesLeft[0];
        let leftY = coordinatesLeft[1];

        // rechtercoordinaat converteren naar EPSG: 4326 
        let coordinatesRight = ol.proj.toLonLat(mapExtent);
        // extraheren van de losse coordinaten
        let rightX = coordinatesRight[0];
        let rightY = coordinatesRight[1];

        // waardes aan de post link toevoegen die wordt verstuurd naar de server via de proxycurl

        let postData = {
            'url': 'https://gmd.has.nl/geoserver/engineer_2021_540231185/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=engineer_2021_540231185:hexagons_statistics&outputFormat=application%2Fjson&viewParams=lx:' + leftX + ';ly:' + leftY + ';rx:' + rightX + ';ry:' + rightY
        };



        $.ajax({
            url: 'php/geoproxycurl.php',
            method: 'post',
            data: postData,
            dataType: 'json'
        }).done(function(data) {
            // aanmaken van variabelen. Deze variabelen koppelen de waardes die aanwezig zijn in het kaart-extent 

            // van te voren moeten de waardes worden gereset worden baar 0
            let dist = 0;
            let timediff = 0;

            $('.walking.distance-switch').html(dist);
            $('.walking.time-switch').html(timediff);

            $('.bike.distance-switch').html(dist);
            $('.bike.time-switch').html(timediff);

            $('.car.distance-switch').html(dist);
            $('.car.time-switch').html(timediff);

            $('.ov.distance-switch').html(dist);
            $('.ov.time-switch').html(timediff);

            // functie om de tijd te berekenen 
            function calculateTime(time) {
                // de data is een string. er wordt gecheckt wat het aantal minuten zijn door te indexeren
                let timeMinutesString = time.charAt(time.length - 5) + time.charAt(time.length - 4);
                // dit wordt geconverteerd naar een integer
                let timeMinutes = parseInt(timeMinutesString);

                // als dit getal groter is dan 30 minuten, moet er 1 uur bij het totale getal
                if (timeMinutes > 30) {
                    time = parseInt(time) + 1;
                } else {
                    time = parseInt(time);
                }
                return time;
            }

            hoogsteWaardeDist = 0;
            hoogsteWaardeTime = 0;
            hoogsteNaamDist = 'leeg';
            hoogsteNaamTime = 'leeg';

            // als de data features bevat
            if (data.features.length > 0) {

                $.each(data.features, function(i, feature) {
                    // per activiteit wordt de waarde toegevoegd als de case is voldaan
                    switch (feature.properties.activity_type) { // indexeert naar het niveau waar de variabelen distance en timediff aanwezig zijn
                        // meerdere cases groeperen zodat ze in gegroepeerde activiteit 'WALKING' vallen
                        case 'WALKING':
                            // waarde geven aan variabelen door te indexeren. 
                            dist = Math.round(feature.properties.distance); // Math round zorgt ervoor dat het getal een geheel getal wordt
                            timediff = calculateTime(feature.properties.timediff);

                            // waarde toekennen aan class die aanwezig is in de html
                            $('.walking.distance-switch').html(dist);
                            $('.walking.time-switch').html(timediff);

                            if (dist > hoogsteWaardeDist) {
                                hoogsteWaardeDist = dist;
                                hoogsteNaamDist = 'walk';
                            }
                            
                            if (timediff > hoogsteWaardeTime){
                                hoogsteWaardeTime = timediff;
                                hoogsteNaamTime = 'walk';
                            }                            
                            break;
                            

                        case 'CYCLING':

                            dist = Math.round(feature.properties.distance);
                            timediff = calculateTime(feature.properties.timediff);
                
                            $('.bike.distance-switch').html(dist);
                            $('.bike.time-switch').html(timediff);

                            if (dist > hoogsteWaardeDist) {
                                hoogsteWaardeDist = dist;
                                hoogsteNaamDist = 'bike';
                            }

                            if (timediff > hoogsteWaardeTime){
                                hoogsteWaardeTime = timediff;
                                hoogsteNaamTime = 'bike';
                            }
                            break;

                        case 'IN_PASSENGER_VEHICLE':

                            dist = Math.round(feature.properties.distance);                           
                            timediff = calculateTime(feature.properties.timediff);

                            $('.car.distance-switch').html(dist);
                            $('.car.time-switch').html(timediff);

                            if (dist > hoogsteWaardeDist) {
                                hoogsteWaardeDist = dist;
                                hoogsteNaamDist = 'car';
                            }

                            if (timediff > hoogsteWaardeTime){
                                hoogsteWaardeTime = timediff;
                                hoogsteNaamTime = 'car';
                            }
                            break;

                        case 'OV':

                            dist = Math.round(feature.properties.distance);
                            timediff = calculateTime(feature.properties.timediff);

                            $('.ov.distance-switch').html(dist);
                            $('.ov.time-switch').html(timediff);

                            if (dist > hoogsteWaardeDist) {
                                hoogsteWaardeDist = dist;
                                hoogsteNaamDist = 'ov';
                            }

                            if (timediff > hoogsteWaardeTime){
                                hoogsteWaardeTime = timediff;
                                hoogsteNaamTime = 'ov';
                            }

                    } 
                });
            }
            highlightHexagon();

        });

    });
}
