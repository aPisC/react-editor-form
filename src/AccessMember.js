import React from 'react'
import ValueConverter from './ValueConverter'

export default function AccessMember(props) {
  return (
    <ValueConverter
      load={(d) => d && d[props.member]}
      update={(v, o) => o && { ...o, [props.member]: v }}
      children={props.children}
    />
  )
}
