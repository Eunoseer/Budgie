import { useState, useEffect } from "react";
import { dataSchema } from "./contentManager";
import { Button } from "./button";
import { Intervals } from "../App";

const getPaymentOptions = (): string[] => {
  const storedPaymentOptions = localStorage.getItem("paymentCategory");
  return storedPaymentOptions ? JSON.parse(storedPaymentOptions) : [];
};

const getAccountNames = (): string[] => {
  const storedAccountNames = localStorage.getItem("accountName");
  return storedAccountNames ? JSON.parse(storedAccountNames) : [];
};

export function Table() {
  const [data, setData] = useState(() => {
    const storedData = localStorage.getItem("tableData");
    const parsedJson = storedData ? JSON.parse(storedData) : [];
    const parsedData = dataSchema.safeParse(parsedJson);
    if (parsedData.error) {
      console.log("it broke yo");
      return undefined;
    }
    return parsedData.data;
  });

  // Update selected value and save to localStorage
  const handleDropdownChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    index: number,
  ) => {
    const selectedValue = e.target.value;
    if (data) {
      const updatedData = data.map((item) =>
        item.id === index ? { ...item, [e.target.name]: selectedValue } : item,
      );
      setData(updatedData);
    }
  };

  const handleTextChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const { name, value } = e.target;
    let updatedValue = "";

    if (name === "cost") {
      const numericValue = value.replace(/^\$/, "");
      // Only allow numbers and an optional decimal value
      const numericPattern = /^[0-9]*\.?[0-9]*$/;
      if (numericPattern.test(numericValue)) {
        updatedValue = numericValue;
      } else {
        //In the absence of form validation, handle a user entering a second decimal place gracefully
        if (numericValue.indexOf(".") !== numericValue.lastIndexOf(".")) {
          updatedValue = numericValue.slice(0, numericValue.lastIndexOf("."));
        }
      }
    } else {
      updatedValue = value;
    }

    if (!data) {
      //If you got here, well done!
      return;
    }

    const updatedData = data.map((item) =>
      item.id === index ? { ...item, [name]: updatedValue } : item,
    );
    setData(updatedData);
  };

  const handleAddRow = () => {
    const newRow = {
      id: data ? data.length + 1 : 1,
      description: "",
      accountName: "",
      frequency: Intervals.annually.name,
      cost: 0,
      paymentCategory: "",
    };
    if (!data) {
      setData([newRow]);
      return;
    }
    setData([...data, newRow]);
  };

  const handleRemoveRow = (index: number) => {
    if (!data) {
      return;
    }
    data.splice(index, 1);
    setData([...data]);
  };

  useEffect(() => {
    localStorage.setItem("tableData", JSON.stringify(data));
  }, [data]);

  return (
    <table
      style={{
        width: "100%",
        tableLayout: "fixed",
        borderCollapse: "collapse",
        borderSpacing: "0px",
        overflowX: "auto",
      }}
    >
      <thead>
        <tr>
          <th style={{ width: "25%" }}>Description</th>
          <th style={{ width: "20%" }}>Account Name</th>
          <th style={{ width: "20%" }}>Frequency</th>
          <th style={{ width: "10%" }}>Cost</th>
          <th style={{ width: "20%" }}>Payment Category</th>
          <th style={{ width: "5%" }}></th>
        </tr>
      </thead>
      <tbody>
        {data &&
          data.map((item, index) => (
            <tr key={item.id}>
              <td style={{ padding: "0px" }}>
                <input
                  name="description"
                  value={item.description}
                  onChange={(e) => handleTextChange(e, item.id)}
                />
              </td>
              <td style={{ padding: "0px" }}>
                <select
                  name="accountName"
                  value={item.accountName}
                  onChange={(e) => handleDropdownChange(e, item.id)}
                >
                  {getAccountNames().map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </td>
              <td style={{ padding: "0px" }}>
                <select
                  name="frequency"
                  value={item.frequency}
                  onChange={(e) => handleDropdownChange(e, item.id)}
                >
                  {Object.values(Intervals).map((interval) => (
                    <option key={interval.name} value={interval.name}>
                      {interval.name}
                    </option>
                  ))}
                </select>
              </td>
              <td style={{ padding: "0px" }}>
                <input
                  name="cost"
                  value={item.cost ? `$${item.cost}` : ""}
                  onChange={(e) => handleTextChange(e, item.id)}
                />
              </td>
              <td style={{ padding: "0px" }}>
                <select
                  name="paymentCategory"
                  value={item.paymentCategory}
                  onChange={(e) => handleDropdownChange(e, item.id)}
                >
                  {getPaymentOptions().map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <Button
                  type="reset"
                  className={"deleteButton"}
                  onClick={() => handleRemoveRow(index)}
                >
                  -
                </Button>
              </td>
            </tr>
          ))}
      </tbody>
      <tfoot>
        <tr>
          <td colSpan={6}>
            <Button type="button" onClick={handleAddRow}>
              Add Row
            </Button>
          </td>
        </tr>
      </tfoot>
    </table>
  );
}
