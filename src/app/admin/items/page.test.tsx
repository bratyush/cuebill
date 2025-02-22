import { render, screen, fireEvent } from '@testing-library/react';
import ItemsPage from './page';
import { getItems } from '~/utils/fetches';

jest.mock('~/utils/fetches', () => ({
  getItems: jest.fn(),
}));

describe('ItemsPage Component', () => {
  beforeEach(() => {
    (getItems as jest.Mock).mockResolvedValue({ items: [{ id: 1, name: 'Pizza', price: 100 }] });
    render(<ItemsPage />);
  });

  it('fetches and displays items', async () => {
    expect(await screen.findByText(/Pizza/i)).toBeInTheDocument();
    expect(screen.getByText(/Price \(₹\)/i)).toBeInTheDocument();
  });

  it('calls deleteItem and updates the list when an item is deleted', async () => {
    const deleteButton = screen.getByText(/Delete/i);
    fireEvent.click(deleteButton);
    expect(await screen.findByText(/Item deleted/i)).toBeInTheDocument();
  });
}); 