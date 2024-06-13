// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import styled from 'styled-components';
// import { Mafs, Coordinates, Point, useMovablePoint } from 'mafs';
// import { motion, useAnimation } from 'framer-motion';
// import 'mafs/core.css';

// const NumberBox = styled(motion.div)`
//   display: inline-block;
//   margin: 10px;
//   padding: 10px;
//   width: 50px;
//   text-align: center;
//   border-radius: 5px;
//   background-color: ${props => props.color};
//   border: 1px solid black;
//   font-weight: bold;
// `;

// const NumberList = styled.div`
//   display: flex;
//   justify-content: center;
//   margin-top: 20px;
// `;

// const MafsContainer = styled.div`
//   height: 300px;
//   margin-top: 20px;
// `;

// const pointStyle = {
//   display: 'inline-block',
//   padding: '5px',
//   borderRadius: '50%',
//   width: '30px',
//   height: '30px',
//   lineHeight: '30px',
//   textAlign: 'center',
//   backgroundColor: '#FFD700',
//   border: '2px solid #000',
//   fontWeight: 'bold',
//   cursor: 'grab',
//   transition: 'transform 0.5s',
//   animation: 'pulse 1s infinite',
// };

// function SortingVisualizer() {
//   const [numbers, setNumbers] = useState([4, 3, 5, 1, 2]);
//   const [isSorting, setIsSorting] = useState(false);
//   const controls = useAnimation();
//   const [activeIndices, setActiveIndices] = useState([]);
//   const [positions, setPositions] = useState([]);
//   const [translates, setTranslates] = useState([]);
//   const [dragging, setDragging] = useState(null);
//   const isMounted = useRef(false);

//   const meter = useMovablePoint([0, 5], {
//     constrain: 'vertical'
//   });

//   useEffect(() => {
//     if (isMounted.current && isSorting) {
//       bubbleSort([...numbers]);
//     } else {
//       isMounted.current = true;
//     }
//   }, [isSorting]);

//   useEffect(() => {
//     setPositions(numbers.map((num, idx) => ({ x: idx, y: num })));
//     setTranslates(numbers.map((_, idx) => ({ x: idx * 70, y: -numbers[idx] * 30 })));
//   }, [numbers]);

//   useEffect(() => {
//     const intensity = Math.abs(meter.y);
//     const shuffledNumbers = shuffle(numbers, intensity);
//     setNumbers(shuffledNumbers);
//     setPositions(shuffledNumbers.map((num, idx) => ({ x: idx, y: num })));
//   }, [meter.y]);

//   const shuffle = (array, intensity) => {
//     const result = [...array];
//     for (let i = result.length - 1; i > 0; i--) {
//       const j = Math.floor(Math.random() * (i + 1) * intensity) % result.length;
//       [result[i], result[j]] = [result[j], result[i]];
//     }
//     return result;
//   };

//   const handleNumberChange = (index, value) => {
//     const updatedNumbers = [...numbers];
//     const newValue = parseInt(value, 10);
//     if (!isNaN(newValue)) {
//       updatedNumbers[index] = newValue;
//       setNumbers(updatedNumbers);
//       setPositions(updatedNumbers.map((num, idx) => ({ x: idx, y: num })));
//     }
//   };

//   const handleMouseDown = useCallback((index) => (e) => {
//     setDragging(index);
//   }, []);

//   const handleMouseUp = useCallback(() => {
//     setDragging(null);
//   }, []);

//   const handleMouseMove = useCallback((e) => {
//     if (dragging !== null) {
//       const rect = e.target.getBoundingClientRect();
//       const yValue = Math.round(10 - (e.clientY - rect.top) / (rect.height / 10));
//       if (yValue >= 0 && yValue <= 10) {
//         const updatedNumbers = [...numbers];
//         updatedNumbers[dragging] = yValue;
//         setNumbers(updatedNumbers);
//         setPositions(updatedNumbers.map((num, idx) => ({ x: idx, y: num })));
//       }
//     }
//   }, [dragging, numbers]);

//   const startSorting = () => {
//     setIsSorting(true);
//     bubbleSort([...numbers]);
//   };

//   const bubbleSort = async (arr) => {
//     let len = arr.length;
//     let swapped;
  
//     for (let i = 0; i < len; i++) {
//       swapped = false;
//       for (let j = 0; j < len - 1; j++) {
//         // Introduce a delay here
//         await new Promise(resolve => setTimeout(resolve, 400));
  
//         if (arr[j] > arr[j + 1]) {
//           await animateSwap(j, j + 1);
//           [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
//           setNumbers([...arr]);
//           swapped = true;
//         }
//       }
//       if (!swapped) break;
//     }
  
//     setIsSorting(false);
//   };
  

//   const animateSwap = async (index1, index2) => {
//     const distanceX = 60; // Horizontal distance for the swap
//     const distanceY = 30; // Vertical distance for the circular motion
  
//     // Move in a circular path with red color
//     await controls.start((i) => {
//       if (i === index1) {
//         return {
//           x: [0, distanceX / 2, distanceX],
//           y: [0, -distanceY, 0],
//           backgroundColor: ['#ff0000', '#ff0000', `hsl(${index2 * 60}, 70%, 70%)`],
//           transition: { duration: 1, ease: 'easeInOut' }
//         };
//       } else if (i === index2) {
//         return {
//           x: [0, -distanceX / 2, -distanceX],
//           y: [0, distanceY, 0],
//           backgroundColor: ['#ff0000', '#ff0000', `hsl(${index1 * 60}, 70%, 70%)`],
//           transition: { duration: 1, ease: 'easeInOut' }
//         };
//       }
//       return {};
//     });
  
