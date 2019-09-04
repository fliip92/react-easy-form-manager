import React, { Component } from 'react'
import { demoStore } from "./Store"
import LiveEditor from "./modules/LiveEditor"


const store = demoStore.create({});

class App extends Component {
  render() {
    return (
      <LiveEditor />
    )
  }
}

export default App
