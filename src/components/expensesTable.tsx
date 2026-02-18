import { useState, useEffect } from "react";
import { dataSchema } from "./contentManager";
import { Button } from "./button";
import {
  avgDaysInYear,
  getIntervalByName,
  Intervals,
  type IntervalType,
} from "../App";

const getPaymentOptions = (): string[] => {
  const storedPaymentOptions = localStorage.getItem("paymentCategory");
  return storedPaymentOptions ? JSON.parse(storedPaymentOptions) : [];
};

const getAccountNames = (): string[] => {
  const storedAccountNames = localStorage.getItem("accountName");
  return storedAccountNames ? JSON.parse(storedAccountNames) : [];
};

const getTransferFrequency = () => {
  const transferFrequency = localStorage.getItem("transferFrequency");
  let interval: IntervalType = Intervals.fortnighty;
  if (transferFrequency) {
    const retrievedinterval = getIntervalByName(transferFrequency);
    interval = retrievedinterval || interval;
  }

  return interval;
};

export function ExpensesTable() {
  const [data, setData] = useState(() => {
    const storedData = localStorage.getItem("tableData");
    const parsedJson = storedData ? JSON.parse(storedData) : [];
    const parsedData = dataSchema.safeParse(parsedJson);
    if (parsedData.error) {
      return undefined;
    }
    return parsedData.data;
  });
  const [transferFrequency] = useState(() => getTransferFrequency());

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

    if (!data) {
      //If you got here, well done!
      return;
    }
    const updatedData = data.map((item) =>
      item.id === index ? { ...item, [name]: value } : item,
    );
    setData(updatedData);
  };

  const handleCostChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const { value } = e.target;
    let cost = "";

    if (!data) {
      //If you got here, well done!
      return;
    }

    const numericValue = value.replace(/^\$/, "");
    // Only allow numbers and an optional decimal value
    const numericPattern = /^[0-9]*\.?[0-9]*$/;
    if (numericPattern.test(numericValue)) {
      cost = numericValue;
    } else {
      //In the absence of form validation, handle a user entering a second decimal place gracefully
      if (numericValue.indexOf(".") !== numericValue.lastIndexOf(".")) {
        cost = numericValue.slice(0, numericValue.lastIndexOf("."));
      }
    }

    const perCycle =
      parseFloat(cost) / (avgDaysInYear / transferFrequency.days) || 0;

    const annual = parseFloat(cost) * (avgDaysInYear / 14) || 0;

    const updatedData = data.map((item) =>
      item.id === index ? { ...item, cost, perCycle, annual } : item,
    );

    //TODO come up with a way that I can add decimal places to the form without the type error of cost being a string
    setData(updatedData);
  };

  const handleAddRow = () => {
    const newRow = {
      id: data ? data.length + 1 : 1,
      description: "",
      accountName: "",
      frequency: Intervals.annually.name,
      cost: 0,
      perCycle: 0,
      paymentCategory: "",
      annual: 0,
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
    <table>
      <thead>
        <tr>
          <th style={{ width: "20%" }}>Description</th>
          <th style={{ width: "13%" }}>Account Name</th>
          <th style={{ width: "13%" }}>Frequency</th>
          <th style={{ width: "12%" }}>Cost</th>
          <th style={{ width: "12%" }}>Per {transferFrequency.singular}</th>
          <th style={{ width: "13%" }}>Payment Category</th>
          <th style={{ width: "12%" }}>Annual Cost</th>
          <th style={{ width: "5%" }}></th>
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
                  onChange={(e) => handleTextChange(e, item.id)}
                  className={index % 2 == 0 ? "table" : "tableAlt"}
                />
              </td>
              <td>
                <select
                  name="accountName"
                  value={item.accountName}
                  onChange={(e) => handleDropdownChange(e, item.id)}
                  className={index % 2 == 0 ? "table" : "tableAlt"}
                >
                  {getAccountNames().map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <select
                  name="frequency"
                  value={item.frequency}
                  onChange={(e) => handleDropdownChange(e, item.id)}
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
                  name="cost"
                  value={item.cost ? `$${item.cost}` : ""}
                  onChange={(e) => handleCostChange(e, item.id)}
                  className={index % 2 == 0 ? "table" : "tableAlt"}
                />
              </td>
              <td>
                <input
                  name="perCycle"
                  value={`$${item.perCycle.toFixed(2)}`}
                  disabled={true}
                  onChange={(e) => handleTextChange(e, item.id)}
                  className={index % 2 == 0 ? "table" : "tableAlt"}
                />
              </td>
              <td>
                <select
                  name="paymentCategory"
                  value={item.paymentCategory}
                  onChange={(e) => handleDropdownChange(e, item.id)}
                  className={index % 2 == 0 ? "table" : "tableAlt"}
                >
                  {getPaymentOptions().map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <input
                  name="annual"
                  value={`$${item.annual.toFixed(2)}`}
                  disabled={true}
                  onChange={(e) => handleTextChange(e, item.id)}
                  className={index % 2 == 0 ? "table" : "tableAlt"}
                />
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
          <td>
            <Button type="button" onClick={handleAddRow}>
              Add Row
            </Button>
          </td>
          <td colSpan={2}></td>
          <td></td>
          <td>
            $
            {data
              ? data.reduce((sum, item) => sum + item.perCycle, 0).toFixed(2)
              : 0}
          </td>
          <td></td>
          <td>
            $
            {data
              ? data.reduce((sum, item) => sum + item.annual, 0).toFixed(2)
              : 0}
          </td>
        </tr>
      </tfoot>
    </table>
  );
}
