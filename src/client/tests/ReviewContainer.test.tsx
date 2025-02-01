import { render, screen, waitFor, act } from '@testing-library/react';
import ReviewContainer from '../components/ReviewContainer';

global.fetch = jest.fn();

describe('ReviewContainer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('displays initial loading state', () => {
    render(<ReviewContainer />);
    expect(screen.getByText('Loading reviews...')).toBeInTheDocument();
  });

  it('displays reviews upon successful fetch', async () => {
    const mockReviews = [
      {
        id: '1',
        content: 'Trash!',
        author: 'B1gg3stH8t3r',
        score: 1,
        timestamp: '2025-01-31T12:00:00Z',
        appId: '1337'
      },
    ];

    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockReviews,
    });

    render(<ReviewContainer />);

    await waitFor(() => {
      expect(screen.getByText('Trash!')).toBeInTheDocument();
      expect(screen.getByText('B1gg3stH8t3r')).toBeInTheDocument();
      expect(screen.queryByText('I love this app!')).not.toBeInTheDocument();
    });
  });

  it('displays error message on fetch failure', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
    })

    render(<ReviewContainer />);

    await waitFor(() => {
      expect(screen.getByText('Error: Failed to fetch reviews')).toBeInTheDocument();
    })
  });
});