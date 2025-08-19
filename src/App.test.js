import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Weather component', () => {
  render(<App />);
    expect(screen.getByText(/Aucune ville sélectionnée/i)).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "" })).toBeInTheDocument(); // input city
    expect(screen.getByRole("button")).toBeInTheDocument(); // bouton recherche
});
