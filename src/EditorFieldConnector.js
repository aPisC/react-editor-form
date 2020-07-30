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
  return React.createElement(
    component,
    {
      ...props,
      onChange: (event) =>
        editor.update((valueLoader || ((event) => event.target.value))(event)),
      [valuePropName || 'value']: editor.data == null ? '' : editor.data,
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