//     // Move numbers along with the boxes
//     const temp = numbers[index1];
//     numbers[index1] = numbers[index2];
//     numbers[index2] = temp;
//     setNumbers([...numbers]);
  
//     // Reset position and color after animation
//     await controls.start((i) => {
//       if (i === index1 || i === index2) {
//         return { x: 0, y: 0, backgroundColor: `hsl(${i * 60}, 70%, 70%)`, transition: { duration: 0.5, ease: 'easeInOut' } };
//       }
//       return {};
//     });
//   };

//   return (
//     <div style={{ textAlign: 'center' }}>
//       <h1>Sorting Visualizer</h1>
//       <NumberList>
//         {numbers.map((num, index) => (
//           <motion.div key={index}>
//             <NumberBox
//              key={index}
//              color={`hsl(${index * 60}, 70%, 70%)`}
//              animate={controls}
//              custom={index}
//             >
//               {num}
//             </NumberBox>
//           </motion.div>
//         ))}
//       </NumberList>
//       <button onClick={startSorting} disabled={isSorting}>Start Sorting</button>
//       <MafsContainer>
//         <Mafs viewBox={{ x: [-1, numbers.length], y: [0, 10] }}>
//           <Coordinates.Cartesian />
//           {positions.map((position, index) => (
//             <Point
//               key={index}
//               x={position.x}
//               y={position.y}
//               color={activeIndices.includes(index) ? 'red' : 'blue'}
//               onMouseDown={handleMouseDown(index)}
//               onMouseUp={handleMouseUp}
//               onMouseMove={handleMouseMove}
//             >
//               <div style={pointStyle}>{numbers[index]}</div>
//             </Point>
//           ))}
//           {meter.element}
//         </Mafs>
//       </MafsContainer>
//     </div>
//   );
// }

// export default SortingVisualizer;


import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useAnimation } from 'framer-motion';
import styled from 'styled-components';
import Slider from '@mui/material/Slider';
import { debounce } from 'lodash';

const Container = styled.div`
  text-align: center;
  background-color: black;
  color: white;
  min-height: 100vh;
  padding: 20px;
`;

const Title = styled.h1`
  margin-top: 20px;
`;

const NumberBox = styled(motion.div)`
  display: inline-block;
  margin: 10px;
  padding: 10px;
  width: 50px;
  text-align: center;
  border-radius: 5px;
  background-color: ${props => `hsl(${props.color}, 70%, 70%)`};
  border: 1px solid black;
  font-weight: bold;
  cursor: pointer;
`;

const NumberList = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const ControlsContainer = styled.div`
  display: flex;
  align-items: center;
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
  margin: 0 10px;
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

const PlayButton = styled.button`
  background-color: #27AE60;
  border: none;
  border-radius: 5px;
  color: white;
  padding: 10px 20px;
  cursor: pointer;
  margin-right: 10px;
  outline: none;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #219653;
  }
`;

function NumberSorter() {
  const [numbers, setNumbers] = useState([4, 3, 5, 1, 2]);
  const [isSorting, setIsSorting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState([]);
  const controls = useAnimation();
  const isMounted = useRef(false);
  const pauseRef = useRef(isPaused);
  const enableScroll = useRef(true); // Ref to enable/disable scrolling

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

  useEffect(() => {
    // Disable scrolling after 7 seconds
    const timeout = setTimeout(() => {
      enableScroll.current = false;
    }, 7000);

    return () => clearTimeout(timeout);
  }, []);

  const bubbleSort = async (arr) => {
    let len = arr.length;
    let swapped;
    const newSteps = [arr.slice()]; // Track initial state

    speak(`Let us start sorting the given array ${arr.join(', ')} using bubble sort algorithm.`);

    for (let i = 0; i < len; i++) {
      swapped = false;
      for (let j = 0; j < len - 1; j++) {
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
    speak(`The final sorted array is ${arr.join(', ')}.`);
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

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance();
    utterance.text = text;
    utterance.lang = 'en-US';
    speechSynthesis.speak(utterance);
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
    if (enableScroll.current) {
      const delta = Math.sign(event.deltaY);
      setNumbers(prevNumbers => {
        const newNumbers = [...prevNumbers];
        newNumbers[index] = Math.max(0, newNumbers[index] - delta);
        return newNumbers;
      });
    }
  };

  return (
    <Container>
      <Title>Sorting Visualizer</Title>
      <NumberList>
        {numbers.map((num, index) => (
          <NumberBox
            key={index}
            color={index * 60}
            animate={controls}
            custom={index}
            onWheel={(event) => handleScroll(index, event)}
          >
            {num}
          </NumberBox>
        ))}
      </NumberList>
      <ControlsContainer>
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
          style={{ flex: 1, margin: '0 10px' }}
        />
        <PlayButton onClick={handlePlayPause}>
          {isSorting ? (isPaused ? 'Resume' : 'Pause') : 'Play'}
        </PlayButton>
      </ControlsContainer>
    </Container>
  );
}

export default NumberSorter;
