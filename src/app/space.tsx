import React, { useState, useEffect } from "react";
import "@/app/space-background.css";

const Star = ({ x, y }: { x: number; y: number }) => {
  return <div className="star" style={{ top: `${y}%`, left: `${x}%` }}></div>;
};

const generateStars = (numStars: number) => {
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

const Space = ({ children }: { children: React.ReactNode }) => {
  const [stars, setStars] = useState<Array<{ id: number; x: number; y: number; }>>([]);

  useEffect(() => {
    setStars(generateStars(100)); // Generate 100 stars
  }, []);

  return (
    <div className="space">
      {stars.map((star) => (
        <Star key={star.id} x={star.x} y={star.y} />
      ))}
      {children}
    </div>
  );
};

export default Space;
