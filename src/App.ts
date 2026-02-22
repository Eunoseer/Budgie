import z from "zod";

export const initialPaymentCategories = [
  "Bills",
  "Savings",
  "Everyday",
  "Unallocated",
];

export const initialAccountNames = ["Default"];

export const localStorageKeys = {
  accountName: "accountName",
  incomeData: "incomeData",
  initialised: "initialised",
  localMode: "localMode",
  paymentCategory: "paymentCategory",
  tableData: "tableData",
  transferFrequency: "transferFrequency",
} as const;

export const avgDaysInYear = 365.25; //((365 * 3) + 366) / 4;

const intervalSchema = z.object({
  name: z.string(),
  singular: z.string(),
  days: z.number(),
});

export const dataSchema = z.array(
  z.object({
    id: z.int(),
    description: z.string(),
    accountName: z.string(),
    frequency: z.string(),
    cost: z.coerce.number(),
    perCycle: z.coerce.number(),
    paymentCategory: z.string(),
    annual: z.coerce.number(),
  }),
);

export const incomeSchema = z.array(
  z.object({
    id: z.int(),
    description: z.string(),
    frequency: z.string(),
    income: z.coerce.number(),
  }),
);

export type IntervalType = z.Infer<typeof intervalSchema>;
export type DataSchemaType = z.infer<typeof dataSchema>;
export type IncomeSchemaType = z.infer<typeof incomeSchema>;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const intervalsSchema = z.record(z.string(), intervalSchema);

export type IntervalsSchemaType = z.Infer<typeof intervalsSchema>;

export const Intervals: IntervalsSchemaType = {
  weekly: { name: "Weekly", singular: "Week", days: 7 },
  fortnightly: { name: "Fortnightly", singular: "Fortnight", days: 14 },
  monthly: { name: "Monthly", singular: "Month", days: avgDaysInYear / 12 },
  "bi-monthly": {
    name: "Bi-Monthly",
    singular: "2 Months",
    days: avgDaysInYear / 6,
  },
  quarterly: {
    name: "Quarterly",
    singular: "Quarter",
    days: avgDaysInYear / 4,
  },
  "bi-annually": {
    name: "Bi-Annually",
    singular: "6 Months",
    days: avgDaysInYear / 2,
  },
  annually: { name: "Annually", singular: "Year", days: avgDaysInYear },
};

export const defaultTransferFrequency = Intervals.monthly.name;

export const getIntervalByName = (name: string) => {
  return (
    Object.values(Intervals).find((interval) => interval.name === name) ||
    undefined
  );
};

export const recalculatePerCycleCostsByIntervalName = (
  intervalName: string,
) => {
  const dataString = localStorage.getItem(localStorageKeys.tableData);
  const interval = getIntervalByName(intervalName);
  if (dataString && interval) {
    const data = JSON.parse(dataString);
    const parsedData = z.safeParse(dataSchema, data);
    if (parsedData.success) {
      parsedData.data.forEach((item) => {
        item.perCycle = item.cost / (avgDaysInYear / interval.days);
      });
      localStorage.setItem(
        localStorageKeys.tableData,
        JSON.stringify(parsedData.data),
      );
    } else {
      console.error(parsedData.error);
    }
  }
};

export const calculateIncomePerTransferCycle = () => {
  const transferCycleName =
    localStorage.getItem(localStorageKeys.transferFrequency) ||
    defaultTransferFrequency;
  const transferCycleInterval = getIntervalByName(transferCycleName);

  if (!transferCycleInterval) {
    return;
  }

  const incomeData = JSON.parse(
    localStorage.getItem(localStorageKeys.incomeData) || "[]",
  );
  let baseIncome = 0;

  const parsedIncomeData = incomeSchema.parse(incomeData);

  //Break down the income into a "per day" base income figure
  parsedIncomeData.forEach((dataItem) => {
    const incomeCycleInterval = getIntervalByName(dataItem.frequency);
    if (!incomeCycleInterval) {
      return;
    }
    baseIncome += dataItem.income / incomeCycleInterval.days;
  });

  //Now that we have our base figure, multiply it out by the transfer cycle interval
  const intervalIncome = baseIncome * transferCycleInterval.days;

  return intervalIncome;
};
