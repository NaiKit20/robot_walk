import './App.css'
import TextField from '@mui/material/TextField';
import { useRef } from "react";
import { useState } from 'react';
import Button from '@mui/material/Button';

function App() { // deploy https://ogs-exam-robot-walk.web.app/
  const inputRef = useRef(null);

  const [n, setN] = useState(0);
  const [center, setCenter] = useState(null);
  const [distances, setDistances] = useState([]);
  const [boxes, setBoxes] = useState([]);
  const [endPoint, setEndPoint] = useState([0, 0])

  const calDistance = () => {
    var direction = "w";
    const distance = [[0, 0]];
    const step = [...inputRef.current.value]

    step.forEach(function (s) {
      const position = distance[distance.length - 1];

      if (s == "W" || s == 'w') {
        if (direction == "w") {
          distance.push([position[0], position[1] + 1]);
        } else if (direction == "a") {
          distance.push([position[0] - 1, position[1]]);
        } else if (direction == "s") {
          distance.push([position[0], position[1] - 1]);
        } else if (direction == "d") {
          distance.push([position[0] + 1, position[1]]);
        }
      } else if (s == "L" || s == "l") {
        if (direction == "w") {
          direction = "a"
        } else if (direction == "a") {
          direction = "s"
        } else if (direction == "s") {
          direction = "d"
        } else if (direction == "d") {
          direction = "w"
        }
      } else if (s == "R" || s == "r") {
        if (direction == "w") {
          direction = "d"
        } else if (direction == "a") {
          direction = "w"
        } else if (direction == "s") {
          direction = "a"
        } else if (direction == "d") {
          direction = "s"
        }
      }
    });
    // ตำแหน่งจุดสิ้นสุด
    setDistances(distance)
    setEndPoint([distance[distance.length - 1][0], distance[distance.length - 1][1]])
    // หาค่าขนาดของตาราง
    const size = calSize(distance)
    setN(size)
    // กำหนดขนาดของตารางจากค่าแกนที่มากที่สุด
    setCenter(Math.floor(size / 2))
    setBoxes(Array.from({ length: size ** 2 }))
  };

  const calSize = (distance) => {
    var distanceFlat = distance.flat();
    distanceFlat = distanceFlat.map(value => Math.abs(value));
    const gridSize = Math.max(...distanceFlat);
    return gridSize * 2 + 1;
  };

  const isPath = (position) => {
    const index = distances.findIndex(
      (dist) => dist[0] === position[0] && dist[1] === position[1]
    );
    if (index >= 0) {
      return true
    } else {
      return false
    }
  };

  return (
    <>
      <div className="app">
        <div className="app-input">
          <div className="app-input-head">
            <p>Robot Walk</p>
          </div>
          <div className="app-input-body">
            <p>คำสั่ง Robot Walk</p>
            <TextField inputRef={inputRef} variant="outlined" style={{ width: "100%", marginTop: "10px" }} />
          </div>
          <div className="app-input-bottom">
            <Button onClick={calDistance} variant="contained">คำนวณ</Button>
          </div>
        </div>
        <hr />
        <div className="app-result">
          {(distances.length <= 0) ? null : <p>ตำแหน่งปัจจุบัน ( {endPoint[0]} , {endPoint[1]} )</p>}
          <br />
          <div style={{ display: 'flex', flexWrap: 'wrap', width: `${n * 40}px` }}>
            {boxes.map((box, index) => {
              const row = Math.floor(index / n);
              const col = index % n;

              const x = col - center;
              const y = center - row;

              return (
                <div
                  key={index}
                  style={{
                    width: '40px',
                    height: '40px',
                    border: '1px solid #9b9b9b',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: (isPath([x, y])) ? (x == 0 && y == 0) ? '#89af72' : (x == endPoint[0] && y == endPoint[1]) ? '#ca8a89' : '#c4c4c4' : '#ffffff'
                  }}
                >
                  {/* {x},{y} */}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  )
}

export default App