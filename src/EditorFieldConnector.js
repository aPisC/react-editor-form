import React, { useContext } from 'react'
import EditorEnvironment from './EditorEnvironment'
import AccessMember from './AccessMember'

const InnerFieldComponent = ({
  component,
  valuePropName,
  valueLoader,
  children,
  ...props
}) => {
  const editor = useContext(EditorEnvironment.Context)

  const propOverride = {
    onChange: (event) =>
      editor.update((valueLoader || ((event) => event.target.value))(event)),
    [valuePropName || 'value']: editor.data == null ? '' : editor.data,
  }

  if (typeof component !== 'string') {
    propOverride.onUpdate = (value) => editor.update(value)
  }

  return React.createElement(
    component,
    {
      ...props,
      ...propOverride,
    },
    children,
  )
}

function EditorFieldConnector({
  component,
  valuePropName,
  valueLoader,
  member,
  ...props
}) {
  if (member)
    return (
      <AccessMember member={member}>
        <InnerFieldComponent
          component={component}
          {...props}
          valuePropName={valuePropName}
          valueLoader={valueLoader}
        />
      </AccessMember>
    )
  return (
    <InnerFieldComponent
      component={component}
      {...props}
      valuePropName={valuePropName}
      valueLoader={valueLoader}
    />
  )
}

export default EditorFieldConnector
