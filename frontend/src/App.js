import Graph from "react-graph-vis";
import React, { useState } from "react";
import axios from 'axios';

const options = {
  layout: {
    hierarchical: false
  },
  edges: {
    color: "#000000"
  }
};

const App = () => {
  let [responseData, setResponseData] = useState('');

  const fetchData = React.useCallback(() => {
    axios({
      "method": "POST",
      "url": "https://us-east-1.aws.webhooks.mongodb-realm.com/api/client/v2.0/app/mongo-graph-vis-ijfpk/service/restAPI/incoming_webhook/getNodesAndEdges",
      "headers": {
        "content-type": "application/octet-stream",
      },
      data: {
        sampleSize: 75
      }
    })
    .then((response) => {
      console.log(response.data)
      setResponseData(response.data)
    })
    .catch((error) => {
      console.log(error)
    })
  }, [])

  React.useEffect(() => {
    fetchData()
  }, [fetchData])

  return (
    <div>
      <h1>React graph vis</h1>
      { responseData && <Graph graph={responseData} options={options} style={{ height: "720px" }} />}
    </div>
  );

}

export default App;