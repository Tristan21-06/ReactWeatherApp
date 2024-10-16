import {useEffect, useState} from "react";
import {fetchData} from "../../utils/functions"
import {buildWeatherUrl} from "../../utils/URL";
import {
    Card,
    CardBody,
    CardHeader,
    Spinner
} from "react-bootstrap";
import {formatDate} from "../../utils/Date";

function CurrentWeather({city, loading, setLoading}) {
    const [cityData, setCityData] = useState(null);

    useEffect(() => {
        if (city.length) {
            let weatherUrl = buildWeatherUrl("https://api.openweathermap.org/data/2.5/weather", city);

            fetchData(weatherUrl)
                .then(data => {
                    data.dt_txt_custom = formatDate((new Date(data.dt*1000)).toUTCString())

                    setCityData({
                        ...data
                    });

                    setLoading(false);
                })
                .catch(error => {
                    console.error(error)
                })
            ;
        }
    }, [city]);

    return (
        <div className="p-4">
            {!loading && cityData ? (
                <>
                    <div className="d-flex justify-content-center">
                        <Card className="w-50">
                            <CardHeader>
                                <h4>{cityData.dt_txt_custom}</h4>
                            </CardHeader>
                            <CardBody>
                                <div className="d-flex flex-column align-items-center">
                                    <img src={`https://openweathermap.org/img/wn/${cityData.weather[0].icon}.png`}
                                         alt={cityData.weather[0].description} width="50px" />
                                    <span>{Math.floor(cityData.main.temp)}°C</span>
                                    <span>{cityData.weather[0].description}</span>
                                </div>
                            </CardBody>
                        </Card>
                    </div>
                </>
            ) : (
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            )}
        </div>
    );
}

export default CurrentWeather;
