import React, { Component } from 'react'
import { observer } from 'mobx-react'
import { formStore } from './Store'

const searchObj = (obj, query, fields) => {
  for (let key in obj) {
    let value = obj[key]
    if (typeof value === 'object' || typeof value === 'symbol') {
      searchObj(value, query, fields)
    }
    if (key === query && value !== 'submit') {
      fields[value] = {
        id: value
      }
    }
  };
}

const trampoline = fn => (...args) => {
  let result = fn(...args)
  while (typeof result === 'function') {
    result = result()
  }
  return result
}

const generateStore = props => {
  let fields = {}
  const SearchTrampoline = trampoline(searchObj)
  if (Array.isArray(props.children)) {
    props.children.map(children =>
      SearchTrampoline(children, 'fieldid', fields)
    )
  } else {
    SearchTrampoline(props.children, 'fieldid', fields)
  }
  console.log(fields)
  return fields
}

const noop = () => { }

let store
let values
let getFieldValue = noop
let setValue

const createNewChildrens = (children) => {
  if (Array.isArray(children)) {
    return children.map((element, index) => React.cloneElement(element, { formstore: store, key: index }))
  } else {
    return React.cloneElement(children, { formstore: store })
  }
}

const Form = observer(
  class Form extends Component {
    constructor(props) {
      super(props)
      store = formStore.create({})
      if (props.fieldsid) {
        store.createFieldsWithArray(props.fieldsid)
      } else {
        store.createFields(props)
      }
      values = store.values
      getFieldValue = store.getFieldValue
      setValue = store.setValue
    }

    componentDidMount() {
      store.addListeners()
    }

    handleSubmit(e) {
      const { validation, onSubmit = noop } = this.props
      e.preventDefault();
      if (validation) {
        if (validation(store.Values.keyValue)) {
          onSubmit(store.Values)
        }
      } else {
        onSubmit(store.Values)
      }
    }
    render() {
      const { children, formName, className } = this.props;
      let newChildren = createNewChildrens(children)
      return (
        <form className={className} onSubmit={e => this.handleSubmit(e)}>
          {newChildren}
        </form>
      )
    }
  }
)

const ConditionalRender = observer(
  class ConditionalRender extends Component {
    render() {
      const {
        condition,
        children,
        formstore
      } = this.props;
      return (
        <div style={{ display: formstore.getConditionalRenderStuatus(condition) }}>
          {children}
        </div>
      )
    }
  }
)

export { Form, values, getFieldValue, observer, setValue, ConditionalRender };