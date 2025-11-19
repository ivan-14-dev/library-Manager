import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useQuery } from 'react-query';
import { FiSearch, FiFilter, FiX } from 'react-icons/fi';
import BookCard from '../components/Books/BooksCard.jsx';
import { booksAPI } from '../api/books';

const CatalogContainer = styled.div`
  padding: 2rem 0;
`;

const PageHeader = styled.div`
  margin-bottom: 2rem;
  text-align: center;

  h1 {
    font-size: 2.5rem;
    color: #2c3e50;
    margin-bottom: 0.5rem;
  }

  p {
    color: #6c757d;
    font-size: 1.1rem;
  }
`;

const SearchSection = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

const SearchForm = styled.form`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 1rem;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const SearchInput = styled.input`
  padding: 1rem;
  border: 2px solid #e9ecef;
  border-radius: 0.5rem;
  font-size: 1rem;

  &:focus {
    border-color: #007bff;
    outline: none;
  }
`;

const FilterSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 2px solid #e9ecef;
  border-radius: 0.5rem;
  background: white;
  font-size: 0.9rem;

  &:focus {
    border-color: #007bff;
    outline: none;
  }
`;

const ActiveFilters = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const FilterTag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: #e3f2fd;
  color: #1976d2;
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  font-size: 0.9rem;

  button {
    background: none;
    color: inherit;
    font-size: 1.1rem;
    padding: 0;
  }
`;

const BooksGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 2rem;
`;

const PageButton = styled.button`
  padding: 0.75rem 1rem;
  border: 2px solid #e9ecef;
  background: white;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    background: #007bff;
    color: white;
    border-color: #007bff;
  }

  &:disabled {
    background: #007bff;
    color: white;
    border-color: #007bff;
    cursor: not-allowed;
  }
`;

const Loading = styled.div`
  text-align: center;
  padding: 3rem;
  font-size: 1.1rem;
  color: #6c757d;
`;

const Error = styled.div`
  text-align: center;
  padding: 3rem;
  color: #dc3545;
  background: #f8d7da;
  border-radius: 0.5rem;
  margin: 2rem 0;
`;

