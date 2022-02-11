import React from 'react';
import './SettlementReportForm.css';
import { fetchCosts, fetchSettlements } from './api';
import JsonDataDisplay from './JsonDataDisplay';

class ShortReportForm extends React.Component {
    constructor(props) {
    super(props);
    this.state = {
      op1_ID: '',
      op2_ID: '',
      date_from: '',
      date_to: '',
      op_credited: '',
      op_debited: '',
      cost: null,
      data: null,
      error: null };
    this.handleShortSubmit = this.handleShortSubmit.bind(this);
    this.handleDetailedSubmit = this.handleDetailedSubmit.bind(this);
    this.handleUserInput = this.handleUserInput.bind(this);
    }

    handleShortSubmit() {
        var cost1;
        var cost2;
        this.setState({
            cost: null,
            data: null,
            error: null           
        });
        this.setState({error: null});
        fetchCosts(this.state.op1_ID, this.state.op2_ID, this.state.date_from, this.state.date_to)
            .then(json => {
              setTimeout(() => {
                cost1 = json.data.PassesCost;
                fetchCosts(this.state.op2_ID, this.state.op1_ID, this.state.date_from, this.state.date_to)
                    .then(json => {
                      setTimeout(() => {
                        cost2 = json.data.PassesCost;
                        if (cost1 > cost2) {
                            this.setState({cost: Number(cost1-cost2).toFixed(2),
                                           op_debited: this.state.op2_ID,
                                           op_credited: this.state.op1_ID});
                        }
                        else {
                            this.setState({cost: Number(cost2-cost1).toFixed(2),
                                           op_debited: this.state.op1_ID,
                                           op_credited: this.state.op2_ID});
                        }
                      }, 0);
                    })
                    .catch(error => {
                        if(error.response){
                            this.setState({ error: error.response.data});
                        }
                    });
              }, 0);
            })
            .catch(error => {
                if(error.response){
                    this.setState({ error: error.response.data});
                }
            });
     }

    handleDetailedSubmit() {
        this.handleShortSubmit();
        fetchSettlements(this.state.op1_ID, this.state.op2_ID, this.state.date_from, this.state.date_to)
            .then(csv => {
              setTimeout(() => {
                this.setState({data: csv.data});
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
        <h1>Short Report</h1>
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
          name="short-submit"
          onClick={this.handleShortSubmit}
        >
          Short Report
        </button>
        <button
          className="btn"
          name="detailed-submit"
          onClick={this.handleDetailedSubmit}
        >
          Detailed Report
        </button>
        {this.state.cost !== null && (
          <div className="ShortReport">
            {this.state.cost != 0 && (
                <p>Operator {this.state.op_debited} owes operator {this.state.op_credited} a total of {this.state.cost}</p>
            )}
            {this.state.cost == 0 && (
                <p>No one owes anything.</p>
            )}
          </div>
        )}
        {this.state.data !== null && (
          <JsonDataDisplay data={this.state.data}/>
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

export default ShortReportForm;
