import React, { useState, useEffect, useRef } from 'react'

const EditorContext = React.createContext({})

function EditorEnvironment({
  id,
  persistance,
  children,
  emitHandler,
  externalState,
}) {
  let [data, setData] = useState(null)
  if (externalState) [data, setData] = externalState

  const [currentPromise, setCurrentPromise] = useState(null)

  // Guard for updating mounted components only
  const isMountedRef = useRef(false)
  useEffect(() => {
    isMountedRef.current = true
    return () => {
      isMountedRef.current = true
    }
  }, [])

  /****************************
   * Signal emitting function
   */
  // emitting a signal, returns true, if it was not canceled
  const emit = (emitData, isCancelable = false) => {
    let isCanceled = false
    if (emitHandler) {
      emitHandler({
        ...(isCancelable
          ? {
              cancel: () => {
                isCanceled = true
              },
            }
          : {}),
        data,
        id,
        ...emitData,
      })
    }
    return !isCanceled
  }
  /*****************************
   * Promise tracking functions
   *
   * used for setting isLoading value to false
   * when there is no pending promise for the environment
   */
  const clearTrackedPromise = (p) => {
    if (isMountedRef.current)
      setCurrentPromise((currentPromise) => {
        if (currentPromise === p) return null
        return currentPromise
      })
  }
  const trackPromise = (p) => {
    if (isMountedRef.current)
      setCurrentPromise((currentPromise) => {
        const mp = currentPromise == null ? p : Promise.all([currentPromise, p])
        mp.then(() => {
          clearTrackedPromise(mp)
        }).catch(() => {
          clearTrackedPromise(mp)
        })
        return mp
      })
  }

  const update = (d) => {
    if (emit({ type: 'BEFORE_UPDATE', data: d, oldData: data }, true)) {
      setData(d)
      emit({ type: 'AFTER_UPDATE' })
    }
  }

  /************************************
   * Basic data store handler functions
   * (load, save, delete)
   */
  const save = () => {
    if (persistance == null) return
    if (emit({ type: 'BEFORE_SAVE' }, true)) {
      const p = (id == null
        ? persistance.create(data)
        : persistance.update(id, data)
      )
        .then((r) => {
          emit({ type: 'AFTER_SAVE' })
          return r
        })
        .catch((error) => {
          emit({ type: 'ERROR_SAVE', error })
          throw error
        })
      trackPromise(p)
      return p
    }
  }

  // deletes current object (using persistance interface)
  const del = () => {
    if (persistance == null) return
    if (emit({ type: 'BEFORE_DELETE' }, true)) {
      const p = persistance
        .delete(id, data)
        .then((r) => {
          emit({ type: 'AFTER_DELETE' })
          return r
        })
        .catch((error) => {
          emit({ type: 'ERROR_DELETE', error })
          throw error
        })
      trackPromise(p)
      return p
    }
  }

  // load data by the given id (using persistance interface)
  const load = () => {
    if (persistance == null) return
    const p = persistance
      .load(id)
      .then((data) => {
        setData(data)
        return data
      })
      .then((data) => {
        emit({ type: 'AFTER_LOAD', data })
        return data
      })
      .catch((error) => {
        emit({ type: 'ERROR_LOAD', error })
        throw error
      })
    trackPromise(p)
    return p
  }

  // load data on editor initialization
  useEffect(() => {
    load()
    // eslint-disable-next-line
  }, [id])

  const editorData = {
    id,
    data,
    isLoading: currentPromise != null,
    update,
    save,
    load,
    delete: del,
    trackPromise,
    emit,
  }

  return <EditorContext.Provider children={children} value={editorData} />
}

EditorEnvironment.Context = EditorContext
EditorEnvironment.Consumer = function ({ children }) {
  return <EditorContext.Consumer children={children} />
}

export default EditorEnvironment
