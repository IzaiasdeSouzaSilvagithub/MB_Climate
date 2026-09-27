// ============================================================
// 1. MÉDIA ANUAL DO ACUMULADO ANUAL DE PRECIPITAÇÃO
// ============================================================
var brasil = table;

// Carregar a IMAGEM de precipitação anual
var precipImg = ee.Image('projects/mapbiomas-public/assets/brazil/atmosphere/collection1/mapbiomas_brazil_collection1_precipitation_annual_v2');

// Calcular a média de todas as bandas (todos os anos) para obter a média anual
var mediaPrecip = precipImg.reduce(ee.Reducer.mean()).clip(brasil);

// Visualização
Map.centerObject(brasil, 4);
Map.addLayer(mediaPrecip, {min: 0, max: 3000, palette: ['#ffffcc', '#a1dab4', '#41b6c4', '#2c7fb8', '#253494']}, 'Precipitação Média Anual (mm)');

// Estatística
var stats = mediaPrecip.reduceRegion({reducer: ee.Reducer.mean(), geometry: brasil, scale: 10000, maxPixels: 1e13});
print('Média de precipitação anual (mm):', stats);

// Exportar
Export.image.toDrive({
    image: mediaPrecip,
    description: 'precipitacao_media_anual_mapbiomas',
    folder: 'GEE_MapBiomas',
    scale: 10000,
    region: brasil,
    maxPixels: 1e13,
    fileFormat: 'GeoTIFF'
});
