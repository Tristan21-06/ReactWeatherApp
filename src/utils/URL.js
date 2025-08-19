import config from "../env.local";

export const buildWeatherUrl = (url, city) => {
    let builtUrl = new URL(url);
    builtUrl.searchParams.append('q', city);
    builtUrl.searchParams.append('units', 'metric');
    builtUrl.searchParams.append('lang', 'fr');
    builtUrl.searchParams.append('appid', config.OPEN_WEATHER_MAP_API_KEY);

    return builtUrl;
}

export const buildGeoPosUrl = (url, {lat, lon}) => {
    let builtUrl = new URL(url);
    builtUrl.searchParams.append('lat', lat);
    builtUrl.searchParams.append('lon', lon);
    builtUrl.searchParams.append('limit', '1');
    builtUrl.searchParams.append('lang', 'fr');
    builtUrl.searchParams.append('appid', config.OPEN_WEATHER_MAP_API_KEY);

    return builtUrl;
}