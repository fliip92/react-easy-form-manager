import React, { Component } from 'react'
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live';
import { Form, values, observer, getFieldValue, setValue, ConditionalRender } from "easy-form-manager"
import TextField from '@material-ui/core/TextField';
import NativeSelect from '@material-ui/core/NativeSelect';
import InputLabel from '@material-ui/core/InputLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Switch from '@material-ui/core/Switch';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import { get } from "lodash"
import "./style.css"

const scope = {
  Form, getFieldValue, observer, values, setValue, ConditionalRender,
  TextField, NativeSelect, InputLabel, FormControlLabel, Switch, Button, Select, MenuItem, FormControl
};

const code = `<Form className="form-container-custom-className" onSubmit={(e)=>alert(JSON.stringify(e.keyValue))}>
  <TextField
    fieldid="material-text-field"
    label="Type your name"
    margin="normal"
  />
  <br/>
  <label>Plain html input field</label>
  <input fieldid="input-field-02" />
  <br/>
  <InputLabel >Age</InputLabel>
  <NativeSelect
    fieldid="age"
  >
    <option value="">None</option>
    <option value={10}>Ten</option>
    <option value={20}>Twenty</option>
    <option value={30}>Thirty</option>
  </NativeSelect>
  <br />
  <FormControlLabel
    control={
      <Switch
        color="primary"
        inputProps={{ 'fieldid': 'switch' }}
      />
    }
    label="Do you wanna know a secret?"
  />
  <ConditionalRender condition={(values)=>values.switch ? true : false}>
    You can any thing here
    <NativeSelect
      fieldid="cool"
    >
      <option value={"cool"}>Cool!</option>
      <option value={"ne"}>ne</option>
    </NativeSelect>
  </ConditionalRender>
  <Button variant="contained" color="primary" type="submit">
    Send
  </Button>
</Form>`

export default class LiveEditorComponent extends Component {
  render() {
    return (
      <div className="live-container">
        <LiveProvider code={code} scope={scope} >
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Card>
                <LiveEditor />
                <LiveError />
              </Card>
            </Grid>
            <Grid item xs={6} className="live-preview">
              <Card>
                <LivePreview />
              </Card>
            </Grid>
          </Grid>
        </LiveProvider>
      </div>

    )
  }
}
