import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Weather from "../views/Weather";
import { fetchData } from "../utils/functions";

jest.mock("../utils/functions", () => ({
    fetchData: jest.fn(),
}));

jest.mock("../views/Weather/CurrentWeather", () => () => (
    <div>Mocked CurrentWeather</div>
));

jest.mock("../views/Weather/FiveDaysWeather", () => () => (
    <div>Mocked FiveDaysWeather</div>
));

describe("Weather component", () => {
    test("affiche le message par défaut", () => {
        render(<Weather />);
        expect(screen.getByText(/Aucune ville sélectionnée/i)).toBeInTheDocument();
        expect(screen.getByRole("textbox")).toBeInTheDocument();
        expect(screen.getByRole("button")).toBeInTheDocument();
    });

    test("met à jour la ville via le formulaire", async () => {
        fetchData.mockResolvedValueOnce({
            dt: Date.now(),
            weather: [{ description: "ciel dégagé", icon: "01n" }],
            name: "Paris",
        });

        render(<Weather />);
        const input = screen.getByRole("textbox");
        fireEvent.change(input, { target: { value: "Paris" } });
        fireEvent.click(screen.getByRole("button", {type: 'submit'}));

        await waitFor(() => {
            expect(screen.getByDisplayValue("Paris")).toBeInTheDocument();
        });
    });

    test("ajoute une ville aux favoris et peut la supprimer", async () => {
        fetchData.mockResolvedValueOnce({
            dt: Date.now(),
            weather: [{ description: "ciel dégagé", icon: "01n", id: 800, main: "Clear" }],
            name: "Paris",
        });

        render(<Weather />);
        fireEvent.change(screen.getByRole("textbox"), { target: { value: "Paris" } });
        fireEvent.click(screen.getByRole("button", { name: "search" }));

        await waitFor(() => {
            expect(screen.getByText(/Paris/i)).toBeInTheDocument();
        });

        fireEvent.click(screen.getByRole("button", { name: "addfav" }));

        fireEvent.click(screen.getByText(/Favoris/i));
        expect(screen.getByRole("button", { name: "removefav0" })).toBeInTheDocument();

        const deleteBtn = screen.getByRole("button", { name: "removefav0" });
        fireEvent.click(deleteBtn);

        expect(screen.queryByRole("button", { name: "removefav0" })).not.toBeInTheDocument();
    });

    test("affiche les onglets quand loading !== null", async () => {
        fetchData.mockResolvedValueOnce({
            dt: Date.now(),
            weather: [{ description: "ensoleillé", icon: "01d" }],
            name: "Marseille",
        });

        render(<Weather />);
        fireEvent.change(screen.getByRole("textbox"), { target: { value: "Paris" } });
        fireEvent.click(screen.getByRole("button"));

        await waitFor(() => {
            expect(screen.getByText(/Météo actuelle/i)).toBeInTheDocument();
        });

        await waitFor(() => {
            expect(screen.getByText(/Météo sur 5 jours/i)).toBeInTheDocument();
        });
    });

    test("utilise la géolocalisation pour récupérer une ville", async () => {
        navigator.geolocation.getCurrentPosition.mockImplementationOnce((success) =>
            success({ coords: { latitude: 48.8566, longitude: 2.3522 } })
        );

        fetchData.mockResolvedValueOnce([{ name: "Paris" }]);

        render(<Weather />);

        await waitFor(() => {
            expect(screen.getByText(/Paris/i)).toBeInTheDocument();
        });
    });

    test("affiche un message si la géolocalisation échoue", async () => {
        navigator.geolocation.getCurrentPosition.mockImplementationOnce((_, error) =>
            error(new Error("Permission refusée"))
        );

        render(<Weather />);

        await waitFor(() => {
            expect(screen.getByText(/Aucune ville sélectionnée/i)).toBeInTheDocument();
        });
    });
});