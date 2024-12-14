import React, { useState, useEffect } from 'react';
import './SpaceBackground.css';

const Star = ({ x, y }) => {
  return <div className="star" style={{ top: `${y}%`, left: `${x}%` }}></div>;
};

const generateStars = (numStars) => {
  const stars = [];
  for (let i = 0; i < numStars; i++) {
    stars.push({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
    });
  }
  return stars;
};

const Space = ({children}) => {
  const [stars, setStars] = useState([]);

  useEffect(() => {
    setStars(generateStars(100)); // Generate 100 stars
  }, []);

  return (
    <div className='space'>
      {stars.map((star) => (
        <Star key={star.id} x={star.x} y={star.y} />
      ))}
    {children}
    </div>
  );
};

export default Space;
