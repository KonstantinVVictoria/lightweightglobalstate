import React, { Component } from "react";
try {
  var GlobalState = require("../../../src/G_State.js");
} catch (ex) {
  console.error(
    "Please add a GlobalState.js file containing an object with all the global properties"
  );
}
var now = GlobalState.default;

const debug = (args) => {
  if (args) {
    Object.keys(args).forEach((arg) => {
      if (debugArgList[arg] !== undefined) debugArgList[arg] = arg;
      else console.log("not an valid setting");
    });
  }
  debugArgList.isDebugging = true;
  window.G_events = events;
};
const changesTo = (changes) => {
  let changedProperties = [];
  Object.entries(changes).forEach((change) => {
    changedProperties.push(change[0]);
    currentEvent = change[0];

    if (debugArgList.isDebugging) {
      createEvent(change);
      debug();
    } else change[1]();
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

Object.entries(now).forEach((property) => {
  if (typeof property[1] === "object" && property[1].hasOwnProperty("value"))
    now[property[0]].changesTo = (event, value) => {
      let newState = {};
      newState[property[0]] = {};
      newState[property[0]] = () => {
        now[property[0]].value = value;
        return event + "_" + property[0];
      };
      changesTo(newState);
    };
});

var events = [];

var debugArgList = { isDebugging: false, showInitialMount: false, live: false };

let currentEvent = "";

const show = () => {
  if (now) return now;
  else return "There are no properties in the global state.";
};

const createEvent = (change) => {
  if (debugArgList.isDebugging) {
    let initialType = typeof State.now[change[0]];
    let event = {
      event: change[1](),
    };
    event[
      typeof change[0] !== "string"
        ? typeof change[0] === "object" && change[0].G_ID
          ? "component"
          : change[0]
        : change[0]
    ] =
      typeof change[0] === "string" && !change[0].G_ID
        ? State.now[change[0]]
        : typeof change[0] == "object" && change[0].G_ID
        ? change[0]._reactInternalFiber._debugSource.fileName +
          ":" +
          change[0]._reactInternalFiber._debugSource.lineNumber
        : State.now[change[0]]
        ? State.now[change[0]]
        : "";
    //Why you should not write logic this
    events.push(event);
    if (debugArgList.live)
      console.log(events.length, events[events.length - 1]);
  }
};

const updateState = (componentLink, changes) => {
  let isChangedComponent = false;
  changes.changedProperties.forEach((property) => {
    if (componentLink.G_dependancies.hasOwnProperty(property)) {
      isChangedComponent = true;
    }
  });

  if (isChangedComponent) {
    createEvent([
      componentLink.component,
      () => {
        return "rendering " + componentLink.component.G_ID;
      },
    ]);
    componentLink.component.forceUpdate();
  }
};

const commit = (actions) => {
  if (actions) {
    Object.entries(actions).forEach((action) => {
      let newState = {};
      newState[action[0]] = action[1];
      let event = Object.keys(newState)[0];
      if (currentEvent !== event && currentEvent !== "initial_mount") {
        currentEvent = Object.keys(newState)[0];

        changesTo(newState);
      }
    });
  }
};

const updates = (component, state, actions) => {
  if (debugArgList.showInitialMount) {
    currentEvent = "initial_mount";
    let initialEvent = [
      "initial_mount",
      () => {
        return "initial_mount";
      },
    ];

    createEvent(initialEvent);
  }
  if (typeof component === "function") {
    return instantiate(component, state, actions);
  } else if (typeof component === "object") {
    if (!component.G_ID) component.G_ID = component.constructor.name;

    if (actions) {
      component.componentDidUpdate = () => {
        commit(actions);
      };
    }

    let componentLink = {
      component: component,
      G_dependancies: component.state.G_dependancies,
    };

    let heardUpdate = (event) => {
      return updateState(componentLink, event.detail);
    };

    document.addEventListener("stateChanged", heardUpdate);
    component.componentWillUnmount = () => {
      document.removeEventListener("stateChanged", heardUpdate);
    };
  }
};

const instantiate = (ChildComponent, G_dependancies, actions) => {
  class Comp extends Component {
    constructor(props) {
      super(props);
      this.state = {};
      this.state.G_dependancies = G_dependancies;
      this.G_ID = ChildComponent.name;
      updates(this);
    }

    componentDidUpdate() {
      commit(actions);
    }

    render() {
      return React.createElement(
        React.Fragment,
        null,
        React.createElement(ChildComponent)
      );
    }
  }
  return Comp;
};
const addProperty = (propertyName, property) => {
  now[propertyName] = property;
};

const removeProperty = (propertyName) => {
  delete now[propertyName];
};

const link = (...args) => {
  let dependancies = {};
  args.forEach((dependancy) => {
    dependancies[dependancy] = null;
  });
  return dependancies;
};

var State = {
  now,
  link,
  show,
  updates,
  addProperty,
  removeProperty,
  changesTo,
  debug,
};

export default State;
