/* Copyright (C) 2018 TeselaGen Biotechnology, Inc. */
import { types, flow } from "mobx-state-tree";
import { size } from "lodash";

const fieldStore = types
  .model("fieldStore", {
    id: types.optional(types.string, ""),
    value: types.optional(types.union(types.string, types.boolean), false),
    type: types.optional(types.string, ""),
    required: types.optional(types.boolean, false)
  })
  .actions(self => ({
    addType(type) {
      if (type !== 'checkbox') {
        self.value = ""
      }
      self.type = type
    },
    handleValue(newValue) {
      if (self.type === "checkbox") {
        self.value = !self.value;
      } else {
        self.value = newValue;
      }
    }
  }));

function getAllElementsWithAttribute(attribute, value) {
  var allElements = document.getElementsByTagName('*');
  for (var i = 0, n = allElements.length; i < n; i++) {
    if (allElements[i].getAttribute(attribute) === value) {
      // Element exists with attribute. Add to array.
      return allElements[i]
    }
  }
}

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

export const formStore = types
  .model("formStore", {
    fields: types.optional(types.map(fieldStore), {}),
    sending: types.optional(types.boolean, false)
  })
  .actions(self => {
    function afterCreate() {
    }
    return {
      afterCreate,
      setValue(key, value) {
        self.fields.get(key).handleValue(value)
      },
      addListeners() {
        let keys = Array.from(self.fields.keys())
        keys.map(key => {
          let element = getAllElementsWithAttribute("fieldid", key)
          if (element) {
            self.fields.get(key).addType(element.type)
            element.addEventListener("change", function (e) {
              self.fields.get(key).handleValue(e.target.value)
            })
          }
        })
      }
    }
  })
  .extend(self => {
    return {
      actions: {
        createFields(props) {
          self.fields = generateStore(props)
        },
        createFieldsWithArray(fieldsId) {
          let fields = {}
          fieldsId.map(id => {
            fields[id] = {
              id: id
            }
          })
          self.fields = fields
        }
      }
    }
  })
  .views(self => ({
    getConditionalRenderStuatus(condition) {
      if (condition(self.Values.keyValue)) {
        return "block"
      } else {
        return "none"
      }
    },
    getFieldValue(key) {
      return self.fields.get(key).value
    },
    values() {
      let keys = Array.from(self.fields.keys());
      let obj = {};
      keys.map(key => obj[key] = self.fields.get(key).value);
      return ({
        values: keys.map(key => self.fields.get(key).value),
        keyValue: obj
      })
    },
    get Values() {
      let keys = Array.from(self.fields.keys());
      let obj = {};
      keys.map(key => obj[key] = self.fields.get(key).value);
      return ({
        values: keys.map(key => self.fields.get(key).value),
        keyValue: obj
      })
    }
  }));