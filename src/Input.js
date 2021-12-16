import React, { useRef } from 'react'
import styled from 'styled-components'

export const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  user-select: none;
  label {
    font-size: 11px;
    margin-right: 5px;
  }
  input {
    width: 40px;
    text-align: center;
    border: 1px solid #ddd;
    outline: 0;
    font-family: monospace;
    font-size: 10px;
    padding: 4px 4px;
    user-select: none;
    &:focus {
      background: #fafafa;
    }
    &::selection {
      background: #ddd;
    }
  }
`

const Input = ({ label, value, max, min, defaultValue, setValue }) => {
  const input = useRef(null)

  function onBlur(e) {
    if (e.target.value === '') {
      setValue(defaultValue)
    } else if (e.target.value < min) {
      setValue(min)
    }
  }

  function onChange(e) {
    const isDigit = /^\d\*\$/
    var newValue
    if (isDigit.test(e.target.value)) {
      if (Number(e.target.value) > max) {
        newValue = max
      } else {
        newValue = Number(e.target.value)
      }
    } else {
      newValue = defaultValue
    }
    setValue(newValue)
  }

  return (
    <InputWrapper>
      <label>{label}</label>
      <input
        ref={input}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        autoFocus={false}
      />
    </InputWrapper>
  )
}

export default Input