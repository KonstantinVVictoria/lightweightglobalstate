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
  if (!Object.keys(component.state).length) return component.state;
  Object.entries(globalState.state).forEach((value) => {
    if (component.state.hasOwnProperty(value[0])) {
      component.state[value[0]] = value[1];
    }
  });

  return component.state;
};
//Only updates the states that are dependant on the property that was changed
const updateState = (component, changed) => {
  component.setState(mergeState(component, changed));
};
//Attaches a lister to a component
const updates = (component) => {
  document.addEventListener("stateChanged", (event) => {
    updateState(component, event.detail);
  });
  let globalState = { state: now };
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
