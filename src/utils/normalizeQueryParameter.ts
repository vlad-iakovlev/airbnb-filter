import { MayBeArray } from "../types/utility.js";
import { isTruthy } from "./isTruthy.js";

export const normalizeQueryParameter = <T>(
  parameter: MayBeArray<T | null | undefined>,
): T[] => {
  if (!Array.isArray(parameter)) parameter = [parameter];
  return parameter.filter(isTruthy);
};
