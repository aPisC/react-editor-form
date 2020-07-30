import { useEffect, useContext } from 'react'
import EditorEnvironment from './EditorEnvironment'

const EditorInitializer = ({ initializer, onUpdate, dependencies }) => {
  const editor = useContext(EditorEnvironment.Context)

  const fetchData = () => {
    if (initializer.constructor.name === 'AsyncFunction')
      editor.trackPromise(initializer(editor.id).then((x) => onUpdate(x)))
    else if (typeof initializer === 'function') onUpdate(initializer(editor.id))
  }
  useEffect(fetchData, dependencies || [])

  return null
}

export default EditorInitializer
