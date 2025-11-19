import React from 'react';
import {
  Section,
  SectionContainer,
  SectionHeader,
  SectionTitle,
  SectionSubtitle,
  ToolsGrid,
  ToolCard,
  ToolIcon,
  ToolTitle,
  ToolDescription,
  ToolButton
} from './Home.styles';

const CollaborativeTools = () => {
  const tools = [
    {
      title: "Éditeur Collaboratif",
      description: "Écrivez ensemble en temps réel avec suggestions IA intégrées",
      buttonText: "Essayer maintenant",
      icon: "fas fa-edit",
      color: "blue"
    },
    {
      title: "Appels Audio/Vidéo",
      description: "Communiquez directement avec vos collaborateurs",
      buttonText: "Démarrer un appel",
      icon: "fas fa-video",
      color: "orange"
    },
    {
      title: "Chat en Temps Réel",
      description: "Discussions instantanées et commentaires sur les publications",
      buttonText: "Rejoindre le chat",
      icon: "fas fa-comments",
      color: "green"
    }
  ];

  return (
    <Section>
      <SectionContainer>
        <SectionHeader>
          <SectionTitle>Outils Collaboratifs</SectionTitle>
          <SectionSubtitle>Fonctionnalités avancées pour la collaboration académique</SectionSubtitle>
        </SectionHeader>
        <ToolsGrid>
          {tools.map((tool, index) => (
            <ToolCard key={index}>
              <ToolIcon className={tool.color}>
                <i className={tool.icon} />
              </ToolIcon>
              <ToolTitle>{tool.title}</ToolTitle>
              <ToolDescription>{tool.description}</ToolDescription>
              <ToolButton className={tool.color}>
                {tool.buttonText}
              </ToolButton>
            </ToolCard>
          ))}
        </ToolsGrid>
      </SectionContainer>
    </Section>
  );
};

export default CollaborativeTools;