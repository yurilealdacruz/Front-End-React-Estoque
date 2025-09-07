// em src/components/SearchBar.jsx

import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(searchTerm);
    };

    return (
        <form onSubmit={handleSubmit} className="search-form">
            <div className="search-container">
                <svg className="search-icon" /* ... ícone de busca ... */ ></svg>
                <input 
                    type="text" 
                    placeholder="Buscar..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <button type="submit" className="btn btn-secondary">Buscar</button>
        </form>
    );
};

export default SearchBar;