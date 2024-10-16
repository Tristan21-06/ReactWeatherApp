import {useEffect, useState} from "react";
import {formatDate, formatTime} from "../../utils/Date"
import {fetchData, groupByDate} from "../../utils/functions"
import {buildWeatherUrl} from "../../utils/URL";
import {
    Carousel,
    CarouselItem,
    Card,
    CardHeader,
    CardBody,
    Tab,
    Tabs,
} from "react-bootstrap";

function FiveDaysWeather({city}) {
    const [cityData, setCityData] = useState(null);

    useEffect(() => {
        if (city.length) {
            let weatherUrl = buildWeatherUrl("https://api.openweathermap.org/data/2.5/forecast", city);

            fetchData(weatherUrl)
                .then(data => {
                        data.list = groupByDate(data.list);
                        setCityData({
                            ...data
                        })
                    }
                )
                .catch(error => {
                    console.error(error)
                })
            ;

        }
    }, [city]);

    return (
        <div className="p-4">
            {cityData?.list ? (
                <>
                    <Carousel
                        interval={null}
                        prevLabel=""
                        nextLabel=""
                        prevIcon={
                            (
                                <>
                                    <span aria-hidden="true" className="carousel-control-prev-icon"></span>
                                    <span>Jour précédent</span>
                                </>
                            )
                        }
                        nextIcon={
                            (
                                <>
                                    <span>Jour suivant</span>
                                    <span aria-hidden="true" className="carousel-control-next-icon"></span>
                                </>
                            )
                        }
                    >
                        {Object.keys(cityData.list).map((date, index) => (
                            <CarouselItem key={index}>
                                <div className="d-flex justify-content-center">
                                    <Card className="w-50">
                                        <CardHeader>
                                            <h4>{formatDate(date)}</h4>
                                        </CardHeader>
                                        <CardBody>
                                            <Carousel indicators={false} interval={null}>
                                                {cityData.list[date].map((period, subIndex) => (
                                                    <CarouselItem key={subIndex}>
                                                        <p>{formatTime(period.dt_txt)}</p>
                                                        <img
                                                            src={`https://openweathermap.org/img/wn/${period.weather[0].icon}.png`}
                                                            alt={period.weather[0].description}/>
                                                        <p>{Math.floor(period.main.temp)}°C</p>
                                                        <p>{period.weather[0].description}</p>
                                                    </CarouselItem>
                                                ))}
                                            </Carousel>
                                        </CardBody>
                                    </Card>
                                </div>
                            </CarouselItem>
                        ))}
                    </Carousel>
                </>
            ) : 'Aucune ville sélectionnée'}
        </div>
    );
}

export default FiveDaysWeather;
