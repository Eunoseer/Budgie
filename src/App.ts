export const initialPaymentCategories = [
  "Bills",
  "Savings",
  "Everyday",
  "Unallocated",
];

export const initialAccountNames = ["Default"];

const avgDaysInYear = 365.25; //((365 * 3) + 366) / 4;

export const Intervals = {
  weekly: { name: "Weekly", days: 7 },
  fortnighty: { name: "Fortnightly", days: 7 },
  monthly: { name: "Monthly", days: avgDaysInYear / 12 },
  bimonthly: { name: "Bi-Monthly", days: avgDaysInYear / 6 },
  quarterly: { name: "Quarterly", days: avgDaysInYear / 4 },
  biannually: { name: "Bi-Annually", days: avgDaysInYear / 2 },
  annually: { name: "Annually", days: avgDaysInYear },
} as const;
