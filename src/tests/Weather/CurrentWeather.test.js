import { render, screen, waitFor } from "@testing-library/react";
import CurrentWeather from "../../views/Weather/CurrentWeather";
import { fetchData } from "../../utils/functions";

jest.mock("../../utils/functions", () => ({
    fetchData: jest.fn(),
}));

describe("CurrentWeather", () => {
    test("affiche la météo récupérée depuis l'API", async () => {
        fetchData.mockResolvedValueOnce({
            dt: 1234567890,
            weather: [{ description: "ciel dégagé" }],
            main: { temp: 20 },
        });

        render(
            <CurrentWeather
                city="Paris"
                loading={false}
                setLoading={jest.fn()}
                setMessage={jest.fn()}
            />
        );

        await waitFor(() => {
            expect(screen.getByText(/ciel dégagé/i)).toBeInTheDocument();
        });
    });
});