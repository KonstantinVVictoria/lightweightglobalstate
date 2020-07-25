# Lightweight Global State

Lightweight Global State is a lightweight module that allows you to use global states in your react project.

#### Installation:

```
npm i @scythodemes/lightweightglobalstate
```

1. Import
   Import to your react javascript files via **_import <variable name> from "@scythodemes/lightweightglobalstate"_**
   Import to your react typescript files via **_const <variable name> = require("@scythodemes/lightweightglobalstate")_**
2. Create a GlobalState.js file
   The file must have an object containing all your global properties and must export that object.

#### Naming Conventions:

1. Global variables should follow the naming convention G\_<variable name> to separate it from local state variables.
   **ex:** "G_globalProperty"

2. Import variable convention for react javascript files is "State".
   **ex:** _import State from "@scythodemes/lightweightglobalstate"_

#### Documentation

##### 1) **_State.show()_**

Returns a field of global properties of the global state in the form of an object.

**ex:**  
_import **State** from "@scythodemes/lightweightglobalstate"_  
_console.log(**State.show()**)_

##### 2) **_State.updates(<component (component)>)_**

Binds a component to the global state so that it updates when the component has a global property in its local state and when the global state updates. This function should be called in the constructor of a component.

**ex:**  
_import **State** from "@scythodemes/lightweightglobalstate"_  
_class App extends React.Component{_  
_constructor(props) {_  
_super(props);_  
_this.state = { G_number: 0 };_  
**_State.updates(this);_**  
_}}_

##### 3) **_State.changes(<callback (function)>)_**

Changes the Global State directly via the function in its argument.

**ex:**  
_import **State** from "@scythodemes/lightweightglobalstate"_  
_class App extends React.Component{_  
_constructor(props) {_  
_super(props);_  
_this.state = { G_number: 0 };_  
**_State.changes( () => {State.property++} ));_**  
_}}_

##### 4)**_State.newProperty(<propertyName (string)>, <propertyValue (any)>)_**

Adds a new property to the Global State.

**ex:**  
_import **State** from "@scythodemes/lightweightglobalstate"_  
_class App extends React.Component{_  
_constructor(props) {_  
_super(props);_  
_this.state = { G_number: 0 };_  
_State.updates(this);_  
**_State.newProperty("newProperty", 1)_**  
_}}_

##### 5)**_State.removeProperty(<propertyName (string)>)_**

Removes a property in the Global State.

**ex:**  
_import **State** from "@scythodemes/lightweightglobalstate"_  
_class App extends React.Component{_  
_constructor(props) {_  
_super(props);_  
_this.state = { G_number: 0 };_  
_State.updates(this);_  
**_State.removeProperty("newProperty")_**  
_}}_

##### 6)**_State.updateState(<component (component)>, <globalState (globalState)>_**

Manually merges the local state with the global state

**ex:**  
_constructor(props) {_  
_super(props);_  
_this.state = { G_number: 0 };_  
**_State.updateState(this, State.show())_**  
_}}_
