import React from 'react';
import './App.css';
import NewForm from './NewForm';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = null;
  }

  render() {
    return (
      <div className="container">
        <NewForm />
      </div>
    );
  }
}

export default App;
