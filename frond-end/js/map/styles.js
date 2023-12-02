var placevisitStyle = new ol.style.Style({
    image: new ol.style.Circle({
        radius: 4,
        fill: new ol.style.Fill({
            color: '#01dfb0',
        }),
        stroke: new ol.style.Stroke({
            color: '#808080',
            width: 0.5,
        }),
    }),

});

var labelStyle = new ol.style.Style({
    text: new ol.style.Text({
      font: '16px Calibri,sans-serif',
      overflow: true,
      fill: new ol.style.Fill({
        color: 'black',
      }),
      stroke: new ol.style.Stroke({
        color: '#fff',
        width: 2,
    }),
      offsetY: -20,
    }),
});

var placevisitStyleDark = new ol.style.Style({
    image: new ol.style.Circle({
        radius: 4,
        fill: new ol.style.Fill({
            color: 'rgba(1, 223, 176, 0.6)',
        }),
        stroke: new ol.style.Stroke({
            color: '#fff',
            width: 0.5,
        }),
    }),
});

var labelStyleDark = new ol.style.Style({
    text: new ol.style.Text({
      font: '16px Calibri,sans-serif',
      overflow: true,
      fill: new ol.style.Fill({
        color: '#fff',
      }),
      offsetY: -20,
    }),
});

