import numeral from "numeral";
export const prettyPrint = (stat) =>
  stat ? `+${numeral(stat).format("0.0a")}` : "+0";
