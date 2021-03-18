import Graph from "react-graph-vis";
import React, { useState } from "react";

const options = {
  layout: {
    hierarchical: false
  },
  edges: {
    color: "#000000"
  }
};

function randomColor() {
  const red = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
  const green = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
  const blue = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
  return `#${red}${green}${blue}`;
}

const App = () => {
  const [state, setState] = useState({
    counter: 5,
    graph: {
      nodes: [
        { id: 1, label: "Node 1" },
        { id: 2, label: "Node 2" },
        {
          id: 3,
          label: "Node 3:\nLeft-Aligned",
          font: { face: "Monospace", align: "left" },
        },
        { id: 4, label: "Node 4" },
        {
          id: 5,
          label: "Node 5\nLeft-Aligned box",
          shape: "box",
          font: { face: "Monospace", align: "left" },
        },
      ],
      edges: [
        { from: 1, to: 2, label: "middle", font: { align: "middle" } },
        { from: 1, to: 3, label: "top", font: { align: "top" } },
        { from: 2, to: 4, label: "horizontal", font: { align: "horizontal" } },
        { from: 2, to: 5, label: "bottom", font: { align: "bottom" } },
      ]
    },
    events: { }
  })
  const { graph, events } = state;
  return (
    <div>
      <h1>React graph vis</h1>
      <Graph graph={graph} options={options} events={events} style={{ height: "640px" }} />
    </div>
  );

}

export default App;