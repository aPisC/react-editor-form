import { useEffect, useContext } from 'react'
import EditorEnvironment from './EditorEnvironment'

const EditorInitializer = ({ initializer, onUpdate, dependencies }) => {
  const editor = useContext(EditorEnvironment.Context)

  const fetchData = () => {
    editor.trackPromise(initializer(editor.id).then((x) => onUpdate(x)))
  }
  useEffect(fetchData, dependencies || [])

  return null
}

export default EditorInitializer
