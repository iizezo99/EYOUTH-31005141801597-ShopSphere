import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Products from '../pages/Products';

const renderProducts = () =>
  render(
    <MemoryRouter>
      <Products />
    </MemoryRouter>
  );

describe('Products page', () => {
  it('shows all products on initial load before searching', async () => {
    renderProducts();

    await waitFor(() => {
      expect(screen.getByTestId('products-grid')).toBeInTheDocument();
    });

    expect(screen.getByText('iPhone 16 Pro')).toBeInTheDocument();
    expect(screen.getByText('Leather Jacket')).toBeInTheDocument();
    expect(screen.getByTestId('product-count')).toHaveTextContent('Showing all 2 products');
  });

  it('filters products when search is submitted', async () => {
    const user = userEvent.setup();
    renderProducts();

    await waitFor(() => {
      expect(screen.getByText('iPhone 16 Pro')).toBeInTheDocument();
    });

    const searchInput = screen.getByLabelText('Search products');
    await user.type(searchInput, 'iPhone');
    await user.click(screen.getByRole('button', { name: 'Search' }));

    await waitFor(() => {
      expect(screen.getByText('iPhone 16 Pro')).toBeInTheDocument();
      expect(screen.queryByText('Leather Jacket')).not.toBeInTheDocument();
    });

    expect(screen.getByTestId('product-count')).toHaveTextContent('Found 1 product');
  });

  it('shows skeleton loaders while fetching', () => {
    renderProducts();
    expect(screen.getAllByTestId('product-skeleton').length).toBeGreaterThan(0);
  });
});
import React from 'react';
