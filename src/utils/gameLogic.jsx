export const createTeam = (owner, teamList) => {
  return Object.entries(teamList).map(([key, data]) => ({
    ...data,
    id: `${owner}-${key}-${Math.random().toString(36).substr(2, 9)}`,
    owner,
    isActive: true,
  }));
};

export const isValidAction = (attacker, target) => {
  if (!attacker || !target) return false;
  if (attacker.owner === target.owner) return false;
  if (attacker.health <= 0 || target.health <= 0) return false;
  return true;
};

export const checkGameOver = (playerTeam, cpuTeam) => {
  const playerAlive = playerTeam.some((soldier) => soldier.health > 0);
  const cpuAlive = cpuTeam.some((soldier) => soldier.health > 0);
  return !playerAlive || !cpuAlive;
};

export const getWinningPlayer = (playerTeam, cpuTeam) => {
  const playerAlive = playerTeam.some((soldier) => soldier.health > 0);
  const cpuAlive = cpuTeam.some((soldier) => soldier.health > 0);

  if (playerAlive && !cpuAlive) return "player1";
  if (!playerAlive && cpuAlive) return "player2";
  return null;
};

export const getAIMove = (cpuTeam, playerTeam) => {
  const activeCpuSoldiers = cpuTeam.filter((s) => s.health > 0);
  const activePlayerSoldiers = playerTeam.filter((s) => s.health > 0);

  if (!activeCpuSoldiers.length || !activePlayerSoldiers.length) return null;

  const attacker =
    activeCpuSoldiers[Math.floor(Math.random() * activeCpuSoldiers.length)];
  const target =
    activePlayerSoldiers[
      Math.floor(Math.random() * activePlayerSoldiers.length)
    ];

  return { attacker, target };
};
