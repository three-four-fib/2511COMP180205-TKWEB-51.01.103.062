import React from 'react';
import Clock from '../components/Clock';
import Counter from '../components/Counter';
import Greeting from '../components/Greeting';
import DualPlayerChase from '../components/DualPlayerChase';
import './Properties.css';

function Properties() 
{
  return (
    <div className="properties-container">
      <h1 className="properties-title">Properties Page</h1>
      <p className="properties-subtitle">Properties Demo</p>
      
      <div className="properties-grid">
        <div className="properties-item">
          <Counter />
        </div>
        <div className="properties-item">
          <Clock />
        </div>
        <div className="properties-item">
          <Greeting />
        </div>
        <div className="properties-item-chase">
          <DualPlayerChase />
        </div>
      </div>
    </div>
  );
}

export default Properties;
