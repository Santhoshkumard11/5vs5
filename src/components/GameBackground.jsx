import React from "react";
import { Box } from "@mui/material";
import "../styles/GameBackground.css";

const bulletImage = "./img/bullet.png";

const BattlefieldBackground = () => {
  return (
    <Box
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "200vh",
        overflow: "hidden",
        zIndex: -1,
        background: "linear-gradient(to bottom, #fffff, #252A34)", // Battlefield theme
      }}
    >
      {[...Array(20)].map((_, i) => (
        <Box
          key={i}
          component="img"
          src={bulletImage}
          alt="Bullet"
          sx={{
            position: "absolute",
            width: `${Math.random() * 40 + 20}px`,
            height: "auto",
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animation: `move-bullet-${i} ${
              Math.random() * 4 + 7
            }s linear infinite`,
          }}
        />
      ))}
      <style>
        {`
          ${[...Array(10)]
            .map((_, i) => {
              const randomX = Math.random() * 500 - 100; // Random horizontal direction (-100 to 100)
              const randomY = Math.random() * 500 - 100; // Random vertical direction (-100 to 100)
              return `
                @keyframes move-bullet-${i} {
                  0% {
                    transform: translate(0, 0);
                    opacity: 1;
                  }
                  50% {
                      opacity: 0.8;
                  }
                  100% {
                    transform: translate(${randomX}px, ${randomY}px);
                    opacity: 0.5;
                  }
                }
              `;
            })
            .join("\n")}
        `}
      </style>

      {[...Array(10)].map((_, i) => (
        <Box
          key={i}
          component="img"
          src={"./img/bomb.png"}
          alt="Bullet"
          sx={{
            position: "absolute",
            width: `${Math.random() * 50 + 10}px`,
            height: "auto",
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animation: `float-animation ${
              Math.random() * 5 + 6
            }s linear infinite`,
            transform: `rotate(${Math.random() * 360}deg)`,
          }}
        />
      ))}
    </Box>
  );
};

export default BattlefieldBackground;
