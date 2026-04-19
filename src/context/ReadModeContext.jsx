/* ========================
   READ MODE CONTEXT
======================== */

import { createContext, useState } from 'react'

const ReadModeContext = createContext()

export function ReadModeProvider({ children }) {
  const [mode, setMode] = useState('short')

  return (
    <ReadModeContext.Provider value={{ mode, setMode }}>
      {children}
    </ReadModeContext.Provider>
  )
}

export { ReadModeContext }