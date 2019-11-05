import React from 'react';
import c from './Food.module.css';

export const Food = ({ food }) => {
  return <div
    className={c.Food_dot}
    style={{
      left: `${food[0]}%`,
      top: `${food[1]}%`
    }}
  />
}

