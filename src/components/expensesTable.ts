import {
  type IntervalType,
  Intervals,
  avgDaysInYear,
  type DataSchemaType,
  getIntervalByName,
  localStorageKeys,
} from "../App";

export const getPaymentOptions = (): string[] => {
  const storedPaymentCategoryOptions = localStorage.getItem(
    localStorageKeys.paymentCategory,
  );
  return storedPaymentCategoryOptions
    ? JSON.parse(storedPaymentCategoryOptions)
    : [];
};

export const getAccountNames = (): string[] => {
  const storedAccountNames = localStorage.getItem(localStorageKeys.accountName);
  return storedAccountNames ? JSON.parse(storedAccountNames) : [];
};

export const getTransferFrequency = () => {
  const transferFrequency = localStorage.getItem(
    localStorageKeys.transferFrequency,
  );
  let interval: IntervalType = Intervals.fortnightly;
  if (transferFrequency) {
    const retrievedinterval = getIntervalByName(transferFrequency);
    interval = retrievedinterval || interval;
  }

  return interval;
};

export const getFrequencyIntervalByTableRowId = (
  data: DataSchemaType,
  id: number,
) => {
  const dataRow = data.find((item) => item.id === id);
  if (dataRow) {
    return getIntervalByName(dataRow.frequency);
  }
  return undefined;
};

export const recalculateCostsByIdByIntervalName = (
  data: DataSchemaType,
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
