import React from 'react';
import './TableReportForm.css';
import { fetchData } from './api';
import JsonDataDisplay from './JsonDataDisplay';

class TableReportForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      op1_ID: '',
      op2_ID: '',
      date_from: '',
      date_to: '',
      data: null,
      error: null };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleUserInput = this.handleUserInput.bind(this);
  }

  handleSubmit() {
      this.state.data = null;
      fetchData(this.state.op1_ID, this.state.op2_ID, this.state.date_from, this.state.date_to)
        .then(json => {
          this.setState({ error : null});
          setTimeout(() => {
            this.setState({data: json});
          }, 0);
        })
        .catch(error => {
            if(error.response){
                this.setState({ error: error.response.data});
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
          name="back"
          onClick={this.props.handleBack}
        >
          Back
        </button>
        <button
          className="btn"
          name="submit"
          onClick={this.handleSubmit}
        >
          Show Table
        </button>
<<<<<<< HEAD
        {this.state.data !== null && (
          <JsonDataDisplay data={this.state.data}/>
=======
        <button
          className="btn"
          name="clear"
          onClick={this.handleClear}
        >
          Clear
        </button>

        {this.data !== null && (
          <JsonDataDisplay data={this.data} />
>>>>>>> 289561ca0c2cf8d48063fa023a34072f7d1a570d
        )}
        {this.state.error !== null && (
          <div className="error">
            {this.state.error}
          </div>
        )}
      </div>
    );
  }
}

export default TableReportForm;
