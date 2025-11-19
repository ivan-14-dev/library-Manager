import React, { useState, useEffect } from 'react';
import {
  HeroSection,
  HeroOverlay,
  HeroContent,
  HeroMaxWidth,
  HeroTitle,
  HeroSubtitle,
  HeroButtons,
  HeroButton
} from './Hero.styles';

const Hero = () => {
  const titles = [
    "Partager votre experience Personnelle et Professionnel",
    "Solution Professionnelle Collaborative A Portee de Main",
    "Interface Éducative et interactive Professionnel",
    "Creer votre propre communauter de lecture et Nourissez votre curiosite ",
    "Hub d'Apprentissage et de Recherche Intelligent pour Vous"
  ];

  const backgroundImages = [
    "https://cdn.pixabay.com/photo/2021/12/09/12/45/books-6858688_1280.jpg",
    "https://cdn.pixabay.com/photo/2015/11/19/21/10/library-1052834_1280.jpg",
    "https://media.istockphoto.com/id/1964700460/photo/stack-of-colorful-books-education-background-back-to-school-book-hardback-colorful.jpg?s=1024x1024&w=is&k=20&c=example",
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1440&h=400&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1440&h=400&fit=crop&crop=center"
  ];

  const animations = [
    { transform: 'translateY(-30px) rotateX(90deg)', opacity: 0 },
    { transform: 'translateX(-100%)', opacity: 0 },
    { transform: 'scale(0.5)', opacity: 0 },
    { transform: 'translateY(50px) rotateY(45deg)', opacity: 0 },
    { transform: 'translateX(100%) skewX(30deg)', opacity: 0 }
  ];

  const [currentTitleIndex, setCurrentTitleIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationType, setAnimationType] = useState(0);
  const [imageAnimating, setImageAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setImageAnimating(true);
      setTimeout(() => {
        const nextIndex = (currentTitleIndex + 1) % titles.length;
        setCurrentTitleIndex(nextIndex);
        setCurrentImageIndex(nextIndex);
        setAnimationType(Math.floor(Math.random() * animations.length));
        setIsAnimating(false);
        setImageAnimating(false);
      }, 600); // Animation duration
    }, 3500); // Change every 3.5 seconds

    return () => clearInterval(interval);
  }, [currentTitleIndex, titles.length, animations.length]);

  return (
    <HeroSection style={{
      backgroundImage: `url('${backgroundImages[currentImageIndex]}')`,
      filter: imageAnimating ? 'blur(2px) brightness(0.8)' : 'blur(0px) brightness(1)',
      transition: 'all 1.2s ease-in-out'
    }}>
      <HeroOverlay />
      <HeroContent>
        <HeroMaxWidth>
          <HeroTitle style={{
            opacity: isAnimating ? 0 : 1,
            transform: isAnimating ? animations[animationType].transform : 'translateY(0) rotateX(0deg) rotateY(0deg) scale(1) skewX(0deg)',
            transition: 'all 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)'
          }}>
            {titles[currentTitleIndex]}
          </HeroTitle>
          <HeroSubtitle>
            Publiez, partagez et collaborez autour des livres, e-books, articles et thèses. Rejoignez notre communauté académique interactive et sécurisée.
          </HeroSubtitle>
          <HeroButtons>
            <HeroButton className="primary">
              Commencer à publier
            </HeroButton>
            <HeroButton className="secondary">
              Explorer la bibliothèque
            </HeroButton>
          </HeroButtons>
        </HeroMaxWidth>
      </HeroContent>
    </HeroSection>
  );
};

export default Hero;