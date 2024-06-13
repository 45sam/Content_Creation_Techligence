import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import styled from 'styled-components';

const NumberBox = styled(motion.div)`
  display: inline-block;
  margin: 10px;
  padding: 10px;
  width: 50px;
  text-align: center;
  border-radius: 5px;
  background-color: ${props => props.color};
  border: 1px solid black;
  font-weight: bold;
`;

const NumberList = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

function SortingVisualizer() {
  const [numbers, setNumbers] = useState([4, 3, 5, 1, 2]);
  const [isSorting, setIsSorting] = useState(false);
  const controls = useAnimation();
  const isMounted = useRef(false);

  useEffect(() => {
    if (isMounted.current && isSorting) {
      bubbleSort([...numbers]);
    } else {
      isMounted.current = true;
    }
  }, [isSorting]);

  const bubbleSort = async (arr) => {
    let len = arr.length;
    let swapped;

    for (let i = 0; i < len; i++) {
      swapped = false;
      for (let j = 0; j < len - 1; j++) {
        if (arr[j] > arr[j + 1]) {
          await animateSwap(j, j + 1);
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          swapped = true;
        }
      }
      if (!swapped) break;
    }

    setIsSorting(false);
    setNumbers(arr);
  };

  const animateSwap = async (index1, index2) => {
    // Apply rotation and scaling to indicate swapping
    await controls.start((i) => {
      if (i === index1 || i === index2) {
        return {
          x: i === index1 ? 60 : -60,
          rotate: i === index1 ? 180 : -180,
          scale: 1.2,
          backgroundColor: 'red',
          transition: { duration: 0.5, ease: 'easeInOut' },
        };
      }
      return {};
    });

    // Delay for a smoother transition
    await new Promise(resolve => setTimeout(resolve, 500));

    // Update the numbers after the animation
    setNumbers((prevNumbers) => {
      const newNumbers = [...prevNumbers];
      [newNumbers[index1], newNumbers[index2]] = [newNumbers[index2], newNumbers[index1]];
      return newNumbers;
    });

    // Reset position, rotation, scale, and color
    await controls.start((i) => {
      if (i === index1 || i === index2) {
        return {
          x: 0,
          rotate: 0,
          scale: 1,
          backgroundColor: `hsl(${i * 60}, 70%, 70%)`,
          transition: { duration: 0.5, ease: 'easeInOut' },
        };
      }
      return {};
    });
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h1>Sorting Visualizer</h1>
      <NumberList>
        {numbers.map((num, index) => (
          <NumberBox
            key={index}
            color={`hsl(${index * 60}, 70%, 70%)`}
            animate={controls}
            custom={index}
          >
            {num}
          </NumberBox>
        ))}
      </NumberList>
      <button onClick={() => setIsSorting(true)} disabled={isSorting}>Start Sorting</button>
    </div>
  );
}

export default SortingVisualizer;
