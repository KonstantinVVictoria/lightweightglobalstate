import GlobalState from "../../../src/GlobalState";

const now = Object.fromEntries(
  Object.entries(GlobalState).filter(
    (properties) => typeof properties[1] != "function"
  )
);

//Coverts the constiables into a state object
const toObject = () => {
  let globalState = {};
  return (globalState.state = Object.fromEntries(
    Object.entries(now).filter(
      (properties) => typeof properties[1] != "function"
    )
  ));
};
const show = () => {
  return toObject();
};
//Merges the state. Makes sure that the components only gets the properties that it uses
const mergeState = (component, globalState) => {
  let mergedStateEntries = [];

  if (!Object.keys(component.state).length) return component.state;

  Object.entries(globalState.state).forEach((value) => {
    if (Object.entries(component.state)[0][0] === value[0]) {
      mergedStateEntries.push(value);
    }
  });

  return Object.fromEntries(mergedStateEntries);
};
//Only updates the states that are dependant on the property that was changed
const updateState = (component, changed) => {
  Object.entries(changed.state).forEach((value) => {
    console.log(Object.entries(component.state)[0][0], value[0]);
    if (Object.entries(component.state)[0][0] === value[0]) {
      mergeState(component, changed);
      let mergeStateEntries = [];
      Object.entries(changed.state).forEach((value) => {
        if (Object.entries(component.state)[0][0] === value[0]) {
          mergeStateEntries.push(value);
        }
      });

      component.setState(Object.fromEntries(mergeStateEntries));
    }
  });
};
//Attaches a lister to a component
const updates = (component) => {
  document.addEventListener("stateChanged", (event) => {
    updateState(component, event.detail);
  });
  let globalState = { state: show() };
  component.state = mergeState(component, globalState);
};
const newProperty = (propertyName, property) => {
  now[propertyName] = property;
};

const removeProperty = (propertyName) => {
  delete now[propertyName];
};

//Changes the State
const change = (callback) => {
  callback();
  document.dispatchEvent(
    new CustomEvent("stateChanged", {
      detail: { state: toObject() },
    })
  );
};

var State = {
  now,
  toObject,
  show,
  updateState,
  updates,
  newProperty,
  removeProperty,
  change,
};

export default State;
