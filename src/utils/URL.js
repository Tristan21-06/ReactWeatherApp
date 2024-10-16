export const buildWeatherUrl = (url, city) => {
    let builtUrl = new URL(url);
    builtUrl.searchParams.append('q', city);
    builtUrl.searchParams.append('units', 'metric');
    builtUrl.searchParams.append('lang', 'fr');
    builtUrl.searchParams.append('appid', "6ac4ac217b24e462da817e583a81f929");

    return builtUrl;
}