// src/components/common/DataTable.jsx
import React, { useState } from 'react';
import styled from 'styled-components';

/**
 * Tableau de données réutilisable avec pagination et tri
 */
const DataTable = ({ 
  columns, 
  data, 
  renderRow,
  pagination = true,
  itemsPerPage = 10
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  // Tri
  const sortedData = React.useMemo(() => {
    if (!sortConfig.key) return currentItems;
    
    return [...currentItems].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [currentItems, sortConfig]);

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    });
  };

  return (
    <TableContainer>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column, index) => (
              <TableHead 
                key={index}
                $sortable={column.sortable}
                onClick={() => column.sortable && handleSort(column.key)}
              >
                {column.label}
                {sortConfig.key === column.key && (
                  <SortIcon>
                    {sortConfig.direction === 'asc' ? '↑' : '↓'}
                  </SortIcon>
                )}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.map((item, index) => (
            renderRow ? renderRow(item, index) : (
              <TableRow key={index}>
                {columns.map((column, colIndex) => (
                  <TableCell key={colIndex}>
                    {item[column.key]}
                  </TableCell>
                ))}
              </TableRow>
            )
          ))}
        </TableBody>
      </Table>

      {pagination && totalPages > 1 && (
        <Pagination>
          <PaginationButton
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Précédent
          </PaginationButton>
          
          <PageInfo>
            Page {currentPage} sur {totalPages}
          </PageInfo>
          
          <PaginationButton
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Suivant
          </PaginationButton>
        </Pagination>
      )}
    </TableContainer>
  );
};

const TableContainer = styled.div`
  background: ${props => props.theme.colors.white};
  border-radius: 8px;
  overflow: hidden;
  box-shadow: ${props => props.theme.shadows.sm};
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.thead`
  background: ${props => props.theme.colors.gray[50]};
  border-bottom: 1px solid ${props => props.theme.colors.gray[200]};
`;

const TableHead = styled.th`
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: ${props => props.theme.colors.gray[700]};
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  cursor: ${props => props.$sortable ? 'pointer' : 'default'};
  user-select: none;
  
  &:hover {
    background: ${props => props.$sortable ? props.theme.colors.gray[100] : 'none'};
  }
`;

const TableBody = styled.tbody`
  background: ${props => props.theme.colors.white};
`;

const TableRow = styled.tr`
  border-bottom: 1px solid ${props => props.theme.colors.gray[100]};
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background: ${props => props.theme.colors.gray[50]};
  }
`;

const TableCell = styled.td`
  padding: 1rem;
  color: ${props => props.theme.colors.gray[700]};
  font-size: 0.875rem;
`;

const SortIcon = styled.span`
  margin-left: 0.5rem;
  font-weight: bold;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-top: 1px solid ${props => props.theme.colors.gray[200]};
  background: ${props => props.theme.colors.gray[50]};
`;

const PaginationButton = styled.button`
  padding: 0.5rem 1rem;
  border: 1px solid ${props => props.theme.colors.gray[300]};
  border-radius: 6px;
  background: ${props => props.theme.colors.white};
  color: ${props => props.theme.colors.gray[700]};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    border-color: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.primary};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PageInfo = styled.span`
  color: ${props => props.theme.colors.gray[600]};
  font-size: 0.875rem;
`;

export default DataTable;