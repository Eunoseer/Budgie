import { useRef, useState } from "react";
import { Button } from "./button";
import { configSchema, ignoredContent } from "./contentManager";
import {
  initialPaymentCategories,
  initialAccountNames,
  Intervals,
  recalculatePerCycleCostsByIntervalName,
  defaultTransferFrequency,
  localStorageKeys,
} from "../App";

export function ContentManager() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");
  const [transferFrequency, setTransferFrequency] = useState(
    localStorage.getItem(localStorageKeys.transferFrequency),
  );

  const importConfiguration = () => {
    fileInputRef.current?.click();
  };

  const handleFeedbackMessage = (
    messageType: "success" | "error",
    message: string,
  ) => {
    setMessage(message);
    setMessageType(messageType);
    setTimeout(() => setMessage(""), 2000); // Hide after 2 seconds
  };

  const handleTransferChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTransferFrequency(e.target.value);
    localStorage.setItem(localStorageKeys.transferFrequency, e.target.value);
    recalculatePerCycleCostsByIntervalName(e.target.value);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;

    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const fileContent = e.target?.result as string;
        const data = JSON.parse(fileContent);

        // Filter out keys not defined in the schema
        const filteredData = Object.keys(data)
          .filter((key) => !ignoredContent.includes(key))
          .reduce(
            (acc, key) => {
              acc[key] = data[key];
              return acc;
            },
            {} as Record<string, unknown>,
          );

        const validatedData = configSchema.parse(filteredData);

        Object.entries(validatedData).forEach(([key, value]) => {
          localStorage.setItem(key, JSON.stringify(value));

          //Workaround for the storage event not firing on the same window
          //Yes, it's hacky to not set the old and new value
          const event = new StorageEvent("storage", {
            key: key,
            oldValue: "",
            newValue: "",
            url: window.location.href,
            storageArea: localStorage,
          });
          window.dispatchEvent(event);
        });

        handleFeedbackMessage("success", "File Successfully Loaded");
      } catch (error) {
        console.error("Validation failed:", error);
        handleFeedbackMessage("error", "Invalid File Format");
      }
    };

    reader.readAsText(file);
  };

  const exportConfiguration = () => {
    const data: Record<string, unknown> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key || ignoredContent.includes(key)) continue;
      const value = localStorage.getItem(key);
      if (value) {
        try {
          data[key] = JSON.parse(value);
        } catch (e) {
          console.error("error when parsing export data:- ", e);
          data[key] = value;
        }
      }
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "config-export.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset to defaults?")) {
      localStorage.setItem(
        localStorageKeys.paymentCategory,
        JSON.stringify(initialPaymentCategories),
      );
      localStorage.setItem(
        localStorageKeys.accountName,
        JSON.stringify(initialAccountNames),
      );

      //Workaround for the storage event not firing on the same window
      //Yes, it's hacky to not set the old and new value
      const paymentEvent = new StorageEvent("storage", {
        key: "paymentCategory",
        oldValue: "",
        newValue: "",
        url: window.location.href,
        storageArea: localStorage,
      });
      window.dispatchEvent(paymentEvent);

      const accountEvent = new StorageEvent("storage", {
        key: "accountName",
        oldValue: "",
        newValue: "",
        url: window.location.href,
        storageArea: localStorage,
      });
      window.dispatchEvent(accountEvent);

      handleFeedbackMessage("success", "Application reset to defaults");
    }
  };

  return (
    <>
      <input
        type="file"
        accept=".json"
        onChange={handleFileUpload}
        ref={fileInputRef}
        style={{ display: "none" }}
      />
      <section>
        <p className={`${messageType} ${message.length > 0 ? "show" : ""}`}>
          {message}
        </p>
        <Button type="button" onClick={() => importConfiguration()}>
          Import Configuration
        </Button>
        <Button type="button" onClick={() => exportConfiguration()}>
          Export Configuration
        </Button>
      </section>
      <section className={"resetContainer"}>
        <Button type="reset" onClick={handleReset} className="criticalButton">
          Reset to Defaults
        </Button>
      </section>
      <section>
        <p>Preferred Transfer Frequency</p>
        <select
          className="standard"
          value={transferFrequency || defaultTransferFrequency}
          onChange={(e) => {
            handleTransferChange(e);
          }}
        >
          {Object.values(Intervals).map((interval) => (
            <option key={interval.name} value={interval.name}>
              {interval.name}
            </option>
          ))}
        </select>
      </section>
    </>
  );
}
