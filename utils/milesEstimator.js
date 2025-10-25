import { amexTransferPrograms } from "./amexPartners.js";
export function estimateMilesOptions(flight) {
  const { price, marketingAirlines } = flight;
  const taxes = 180;
  const euroPerPoint = 0.012;
  const matched = amexTransferPrograms.filter(p => p.airlines.some(a => marketingAirlines.includes(a)));
  if (!matched.length) return [{ program: "Cash only", notes: "No Amex transfer partner found" }];
  return matched.map(p => {
    const pointsRequired = Math.round((price - taxes) / euroPerPoint / p.ratio_value);
    return { program: p.program, airline_match: p.airlines.find(a => marketingAirlines.includes(a)), ratio: p.ratio, transfer_time_days: p.transfer_time_days, required_points: pointsRequired, estimated_value_per_point: euroPerPoint, taxes };
  });
}
