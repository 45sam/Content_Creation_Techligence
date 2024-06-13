import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { Mafs, Coordinates, Point, useMovablePoint } from 'mafs';
import { motion, useAnimation } from 'framer-motion';
import 'mafs/core.css';

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

const MafsContainer = styled.div`
  height: 300px;
  margin-top: 20px;
`;

const pointStyle = {
  display: 'inline-block',
  padding: '5px',
  borderRadius: '50%',
  width: '30px',
  height: '30px',
  lineHeight: '30px',
  textAlign: 'center',
  backgroundColor: '#FFD700',
  border: '2px solid #000',
  fontWeight: 'bold',
  cursor: 'grab',
  transition: 'transform 0.5s',
  animation: 'pulse 1s infinite',
};

function SortingVisualizer() {
  const [numbers, setNumbers] = useState([4, 3, 5, 1, 2]);
  const [isSorting, setIsSorting] = useState(false);
  const controls = useAnimation();
  const [activeIndices, setActiveIndices] = useState([]);
  const [positions, setPositions] = useState([]);
  const [translates, setTranslates] = useState([]);
  const [dragging, setDragging] = useState(null);
  const isMounted = useRef(false);

  const meter = useMovablePoint([0, 5], {
    constrain: 'vertical'
  });

  useEffect(() => {
    if (isMounted.current && isSorting) {
      bubbleSort([...numbers]);
    } else {
      isMounted.current = true;
    }
  }, [isSorting]);

  useEffect(() => {
    setPositions(numbers.map((num, idx) => ({ x: idx, y: num })));
    setTranslates(numbers.map((_, idx) => ({ x: idx * 70, y: -numbers[idx] * 30 })));
  }, [numbers]);

  useEffect(() => {
    const intensity = Math.abs(meter.y);
    const shuffledNumbers = shuffle(numbers, intensity);
    setNumbers(shuffledNumbers);
    setPositions(shuffledNumbers.map((num, idx) => ({ x: idx, y: num })));
  }, [meter.y]);

  const shuffle = (array, intensity) => {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1) * intensity) % result.length;
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  };

  const handleNumberChange = (index, value) => {
    const updatedNumbers = [...numbers];
    const newValue = parseInt(value, 10);
    if (!isNaN(newValue)) {
      updatedNumbers[index] = newValue;
      setNumbers(updatedNumbers);
      setPositions(updatedNumbers.map((num, idx) => ({ x: idx, y: num })));
    }
  };

  const handleMouseDown = useCallback((index) => (e) => {
    setDragging(index);
  }, []);

  const handleMouseUp = useCallback(() => {
    setDragging(null);
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (dragging !== null) {
      const rect = e.target.getBoundingClientRect();
      const yValue = Math.round(10 - (e.clientY - rect.top) / (rect.height / 10));
      if (yValue >= 0 && yValue <= 10) {
        const updatedNumbers = [...numbers];
        updatedNumbers[dragging] = yValue;
        setNumbers(updatedNumbers);
        setPositions(updatedNumbers.map((num, idx) => ({ x: idx, y: num })));
      }
    }
  }, [dragging, numbers]);

  const startSorting = () => {
    setIsSorting(true);
    bubbleSort([...numbers]);
  };

  const bubbleSort = async (arr) => {
    let len = arr.length;
    let swapped;
  
    for (let i = 0; i < len; i++) {
      swapped = false;
      for (let j = 0; j < len - 1; j++) {
        // Introduce a delay here
        await new Promise(resolve => setTimeout(resolve, 400));
  
        if (arr[j] > arr[j + 1]) {
          await animateSwap(j, j + 1);
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          setNumbers([...arr]);
          swapped = true;
        }
      }
      if (!swapped) break;
    }
  
    setIsSorting(false);
  };
  

  const animateSwap = async (index1, index2) => {
    const distanceX = 60; // Horizontal distance for the swap
    const distanceY = 30; // Vertical distance for the circular motion
  
    // Move in a circular path with red color
    await controls.start((i) => {
      if (i === index1) {
        return {
          x: [0, distanceX / 2, distanceX],
          y: [0, -distanceY, 0],
          backgroundColor: ['#ff0000', '#ff0000', `hsl(${index2 * 60}, 70%, 70%)`],
          transition: { duration: 1, ease: 'easeInOut' }
        };
      } else if (i === index2) {
        return {
          x: [0, -distanceX / 2, -distanceX],
          y: [0, distanceY, 0],
          backgroundColor: ['#ff0000', '#ff0000', `hsl(${index1 * 60}, 70%, 70%)`],
          transition: { duration: 1, ease: 'easeInOut' }
        };
      }
      return {};
    });
  
    // Move numbers along with the boxes
    const temp = numbers[index1];
    numbers[index1] = numbers[index2];
    numbers[index2] = temp;
    setNumbers([...numbers]);
  
    // Reset position and color after animation
    await controls.start((i) => {
      if (i === index1 || i === index2) {
        return { x: 0, y: 0, backgroundColor: `hsl(${i * 60}, 70%, 70%)`, transition: { duration: 0.5, ease: 'easeInOut' } };
      }
      return {};
    });
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h1>Sorting Visualizer</h1>
      <NumberList>
        {numbers.map((num, index) => (
          <motion.div key={index}>
            <NumberBox
             key={index}
             color={`hsl(${index * 60}, 70%, 70%)`}
             animate={controls}
             custom={index}
            >
              {num}
            </NumberBox>
          </motion.div>
        ))}
      </NumberList>
      <button onClick={startSorting} disabled={isSorting}>Start Sorting</button>
      <MafsContainer>
        <Mafs viewBox={{ x: [-1, numbers.length], y: [0, 10] }}>
          <Coordinates.Cartesian />
          {positions.map((position, index) => (
            <Point
              key={index}
              x={position.x}
              y={position.y}
              color={activeIndices.includes(index) ? 'red' : 'blue'}
              onMouseDown={handleMouseDown(index)}
              onMouseUp={handleMouseUp}
              onMouseMove={handleMouseMove}
            >
              <div style={pointStyle}>{numbers[index]}</div>
            </Point>
          ))}
          {meter.element}
        </Mafs>
      </MafsContainer>
    </div>
  );
}

export default SortingVisualizer;
