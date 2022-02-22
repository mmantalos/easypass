import React from 'react';
import './SettlementReportForm.css';
// import './CSVdataDisplay.css';
import { fetchCosts, fetchSettlements, setSettlements} from './api';
import CSVdataDisplay from './CSVdataDisplay';

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
      data1: null,
      data2: null,
      settled: false,
      show_settled: true,
      error: null };
    this.handleShortSubmit = this.handleShortSubmit.bind(this);
    this.handleDetailedSubmit = this.handleDetailedSubmit.bind(this);
    this.handleUserInput = this.handleUserInput.bind(this);
    this.handleSettleSubmit = this.handleSettleSubmit.bind(this);
    this.handleShowSettledCheck = this.handleShowSettledCheck.bind(this);
    }

    handleShortSubmit() {
        var cost1;
        var cost2;
        this.setState({
            cost: null,
            data1: null,
            data2: null,
            settled: false,
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
                            this.setState({ error: error.response.data.details});
                        }
                    });
              }, 0);
            })
            .catch(error => {
                if(error.response){
                    this.setState({ error: error.response.data.details});
                }
            });
     }

    handleDetailedSubmit() {
        this.handleShortSubmit();
        fetchSettlements(this.state.op1_ID, this.state.op2_ID, this.state.date_from, this.state.date_to)
            .then(csv => {
              setTimeout(() => {
                this.setState({data1: csv.data});
              }, 0);
            })
            .catch(error => {
                if(error.response){
                    this.setState({ error: error.response.data.details});
                }
            });
        fetchSettlements(this.state.op2_ID, this.state.op1_ID, this.state.date_from, this.state.date_to)
            .then(csv => {
              setTimeout(() => {
                this.setState({data2: csv.data});
              }, 0);
            })
            .catch(error => {
                if(error.response){
                    this.setState({ error: error.response.data.details});
                }
            });
    }

    handleSettleSubmit(){
        this.setState({
            cost: null,
            data1: null,
            data2: null,
            error: null
        });
        //Settle
        setSettlements(this.state.op1_ID, this.state.op2_ID, this.state.date_from, this.state.date_to)
            .then(res => {
                setSettlements(this.state.op2_ID, this.state.op1_ID, this.state.date_from, this.state.date_to)
                    .then(res => {
                        this.setState({settled: true});
                    }); // catch needed?
            })
            .catch(error => {
                this.setState({error: error.response.data.details});
            });
    }

    handleUserInput(e) {
        const name = e.target.name;
        const value = e.target.value;
        this.setState({ [name]: value });
    }

    handleShowSettledCheck(e){
        console.log('handle', e.target.checked);
        this.setState({show_settled: e.target.checked});
    }

  render() {
    return (
      <div className="new-form">
        <h1>Settlements Report</h1>
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
          type="date"
          value={this.state.date_from}
          onChange={this.handleUserInput} />
        <input
          name="date_to"
          field="date_to"
          placeholder="DD-MM-YYYY"
          type="date"
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
        <button
        className="btn"
        name='settle'
        onClick={this.handleSettleSubmit}>
        Settle Passes
        </button>
        <br/>
        {this.state.cost !== null && (
          <div className="ShortReport">
            {this.state.cost !== 0.00 && (
                <p>Operator {this.state.op_debited} owes operator {this.state.op_credited} a total of {this.state.cost}</p>
            )}
            {this.state.cost === 0.00 && (
                <p>No one owes anything.</p>
            )}
          </div>
        )}
        {this.state.data1 !== null && this.state.data2 !== null && (
            <div>
                <label>
                    <input type="checkbox" name="settled-checkbox" value="show-settled" defaultChecked={true} onChange={this.handleShowSettledCheck}/>
                    <span>Show Settled Passes</span>
                 </label>
                <div className="float-container">

                  <div className="float-child">
                    <p>Passes from {this.state.op2_ID} to {this.state.op1_ID}. </p>
                    <CSVdataDisplay data={this.state.data1} display='settle' show_settled={this.state.show_settled}/>
                  </div>

                  <div className="float-child">
                    <p>Passes from {this.state.op1_ID} to {this.state.op2_ID}. </p>
                    <CSVdataDisplay data={this.state.data2} display='settle' show_settled={this.state.show_settled}/>
                  </div>

                </div>
            </div>

        )}
        {this.state.settled && (
            <div className = 'settlement-result'>
                <p>Passes between operators {this.state.op1_ID} and {this.state.op2_ID} from date: {this.state.date_from} to date: {this.state.date_to} have been settled succesfuly.</p>
            </div>
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
