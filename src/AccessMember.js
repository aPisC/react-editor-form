import React from 'react'
import ValueConverter from './ValueConverter'

export default function AccessMember(props) {
  const seg = props.member.split('.')
  const last = seg[seg - 1]
  let am = (
    <ValueConverter
      load={(d) => d && d[last]}
      update={(v, o) => o && { ...o, [last]: v }}
      children={props.children}
    />
  )
  for (let i = seg.length - 2; i >= 0; i--) {
    const part = seg[i]
    am = (
      <ValueConverter
        load={(d) => d && d[part]}
        update={(v, o) => o && { ...o, [part]: v }}
        children={am}
      />
    )
  }
  return am
}
