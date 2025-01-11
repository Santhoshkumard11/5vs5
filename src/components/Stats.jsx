import { Grid2, Box, Typography, LinearProgress } from "@mui/material";

function PlayersStats({ gameState }) {
  return (
    <div className="metrics-container">
      <Grid2
        container
        spacing={2}
        sx={{
          position: "absolute",
          bottom: 10,
          left: 10,
          width: "99%",
          justifyContent: "space-between",
          px: 2,
        }}
      >
        {/* Player 1 Metrics */}
        <Grid2 item xs={5}>
          <Box
            sx={{
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              borderRadius: 2,
              p: 2,
              boxShadow: 3,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Player 1 Stats
            </Typography>
            <Typography>
              Successful Hits: {gameState.metrics.player1.successfulHits}
            </Typography>
            <Typography>Misses: {gameState.metrics.player1.misses}</Typography>
          </Box>
        </Grid2>

        {/* Player 2 Metrics */}
        <Grid2 item xs={5}>
          <Box
            sx={{
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              borderRadius: 2,
              p: 2,
              boxShadow: 3,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Player 2 Stats
            </Typography>
            <Typography>
              Successful Hits: {gameState.metrics.player2.successfulHits}
            </Typography>
            <Typography>Misses: {gameState.metrics.player2.misses}</Typography>
          </Box>
        </Grid2>
      </Grid2>
    </div>
  );
}

export { PlayersStats };
