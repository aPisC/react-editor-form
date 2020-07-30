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
    editor.trackPromise(initializer(editor.id).then((x) => setState(x)))
  }
  useEffect(fetchData, dependencies || [])

  return [state, fetchData]
}

export default useEditorInitializer
