import { capitalizeFirstLetter } from "../../utils";

const value = "kusama";

export const kusama = {
  value,
  name: capitalizeFirstLetter(value),
  symbol: "KSM",
  decimals: 12,
  ss58Format: 2,
  supportOpenGov: true,
  hasDotreasury: true,
  hasSubscan: true,
  hasStatescan: true,

  hasProjects: true,
  hasOutputPeriods: true,

  hasStaking: true,
  hasSpends: true,
  hasTips: true,
  hasBounties: true,
  hasTransfers: true,
  hasBurnt: true,

  ui: {
    totalStacked: {
      yStepSize: 200000,
    },
  },
};
