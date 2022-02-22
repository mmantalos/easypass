import React from 'react';
import TableReportForm from './TableReportForm';
import SettlementReportForm from './SettlementReportForm';

class FrontPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selection: null,
      error: null
    };
    this.handleSelect = this.handleSelect.bind(this);
    this.handleBack = this.handleBack.bind(this);
  }

  handleSelect(e) {
    const name = e.target.name;
    this.setState({ selection: name });
  }

  handleBack(){
    this.setState({ selection : null })
  }

  render() {
    return (
      <div className="myDiv">
        {this.state.selection == null && (
          <div className="first-buttons" id="id" style={{ display: "flex",
          justifyContent: "center",
          alignItems: "center" }}>
            <button
              className="btn"
              name="passes-btn"
              onClick={this.handleSelect}
              style={{ marginLeft: "auto", marginRight: "10px", marginTop: "auto" }}
            >
              Passes Report
            </button>
            <button
              className="btn"
              name="settlement-btn"
              onClick={this.handleSelect}
              style={{ marginRight: "auto", marginTop: "auto", marginButton: "auto" }}
            >
              Settlement Report
            </button>
          </div>
        )}

        {this.state.selection === "passes-btn" && (
          <TableReportForm handleBack={this.handleBack} />
        )}

        {this.state.selection === "settlement-btn" && (
          <SettlementReportForm handleBack={this.handleBack} />
        )}
      </div>
    );
  }
}

export default FrontPage;
