import { useState, useEffect, useRef } from "react";
import { dataSchema } from "./contentManager";

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
    return dataSchema.parse(parsedJson);
  });

  const timeoutRef = useRef<number | undefined>(undefined);

  // Update selected value and save to localStorage
  const handleDropdownChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    index: number,
  ) => {
    const selectedValue = e.target.value;
    const updatedData = data.map((item) =>
      item.id === index ? { ...item, [e.target.name]: selectedValue } : item,
    );
    setData(updatedData);
  };

  const handleTextChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const { name, value } = e.target;
    clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => {
      const updatedData = data.map((item) =>
        item.id === index ? { ...item, [name]: value } : item,
      );
      setData(updatedData);
    }, 100);
  };

  useEffect(() => {
    localStorage.setItem("tableData", JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

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
          {/* <th style={{ width: "3%" }}></th> */}
          <th style={{ width: "30%" }}>Description</th>
          <th style={{ width: "20%" }}>Account Name</th>
          <th style={{ width: "20%" }}>Frequency</th>
          <th style={{ width: "10%" }}>Cost</th>
          <th style={{ width: "20%" }}>Payment Category</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item.id}>
            {/* <td></td> */}
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
                <option value="annually">Annually</option>
                <option value="fortnightly">Fortnightly</option>
              </select>
            </td>
            <td style={{ padding: "0px" }}>
              <input
                name="cost"
                value={item.cost}
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
          </tr>
        ))}
      </tbody>
    </table>
  );
}
