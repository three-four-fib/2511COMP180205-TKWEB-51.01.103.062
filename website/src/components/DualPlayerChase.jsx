import React, { useEffect, useRef, useState } from "react";
import "./DualPlayerChase.css";

function DualPlayerChase() {
  const size = 6; // grid size
  const walls = [
    [1, 1],
    [2, 2],
    [3, 3],
    [4, 1],
    [1, 4],
  ];

  // Player 1 (Arrow keys), Player 2 (WASD)
  const [p1, setP1] = useState({ x: 0, y: 0 });
  const [p2, setP2] = useState({ x: 5, y: 5 });
  const [message, setMessage] = useState("");
  const pressedKeysRef = useRef(new Set());
  const [isPlaying, setIsPlaying] = useState(false);

  const movePlayer = (player, setPlayer, keys, controls) => {
    let dx = 0;
    let dy = 0;

    if (keys.has(controls.up)) dy -= 1;
    if (keys.has(controls.down)) dy += 1;
    if (keys.has(controls.left)) dx -= 1;
    if (keys.has(controls.right)) dx += 1;

    const newX = player.x + dx;
    const newY = player.y + dy;

    const wallHit = walls.some(([wx, wy]) => wx === newX && wy === newY);
    if (wallHit || newX < 0 || newY < 0 || newX >= size || newY >= size) return;

    setPlayer({ x: newX, y: newY });
  };

  useEffect(() => {
    if (!isPlaying) {
      // ensure no keys are considered pressed when paused
      pressedKeysRef.current = new Set();
      return;
    }

    const handleKeyDown = (e) => {
      // prevent page from scrolling with arrow keys during play
      if (e.key === "ArrowUp" || e.key === "ArrowDown" || e.key === "ArrowLeft" || e.key === "ArrowRight") {
        e.preventDefault();
      }
      pressedKeysRef.current.add(e.key);
    };

    const handleKeyUp = (e) => {
      pressedKeysRef.current.delete(e.key);
    };

    const interval = setInterval(() => {
      setMessage("");

      movePlayer(p1, setP1, pressedKeysRef.current, {
        up: "ArrowUp",
        down: "ArrowDown",
        left: "ArrowLeft",
        right: "ArrowRight",
      });

      movePlayer(p2, setP2, pressedKeysRef.current, {
        up: "w",
        down: "s",
        left: "a",
        right: "d",
      });
    }, 100);

    window.addEventListener("keydown", handleKeyDown, { capture: false });
    window.addEventListener("keyup", handleKeyUp, { capture: false });
    return () => {
      clearInterval(interval);
      window.removeEventListener("keydown", handleKeyDown, { capture: false });
      window.removeEventListener("keyup", handleKeyUp, { capture: false });
      pressedKeysRef.current = new Set();
    };
  }, [isPlaying, p1, p2]);

  useEffect(() => {
    if (p1.x === p2.x && p1.y === p2.y) {
      setMessage("🎉 Player 1 caught Player 2!");
    }
  }, [p1, p2]);

  return (
    <div className="game-container">
      <h2>🎮 Dual-Player Chase (Multi-Key Support)</h2>
      <p>🟥 W A S D (Player 1)&nbsp; | &nbsp; 🟦 Arrow Keys (Player 2) </p>
      <div style={{ margin: "10px 0" }}>
        <button class="btn" onClick={() => setIsPlaying((v) => !v)}>
          {isPlaying ? "Pause" : "Play"}
        </button>
      </div>
      {!isPlaying && (
        <p>Press Play to start</p>
      )}

      <div className="grid">
        {[...Array(size)].map((_, y) => (
          <div key={y} className="row">
            {[...Array(size)].map((_, x) => {
              const wall = walls.some(([wx, wy]) => wx === x && wy === y);
              const cell =
                (p1.x === x && p1.y === y && "🟦") ||
                (p2.x === x && p2.y === y && "🟥") ||
                (wall && "🧱");
              return (
                <div key={x} className={`cell ${wall ? "wall" : ""}`}>
                  {cell}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {message && <p className="msg">{message}</p>}
    </div>
  );
}

export default DualPlayerChase;


