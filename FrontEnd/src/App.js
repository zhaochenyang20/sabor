import "./App.css";
import React from "react";
import "./index.css";
import OurRouter from "./router";
import ThemeConfig from "./theme";

function App() {
  return (
    <ThemeConfig>
      <OurRouter />
    </ThemeConfig>
  );
}

export default App;
