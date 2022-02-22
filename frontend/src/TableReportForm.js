import React from 'react';
import './TableReportForm.css';
import { fetchPasses, fetchPassesPerStation } from './api';
import CSVdataDisplay from './CSVdataDisplay';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import CanvasJSReact from './canvasjs.react';
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

var dict = {
    egnatia: "Engatia",
    gefyra: "Gefyra",
    kentriki_odos: "Kentriki Odos",
    moreas: "Moreas",
    nea_odos: "Nea Odos",
    olympia_odos: "Olympia Odos",
    aodos: "Attiki Odos"
}

class TableReportForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      op1_ID: '',
      op2_ID: '',
      station_ID: '',
      date_from: '',
      date_to: '',
      dataT: null,
      dataG: null,
      options: null,
      error: null };
    this.handleTableSubmit = this.handleTableSubmit.bind(this);
    this.handleGraphSubmit = this.handleGraphSubmit.bind(this);
    this.handleUserInput = this.handleUserInput.bind(this);
  }

  handleTableSubmit() {
      this.setState({dataT: null});
      this.setState({error: null});
      fetchPasses(this.state.op1_ID, this.state.op2_ID, this.state.date_from, this.state.date_to)
        .then(csv => {
          this.setState({ error : null});
          setTimeout(() => {
            this.setState({dataT: csv.data});
          }, 0);
        })
        .catch(error => {
            if(error.response){
                this.setState({ error: error.response.data.details});
            }
        });
  }

  handleGraphSubmit() {
      this.setState({dataG: null});
      this.setState({error: null});
      fetchPassesPerStation(this.state.station_ID, this.state.date_from, this.state.date_to)
        .then(json => {
          this.setState({ error : null});
          setTimeout(() => {
            this.setState({dataG: json.data});
            var chartData = {};
            var chartDataJson = [];
            for (var i = 0; i < this.state.dataG.NumberOfPasses; i++) {
                var provider = this.state.dataG.PassesList[i].TagProvider;
                if (chartData[provider] == null)
                    chartData[provider] = 1;
                else
                    chartData[provider] += 1;
            }
            for (var key in chartData) {
                chartDataJson.push({ label: dict[key], y: chartData[key] })
            }
            var op = {
                title: {
                    text: "Chart of passes from selected station"
                },
                data: [{
                    type: "column",
                    dataPoints: chartDataJson
                }]
            };

            this.setState({dataG: chartData,
                           options: op
            });
          }, 0);
        })
        .catch(error => {
            if(error.response){
                this.setState({ error: error.response.data.details});
            }
        });
  }


  handleUserInput(e) {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({ [name]: value });
  }

  render() {
    return (
      <div className="new-form">
      <Tabs defaultIndex={1}>
        <TabList>
          <Tab>Table Report</Tab>
          <Tab>Graph Report</Tab>
        </TabList>

        <TabPanel>
            <h3>Table Report</h3>
            <input
              id="input"
              name="op1_ID"
              field="op1_ID"
              placeholder="First operator ID"
              value={this.state.op1_ID}
              onChange={this.handleUserInput}
              style={{marginLeft: "20px"}}
            />
            <input
              id="input"
              name="op2_ID"
              field="op2_ID"
              placeholder="Second operator ID"
              value={this.state.op2_ID}
              onChange={this.handleUserInput}
              style={{marginLeft: "20px"}}
            />
            <input
              id="input"
              name="date_from"
              field="date_from"
              type="date"
              placeholder="From date"
              value={this.state.date_from}
              onChange={this.handleUserInput}
              style={{marginLeft: "20px"}}
            />
            <input
              id="input"
              name="date_to"
              field="date_to"
              placeholder="To date"
              type="date"
              value={this.state.date_to}
              onChange={this.handleUserInput}
              style={{marginLeft: "20px"}}
            />
            <button
              className="btn"
              name="back"
              onClick={this.props.handleBack}
              style={{ marginRight: "10px", marginLeft: "20px"}}
            >
              Back
            </button>
            <button
              className="btn"
              name="submitTable"
              onClick={this.handleTableSubmit}
            >
              Show Table
            </button>
            {this.state.dataT !== null && (
              <CSVdataDisplay data={this.state.dataT}/>
            )}
            {this.state.error !== null && (
              <div className="error">
                {this.state.error}
              </div>
            )}
        </TabPanel>
        <TabPanel>
          <h3>Graph Report</h3>
          <input
            id="input"
            name="station_ID"
            field="station_ID"
            placeholder="Station ID"
            value={this.state.station_ID}
            onChange={this.handleUserInput}
            style={{marginLeft: "20px"}}
          />
          <input
            id="input"
            name="date_from"
            field="date_from"
            type="date"
            placeholder="From date"
            value={this.state.date_from}
            onChange={this.handleUserInput}
            style={{marginLeft: "20px"}}
          />
          <input
            id="input"
            name="date_to"
            field="date_to"
            placeholder="To date"
            type="date"
            value={this.state.date_to}
            onChange={this.handleUserInput}
            style={{marginLeft: "20px"}}
          />
          <button
            className="btn"
            name="back"
            onClick={this.props.handleBack}
            style={{ marginRight: "10px", marginLeft: "20px"}}
          >
            Back
          </button>
          <button
            className="btn"
            name="submitGraph"
            onClick={this.handleGraphSubmit}
          >
            Show Graph
          </button>
          {this.state.dataG !== null && (
             <div>
                <CanvasJSChart options = {this.state.options}
                /* onRef = {ref => this.chart = ref} */
                />
            </div>
          )}
          {this.state.error !== null && (
            <div className="error">
              {this.state.error}
            </div>
          )}
        </TabPanel>
      </Tabs>

      </div>
    );
  }
}

export default TableReportForm;
