import { useEffect, useRef, useState } from "react";
import {
  incomeSchema,
  Intervals,
  localStorageKeys,
  type IncomeSchemaType,
} from "../App";
import { Button } from "./button";

export function IncomeTable() {
  const timeoutRef = useRef<{ [id: number]: number | null }>({});
  const [data, setData] = useState(() => {
    const storedData = localStorage.getItem(localStorageKeys.incomeData);
    const parsedJson = storedData ? JSON.parse(storedData) : [];
    const parsedData = incomeSchema.safeParse(parsedJson);
    if (parsedData.error) {
      return undefined;
    }
    return parsedData.data;
  });

  const [localIncomeValues, setLocalIncomeValues] = useState<{
    [id: number]: string;
  }>(() => {
    const storedData = localStorage.getItem(localStorageKeys.incomeData);
    const parsedJson = storedData ? JSON.parse(storedData) : [];
    const parsedData = incomeSchema.safeParse(parsedJson);
    let initialData: IncomeSchemaType = [];
    if (parsedData.success) {
      initialData = parsedData.data;
    }

    // Build initial localIncomeValues from parsed data
    return initialData.reduce(
      (acc, item) => {
        acc[item.id] = item.income.toFixed(2);
        return acc;
      },
      {} as { [id: number]: string },
    );
  });

  const handleTextChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const { name, value } = e.target;

    if (!data) {
      //If you got here, well done!
      return;
    }

    const id = data[index].id;
    const updatedData = data.map((item) =>
      item.id === id ? { ...item, [name]: value } : item,
    );
    setData(updatedData);
  };

  const handleDropdownChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    index: number,
  ) => {
    const { name, value } = e.target;
    if (data) {
      const id = data[index].id;
      const updatedData = data.map((item) =>
        item.id === id ? { ...item, [name]: value } : item,
      );
      setData(updatedData);
    }
  };

  const handleIncomeChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const { value } = e.target;
    const numericValue = value.replace(/^\$/, "");

    if (!data) {
      //If you got here, well done!
      return;
    }

    const id = data[index].id;

    // Update local state immediately
    setLocalIncomeValues((prev) => ({
      ...prev,
      [id]: numericValue,
    }));

    // Clear any existing timeout for this row
    if (timeoutRef.current[id]) {
      clearTimeout(timeoutRef.current[id]);
    }

    // Set new timeout
    timeoutRef.current[id] = window.setTimeout(() => {
      const numericPattern = /^[0-9]*\.?[0-9]*$/;
      let income = "";

      if (numericPattern.test(numericValue)) {
        income = numericValue;
      } else {
        if (numericValue.indexOf(".") !== numericValue.lastIndexOf(".")) {
          income = numericValue.slice(0, numericValue.lastIndexOf("."));
        }
      }

      if (!data) {
        return;
      }

      const updatedData = data.map((item) =>
        item.id === id ? { ...item, income: parseFloat(income) } : item,
      );

      setData(updatedData);
    }, 100);
  };

  const handleAddRow = () => {
    const newRow = {
      id: data ? data.length + 1 : 1,
      description: "",
      frequency: Intervals.fortnightly.name,
      income: 0,
    };
    if (!data) {
      setData([newRow]);
      return;
    }
    setData([...data, newRow]);
  };

  useEffect(() => {
    localStorage.setItem(localStorageKeys.incomeData, JSON.stringify(data));
  }, [data]);

  return (
    <>
      <table>
        <thead>
          <tr>
            <th>Description</th>
            <th>Frequency</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {data &&
            data.map((item, index) => (
              <tr key={item.id}>
                <td>
                  <input
                    name="description"
                    value={item.description}
                    onChange={(e) => handleTextChange(e, index)}
                    className={index % 2 == 0 ? "table" : "tableAlt"}
                    aria-label="description"
                  />
                </td>
                <td>
                  <select
                    name="frequency"
                    value={item.frequency}
                    onChange={(e) => handleDropdownChange(e, index)}
                    className={index % 2 == 0 ? "table" : "tableAlt"}
                    aria-label="frequency"
                  >
                    {Object.values(Intervals).map((interval) => (
                      <option key={interval.name} value={interval.name}>
                        {interval.name}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <input
                    name="income"
                    value={`$${localIncomeValues[item.id]}`}
                    onChange={(e) => {
                      handleIncomeChange(e, index);
                    }}
                    className={index % 2 == 0 ? "table" : "tableAlt"}
                    aria-label="income"
                  />
                </td>
              </tr>
            ))}
        </tbody>
        <tfoot>
          <tr>
            <td>
              <Button type="button" onClick={handleAddRow} aria-label="add row">
                Add Row
              </Button>
            </td>
            <td colSpan={2}></td>
          </tr>
        </tfoot>
      </table>
    </>
  );
}
