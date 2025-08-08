import { useEffect, useState } from "react";

export default function App() {
  const [html, setHtml] = useState("");

  useEffect(() => {
    fetch("/api/snippet/1", {
      method: "POST",
      body: new URLSearchParams({ name: "Shrehan" }),
    })
      .then((res) => res.text())
      .then(setHtml);
  }, []);

  return (
    <div>
      <h1>{html}</h1>
    </div>
  );
}
