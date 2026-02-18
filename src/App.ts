import z from "zod";
import { dataSchema } from "./components/contentManager";

export const initialPaymentCategories = [
  "Bills",
  "Savings",
  "Everyday",
  "Unallocated",
];

export const initialAccountNames = ["Default"];

export const avgDaysInYear = 365.25; //((365 * 3) + 366) / 4;

const intervalSchema = z.object({
  name: z.string(),
  singular: z.string(),
  days: z.number(),
});

export type IntervalType = z.Infer<typeof intervalSchema>;

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

export const getIntervalByName = (name: string) => {
  return (
    Object.values(Intervals).find((interval) => interval.name === name) ||
    undefined
  );
};

export const recalculatePerCycleCostsByIntervalName = (
  intervalName: string,
) => {
  const dataString = localStorage.getItem("tableData");
  const interval = getIntervalByName(intervalName);
  if (dataString && interval) {
    const data = JSON.parse(dataString);
    const parsedData = z.safeParse(dataSchema, data);
    if (parsedData.success) {
      parsedData.data.forEach((item) => {
        item.perCycle = item.cost / (avgDaysInYear / interval.days);
      });
      localStorage.setItem("tableData", JSON.stringify(parsedData.data));
    } else {
      console.error(parsedData.error);
    }
  }
};
