// App.js
import React, { useState } from "react";
import axios from "axios";
import "./App.css";
import { saveAs } from "file-saver";
import loadingGif from "../assets/loading.gif"; // Import your loading GIF

const BASE_URL = "http://localhost:5000";

function App() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        `${BASE_URL}/convert-to-pdf-puppeteer`,
        { url },
        { responseType: "arraybuffer" } // tell axios to respond with an array buffer
      );

      // Convert the array buffer to a blob
      const pdfBlob = new Blob([response.data], { type: "application/pdf" });

      // Use file-saver to save the file
      saveAs(pdfBlob, "output.pdf");
      setLoading(false);
      setUrl("");
    } catch (error) {
      console.error("Error converting to PDF:", error);
      setError("Error converting to PDF. Please try again later.");
      setLoading(false);
    }
  };

  return (
    <div className="outer-container">
      <div className="container">
        <form onSubmit={handleSubmit} className="input-form">
          <input
            type="url"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder="Enter URL"
            required
          />
          <button type="submit" disabled={loading} className="btn">
            {loading ? (
              <img src={loadingGif} alt="Loading..." /> // Render loading GIF if loading
            ) : (
              "Convert to PDF"
            )}
          </button>
        </form>
        {error && <div>{error}</div>}
      </div>
    </div>
  );
}

export default App;
