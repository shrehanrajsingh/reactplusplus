import { useEffect, useState } from "react";


export default function FormComponent() {
const [Var1, setVar1] = useState("");

  useEffect(() => {
    fetch("/api/snippet/1", {
      method: "GET"
    })
      .then((res) => res.text())
      .then(setVar1);
  }, []);

return (
<form action="/" method="post">
  <h1>{Var1}</h1>
  <label htmlFor="name">Name: </label>
  <input type="text" id="name" name="name" />

  <button type="submit">Submit</button>
</form>
);
}