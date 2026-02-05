import React from 'react';
import Forbidden from './Forbidden';
import OurProducts from '../component/OurProducts';
import HowItWorks from '../component/HowItWorks';
import CustomerFeedback from '../component/CustomerFeedback';
import HeroBanner from '../component/HeroBanner';

const Home = () => {
    return (
        <div>
            <HeroBanner></HeroBanner>
            <OurProducts></OurProducts>
            <HowItWorks></HowItWorks>
            <CustomerFeedback></CustomerFeedback>
        </div>
    );
};

export default Home;