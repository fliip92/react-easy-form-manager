import React, { Component } from "react";
import { observer } from "mobx-react";
import { formStore } from "./Store";
import { get } from "lodash"

const searchObj = (obj, query, fields) => {
  let result;
  for (let key in obj) {
    let value = obj[key];
    if (typeof value === "object") {
      searchObj(value, query, fields);
    }
    if (key === query && value !== "submit") {
      result = value;
      fields[value] = {
        id: value
      }
    }
    if (result) {
      return result
    }
  };
}

  const generateStore = props => {
    let fields = {};
    if (Array.isArray(props.children)) {
      props.children.map(children => {
        searchObj(children, "fieldid", fields);
      });
    } else {
      searchObj(children, "fieldid", fields);
    }
    return fields;
  };

  const noop = () => { }

  let store, values, getFieldValue = noop, setValue;

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
        let fields = generateStore(props);
        store = formStore.create({ fields })
        values = store.values;
        getFieldValue = store.getFieldValue;
        setValue = store.setValue;
      }


      componentDidMount() {
        store.addListeners();
      }

      handleSubmit(e) {
        const { validation, onSubmit = noop } = this.props;
        e.preventDefault();
        if (validation) {
          if (validation(store.Values.keyValue)) {
            onSubmit(store.Values);
          }
        } else {
          onSubmit(store.Values);
        }
      }
      render() {
        const { children, formName, className } = this.props;
        let newChildren = createNewChildrens(children);
        return (
          <form className={className} onSubmit={e => this.handleSubmit(e)}>
            {newChildren}
          </form>
        );
      }
    }
  );

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