import React, { useContext } from 'react'
import AccessMember from './AccessMember'
import EditorEnvironment from '../EditorEnvironment'

const AccessListItemInner = ({ children }) => {
  const editor = useContext(EditorEnvironment.Context)
  const list = editor.data || []
  return (
    Array.isArray(list) &&
    list.map((e, i) => (
      <EditorEnvironment.Context.Provider
        key={i}
        value={{
          ...editor,
          data: e,
          update: (nd) =>
            editor.update([
              ...editor.data.slice(0, i),
              nd,
              ...editor.data.slice(i + 1),
            ]),
          delete: () =>
            editor.update([
              ...editor.data.slice(0, i),
              ...editor.data.slice(i + 1),
            ]),
        }}
      >
        <EditorEnvironment.Context.Consumer children={children} />
      </EditorEnvironment.Context.Provider>
    ))
  )
}

function AccessListItem({ member, children }) {
  if (member)
    return (
      <AccessMember member={member}>
        <AccessListItemInner children={children} />
      </AccessMember>
    )
  return <AccessListItemInner children={children} />
}

export default AccessListItem
