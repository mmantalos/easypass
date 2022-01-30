import React from 'react';
import './ShortReportForm.css';
import { fetchData } from './api';
import JsonDataDisplay from './JsonDataDisplay';

class ShortReportForm extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="new-form">
        <button
          className="btn"
          name="back"
          onClick={this.props.handleBack}
        >
          Back
        </button>
      </div>
    );
  }
}

export default ShortReportForm;
