import React from 'react';
import './App.css';
import TableReportForm from './TableReportForm';
import ShortReportForm from './ShortReportForm';

class App extends React.Component {
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
      <div className="start-page">
        {this.state.selection == null && (
          <div className="first-buttons">
            <button
              className="btn"
              name="passes-btn"
              onClick={this.handleSelect}
            >
              Passes Report
            </button>
            <button
              className="btn"
              name="settlement-btn"
              onClick={this.handleSelect}
            >
              Settlement Report
            </button>
          </div>
        )}

        {this.state.selection == "passes-btn" && (
          <TableReportForm handleBack={this.handleBack} />
        )}

        {this.state.selection == "settlement-btn" && (
          <ShortReportForm handleBack={this.handleBack} />
        )}
      </div>
    );
  }
}

export default App;
