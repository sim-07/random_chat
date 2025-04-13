import React from 'react';
import HeroSection from '../components/HeroSection';
import Header from '../components/Header';
import MiddleSection from '../components/MiddleSection';
import Footer from '../components/Footer';

function Home() {
    return (
        <div>
            <Header />
            <HeroSection />
            <MiddleSection />
            <Footer />
        </div>
    );
}

export default Home