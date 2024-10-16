import {useEffect, useState} from "react";
import CurrentWeather from "./Weather/CurrentWeather";
import FiveDaysWeather from "./Weather/FiveDaysWeather";
import {Button, Dropdown, Form, InputGroup, Tab, Tabs} from "react-bootstrap";
import {Search, StarFill, X} from "react-bootstrap-icons";
import {buildGeoPosUrl} from "../utils/URL";
import {fetchData} from "../utils/functions";

function Weather() {
    const [city, setCity] = useState('');
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(null);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                    setLoading(true);

                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;

                    let geoUrl = buildGeoPosUrl("https://api.openweathermap.org/geo/1.0/reverse", {lat,lon});

                    fetchData(geoUrl)
                        .then(data => {
                            setCity(data[0].name);
                        })
                        .catch((error) => {
                            console.error(error);
                        })
                },
                () => {
                    console.error("Unable to retrieve your location");
                });
        } else {
            console.error("Geolocation not supported");
        }
    }, []);

    const switchCity = (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);
        const cityValue = formData.get('city');

        if(cityValue !== city) {
            setLoading(true);
        }

        setCity(cityValue);
    }

    const addToFavorites = (event) => {
        event.preventDefault();

        if(!favorites.includes(city) && city.length) {
            setFavorites([
                ...favorites,
                city
            ]);
        }
    }

    const deleteFavorite = (event, index) => {
        event.preventDefault();

        favorites.splice(index, 1);
        setFavorites([
            ...favorites
        ]);
    }

    const displayFavorite = (event, index) => {
        event.stopPropagation();
        if(favorites[index] !== city) {
            setLoading(true);
        }

        setCity(favorites[index]);
    };

    return (
        <>
            <div className="d-flex justify-content-around">
                <Form onSubmit={switchCity} className="w-50 d-flex justify-content-center" id="city-form">
                    <InputGroup>
                        <Form.Control type="text" name="city" id="city" />
                        <Button className="btn btn-primary" type="submit">
                            <Search />
                        </Button>
                    </InputGroup>
                </Form>
                {favorites.length ? (
                    <>
                        <Dropdown>
                            <Dropdown.Toggle variant="success" id="dropdown-autoclose-false">
                                Favoris
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                {favorites.map((favorite, index) => (
                                    <Dropdown.Item href="#main" key={index} className="favorite-item">
                                        <span onClick={(event) => displayFavorite(event, index)}>{favorite}</span>
                                        <Button onClick={(event) => deleteFavorite(event, index)}>
                                            <X></X>
                                        </Button>
                                    </Dropdown.Item>
                                ))}
                            </Dropdown.Menu>
                        </Dropdown>
                    </>
                ) : ''}
            </div>
            <div>
                {loading != null ? (
                    <>
                        <h2>
                            {city}
                            <Button className="btn btn-dark ms-2" onClick={addToFavorites}>
                                <StarFill />
                            </Button>
                        </h2>
                        <Tabs>
                            <Tab title="Météo actuelle" eventKey="current-day">
                                <CurrentWeather city={city} loading={loading} setLoading={setLoading}/>
                            </Tab>
                            <Tab title="Météo sur 5 jours" eventKey="five-days">
                                <FiveDaysWeather city={city} loading={loading} setLoading={setLoading}/>
                            </Tab>
                        </Tabs>
                    </>
                ) : "Aucune ville précédemment sélectionnée"}
            </div>
        </>
    );
}

export default Weather;
