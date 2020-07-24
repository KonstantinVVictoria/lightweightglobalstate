import GlobalState from "GlobalState";
export default State = {
  //Global Variables
  now: Object.fromEntries(
    Object.entries(GlobalState).filter(
      (properties) => typeof properties[1] != "function"
    )
  ),

  //Coverts the variables into a state object
  toObject: () => {
    let globalState = {};
    return (globalState.state = Object.fromEntries(
      Object.entries(State.now).filter(
        (properties) => typeof properties[1] != "function"
      )
    ));
  },
  show: () => {
    return State.toObject();
  },
  //Merges the state. Makes sure that the components only gets the properties that it uses
  mergeState: (component, globalState) => {
    let mergedStateEntries = [];

    if (!Object.keys(component.state).length) return component.state;

    Object.entries(globalState.state).forEach((value) => {
      if (Object.entries(component.state)[0][0] === value[0]) {
        mergedStateEntries.push(value);
      }
    });

    return Object.fromEntries(mergedStateEntries);
  },
  //Only updates the states that are dependant on the property that was changed
  updateState: (component, changed) => {
    Object.entries(changed.state).forEach((value) => {
      if (Object.entries(component.state)[0][0] === value[0]) {
        State.mergeState(component, changed);
        let mergeStateEntries = [];
        Object.entries(changed.state).forEach((value) => {
          if (Object.entries(component.state)[0][0] === value[0]) {
            mergeStateEntries.push(value);
          }
        });

        component.setState(Object.fromEntries(mergeStateEntries));
      }
    });
  },
  //Attaches a lister to a component
  updates: (component) => {
    document.addEventListener("stateChanged", (event) => {
      State.updateState(component, event.detail);
    });
  },
  newProperty: (propertyName, property) => {
    State.now[propertyName] = property;
  },

  removeProperty: (propertyName) => {
    delete State.now[propertyName];
  },

  //Changes the State
  change: (callback) => {
    callback();
    document.dispatchEvent(
      new CustomEvent("stateChanged", {
        detail: { state: State.toObject() },
      })
    );
  },
};
module.exports.State = State;
