import {
  type IntervalType,
  Intervals,
  avgDaysInYear,
  getIntervalByName,
} from "../App";
import type { dataSchemaType } from "./contentManager";

export const getPaymentOptions = (): string[] => {
  const storedPaymentOptions = localStorage.getItem("paymentCategory");
  return storedPaymentOptions ? JSON.parse(storedPaymentOptions) : [];
};

export const getAccountNames = (): string[] => {
  const storedAccountNames = localStorage.getItem("accountName");
  return storedAccountNames ? JSON.parse(storedAccountNames) : [];
};

export const getTransferFrequency = () => {
  const transferFrequency = localStorage.getItem("transferFrequency");
  let interval: IntervalType = Intervals.fortnighty;
  if (transferFrequency) {
    const retrievedinterval = getIntervalByName(transferFrequency);
    interval = retrievedinterval || interval;
  }

  return interval;
};

export const getFrequencyIntervalByTableRowId = (
  data: dataSchemaType,
  id: number,
) => {
  const dataRow = data.find((item) => item.id === id);
  if (dataRow) {
    return getIntervalByName(dataRow.frequency);
  }
  return undefined;
};

export const recalculateCostsByIdByIntervalName = (
  data: dataSchemaType,
  intervalName: string,
  id: number,
) => {
  const interval = getIntervalByName(intervalName);
  const transferFrequency = getTransferFrequency();
  if (!interval) return data;
  return data.map((item) => {
    if (item.id === id) {
      const annual = item.cost * (avgDaysInYear / interval.days);
      const perCycle = annual / (avgDaysInYear / transferFrequency.days);
      return { ...item, annual, perCycle };
    }
    return item;
  });
};
