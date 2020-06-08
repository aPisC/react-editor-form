import React, { useState, useEffect } from 'react'

const EditorContext = React.createContext({})

function EditorEnvironment({ id, persistance, children }) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const update = (d) => { setData(d) }
  const save = () => {
    if(id == null)
      persistance.create(id, data);
    else
      persistance.update(id, data)
    }
  const del = () => {}

  useEffect(()=> {
    setIsLoading(true);
    persistance
      .load(id)
      .then(data => {
        console.log("loaded", data)
        setData(data);
        setIsLoading(false);
      })
  }, [id])

  const editorData = {
    id,
    data,
    isLoading,
    update,
    save,
    delete: del
  }

  return <EditorContext.Provider children={children} value={editorData} />
}

EditorEnvironment.Context = EditorContext;
EditorEnvironment.Consumer = function ({children}) {
  return <EditorContext.Consumer children={children}/>
}

export default EditorEnvironment;