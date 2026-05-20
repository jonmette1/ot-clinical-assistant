import type { StrategyType } from "@/lib/clinicalDecisionEngine";
import type { ProgressionPhase } from "@/lib/progression/progressionTypes";

export function toNumber(value: unknown, fallback = 7): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function compactUnique(items: string[]) {
  return Array.from(new Set(items.filter(Boolean)));
}

export function hasStrategy(
  selectedStrategies: StrategyType[] | undefined,
  strategy: StrategyType
) {
  return (
    Array.isArray(selectedStrategies) &&
    selectedStrategies.includes(strategy)
  );
}

export function limitMilestones(
  milestones: string[],
  currentPhase: ProgressionPhase
) {
  const unique = compactUnique(milestones);

  if (currentPhase === "stabilization") {
    return unique.slice(0, 4);
  }

  return unique.slice(0, 5);
}