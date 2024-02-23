import React, { useState } from "react";
import axios from "axios";
import "./App.css";
import { saveAs } from "file-saver";
import loadingGif from "../assets/loading.gif";

// Base URL for the backend server
const BASE_URL = "http://localhost:5000";

function App() {
  // State variables to manage URL input, loading state, and error messages
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior
    setLoading(true); // Set loading state to true
    setError(""); // Clear any previous error messages

    try {
      // Send a POST request to the backend server to convert the URL to PDF
      const response = await axios.post(
        `${BASE_URL}/convert-to-pdf-puppeteer`,
        { url },
        { responseType: "arraybuffer" } // Tell axios to respond with an array buffer
      );

      // Convert the array buffer received from the server to a Blob
      const pdfBlob = new Blob([response.data], { type: "application/pdf" });

      // Use file-saver to save the PDF file locally
      saveAs(pdfBlob, "output.pdf");

      // Reset loading state and URL input after successful conversion
      setLoading(false);
      setUrl("");
    } catch (error) {
      // Handle errors if any occur during the conversion process
      console.error("Error converting to PDF:", error);
      setError("Error converting to PDF. Please try again later.");
      setLoading(false); // Reset loading state
    }
  };

  // Render the component
  return (
    <div className="outer-container">
      <h1>Convert web page to pdf</h1>
      <div className="container">
        {/* Form for entering the URL and submitting the conversion request */}
        <form onSubmit={handleSubmit} className="input-form">
          <input
            type="url"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder="Enter URL"
            required
          />
          {/* Button to initiate the conversion process */}
          <button type="submit" disabled={loading} className="btn">
            {/* Display loading animation if loading, otherwise display button text */}
            {loading ? (
              <img src={loadingGif} alt="Loading..." />
            ) : (
              "Convert to PDF"
            )}
          </button>
        </form>
        {/* Display error message if conversion fails */}
        {error && <div>{error}</div>}
      </div>
    </div>
  );
}

export default App;
