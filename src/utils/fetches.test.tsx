import { createCanteenBill } from './fetches';

describe('fetches utility functions', () => {
  it('creates a canteen bill successfully', async () => {
    const response = await createCanteenBill(1, 1, 2, 200);
    expect(response).toHaveProperty('status', 'success'); // Adjust based on your API response
  });

  it('throws an error when creating a canteen bill fails', async () => {
    // Mock fetch to simulate an error
    global.fetch = jest.fn(() =>
      Promise.reject(new Error('Network response was not ok'))
    );

    await expect(createCanteenBill(1, 1, 2, 200)).rejects.toThrow('Network response was not ok');
  });
}); 