import Graph from "react-graph-vis";
import React, { useState } from "react";
import axios from 'axios';
import { uuid } from 'uuidv4';

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
  let [searchCriteria, setSearchCriteria] = useState('Sample');
  let [sampleSize, setSampleSize] = useState(25);

  const fetchData = React.useCallback((size) => {
    axios({
      "method": "POST",
      "url": "https://us-east-1.aws.webhooks.mongodb-realm.com/api/client/v2.0/app/mongo-graph-vis-ijfpk/service/restAPI/incoming_webhook/getNodesAndEdges",
      "headers": {
        "content-type": "application/octet-stream",
      },
      data: {
        sampleSize: size
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
    fetchData(sampleSize)
  }, [fetchData, sampleSize])

  return (
    <div>
      <h1>MongoDB Graph Vis</h1>
      <div style={{
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div>
          <input type="radio" checked={searchCriteria === "Sample"}
            onChange={e => setSearchCriteria(e.target.value)} value="Sample" name="sample" /> Sample search
            {
            searchCriteria === "Sample" &&

            <div>
              <label for="sampleSearch">Sample Size</label>

              <select onChange={e => setSampleSize(parseInt(e.target.value))} value={sampleSize} name="cars" id="sampleSearch">
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>
          }
        </div>
        <div>
          <input type="radio" checked={searchCriteria === "Person"}
            onChange={e => setSearchCriteria(e.target.value)} value="Person" name="person" /> Person search
          </div>
        <div>
          <input type="radio" checked={searchCriteria === "Place"}
            onChange={e => setSearchCriteria(e.target.value)} value="Place" name="Place" /> Place search
          </div>
      </div>
      <div>
        {responseData && <Graph key={uuid()} graph={responseData} options={options} style={{ height: "720px" }} />}
      </div>
    </div>
  );

}

export default App;