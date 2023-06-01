import React, { useState, useEffect } from 'react';

function PlanetTable() {
  const [name, setName] = useState([]);
  const [nameFilter, setNameFilter] = useState('');
  const [columnFilter, setColumnFilter] = useState('population');
  const [comparisonFilter, setComparisonFilter] = useState('maior que');
  const [valueFilter, setValueFilter] = useState('0');
  const [planetFiltered, setPlanetFiltered] = useState([]);

  useEffect(() => {
    fetch('https://swapi.dev/api/planets')
      .then((res) => res.json())
      .then((data) => {
        const dataResidentsDelete = data.results.map((res) => {
          delete res.residents;
          return res;
        });
        setName(dataResidentsDelete);
        console.log(dataResidentsDelete);
      });
  }, []);

  // Filtra por um input, requisito 2

  const planetFilter = name
    .filter((planet) => planet.name.toLowerCase()
      .includes(nameFilter.toLowerCase()));

  // Filtra por 2 select e 1 input, requisito 3

  const handleFilter = () => {
    const filtered = name.filter((planet) => {
      const columnValue = Number(planet[columnFilter]);
      const filterValue = Number(valueFilter);
      switch (comparisonFilter) {
      case 'maior que':
        return columnValue > filterValue;
      case 'menor que':
        return columnValue < filterValue;
      case 'igual a':
        return columnValue === filterValue;
      default:
        return planet;
      }
    });

    setPlanetFiltered(filtered);
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
          <option value="population">population</option>
          <option value="orbital_period">orbital_period</option>
          <option value="diameter">diameter</option>
          <option value="rotation_period">rotation_period</option>
          <option value="surface_water">surface_water</option>
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
        <button
          type="button"
          data-testid="button-filter"
          onClick={ handleFilter }
        >
          Filtrar
        </button>
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
          {
            (planetFiltered.length > 0 ? planetFiltered : planetFilter)
              .map((planet, index) => (
                <tr key={ index }>
                  <td>{ planet.name }</td>
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
              ))
          }
        </tbody>
      </table>
    </div>
  );
}

export default PlanetTable;
