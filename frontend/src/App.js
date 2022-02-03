import React from 'react';
import './App.css';
import FrontPage from './FrontPage';

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
      <FrontPage />
    );
  }
}

export default App;
