# easy-form-manager
_Simple, Fast, MobX-State-Tree powered form manager [Live Demo](https://easy-form-5bdb0.web.app/)_

# Contents
-   [Installation](#installation)
-   [Getting Started](#getting-started)
-   [Examples](#examples)
-   [Api overview](#api-overview)


# Installation

-   NPM: `npm install easy-form-manager --save`
-   Yarn: `yarn add easy-form-manager`

# Getting started

`<Form>` is a wrapper component automatically inject value and listener to each field contained with fieldid atributte added.

| prop                |  description                                                                          | required  | 
| ------------------- | ------------------------------------------------------------------------------------- | --------- |
| [`onSubmit`]()      | Callback return field values required a submit type button.                           | optional  |
| [`validation`]()    | Callback function expect return true or false.                                        | optional  |
| [`fieldid`]()       | Atributte required must be added to each field.                                       | required  |



```javascript
import { Form } from "easy-form-manager"
//...

render(){
  return(
    <Form 
      onSubmit={(values)=> { /* do something with the values */ }} 
      validation={(values) => /* validate values and return true or false */}
    > 
      <label>This is a field</label>
      <input fieldid="field-id" />
    </Form>
  )
}

```

`<ConditionalRender>` is a wrapper component to hide or render the children

| prop                |  description                                                                          | required  | 
| ------------------- | ------------------------------------------------------------------------------------- | --------- |
| [`condition`]()      | Callback return field values and expect `true` or `false`                            | optional  |

```javascript
import { Form } from "easy-form-manager"
//...

render(){
  return(
    <Form> 
      <ConditionalRender condition={(values)=> /* add some condition as values.fieldid === "something" */ ? true : false}>
        <MoreFields />
        <YepEvenMoreThanOne />
      </ConditionalRender>
    </Form>
  )
}

```



# Examples

To run the examples:

1.  clone this repository
2.  navigate to the demo folder (e.g. `/demo`)
3.  run `yarn install` and `yarn start`

or check the [Live Demo](https://easy-form-5bdb0.web.app/) page

# Api overview
| signature                                                                                                             |                                                                                                                                                                                                                                                       |
| --------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`values()`]()                                                     | Function, return field values                                                                                                                                                                        |
| [`getFieldValue(fieldid) => fieldid.value)`]() | Return an specific field value                                                                                                                                                                |
| [`setValue(fieldid, value)`]()                                              | Set a value to an specific field                                                                                                                                                                                                                |
