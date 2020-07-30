import { useEffect, useContext, useState } from 'react'
import EditorEnvironment from './EditorEnvironment'

const useEditorInitializer = (
  initializer,
  initialValue = null,
  dependencies,
) => {
  const editor = useContext(EditorEnvironment.Context)
  const [state, setState] = useState(initialValue)

  const fetchData = () => {
    if (initializer.constructor.name === 'AsyncFunction')
      editor.trackPromise(initializer(editor.id).then((x) => onUpdate(x)))
    else if (typeof initializer === 'function') onUpdate(initializer(editor.id))
  }
  useEffect(fetchData, dependencies || [])

  return [state, fetchData]
}

export default useEditorInitializer
