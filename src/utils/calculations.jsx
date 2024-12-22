export const calculateDamage = (attacker, target, airdropBonus = false) => {
  const hit = Math.random() <= attacker.accuracy;
  if (!hit) return 0;

  const baseDamage = attacker.damage;
  const multiplier = airdropBonus ? 2 : 1;
  const randomFactor = 0.8 + Math.random() * 0.4; // 80-120% damage variation

  return Math.round(baseDamage * multiplier * randomFactor);
};
