import React from 'react';
import styled, { keyframes } from 'styled-components';

const moveVertically = (dot, oldDot) =>
  keyframes`
    0% {
        left: ${oldDot[0]}%;
        top: ${oldDot[1]}%
    }
    100% {
      left: ${dot[0]}%;
      top: ${dot[1]}%
    }
`;

const Item = styled.div`
    position: absolute;
    width: 3.6%;
    height: 3.6%;
    background-color: #88c586;
    border: 2px solid #424645;
    margin: 0.4%;
    z-index: 2;
    left: ${({ dot }) => dot[0]}%;
    top: ${({ dot }) => dot[1]}%;
    animation-name : ${(({ dot, oldLength, i }) => moveVertically(dot, oldLength[i] || [oldLength[i - 1]]))};
    animation-duration: ${({speed}) => speed / 1000}s;
    animation-timing-function: linear
`

export const Snake = ({ length, oldLength, speed }) => {
  const snake = length.map((dot, i) =>
    <Item key={i} i={i} speed={speed} dot={dot} oldLength={oldLength} />
  )
  return <div>{snake}</div>
}

