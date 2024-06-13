import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useAnimation } from 'framer-motion';
import styled from 'styled-components';
import Slider from '@mui/material/Slider';
import { debounce } from 'lodash';

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
  cursor: pointer;  // Add cursor pointer for better UX
`;

const NumberList = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const PlayPauseButton = styled.button`
  background-color: ${props => (props.isPaused ? '#3498DB' : '#27AE60')};
  border: none;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  cursor: pointer;
  margin: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  outline: none;
  transition: background-color 0.3s ease;

  &:hover {
    opacity: 0.8;
  }

  svg {
    width: 30px;
    height: 30px;
    fill: white;
  }
`;

function SortingVisualizer() {
  const [numbers, setNumbers] = useState([4, 3, 5, 1, 2]);
  const [isSorting, setIsSorting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState([]);
  const controls = useAnimation();
  const isMounted = useRef(false);
  const pauseRef = useRef(isPaused);

  useEffect(() => {
    pauseRef.current = isPaused;
  }, [isPaused]);

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
    const newSteps = [arr.slice()]; // Track initial state

    for (let i = 0; i < len; i++) {
      swapped = false;
      for (let j = 0; j < len - 1; j++) {
        // Pause the loop if isPaused is true
        while (pauseRef.current) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }

        if (arr[j] > arr[j + 1]) {
          await animateSwap(j, j + 1);
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          newSteps.push(arr.slice()); // Track each step
          setNumbers([...arr]);
          swapped = true;
        }
      }
      if (!swapped) break;
    }

    setSteps(newSteps);
    setIsSorting(false);
  };

  const animateSwap = async (index1, index2) => {
    await controls.start((i) => {
      if (i === index1) {
        return { x: 60, backgroundColor: 'red', transition: { duration: 0.5, ease: 'easeInOut' } };
      } else if (i === index2) {
        return { x: -60, backgroundColor: 'red', transition: { duration: 0.5, ease: 'easeInOut' } };
      }
      return {};
    });

    await controls.start((i) => {
      if (i === index1) {
        return { x: 0, backgroundColor: `hsl(${index2 * 60}, 70%, 70%)`, transition: { duration: 0.5, ease: 'easeInOut' } };
      } else if (i === index2) {
        return { x: 0, backgroundColor: `hsl(${index1 * 60}, 70%, 70%)`, transition: { duration: 0.5, ease: 'easeInOut' } };
      }
      return {};
    });
  };

  const handlePlayPause = () => {
    if (isSorting) {
      setIsPaused(prev => !prev);
    } else {
      setIsSorting(true);
    }
  };

  const debouncedSliderChange = useCallback(
    debounce((newValue) => {
      setCurrentStep(newValue);
      setNumbers(steps[newValue]);
    }, 100),
    [steps]
  );

  const handleSliderChange = (event, newValue) => {
    debouncedSliderChange(newValue);
  };

  const handleScroll = (index, event) => {
    event.preventDefault();
    const delta = Math.sign(event.deltaY);
    setNumbers(prevNumbers => {
      const newNumbers = [...prevNumbers];
      newNumbers[index] = Math.max(0, newNumbers[index] - delta);
      return newNumbers;
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
            onWheel={(event) => handleScroll(index, event)}
          >
            {num}
          </NumberBox>
        ))}
      </NumberList>
      <PlayPauseButton onClick={handlePlayPause} isPaused={isPaused}>
        {isSorting ? (
          isPaused ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="30px" height="30px">
              <path d="M0 0h24v24H0V0z" fill="none"/>
              <path d="M8 5h4v14H8zm6 0h4v14h-4z"/>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="30px" height="30px">
              <path d="M0 0h24v24H0V0z" fill="none"/>
              <path d="M8 5v14l11-7z"/>
            </svg>
          )
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="30px" height="30px">
            <path d="M0 0h24v24H0V0z" fill="none"/>
            <path d="M8 5v14l11-7z"/>
          </svg>
        )}
      </PlayPauseButton>
      <Slider
        value={currentStep}
        onChange={handleSliderChange}
        min={0}
        max={steps.length - 1}
        step={1}
        marks
        valueLabelDisplay="auto"
        style={{ width: '300px', margin: '20px auto' }}
      />
    </div>
  );
}

export default SortingVisualizer;
