# react-editor-form

It is a small package that helps with managing complex data behind an editor or form.

> Made with create-react-library

[![NPM](https://img.shields.io/npm/v/@apisc/react-editor-form.svg)](https://www.npmjs.com/package/@apisc/react-editor-form) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save @apisc/react-editor-form
```

## EditorEnvironment Component
This is the component which provides a flexible context to easily create forms withouth manual state management, and simplifies complex logic behind the forms.
### Properties
|Name| Definition|
|-|-|
| `id` | Identifier of the edited object, `null` when creating a new entity |
| `persistance` | An object with data storing functions, used for loading , saving and deleting entities  |
| `emitHandler` (optional) | You can pass a function to be notified from changes and data storing events within the context of editor |

### Provided context
You can access the provided editor context by hooks (`useContext(EditorEnvironment.Context)`) or with consumer component (`<EditorEnvironment.Consumer />`)

You can use the following members from the context object:
- `id : any`: Same as the id property
- `data : any`: The whole edited entity
- `isLoading : bool`: Indicates that there is a pending promise what the editor is waiting for
- `trackPromise : function`: Adds a promise to tracking
- `emit : function`: You can emit custom signals with this function
- `update : function`: Replaces the stored entity with a new one
- `save : function` : Saves the current entity to the store
- `delete : function`: Deletes current entity from store
- `load : function`: Reloads current entity from store

### Persistance interface
The persistance interface is an object with the following members:
- `load(id) => Promise<Data>`
- `update(id, data) => Promise<Data>`
- `create(data) => Promise<Data>`
- `delete(id, data) => Promise`

### Emitted signals
The emitHandler functions will be called with an object that contains all information about the event. 

The base members of the object:
- type (name of the emitted signal)
- data (the current edited entity)
- id (same as the id parameter)

Optional members: 
- cancel (Function that can cancel the current action).
- error (The error object of an unsuccess operation).

These members can be extended and overwritten when emitting custom signals with emit function.

#### Built-in types
- `BEFORE_DELETE` (cancellable)
- `AFTER_DELETE`
- `ERROR_DELETE` (has error)
- `BEFORE_SAVE` (cancellable)
- `AFTER_SAVE`
- `ERROR_SAVE` (has error)
- `BEFORE_UPDATE`(cancellable, data contains the next state of edited entity, oldData contains the previous state )
- `AFTER_UPDATE`
- `AFTER_LOAD`
- `ERROR_LOAD` (has error)

#### Emitting custom signals
Signals can be emitted with `emit` function, it requires an object with the data of the signal, the second parameter is optionally indicates if the signal is cancellable, and return true is it was not cancelled.
```jsx
  editor.emit({type: "CUSTOM_SIGNAL", ...customData});

  if(editor.emit({type: "CUSTOM_CANCELLABLE", ...customData}, true)) 
    doSomething();

```

## EditorFieldConnector
This component will create a field of the given type, connects the `value` and `onChange` properties, and updates the entity or the given member of entity by the `onChange` event. The value property name and the function that gets value from event object can be overwritten.

```jsx
return (
  <EditorEnvironment id={id} persistance={persistance} >
    <EditorFieldConnector
      component="input"
      member="member1"
      className="form-control">
    <EditorFieldConnector
      component="input"
      type="checkbox"
      member="check1"
      valuePropName="checked"
      valueLoader={ (event) => event.target.checked } >
    </EditorFieldConnector>
    <EditorFieldConnector
      component={ MyInputComponent }
      member="member3" >
    </EditorFieldConnector>
  </EditorEnvironment>
)
```
## Editor Initializaton
You can perform loading actions in your editor before allowing the form with the `EditorInitializer` component and `useEditorInitializer` hook. These initializer must not be conditionally rendered based on the isLoading value of the editor!
### Examples
```jsx
const [options, setOptions] = useState([]);
<EditorEnvironment id={id} persistance={persistance}>
  <EditorInitializer
    initializer={(id)=>axios.get("/options" + id).then(r=> r.data)}
    onUpdate={(options) => setOptions(options)}
    dependencies={[id]} {/* optional, reloads the data when a dependency changes*/}
  />
  <EditorEnvironment.Consumer>
    { ({isLoading}) => !isloading && (
      <EditorFieldConnector
        component="select"
        member="ddval"
      >
        {options.map(o=> <option value={o.value} key={o.value}>{o.text}</option>)}
      </EditorFieldConnector>
    )}
  </EditorEnvironment.Consumer>
</EditorEnvironment>
```
```jsx
const MyDropDown = (props) => {
  const [options, manualUpdate] = useEditorInitializer(
    (id)=>axios.get("/options" + id).then(r=> r.data) /*initializer*/, 
    [] /*initialValue*/, 
    [id] /* dependencies */
  );
  return (
    <EditorEnvironment.Consumer>
      { ({isLoading}) => !isloading && (
        <EditorFieldConnector
          component="select"
          member={props.member}
        >
          {options.map(o=> <option value={o.value} key={o.value}>{o.text}</option>)}
        </EditorFieldConnector>
      )}
    </EditorEnvironment.Consumer>
  )
}

return (
  <EditorEnvironment id={id} persistance={persistance}>
    <MyDropDown member="ddval" />
  </EditorEnvironment>
)
```

## Managing Complex entities
### AccessMember
This component will replace the original entity with a member of it and handles the update of this member.
#### Example 
```jsx
const exampleEntity = {
  name: "John Doe",
  mother: {
    name: "Jane Doe",
    city: "New York"
  },
  profession: "programmer"
}
return (
  <EditorFieldConnector component="input" member="name" ></EditorFieldConnector>
  <AccessListMember member="mother">
    <EditorFieldConnector component="input" member="name" ></EditorFieldConnector>
    <EditorFieldConnector component="input" member="city" ></EditorFieldConnector>
  </Converters.AccessListItem>
  <AccessListMember member="profession">
    <EditorFieldConnector component="input" ></EditorFieldConnector>
  </Converters.AccessListItem>
)
```

### AccessListItem
This component will generate editor components to all members of a list in edited entity, and maps the data to it.
The update and delete methods will be overwritten in its context, the update function will replace the current element in the list, and the delete function will remove the current element from list.

#### Example
```jsx
return (
  <EditorEnvironment id={id} persistance={persistance}>
    <AccessListItem member="list">
      {(editor) => <div>
          <EditorFieldConnector component="input" />
          <button type="button" onClick={editor.delete}>
          Delete this item.
        </button>
      </div>
      }
    </AccessListItem>
    <EditorEnvironment.Consumer>
      {({update, data})=>
        <button type="button" onClick={() => {update({...data, list: [...data.list, ""]})}}>
              Add an empty item to list
        </button>
      }
    </EditorEnvironment.Consumer>
  </EditorEnvironment>
)
```

### ValueConverter
The ValueConverter can perform data conversion between the entity and the editor field (For exaple: the date format  is different in the edited entity and the field). It requires 2 functions as parameters:
- `load`: generates the converted value when an updated state arrives
- `update` generates the updated state from the old state and the updated value within its context

#### Example (AccessMember Component)
```jsx
return (
  <ValueConverter
    load={(d) => d && d[props.member] }
    update={(v, o) => o && ({ ...o, [props.member]: v })}
    children={props.children}
  />
);
```

## License

MIT © [aPisC](https://github.com/aPisC)
