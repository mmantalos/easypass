import React from 'react';
import './NewForm.css';
import { fetchData } from './api';
import JsonDataDisplay from './JsonDataDisplay';

class NewForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
    this.data = null;
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClear = this.handleClear.bind(this);
  }

  handleSubmit() {
    this.setState({ error : null});
    fetchData()
      .then(json => {
        setTimeout(() => {
          this.data = json;
        }, 0);
      })
      .catch(err => {
        this.setState({ error: err.error })
      });
  }

  handleClear() {
    this.setState({ error : null});
    this.data = null;
  }

  render() {
    return (
      <div className="new-form">
        <h1>Table Report</h1>
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

export default NewForm;
