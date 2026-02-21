import { useEffect, useState } from "react";
import { incomeSchema, Intervals } from "../App";
import { Button } from "./button";

export function IncomeTable() {
  const [data, setData] = useState(() => {
    const storedData = localStorage.getItem("incomeData");
    const parsedJson = storedData ? JSON.parse(storedData) : [];
    const parsedData = incomeSchema.safeParse(parsedJson);
    if (parsedData.error) {
      return undefined;
    }
    return parsedData.data;
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
    let income = "";

    if (!data) {
      //If you got here, well done!
      return;
    }

    const id = data[index].id;

    const numericValue = value.replace(/^\$/, "");
    // Only allow numbers and an optional decimal value
    const numericPattern = /^[0-9]*\.?[0-9]*$/;
    if (numericPattern.test(numericValue)) {
      income = numericValue;
    } else {
      //In the absence of form validation, handle a user entering a second decimal place gracefully
      if (numericValue.indexOf(".") !== numericValue.lastIndexOf(".")) {
        income = numericValue.slice(0, numericValue.lastIndexOf("."));
      }
    }

    const updatedData = data.map((item) =>
      item.id === id ? { ...item, income } : item,
    );

    //TODO come up with a way that I can add decimal places to the form without the type error of cost being a string
    setData(updatedData);
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
    localStorage.setItem("incomeData", JSON.stringify(data));
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
                  />
                </td>
                <td>
                  <select
                    name="frequency"
                    value={item.frequency}
                    onChange={(e) => handleDropdownChange(e, index)}
                    className={index % 2 == 0 ? "table" : "tableAlt"}
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
                    value={item.income ? `$${item.income}` : ""}
                    onChange={(e) => handleIncomeChange(e, index)}
                    className={index % 2 == 0 ? "table" : "tableAlt"}
                  />
                </td>
              </tr>
            ))}
        </tbody>
        <tfoot>
          <tr>
            <td>
              <Button type="button" onClick={handleAddRow}>
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
