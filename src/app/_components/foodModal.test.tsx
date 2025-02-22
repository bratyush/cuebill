import { render, screen, fireEvent } from '@testing-library/react';
import Food from './foodModal';
import { ItemType } from '~/types/myTypes';

const mockItems: ItemType[] = [
  { id: 1, name: 'Pizza', price: 100, active: true, club: 'A' },
  { id: 2, name: 'Burger', price: 50, active: true, club: 'A' },
];

describe('Food Component', () => {
  const closeMock = jest.fn();
  const saveMock = jest.fn();

  beforeEach(() => {
    render(<Food billId={1} items={mockItems} close={closeMock} save={saveMock} />);
  });

  it('renders the component correctly', () => {
    expect(screen.getByText(/Canteen Bill/i)).toBeInTheDocument();
  });

  it('allows selecting an item and entering quantity', () => {
    const select = screen.getByPlaceholderText(/Select an item/i);
    fireEvent.change(select, { target: { value: '1' } }); // Select Pizza

    const quantityInput = screen.getByPlaceholderText(/quantity/i);
    fireEvent.change(quantityInput, { target: { value: '2' } }); // Set quantity to 2

    expect(screen.getByText(/Cost/i)).toBeInTheDocument();
    expect(screen.getByText(/₹200/i)).toBeInTheDocument(); // Check if cost is calculated correctly
  });

  it('calls save function with total amount when Save Canteen is clicked', () => {
    const totalAmount = 200; // Assuming total amount is calculated as 200
    fireEvent.click(screen.getByText(/Save Canteen/i));
    expect(saveMock).toHaveBeenCalledWith(totalAmount);
  });

  it('calls close function when Close button is clicked', () => {
    fireEvent.click(screen.getByText(/Close/i));
    expect(closeMock).toHaveBeenCalled();
  });
}); 