// ============================================================
// 2. MÉDIA ANUAL DA TEMPERATURA MÉDIA DO AR
// ============================================================
var brasil = table;

// 1. Carregar a COLEÇÃO
var tempCollection = ee.ImageCollection(
    'projects/mapbiomas-public/assets/brazil/atmosphere/collection1/mapbiomas_brazil_collection1_air_temperature_annual_v2'
);

// 2. Filtrar para pegar apenas a imagem de temperatura MÉDIA
var meanColl = tempCollection
    .filter(ee.Filter.stringContains('system:index', 'max').not())
    .filter(ee.Filter.stringContains('system:index', 'min').not());

// 3. Se o filtro achar 1 imagem, usa ela; senão, usa a primeira como fallback
var meanImg = ee.Image(ee.Algorithms.If(
    meanColl.size().gt(0),
    meanColl.first(),
    tempCollection.first()
));

// 4. Calcular a média das bandas anuais
var mediaTemp = meanImg.reduce(ee.Reducer.mean()).clip(brasil);

// 5. Visualização
Map.centerObject(brasil, 4);
Map.addLayer(mediaTemp,
    {min: 15, max: 30, palette: ['#0000ff', '#00ffff', '#ffff00', '#ff0000']},
    'Temperatura Média Anual (°C)');

// 6. Estatística
var stats = mediaTemp.reduceRegion({
    reducer: ee.Reducer.mean(),
    geometry: brasil,
    scale: 10000,
    maxPixels: 1e13
});
print('Média de temperatura média anual (°C):', stats);

// 7. Exportar
Export.image.toDrive({
    image: mediaTemp,
    description: 'temperatura_media_anual_mapbiomas',
    folder: 'GEE_MapBiomas',
    scale: 10000,
    region: brasil,
    maxPixels: 1e13,
    fileFormat: 'GeoTIFF'
});
