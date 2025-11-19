import React from 'react';
import {
  Section,
  SectionContainer,
  SectionHeader,
  SectionTitle,
  SectionSubtitle,
  DomainsGrid,
  DomainCard,
  DomainIcon,
  DomainImage,
  DomainTitle,
  DomainTags,
  DomainTag,
  DomainDescription,
  DomainCount
} from './Home.styles';

const AcademicDomains = () => {
  const domains = [
    {
      title: "Programmation",
      tags: ["Java", "Python", "C++"],
      description: "Développement logiciel, algorithmes, structures de données",
      publications: "1,247 publications",
      iconUrl: "https://readdy.ai/api/search-image?query=Computer%20programming%20and%20software%20development%20icon%20illustration%2C%20modern%20tech%20symbols%20with%20clean%20blue%20background%2C%20minimalist%20digital%20design&width=64&height=64&seq=ict-prog&orientation=squarish",
      color: "blue"
    },
    {
      title: "Sécurité Informatique",
      tags: ["Cryptographie", "Ethical Hacking"],
      description: "Cybersécurité, analyse des vulnérabilités",
      publications: "892 publications",
      iconUrl: "https://readdy.ai/api/search-image?query=Network%20security%20and%20cybersecurity%20shield%20icon%2C%20digital%20protection%20symbols%20with%20clean%20blue%20background%2C%20modern%20security%20illustration&width=64&height=64&seq=ict-security&orientation=squarish",
      color: "blue"
    },
    {
      title: "Management",
      tags: ["GRH", "Finance", "Leadership"],
      description: "Gestion d'entreprise, stratégie organisationnelle",
      publications: "654 publications",
      iconUrl: "https://readdy.ai/api/search-image?query=Business%20management%20and%20strategy%20icons%2C%20corporate%20finance%20symbols%20with%20clean%20orange%20background%2C%20professional%20business%20illustration&width=64&height=64&seq=bms-mgmt&orientation=squarish",
      color: "orange"
    },
    {
      title: "Marketing Digital",
      tags: ["SEO", "Social Media", "E-commerce"],
      description: "Communication digitale, analyse de marché",
      publications: "523 publications",
      iconUrl: "https://readdy.ai/api/search-image?query=Marketing%20and%20digital%20commerce%20icons%2C%20business%20promotion%20symbols%20with%20clean%20orange%20background%2C%20modern%20marketing%20illustration&width=64&height=64&seq=bms-marketing&orientation=squarish",
      color: "orange"
    },
    {
      title: "Open Source",
      tags: ["GitHub", "Linux", "APIs"],
      description: "Projets collaboratifs, code libre, communauté",
      publications: "1,089 publications",
      iconUrl: "https://readdy.ai/api/search-image?query=Open%20source%20software%20and%20collaboration%20icons%2C%20community%20development%20symbols%20with%20clean%20green%20background%2C%20modern%20tech%20sharing%20illustration&width=64&height=64&seq=opensource&orientation=squarish",
      color: "green"
    },
    {
      title: "Data Science",
      tags: ["Machine Learning", "Big Data"],
      description: "Analyse de données, intelligence artificielle",
      publications: "756 publications",
      iconUrl: "https://readdy.ai/api/search-image?query=Data%20science%20and%20analytics%20icons%2C%20artificial%20intelligence%20and%20machine%20learning%20symbols%20with%20clean%20purple%20background%2C%20modern%20data%20visualization&width=64&height=64&seq=datascience&orientation=squarish",
      color: "purple"
    }
  ];

  return (
    <Section>
      <SectionContainer>
        <SectionHeader>
          <SectionTitle>Domaines Académiques</SectionTitle>
          <SectionSubtitle>Explorez nos catégories ICT et BMS avec une organisation claire</SectionSubtitle>
        </SectionHeader>
        <DomainsGrid>
          {domains.map((domain, index) => (
            <DomainCard key={index}>
              <DomainIcon className={domain.color}>
                <DomainImage src={domain.iconUrl} alt={domain.title} />
              </DomainIcon>
              <DomainTitle>{domain.title}</DomainTitle>
              <DomainTags>
                {domain.tags.map((tag, tagIndex) => (
                  <DomainTag key={tagIndex}>{tag}</DomainTag>
                ))}
              </DomainTags>
              <DomainDescription>{domain.description}</DomainDescription>
              <DomainCount className={domain.color}>{domain.publications}</DomainCount>
            </DomainCard>
          ))}
        </DomainsGrid>
      </SectionContainer>
    </Section>
  );
};

export default AcademicDomains;