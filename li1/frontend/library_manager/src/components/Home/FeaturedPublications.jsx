import React from 'react';
import {
  Section,
  SectionContainer,
  SectionHeader,
  SectionTitle,
  SectionSubtitle,
  PublicationsGrid,
  PublicationCard,
  PublicationImage,
  PublicationImg,
  PublicationContent,
  PublicationHeader,
  PublicationBadge,
  PublicationRating,
  PublicationTitle,
  PublicationDescription,
  PublicationFooter,
  PublicationAuthor,
  AuthorIcon,
  AuthorName,
  PublicationViews
} from './Home.styles';

const FeaturedPublications = () => {
  const publications = [
    {
      title: "Intelligence Artificielle Appliquée",
      type: "PREMIUM",
      typeColor: "premium",
      rating: 5,
      description: "Une approche pratique du machine learning pour les étudiants en informatique...",
      author: "Dr. Kouame Jean",
      views: "2,341 lectures",
      imageUrl: "https://readdy.ai/api/search-image?query=Academic%20research%20book%20cover%20about%20artificial%20intelligence%20and%20machine%20learning%2C%20professional%20educational%20design%20with%20blue%20and%20white%20background%2C%20modern%20university%20textbook%20style&width=300&height=200&seq=pub-ai&orientation=landscape"
    },
    {
      title: "Stratégies Marketing Digitales",
      type: "PUBLIC",
      typeColor: "public",
      rating: 4,
      description: "Guide complet pour développer une présence en ligne efficace...",
      author: "Prof. Aïcha Traoré",
      views: "1,876 lectures",
      imageUrl: "https://readdy.ai/api/search-image?query=Business%20management%20thesis%20cover%20design%2C%20corporate%20strategy%20and%20finance%20book%20with%20professional%20orange%20and%20blue%20color%20scheme%2C%20academic%20publication%20style&width=300&height=200&seq=pub-business&orientation=landscape"
    },
    {
      title: "Cybersécurité Avancée",
      type: "PRIVÉ",
      typeColor: "private",
      rating: 5,
      description: "Techniques modernes de protection des systèmes d'information...",
      author: "Dr. Mohamed Diallo",
      views: "987 lectures",
      imageUrl: "https://readdy.ai/api/search-image?query=Cybersecurity%20and%20network%20protection%20academic%20book%20cover%2C%20digital%20security%20illustration%20with%20blue%20and%20orange%20professional%20design%2C%20university%20textbook%20style&width=300&height=200&seq=pub-security&orientation=landscape"
    }
  ];

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      if (i < rating) {
        stars.push(<i key={i} className="fas fa-star"></i>);
      } else {
        stars.push(<i key={i} className="far fa-star"></i>);
      }
    }
    return stars;
  };

  return (
    <Section>
      <SectionContainer>
        <SectionHeader>
          <SectionTitle>Publications en Vedette</SectionTitle>
          <SectionSubtitle>Découvrez les contenus premium et publications populaires</SectionSubtitle>
        </SectionHeader>
        <PublicationsGrid>
          {publications.map((pub, index) => (
            <PublicationCard key={index}>
              <PublicationImage>
                <PublicationImg src={pub.imageUrl} alt={pub.title} />
              </PublicationImage>
              <PublicationContent>
                <PublicationHeader>
                  <PublicationBadge className={pub.typeColor}>
                    {pub.type}
                  </PublicationBadge>
                  <PublicationRating>
                    {renderStars(pub.rating)}
                  </PublicationRating>
                </PublicationHeader>
                <PublicationTitle>{pub.title}</PublicationTitle>
                <PublicationDescription>{pub.description}</PublicationDescription>
                <PublicationFooter>
                  <PublicationAuthor>
                    <AuthorIcon className="fas fa-user-check" />
                    <AuthorName>{pub.author}</AuthorName>
                  </PublicationAuthor>
                  <PublicationViews>{pub.views}</PublicationViews>
                </PublicationFooter>
              </PublicationContent>
            </PublicationCard>
          ))}
        </PublicationsGrid>
      </SectionContainer>
    </Section>
  );
};

export default FeaturedPublications;