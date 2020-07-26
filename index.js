import GlobalState from "../../../src/GlobalState";

var currentAction = "";
var now = GlobalState;

const show = () => {
  return now;
};

const mergeState = (component, now) => {
  if (!Object.keys(component.state).length) return component.state;
  Object.entries(now).forEach((property) => {
    if (component.state.hasOwnProperty(property[0])) {
      component.state[property[0]] = property[1];
    }
  });
  return component.state;
};

const updateState = (component, changes) => {
  let isChangedComponent = false;
  changes.changedProperties.forEach((property) => {
    if (component.state[property] !== undefined) {
      isChangedComponent = true;
    }
  });
  if (isChangedComponent) {
    component.setState(mergeState(component, now));
  }
};

const updates = (component) => {
  document.addEventListener("stateChanged", (event) => {
    updateState(component, event.detail);
  });
  component.state = mergeState(component, now);
};

const changesTo = (changes) => {
  let changedProperties = [];
  Object.entries(changes).forEach((change) => {
    currentAction = change[1]();
    changedProperties.push(change[0]);
  });
  document.dispatchEvent(
    new CustomEvent("stateChanged", {
      detail: {
        changedProperties: changedProperties,
        now: now,
      },
    })
  );
};

const addProperty = (propertyName, property) => {
  now[propertyName] = property;
};

const removeProperty = (propertyName) => {
  delete now[propertyName];
};

var State = {
  now,
  show,
  updateState,
  updates,
  addProperty,
  removeProperty,
  changesTo,
};

export default State;
