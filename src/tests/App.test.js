import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PlanetTable from '../components/PlanetTable';
import testData from '../../cypress/mocks/testData';

describe('Planet Table test', () => {
  beforeEach(() => {
    jest.spyOn(global, 'fetch');
    global.fetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue(testData),
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
  
  test('testando filtro simples', async () => {
    render(<PlanetTable />);

    fireEvent.change(screen.getByTestId('column-filter'), { target: { value: 'diameter' } });
    fireEvent.change(screen.getByTestId('comparison-filter'), { target: { value: 'igual a' } });
    fireEvent.change(screen.getByTestId('value-filter'), { target: { value: '12500' } });
    fireEvent.click(screen.getByTestId('button-filter'));

    await waitFor(() => {
      expect(screen.getByText('Alderaan')).toBeInTheDocument();
    });
  });

  test('testando se esta sendo renderizado na Table e aplica o filtro', async () => {
    render(<PlanetTable />);

    expect(screen.getByTestId('name-filter')).toBeInTheDocument();
    expect(screen.getByTestId('column-filter')).toBeInTheDocument();
    expect(screen.getByTestId('comparison-filter')).toBeInTheDocument();
    expect(screen.getByTestId('value-filter')).toBeInTheDocument();
    expect(screen.getByTestId('button-filter')).toBeInTheDocument();

    fireEvent.change(screen.getByTestId('name-filter'), { target: { value: 'Tatooine' } });
    fireEvent.change(screen.getByTestId('column-filter'), { target: { value: 'population' } });
    fireEvent.change(screen.getByTestId('comparison-filter'), { target: { value: 'maior que' } });
    fireEvent.change(screen.getByTestId('value-filter'), { target: { value: '100000' } });
    fireEvent.click(screen.getByTestId('button-filter'));

    await waitFor(() => {
      expect(screen.getByText('Tatooine')).toBeInTheDocument();
    });

    expect(screen.getByText('Tatooine')).toBeInTheDocument();
    expect(screen.getByText('200000')).toBeInTheDocument();
  });

  test('testa se ao clicar no botão X remove o filtro', async () => {
    render(<PlanetTable />);

    fireEvent.change(screen.getByTestId('column-filter'), { target: { value: 'population' } });
    fireEvent.change(screen.getByTestId('comparison-filter'), { target: { value: 'igual a' } });
    fireEvent.change(screen.getByTestId('value-filter'), { target: { value: '100000' } });
    fireEvent.click(screen.getByTestId('button-filter'));

    expect(screen.getByTestId('filter')).toBeInTheDocument();
    expect(screen.getByText('population - igual a - 100000')).toBeInTheDocument();

    fireEvent.click(screen.getByText('X'));

    await waitFor(() => {
      expect(screen.queryByTestId('filter')).not.toBeInTheDocument();
    });
  });

  test('testa se ao clicar no botão de remover todos, todos os filtros são removidos', async () => {
    render(<PlanetTable />);

    fireEvent.change(screen.getByTestId('column-filter'), { target: { value: 'population' } });
    fireEvent.change(screen.getByTestId('comparison-filter'), { target: { value: 'maior que' } });
    fireEvent.change(screen.getByTestId('value-filter'), { target: { value: '100000' } });
    fireEvent.click(screen.getByTestId('button-filter'));

    fireEvent.change(screen.getByTestId('column-filter'), { target: { value: 'diameter' } });
    fireEvent.change(screen.getByTestId('comparison-filter'), { target: { value: 'menor que' } });
    fireEvent.change(screen.getByTestId('value-filter'), { target: { value: '10000' } });
    fireEvent.click(screen.getByTestId('button-filter'));

    expect(screen.getAllByTestId('filter')).toHaveLength(2);

    fireEvent.click(screen.getByTestId('button-remove-filters'));

    await waitFor(() => {
      expect(screen.queryByTestId('filter')).not.toBeInTheDocument();
    });
  });
});