const Catalog = () => {
  const [searchParams, setSearchParams] = useState({
    search: '',
    categories: '',
    language: '',
    status: '',
    page: 1
  });
  const [categories, setCategories] = useState([]);
  const [languages, setLanguages] = useState([]);

  const { data, isLoading, error, refetch } = useQuery(
    ['books', searchParams],
    () => booksAPI.getBooks(searchParams),
    {
      keepPreviousData: true,
    }
  );

  useEffect(() => {
    // Charger les catégories et langues disponibles
    const loadFilters = async () => {
      try {
        const categoriesResponse = await booksAPI.getCategories();
        const booksResponse = await booksAPI.getBooks();
        
        const uniqueLanguages = [...new Set(booksResponse.data.results.map(book => book.language))];
        
        setCategories(categoriesResponse.data);
        setLanguages(uniqueLanguages);
      } catch (err) {
        console.error('Erreur lors du chargement des filtres:', err);
      }
    };

    loadFilters();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    refetch();
  };

  const handleFilterChange = (key, value) => {
    setSearchParams(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page when filters change
    }));
  };

  const clearFilter = (key) => {
    setSearchParams(prev => ({
      ...prev,
      [key]: '',
      page: 1
    }));
  };

  const clearAllFilters = () => {
    setSearchParams({
      search: '',
      categories: '',
      language: '',
      status: '',
      page: 1
    });
  };

  const handlePageChange = (page) => {
    setSearchParams(prev => ({ ...prev, page }));
    window.scrollTo(0, 0);
  };

  const hasActiveFilters = Object.values(searchParams).some(
    (value, key) => key !== 'page' && value
  );

  if (error) {
    return (
      <CatalogContainer className="container">
        <Error>
          <h2>Erreur lors du chargement des livres</h2>
          <p>{error.message}</p>
          <button onClick={() => refetch()} className="btn btn--primary mt-3">
            Réessayer
          </button>
        </Error>
      </CatalogContainer>
    );
  }


  return (
    <CatalogContainer className="container">
      <PageHeader>
        <h1>Catalogue des Livres</h1>
        <p>Découvrez notre collection complète</p>
      </PageHeader>

      <SearchSection>
        <SearchForm onSubmit={handleSearch}>
          <SearchInput
            type="text"
            placeholder="Rechercher un livre, auteur, éditeur..."
            value={searchParams.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
          <button type="submit" className="btn btn--primary">
            <FiSearch /> Rechercher
          </button>
        </SearchForm>

        <FilterSection>
          <div>
            <label className="form__label">Catégorie</label>
            <Select
              value={searchParams.categories}
              onChange={(e) => handleFilterChange('categories', e.target.value)}
            >
              <option value="">Toutes les catégories</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <label className="form__label">Langue</label>
            <Select
              value={searchParams.language}
              onChange={(e) => handleFilterChange('language', e.target.value)}
            >
              <option value="">Toutes les langues</option>
              {languages.map(language => (
                <option key={language} value={language}>
                  {language}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <label className="form__label">Statut</label>
            <Select
              value={searchParams.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="">Tous les statuts</option>
              <option value="AVAILABLE">Disponible</option>
              <option value="BORROWED">Emprunté</option>
              <option value="RESERVED">Réservé</option>
            </Select>
          </div>
        </FilterSection>

        {hasActiveFilters && (
          <ActiveFilters>
            {searchParams.search && (
              <FilterTag>
                Recherche: "{searchParams.search}"
                <button onClick={() => clearFilter('search')}>
                  <FiX />
                </button>
              </FilterTag>
            )}
            {searchParams.categories && (
              <FilterTag>
                Catégorie: {categories.find(c => c.id == searchParams.categories)?.name}
                <button onClick={() => clearFilter('categories')}>
                  <FiX />
                </button>
              </FilterTag>
            )}
            {searchParams.language && (
              <FilterTag>
                Langue: {searchParams.language}
                <button onClick={() => clearFilter('language')}>
                  <FiX />
                </button>
              </FilterTag>
            )}
            {searchParams.status && (
              <FilterTag>
                Statut: {searchParams.status}
                <button onClick={() => clearFilter('status')}>
                  <FiX />
                </button>
              </FilterTag>
            )}
            <button onClick={clearAllFilters} className="btn btn--outline btn--sm">
              <FiX /> Tout effacer
            </button>
          </ActiveFilters>
        )}
      </SearchSection>

      {isLoading ? (
        <Loading>Chargement des livres...</Loading>
      ) : data?.count === 0 || !data?.results?.length ? (
  <NoBooks>
    <h2>Aucun livre disponible</h2>
    <p>La base de données ne contient actuellement aucun livre correspondant à vos critères.</p>
  </NoBooks>
  ) : (
    <>
      <div className="card">
        <div className="card__body">
          <p className="text--muted">
            {data?.count || 0} livre(s) trouvé(s)
              </p>
            </div>
          </div>

          <BooksGrid>
            {data?.results.map(book => (
              <BookCard key={book.id} book={book} />
            ))}
          </BooksGrid>

          {data?.count > 0 && (
            <Pagination>
              <PageButton
                onClick={() => handlePageChange(searchParams.page - 1)}
                disabled={searchParams.page === 1}
              >
                Précédent
              </PageButton>
              
              {Array.from({ length: Math.ceil(data.count / 20) }, (_, i) => i + 1)
                .slice(Math.max(0, searchParams.page - 3), searchParams.page + 2)
                .map(page => (
                  <PageButton
                    key={page}
                    onClick={() => handlePageChange(page)}
                    disabled={page === searchParams.page}
                  >
                    {page}
                  </PageButton>
                ))}
              
              <PageButton
                onClick={() => handlePageChange(searchParams.page + 1)}
                disabled={!data.next}
              >
                Suivant
              </PageButton>
            </Pagination>
          )}
        </>
      )}
    </CatalogContainer>
  );
};

export default Catalog;