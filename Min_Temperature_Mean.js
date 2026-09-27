// ============================================================
// 4. MÉDIA ANUAL DA TEMPERATURA MÍNIMA DO AR
// ============================================================
var brasil = table;

// 1. Carregar a COLEÇÃO
var tempCollection = ee.ImageCollection(
    'projects/mapbiomas-public/assets/brazil/atmosphere/collection1/mapbiomas_brazil_collection1_air_temperature_annual_v2'
);

// 2. Filtrar a imagem de temperatura MÍNIMA (ID contém 'min')
var minImg = tempCollection
    .filter(ee.Filter.stringContains('system:index', 'min'))
    .first();

// 3. Média das 40 bandas anuais
var mediaTempMin = minImg.reduce(ee.Reducer.mean()).clip(brasil);

// 4. Visualização
Map.centerObject(brasil, 4);
Map.addLayer(mediaTempMin,
    {min: 5, max: 25, palette: ['#08306b', '#2171b5', '#6baed6', '#c6dbef', '#f7fbff']},
    'Temperatura Mínima Média Anual (°C)');

// 5. Estatística
var stats = mediaTempMin.reduceRegion({
    reducer: ee.Reducer.mean(),
    geometry: brasil,
    scale: 10000,
    maxPixels: 1e13
});
print('Média de temperatura mínima anual (°C):', stats);

// 6. Exportar
Export.image.toDrive({
    image: mediaTempMin,
    description: 'temperatura_minima_media_anual_mapbiomas',
    folder: 'GEE_MapBiomas',
    scale: 10000,
    region: brasil,
    maxPixels: 1e13,
    fileFormat: 'GeoTIFF'
});
