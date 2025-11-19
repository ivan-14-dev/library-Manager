// src/components/Categories/CategoryMenu.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MegaMenu,
  MegaMenuGrid,
  CategoryColumn,
  CategoryTitle,
  SubcategoryGroup,
  SubcategoryTitle,
  SubcategoryList,
  SubcategoryItem,
  MobileCategoryMenu,
  MobileCategorySection,
  MobileCategoryHeader,
  MobileSubcategoryList
} from './Category.styles';

const CategoryMenu = ({ isOpen, onClose, mobile = false }) => {
  const navigate = useNavigate();

  // Catégories adaptées au design épuré
  const allCategories = {
    'Littérature': {
      subcategories: {
        'Romans': 'Fiction contemporaine et classique',
        'Poésie': 'Œuvres poétiques et anthologies',
        'Théâtre': 'Pièces et œuvres dramatiques',
        'Essais': 'Réflexions et analyses littéraires'
      }
    },
    'Sciences & Savoirs': {
      subcategories: {
        'Sciences Exactes': 'Mathématiques, Physique, Chimie',
        'Sciences Humaines': 'Histoire, Philosophie, Sociologie',
        'Sciences Naturelles': 'Biologie, Écologie, Géologie',
        'Technologie': 'Informatique, Ingénierie, Innovation'
      }
    },
    'Arts & Culture': {
      subcategories: {
        'Beaux-Arts': 'Peinture, Sculpture, Architecture',
        'Musique': 'Histoire, Théorie, Partitions',
        'Cinéma': 'Analyse, Scénarios, Histoire',
        'Photographie': 'Art, Technique, Monographies'
      }
    },
    'Éducation': {
      subcategories: {
        'Manuels Scolaires': 'Primaire, Secondaire, Supérieur',
        'Pédagogie': 'Méthodes, Recherche, Innovation',
        'Langues': 'Apprentissage, Dictionnaires, Grammaire',
        'Préparation': 'Concours, Examens, Tests'
      }
    }
  };

  const handleCategorySelect = (mainCat, subCat) => {
    navigate(`/category/${mainCat.toLowerCase()}/${subCat.toLowerCase()}`);
    onClose();
  };

  if (!isOpen) return null;

  if (mobile) {
    return (
      <MobileCategoryMenu>
        {Object.entries(allCategories).map(([category, data]) => (
          <MobileCategorySection key={category}>
            <MobileCategoryHeader>
              {category}
            </MobileCategoryHeader>
            <MobileSubcategoryList>
              {Object.entries(data.subcategories).map(([sub, description]) => (
                <div key={sub}>
                  <SubcategoryTitle>{sub}</SubcategoryTitle>
                  <SubcategoryItem 
                    onClick={() => handleCategorySelect(category, sub)}
                  >
                    {description}
                  </SubcategoryItem>
                </div>
              ))}
            </MobileSubcategoryList>
          </MobileCategorySection>
        ))}
      </MobileCategoryMenu>
    );
  }

  return (
    <MegaMenu>
      <MegaMenuGrid>
        {Object.entries(allCategories).map(([category, data]) => (
          <CategoryColumn key={category}>
            <CategoryTitle>
              {category}
            </CategoryTitle>
            {Object.entries(data.subcategories).map(([sub, description]) => (
              <SubcategoryGroup key={sub}>
                <SubcategoryTitle>{sub}</SubcategoryTitle>
                <SubcategoryList>
                  <SubcategoryItem 
                    onClick={() => handleCategorySelect(category, sub)}
                  >
                    {description}
                  </SubcategoryItem>
                </SubcategoryList>
              </SubcategoryGroup>
            ))}
          </CategoryColumn>
        ))}
      </MegaMenuGrid>
    </MegaMenu>
  );
};

export default CategoryMenu;