import React, { Component } from 'react'
import { observer } from 'mobx-react'
import { formStore } from './Store'

const searchObj = (obj, query, fields) => {
  for (let key in obj) {
    let value = obj[key]
    if (key === query && value !== 'submit') {
      fields[value] = {
        id: value
      }
      return 0
    } else if (typeof value === 'object') {
      searchObj(value, query, fields)
    } else {
      return 0
    }
  };
}

const trampoline = (fn) => {
  while (fn && typeof fn === 'function') {
    fn = fn()
  }
}

const generateStore = props => {
  let fields = {}
  if (Array.isArray(props.children)) {
    props.children.map(children => {
      trampoline(function () {
        return searchObj(children, 'fieldid', fields)
      })
    })
  } else {
    trampoline(function () {
      return searchObj(props.children, 'fieldid', fields)
    })
  }
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
      let fields = generateStore(props)
      store = formStore.create({ fields })
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