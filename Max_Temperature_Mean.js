// ============================================================
// 3. MÉDIA ANUAL DA TEMPERATURA MÁXIMA DO AR
// ============================================================
var brasil = table;

// 1. Carregar a COLEÇÃO
var tempCollection = ee.ImageCollection(
    'projects/mapbiomas-public/assets/brazil/atmosphere/collection1/mapbiomas_brazil_collection1_air_temperature_annual_v2'
);

// 2. Filtrar a imagem de temperatura MÁXIMA (ID contém 'max')
var maxImg = tempCollection
    .filter(ee.Filter.stringContains('system:index', 'max'))
    .first();

// 3. Média das 40 bandas anuais
var mediaTempMax = maxImg.reduce(ee.Reducer.mean()).clip(brasil);

// 4. Visualização
Map.centerObject(brasil, 4);
Map.addLayer(mediaTempMax,
    {min: 20, max: 40, palette: ['#fff5f0', '#fee0d2', '#fc9272', '#de2d26', '#a50f15']},
    'Temperatura Máxima Média Anual (°C)');

// 5. Estatística
var stats = mediaTempMax.reduceRegion({
    reducer: ee.Reducer.mean(),
    geometry: brasil,
    scale: 10000,
    maxPixels: 1e13
});
print('Média de temperatura máxima anual (°C):', stats);

// 6. Exportar
Export.image.toDrive({
    image: mediaTempMax,
    description: 'temperatura_maxima_media_anual_mapbiomas',
    folder: 'GEE_MapBiomas',
    scale: 10000,
    region: brasil,
    maxPixels: 1e13,
    fileFormat: 'GeoTIFF'
});
