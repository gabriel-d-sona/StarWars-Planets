import React, { useState, useEffect } from 'react';

function PlanetTable() {
  const [name, setName] = useState([]);
  const [nameFilter, setNameFilter] = useState('');
  const [columnFilter, setColumnFilter] = useState('population');
  const [comparisonFilter, setComparisonFilter] = useState('maior que');
  const [valueFilter, setValueFilter] = useState('0');
  const [filters, setFilters] = useState([]);

  useEffect(() => {
    fetch('https://swapi.dev/api/planets')
      .then((res) => res.json())
      .then((data) => {
        const dataResidentsDelete = data.results.map((res) => {
          delete res.residents;
          return res;
        });
        setName(dataResidentsDelete);
      });
  }, []);

  const filterOptions = [
    'population',
    'orbital_period',
    'diameter',
    'rotation_period',
    'surface_water',
  ].filter((option) => !filters.some((filter) => filter.column === option));

  const filteredPlanets = name.filter((planet) => filters.every((filter) => {
    const columnValue = Number(planet[filter.column]);
    const filterValue = Number(filter.value);

    if (filter.comparison === 'maior que') {
      return columnValue > filterValue;
    } if (filter.comparison === 'menor que') {
      return columnValue < filterValue;
    } if (filter.comparison === 'igual a') {
      return columnValue === filterValue;
    }

    return false;
  }));

  const handleFilter = () => {
    const newFilter = {
      column: columnFilter,
      comparison: comparisonFilter,
      value: valueFilter,
    };

    setFilters([...filters, newFilter]);
    setColumnFilter(filterOptions[0]);
  };

  const removeFilter = (index) => {
    const updatedFilters = [...filters];
    updatedFilters.splice(index, 1);
    setFilters(updatedFilters);
  };

  const removeAllFilters = () => {
    setFilters([]);
  };

  return (
    <div>
      <div>
        <input
          type="text"
          name="name-filter"
          data-testid="name-filter"
          value={ nameFilter }
          onChange={ ({ target }) => setNameFilter(target.value) }
        />
      </div>
      <form>
        <select
          data-testid="column-filter"
          value={ columnFilter }
          onChange={ ({ target }) => setColumnFilter(target.value) }
        >
          {filterOptions.map((option) => (
            <option key={ option } value={ option }>
              {option}
            </option>
          ))}
        </select>
        <select
          data-testid="comparison-filter"
          value={ comparisonFilter }
          onChange={ ({ target }) => setComparisonFilter(target.value) }
        >
          <option value="maior que">maior que</option>
          <option value="menor que">menor que</option>
          <option value="igual a">igual a</option>
        </select>
        <input
          type="text"
          name="value-filter"
          data-testid="value-filter"
          value={ valueFilter }
          onChange={ ({ target }) => setValueFilter(target.value) }
        />
        <button type="button" data-testid="button-filter" onClick={ handleFilter }>
          Filtrar
        </button>
        {filters.map((filter, index) => (
          <div
            data-testid="filter"
            key={ index }
          >
            {`${filter.column} - ${filter.comparison} - ${filter.value}`}
            <button
              type="button"
              onClick={ () => removeFilter(index) }
            >
              X

            </button>
          </div>
        ))}
        {filters.length > 0 && (
          <button
            type="button"
            data-testid="button-remove-filters"
            onClick={ removeAllFilters }
          >
            Remover todas filtragens
          </button>
        )}
      </form>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Rotation Period</th>
            <th>Orbital Period</th>
            <th>Diameter</th>
            <th>Climate</th>
            <th>Gravity</th>
            <th>Terrain</th>
            <th>Surface Water</th>
            <th>Population</th>
            <th>Films</th>
            <th>Created</th>
            <th>Edited</th>
            <th>URL</th>
          </tr>
        </thead>
        <tbody>
          {filteredPlanets
            .filter((planet) => planet.name
              .toLowerCase()
              .includes(nameFilter.toLowerCase()))
            .map((planet, index) => (
              <tr key={ index }>
                <td>{planet.name}</td>
                <td>{planet.rotation_period}</td>
                <td>{planet.orbital_period}</td>
                <td>{planet.diameter}</td>
                <td>{planet.climate}</td>
                <td>{planet.gravity}</td>
                <td>{planet.terrain}</td>
                <td>{planet.surface_water}</td>
                <td>{planet.population}</td>
                <td>{planet.films}</td>
                <td>{planet.created}</td>
                <td>{planet.edited}</td>
                <td>{planet.url}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default PlanetTable;
