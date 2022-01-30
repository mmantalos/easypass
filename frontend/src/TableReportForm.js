import React from 'react';
import './TableReportForm.css';
import { fetchData } from './api';
import JsonDataDisplay from './JsonDataDisplay';

class TableReportForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      op1_ID: null,
      op2_ID: null,
      date_from: null,
      date_to: null,
      error: null };
    this.data = null;
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClear = this.handleClear.bind(this);
    this.handleUserInput = this.handleUserInput.bind(this);
  }

  handleSubmit() {
    if (this.state.op1_ID && this.state.op2_ID && this.state.date_from && this.state.date_to) {
      this.setState({ error : null});
      fetchData(this.state.op1_ID, this.state.op2_ID, this.state.date_from, this.state.date_to)
        .then(json => {
          setTimeout(() => {
            this.data = json;
          }, 0);
        })
        .catch(err => {
          this.setState({ error: err.message })
        });
    }
    else {
      this.setState({ error: "Some fields are blank" })
    }
  }

  handleClear() {
    this.setState({ error : null});
    this.data = null;
  }

  handleUserInput(e) {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({ [name]: value });
  }

  render() {
    return (
      <div className="new-form">
        <h1>Table Report</h1>
        <input
          name="op1_ID"
          field="op1_ID"
          placeholder="First operator ID"
          value={this.state.op1_ID}
          onChange={this.handleUserInput}
        />
        <input
          name="op2_ID"
          field="op2_ID"
          placeholder="Second operator ID"
          value={this.state.op2_ID}
          onChange={this.handleUserInput} />
        <input
          name="date_from"
          field="date_from"
          placeholder="From date"
          value={this.state.date_from}
          onChange={this.handleUserInput} />
        <input
          name="date_to"
          field="date_to"
          placeholder="To date"
          value={this.state.date_to}
          onChange={this.handleUserInput} />
        <button
          className="btn"
          name="action"
          onClick={this.handleSubmit}
        >
          Show Table
        </button>
        <button
          className="btn"
          name="action"
          onClick={this.handleClear}
        >
          Clear
        </button>
        {this.data !== null && (
          <JsonDataDisplay data={this.data} />
        )}

        {this.state.error !== null && (
          <div className="error">
            Error: {this.state.error}
          </div>
        )}
      </div>
    );
  }
}

export default TableReportForm;
