import React, { useState } from "react";

import './App.css';
import { FileUploader } from "react-drag-drop-files";
import Upload from "./pages/Upload";
import Main from "./pages/Main";

const fileTypes = ["JPG", "PNG"];

function App() {
  const [file, setFile] = useState(null);
  const handleChange = (file) => {
    setFile(file);
    console.log(file)
  };
   return (
    <Main/>
  );
}

export default App;
