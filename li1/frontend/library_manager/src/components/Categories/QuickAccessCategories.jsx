// src/components/Categories/QuickAccessCategories.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  QuickAccessGrid,
  QuickAccessItem,
  QuickAccessIcon,
  QuickAccessLabel
} from './Category.styles';

const QuickAccessCategories = () => {
  const navigate = useNavigate();

  const quickCategories = [
    { icon: '📖', label: 'Littérature', path: '/category/litterature' },
    { icon: '🔬', label: 'Sciences', path: '/category/sciences' },
    { icon: '🎨', label: 'Arts', path: '/category/arts' },
    { icon: '🏫', label: 'Éducation', path: '/category/education' },
    { icon: '💼', label: 'Professionnel', path: '/category/professionnel' },
    { icon: '🌍', label: 'Voyage', path: '/category/voyage' }
  ];

  const handleCategoryClick = (path) => {
    navigate(path);
  };

  return (
    <QuickAccessGrid>
      {quickCategories.map((category, index) => (
        <QuickAccessItem 
          key={index}
          onClick={() => handleCategoryClick(category.path)}
        >
          <QuickAccessIcon>{category.icon}</QuickAccessIcon>
          <QuickAccessLabel>
            {category.label}
          </QuickAccessLabel>
        </QuickAccessItem>
      ))}
    </QuickAccessGrid>
  );
};

export default QuickAccessCategories;