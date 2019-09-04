import React from 'react'
import { render } from 'react-dom'
import App from './App'
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import "./style.css"

const theme = createMuiTheme({
  palette: {
    type: 'dark',
  },
});


render(<ThemeProvider theme={theme}><App /></ThemeProvider>, document.querySelector('#app'))
