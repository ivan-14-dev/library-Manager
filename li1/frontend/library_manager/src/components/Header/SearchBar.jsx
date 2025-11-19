// src/components/Header/SearchBar.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiX } from 'react-icons/fi';
import {
  SearchContainer,
  SearchForm,
  SearchInputWrapper,
  SearchInput,
  ClearButton
} from './Header.styles';

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  return (
    <SearchContainer>
      <SearchForm
        onSubmit={handleSearch}
        $isFocused={isFocused}
      >
        <SearchInputWrapper>
          <FiSearch className="search-icon" />
          <SearchInput
            type="text"
            placeholder="Rechercher un livre, auteur..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          {searchQuery && (
            <ClearButton
              type="button"
              onClick={() => setSearchQuery('')}
            >
              <FiX />
            </ClearButton>
          )}
        </SearchInputWrapper>
      </SearchForm>
    </SearchContainer>
  );
};

export default SearchBar;