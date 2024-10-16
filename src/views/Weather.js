import {useState} from "react";
import CurrentWeather from "./Weather/CurrentWeather";
import FiveDaysWeather from "./Weather/FiveDaysWeather";
import {Tab, Tabs} from "react-bootstrap";

function Weather() {
  const [city, setCity] = useState('');

  const switchCity = (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const cityValue = formData.get('city');

    setCity(cityValue);
  }

  return (
    <>
      <form onSubmit={switchCity}>
        <input type="text" name="city" id="city" />
        <button type="submit">Rechercher</button>
      </form>
      <div>
        <h2>{city}</h2>
        <Tabs>
          <Tab title="Météo actuelle" eventKey="current-day">
            <CurrentWeather city={city}/>
          </Tab>
          <Tab title="Météo sur 5 jours" eventKey="five-days">
            <FiveDaysWeather city={city}/>
          </Tab>
        </Tabs>
      </div>
    </>
  );
}

export default Weather;
