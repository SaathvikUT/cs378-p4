import React, { useState, useEffect } from 'react';
import './App.css';
import StatsChart from './StatsChart';

function App() {
  const [pokemonNameInput, setPokemonNameInput] = useState('');
  const [pokemonButtons, setPokemonButtons] = useState(['pikachu', 'bulbasaur', 'charizard']);
  const [currentPokemon, setCurrentPokemon] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchPokemonData('pikachu');
  }, []);

  async function fetchPokemonData(name) {
    try {
      setErrorMessage(''); // clear any previous error
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`);
      if (!response.ok) {
        throw new Error('Not found');
      }
      const data = await response.json();
      setCurrentPokemon(data);
      
      // If this is a new Pokémon, add it to the buttons list
      if (!pokemonButtons.includes(name.toLowerCase())) {
        setPokemonButtons([...pokemonButtons, name.toLowerCase()]);
      }
    } catch (error) {
      console.error(error);
      setCurrentPokemon(null);
      setErrorMessage(`Could not find Pokémon: ${name}`);
    }
  }

  const handlePokemonButton = (name) => {
    fetchPokemonData(name);
  };

  const handleAddPokemon = () => {
    if (pokemonNameInput.trim()) {
      fetchPokemonData(pokemonNameInput.trim());
      setPokemonNameInput('');
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Pokémon Stats App</h1>
      </header>
      
      <main>
        <div className="top-controls">
          <input
            type="text"
            placeholder="Enter Pokémon name"
            value={pokemonNameInput}
            onChange={(e) => setPokemonNameInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') handleAddPokemon();
            }}
          />
          <button className="add-button" onClick={handleAddPokemon}>+</button>
        </div>

        <div className="buttons-row">
          {pokemonButtons.map((name) => (
            <button 
              key={name} 
              className="pokemon-button" 
              onClick={() => handlePokemonButton(name)}
            >
              {name.charAt(0).toUpperCase() + name.slice(1)}
            </button>
          ))}
        </div>

        {errorMessage && (
          <div className="error-message">
            {errorMessage}
          </div>
        )}

        <section className="pokemon-display">
          {currentPokemon ? (
            <div className="pokemon-info">
              <h2>{currentPokemon.name.toUpperCase()} (ID: {currentPokemon.id})</h2>
              <div className="pokemon-details">
                <p><strong>Base Experience:</strong> {currentPokemon.base_experience}</p>
                <p><strong>Height:</strong> {currentPokemon.height / 10}m</p>
                <p><strong>Weight:</strong> {currentPokemon.weight / 10}kg</p>
                <p><strong>Type(s):</strong> {currentPokemon.types.map(t => 
                  t.type.name.charAt(0).toUpperCase() + t.type.name.slice(1)
                ).join(', ')}</p>
              </div>
              <div className="stats-container">
                <h3>Base Stats</h3>
                <ul className="stats-list">
                  {currentPokemon.stats.map((statObj) => (
                    <li key={statObj.stat.name}>
                      <span className="stat-name">
                        {statObj.stat.name.replace('-', ' ').toUpperCase()}:
                      </span>
                      <span className="stat-value">{statObj.base_stat}</span>
                    </li>
                  ))}
                </ul>
                <StatsChart stats={currentPokemon.stats} />
              </div>
            </div>
          ) : (
            <div className="placeholder-text">
              Select or add a Pokémon to see its stats
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App; 