import React, { useState } from "react";
import ReactFlow from "reactflow";
import "reactflow/dist/style.css";
import axios from "axios";

function App() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");

  const runFlow = async () => {
    try {
      const res = await axios.post("https://mern-ai-app-3rzu.onrender.com/api/ask-ai", {
        prompt: prompt,
      });

      setResponse(res.data.answer);
    } catch (error) {
      console.error(error);
      alert("Error calling AI API");
    }
  };

  const saveFlow = async () => {
    try {
      await axios.post("https://mern-ai-app-3rzu.onrender.com/api/save", {
        prompt: prompt,
        response: response,
      });

      alert("Saved to database");
    } catch (error) {
      console.error(error);
      alert("Error saving flow");
    }
  };

  const nodes = [
    {
      id: "1",
      position: { x: 50, y: 100 },
      data: {
        label: (
          <div>
            <h4>Prompt</h4>
            <textarea
              style={{ width: "200px", height: "80px" }}
              placeholder="Enter prompt"
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>
        ),
      },
    },
    {
      id: "2",
      position: { x: 400, y: 100 },
      data: {
        label: (
          <div>
            <h4>AI Response</h4>
            <p>{response}</p>
          </div>
        ),
      },
    },
  ];

  const edges = [
    {
      id: "e1-2",
      source: "1",
      target: "2",
      animated: true,
    },
  ];

  return (
    <div style={{ height: "100vh" }}>
      <div style={{ padding: "10px" }}>
        <button onClick={runFlow}>Run</button>
        <button onClick={saveFlow} style={{ marginLeft: "10px" }}>
          Save
        </button>
      </div>

      <ReactFlow nodes={nodes} edges={edges} />
    </div>
  );
}

export default App;
