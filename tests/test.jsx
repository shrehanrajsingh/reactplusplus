<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
  $name = htmlspecialchars($_REQUEST["name"]);
  die("The name is " . $name);
}
?>

export default function FormComponent() {
return (
<form action="/" method="post">
  <h1><?php echo "Hello, World!"; ?></h1>
  <label htmlFor="name">Name: </label>
  <input type="text" id="name" name="name" />

  <button type="submit">Submit</button>
</form>
);
}