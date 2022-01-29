import React from 'react';
import './App.css';
import TableReportForm from './TableReportForm';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = null;
  }

  render() {
    return (
      <div className="container">
        <TableReportForm />
      </div>
    );
  }
}

export default App;
