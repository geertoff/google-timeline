<?php
$name = $_POST['name'];
?>

<!DOCTYPE html>
<html>

<head>
    <title>Waar ben ik geweest?</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <link rel="icon" href="favicon.png" type="image/png" sizes="16x16" />

    <!-- Koppeling naar CSS van OpenLayers-->
    <link href="vendor/ol/ol.css" rel="stylesheet" />

    <!-- Koppeling naar CSS van Skeleton -->
    <link href="vendor/Skeleton-2.0.4/skeleton.css" rel="stylesheet" />


    <!-- Koppeling voor ol-ext CSS -->
    <link rel="stylesheet" href="https://cdn.rawgit.com/Viglino/ol-ext/master/dist/ol-ext.min.css" />

    <!-- Koppeling naar eigen CSS-->
    <link href="css/go_main.css" rel="stylesheet" />
    <link href="css/toggleswitch.css" rel="stylesheet" />
    <link href="css/layerswitcher.css" rel="stylesheet" />
    <link href="css/ol_elements.css" rel="stylesheet" />
    <link href="css/modal.css" rel="stylesheet" />

</head>

<body>
    <main>
        <section id="map-page">
            <section>
                <!-- kaart-->
                <div id="map"></div>

                <!-- text box -->
                    <div id="simpleModal" class="modal">
                        <div class="modal-content">
                            <div class="modal-header">
                                <span class="closeBtn">&times;</span>
                                <h4>Hoi <span id="username"><?php echo $name; ?></span>,</h4>   
                            </div>
                            <div class="modal-body">
                                <p>De data is geladen. Bekijk waar je bent geweest en veel kaartplezier!</p>
                            </div>
                            
                        </div>
                    </div>


               
            </section>

            <aside>
                <!-- hexagonen -->
                <div class="first_row">
                    <div id="walk" class="hexagon">
                        <div class="bold-text walking time-switch"></div>
                        <div class="bold-text walking distance-switch"></div>
                        <div class="small text unit">km</div>
                        <ion-icon class="icon" name="walk-sharp"></ion-icon>
                    </div>

                    <div id="car" class="hexagon">
                        <div class="bold-text car time-switch"></div>
                        <div class="bold-text car distance-switch"></div>
                        <div class="small text unit">km</div>
                        <ion-icon class="icon" name="car-sharp"></ion-icon>
                    </div>

                    <!--  Knop om te switchen -->
                    <label id="variable-switch" class="switch">
                        <input type="checkbox" onchange="variableSwitcher(this)">
                        <div class="elements slider">
                            <span class="on small text">Tijd</span><span class="off small text">Km</span>
                        </div>
                    </label>
                </div>

                <div class="second_row">
                    <div id="bike" class="hexagon">
                        <div class="bold-text bike time-switch"></div>
                        <div class="bold-text bike distance-switch"></div>
                        <div class="small text unit">km</div>
                        <ion-icon class="icon" name="bicycle-sharp"></ion-icon>
                    </div>

                    <div id="ov" class="hexagon">
                        <div class="bold-text ov time-switch"></div>
                        <div class="bold-text ov distance-switch"></div>
                        <div class="small text unit">km</div>
                        <ion-icon class="icon" name="train-sharp"></ion-icon>
                    </div>
                </div>
            </aside>

            <article class="elements">
                <div id="filtermenu">
                    <div class="container">
                        <div class="row title center">Filter</div>
                        <!-- Rijen met de iconen -->
                        <div class="row center">
                            <div class="three columns">
                                <label>
                                    <input type="checkbox" class="filter" id="filter-walk" name="WALKING"
                                        onclick='filterActivitys()'>
                                    <ion-icon class="icon" name="walk-sharp"></ion-icon>
                                    <div class="center text">lopen</div>
                                </label>
                            </div>
                            <div class="three columns">
                                <label>
                                    <input type="checkbox" class="filter" id="filter-bike" name="CYCLING"
                                        onclick='filterActivitys()'>
                                    <ion-icon class="icon" name="bicycle-sharp"></ion-icon>
                                    <div class="center text">fietsen</div>
                                </label>
                            </div>
                            <div class="three columns">
                                <label>
                                    <input type="checkbox" class="filter" id="filter-car" name="IN_PASSENGER_VEHICLE"
                                        onclick='filterActivitys()'>
                                    <ion-icon class="icon" name="car-sharp"></ion-icon>
                                    <div class="center text">auto</div>
                                </label>
                            </div>
                            <div class="three columns">
                                <label>
                                    <input type="checkbox" class="filter" id="filter-ov" name="OV"
                                        onclick='ovActivity()'>
                                    <ion-icon class="icon" name="train-sharp"></ion-icon>
                                    <div class="center text">OV</div>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Layer switcher -->
                <div id="layermenu">
                    <div class="layersection">
                        <div class="title">Basemaps</div>
                        <ul id="basemaplayers" class="layer-switcher nobullets"></ul>

                    </div>

                    <div class="layersection"">
                     <div class=" title center">Lagen</div>

                    <ul id="overlaylayers" class="layer-switcher nobullets"></ul>
                    </ul>
                </div>
              
            </article>

            <section>


            </section>

        </section>

    </main>


    <!-- Koppeling met heatmap  -->
    <script src="https://unpkg.com/elm-pep"></script>

    <!-- Koppeling naar Jquery JavaScript -->
    <script src="vendor/jquery/jquery-3.5.1.js"></script>

    <!-- Koppeling naar OpenLayers-->
    <script src="vendor/ol/ol.js"></script>
    <!-- Koppeling voor punten cluster -->
    <script type="text/javascript" src="https://cdn.rawgit.com/Viglino/ol-ext/master/dist/ol-ext.min.js"></script>

    <!-- Koppeling naar eigen JavaScripts-->
    <script src="js/map/globals.js"></script>
    <script src="js/map/map.js"></script>
    <script src="js/map/hexagon_statistics.js"></script>
    <script src="js/map/styles.js"></script>
    <script src="js/map/layers.js"></script>
    <script src="js/map/controls.js"></script>
    <script src="js/map/screenfunction.js"></script>
    <script src="js/mainMap.js"></script>

    <!-- Koppeling naar Ionicons -->
    <script type="module" src="https://unpkg.com/ionicons@5.2.3/dist/ionicons/ionicons.esm.js"></script>
    <script nomodule="" src="https://unpkg.com/ionicons@5.2.3/dist/ionicons/ionicons.js"></script>

</body>

</html>