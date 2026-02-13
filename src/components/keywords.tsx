import { useState, useEffect } from "react";

import { Button } from "./button";
import type { keywordTypes } from "./keywords";

export function Keywords({ type }: { type: keywordTypes }) {
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [keywords, setKeywords] = useState<string[]>(() => {
    const saved = localStorage.getItem(type);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(type, JSON.stringify(keywords));
  }, [keywords]);

  const addKeyword = (e: React.ChangeEvent) => {
    e.preventDefault();
    const input = e.currentTarget.querySelector("input")!;
    const value = input.value.trim();
    if (value && !keywords.includes(value)) {
      setKeywords([...keywords, value]);
    } else if (value) {
      setIsDuplicate(true);
      setTimeout(() => setIsDuplicate(false), 2000); // Hide after 2 seconds
    }
    input.value = "";
  };

  const removeKeyword = (index: number) => {
    const newKeywords = [...keywords];
    newKeywords.splice(index, 1);
    setKeywords(newKeywords);
  };

  return (
    <>
      <form onSubmit={addKeyword}>
        <input type="text" placeholder="Enter keyword" />
        <Button type="submit">Add</Button>
        <p className={`keywordsError ${isDuplicate ? "show" : ""}`}>
          Value already exists
        </p>
      </form>
      <div className="keywords">
        {keywords.map((keyword, index) => (
          <span key={index}>
            {keyword}
            <button type="button" onClick={() => removeKeyword(index)}>
              x
            </button>
          </span>
        ))}
      </div>
    </>
  );
}
