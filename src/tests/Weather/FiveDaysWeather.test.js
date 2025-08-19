import { render, screen, waitFor } from "@testing-library/react";
import FiveDaysWeather from "../../views/Weather/FiveDaysWeather";
import { fetchData, groupByDate } from "../../utils/functions";
import { formatDate, formatTime } from "../../utils/Date";

jest.mock("../../utils/functions", () => ({
    fetchData: jest.fn(),
    groupByDate: jest.fn(),
}));

jest.mock("../../utils/Date", () => ({
    formatDate: jest.fn(),
    formatTime: jest.fn(),
}));

describe("FiveDaysWeather", () => {
    const mockSetLoading = jest.fn();
    const mockSetMessage = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("affiche le spinner quand loading est true", () => {
        render(
            <FiveDaysWeather
                city=""
                loading={true}
                setLoading={mockSetLoading}
                setMessage={mockSetMessage}
            />
        );

        expect(screen.getByRole("status")).toBeInTheDocument();
        expect(screen.getByText(/Loading/i)).toBeInTheDocument();
    });

    test("affiche un message d'erreur si fetchData échoue", async () => {
        fetchData.mockRejectedValueOnce(new Error("API error"));

        render(
            <FiveDaysWeather
                city="Paris"
                loading={true}
                setLoading={mockSetLoading}
                setMessage={mockSetMessage}
            />
        );

        await waitFor(() => {
            expect(mockSetMessage).toHaveBeenCalledWith(
                "Cette ville n'a pas été trouvée"
            );
        });

        await waitFor(() => {
            expect(mockSetLoading).toHaveBeenCalledWith(null);
        });
    });

    test("affiche correctement les données météo groupées", async () => {
        const mockData = {
            list: {
                "2025-08-17": [
                    {
                        dt_txt: "2025-08-17 12:00:00",
                        weather: [{ icon: "01n", description: "ciel dégagé" }],
                        main: { temp: 23.4 },
                    },
                ],
            },
        };

        fetchData.mockResolvedValueOnce({ list: [] });
        groupByDate.mockReturnValue(mockData.list);
        formatDate.mockImplementation((date) => `jour-${date}`);
        formatTime.mockImplementation((time) => `heure-${time}`);

        render(
            <FiveDaysWeather
                city="Paris"
                loading={false}
                setLoading={mockSetLoading}
                setMessage={mockSetMessage}
            />
        );

        await waitFor(() => {
            expect(screen.getByText(/heure-2025-08-17 12:00:00/i)).toBeInTheDocument();
        });

        await waitFor(() => {
            expect(screen.getByText(/23°C/i)).toBeInTheDocument();
        });

        await waitFor(() => {
            expect(screen.getByText(/ciel dégagé/i)).toBeInTheDocument();
        });
    });
});