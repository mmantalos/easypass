import React from 'react';
import './App.css';
import FrontPage from './FrontPage';
import "./materialize.css";
class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <FrontPage />
    );
  }
}

export default App;
