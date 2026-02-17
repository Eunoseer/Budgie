export const initialPaymentCategories = [
  "Bills",
  "Savings",
  "Everyday",
  "Unallocated",
];

export const initialAccountNames = ["Default"];

export const avgDaysInYear = 365.25; //((365 * 3) + 366) / 4;

export const Intervals = {
  weekly: { name: "Weekly", singular: "Week", days: 7 },
  fortnighty: { name: "Fortnightly", singular: "Fortnight", days: 7 },
  monthly: { name: "Monthly", singular: "Month", days: avgDaysInYear / 12 },
  bimonthly: {
    name: "Bi-Monthly",
    singular: "2 Months",
    days: avgDaysInYear / 6,
  },
  quarterly: {
    name: "Quarterly",
    singular: "Quarter",
    days: avgDaysInYear / 4,
  },
  biannually: {
    name: "Bi-Annually",
    singular: "6 Months",
    days: avgDaysInYear / 2,
  },
  annually: { name: "Annually", singular: "Year", days: avgDaysInYear },
} as const;
