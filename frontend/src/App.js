import Graph from "react-graph-vis";
import React, { useState, useEffect } from "react";
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

const baseUrl = "https://us-east-1.aws.webhooks.mongodb-realm.com/api/client/v2.0/app/mongo-graph-vis-ijfpk/service/restAPI/incoming_webhook"

const App = () => {
  let [responseData, setResponseData] = useState('');
  let [searchCriteria, setSearchCriteria] = useState('Sample');
  let [sampleSize, setSampleSize] = useState(25);
  let [personName, setPersonName] = useState('Jude');
  let [placeName, setPlaceName] = useState('Portugal');
  let [graphKey, setGraphKey] = useState(uuid());

  useEffect(() => {
    const fetchData = async (searchCriteria, sampleSize, personName, placeName) => {
      let url = '';
      if (searchCriteria === "Sample") {
        url = `${baseUrl}/searchBySampleSize`
      } else if (searchCriteria === "Person") {
        url = `${baseUrl}/searchByPerson`
      } else if (searchCriteria === "Place") {
        url = `${baseUrl}/searchByPlace`
      }

      const response = await axios({
        "method": "POST",
        "url": url,
        "headers": {
          "content-type": "application/octet-stream",
        },
        data: {
          sampleSize: sampleSize,
          personName: personName,
          placeName: placeName
        }
      });

      const newKey = uuid()
      console.log(`newKey -> ${newKey}`)
      console.log(response.data)
      setGraphKey(newKey)
      setResponseData(response.data)

    };

    fetchData(searchCriteria, sampleSize, personName, placeName);
  }, [searchCriteria, sampleSize, personName, placeName]);


  return (
    <div style={{
      margin: '20px'
    }}>
      <h1>MongoDB Graph Vis</h1>
      <div style={{
        display: 'flex',
        flexDirection: 'row',

      }}>
        <div style={{
          marginTop: '10px',
          marginLef: '20px'
        }}>
          <div>
            <input type="radio" checked={searchCriteria === "Sample"}
              onChange={e => setSearchCriteria(e.target.value)} value="Sample" name="sample" /> Sample search
          </div>

        </div>
        <div style={{
          marginTop: '10px',
          marginLef: '20px'
        }}>
          <div>
            <input type="radio" checked={searchCriteria === "Person"}
              onChange={e => setSearchCriteria(e.target.value)} value="Person" name="person" /> Person search
                    </div>
        </div>
        <div style={{
          marginTop: '10px',
          marginLef: '20px'
        }}>
          <div>
            <input type="radio" checked={searchCriteria === "Place"}
              onChange={e => setSearchCriteria(e.target.value)} value="Place" name="Place" /> Place search
          </div>
        </div>
      </div>
      <div style={{
        marginTop: '10px',
        marginLef: '20px'
      }}>
        {
          searchCriteria === "Sample" &&

          <div style={{
            marginTop: '10px',
            marginLef: '20px'
          }}>
            <label for="sampleSearch">Sample Size</label>

            <select onChange={e => setSampleSize(parseInt(e.target.value))} value={sampleSize} name="sampleSelect" id="sampleSearch">
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
        }
        {
          searchCriteria === "Person" &&

          <div style={{
            marginTop: '10px',
            marginLef: '20px'
          }}>
            <span>Person name (contains)</span>
            <input onChange={e => setPersonName(e.target.value)} name="personName" />
          </div>
        }
        {
          searchCriteria === "Place" &&

          <div style={{
            marginTop: '10px',
            marginLef: '20px'
          }}>
            <span>Place name (contains)</span>
            <input onChange={e => setPlaceName(e.target.value)} name="placeName" />
          </div>
        }
      </div>
      <div style={{
        marginTop: '10px',
        marginLef: '20px'
      }}>
        {responseData && <Graph key={uuid()} graph={responseData} options={options} style={{ height: "720px" }} />}
      </div>
    </div>
  );

}

export default App;