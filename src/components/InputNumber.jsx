import React, { useState, useEffect } from "react";

export default function InputNumber({ className = "", name, value = "", onChange, ...props }) {
  const [display, setDisplay] = useState("");

  // sincroniza cuando el padre cambia el value
  useEffect(() => {
    if (value === "" || value === null) {
      setDisplay("");
      return;
    }
    const digits = String(value).replace(/\D/g, "");
    setDisplay(digits ? Number(digits).toLocaleString("es-ES") : "");
  }, [value]);

  const handleChange = e => {
    const raw = e.target.value;
    const digits = raw.replace(/\D/g, ""); // solo dígitos
    const formatted = digits ? Number(digits).toLocaleString("es-ES") : "";
    setDisplay(formatted);

    // construimos un evento compatible con tu handleSalesChange
    if (onChange) {
      onChange({
        ...e,
        target: {
          ...e.target,
          name,
          value: digits // valor limpio, ej. "1000000"
        }
      });
    }
  };

  return (
    <input
      type="text"
      className={className}
      name={name}
      value={display}
      onChange={handleChange}
      inputMode="numeric"
      {...props}
    />
  );
}
