import React, { useState, useEffect } from 'react'

const EditorContext = React.createContext({})

function EditorEnvironment({ id, persistance, children }) {
  const [data, setData] = useState(null);
  const [currentPromise, setCurrentPromise] = useState(null)

  const update = (d) => { setData(d) }
  const save = () => {
    if(id == null)
      persistance.create(id, data);
    else
      persistance.update(id, data)
    }
  const del = () => {}

  const trackPromise = (p) => {
    const mp = currentPromise == null ? p : Promise.all([currentPromise, p]);
    setCurrentPromise(mp)
    mp.then(()=> setCurrentPromise(cp => {
      if(cp == mp) return null;
      return cp;
    }))
  } 

  useEffect(()=> {
    trackPromise(
    persistance
      .load(id)
      .then(data => {
        console.log("loaded", data)
        setData(data);
      })
    )
  }, [id])

  const editorData = {
    id,
    data,
    isLoading: currentPromise != null,
    update,
    save,
    delete: del,
    trackPromise,
  }

  return <EditorContext.Provider children={children} value={editorData} />
}

EditorEnvironment.Context = EditorContext;
EditorEnvironment.Consumer = function ({children}) {
  return <EditorContext.Consumer children={children}/>
}

export default EditorEnvironment;