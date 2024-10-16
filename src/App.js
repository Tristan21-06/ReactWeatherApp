import logo from './logo.svg';
import './App.css';
import Weather from "./views/Weather";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    return (
        <div className="App">

            <main className="p-4" id="main">
                <img src={logo} className="App-logo" alt="logo"/>

                <Weather/>
            </main>

            <footer className="p-4">
                &copy; Tristan JACQUEMARD
            </footer>
        </div>
    );
}

export default App;
