import React from 'react';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import HomeHero from '../components/Hero/Hero';
import AcademicDomains from '../components/Home/AcademicDomains';
import FeaturedPublications from '../components/Home/FeaturedPublications';
import CommunityStats from '../components/Home/CommunityStats';
import CollaborativeTools from '../components/Home/CollaborativeTools';

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <HomeHero />
        <AcademicDomains />
        <FeaturedPublications />
        <CommunityStats />
        <CollaborativeTools />
      <Footer />
    </div>
  );
};

export default Home;