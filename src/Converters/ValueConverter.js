import React, { useContext } from 'react'
import EditorEnvironment from '../EditorEnvironment'

export default function ValueConverter({ load, update, children }) {
  const editor = useContext(EditorEnvironment.Context)
  console.log(editor)
  return (
    <EditorEnvironment.Context.Provider
      value={{
        ...editor,
        data: load(editor.data),
        update: (nd) => editor.update(update(nd, editor.data))
      }}
      children={children}
    />
  )
}
