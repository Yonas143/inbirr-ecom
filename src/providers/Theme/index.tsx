'use client'

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'

import type { Theme, ThemeContextType } from './types'

import { canUseDOM } from '@/utilities/canUseDOM'
import { defaultTheme, getImplicitPreference, themeLocalStorageKey } from './shared'
import { themeIsValid } from './types'

const initialContext: ThemeContextType = {
  setTheme: () => null,
  theme: undefined,
}

const ThemeContext = createContext(initialContext)

export const ThemeProvider = ({
  children,
  forcedTheme,
}: {
  children: React.ReactNode
  forcedTheme?: Theme
}) => {
  const [theme, setThemeState] = useState<Theme | undefined>(
    forcedTheme ||
      (canUseDOM ? (document.documentElement.getAttribute('data-theme') as Theme) : undefined),
  )

  const setTheme = useCallback(
    (themeToSet: Theme | null) => {
      if (forcedTheme) return
      if (themeToSet === null) {
        window.localStorage.removeItem(themeLocalStorageKey)
        const implicitPreference = getImplicitPreference()
        document.documentElement.setAttribute('data-theme', implicitPreference || '')
        if (implicitPreference) setThemeState(implicitPreference)
      } else {
        setThemeState(themeToSet)
        window.localStorage.setItem(themeLocalStorageKey, themeToSet)
        document.documentElement.setAttribute('data-theme', themeToSet)
      }
    },
    [forcedTheme],
  )

  useEffect(() => {
    if (forcedTheme) {
      document.documentElement.setAttribute('data-theme', forcedTheme)
      return
    }
    let themeToSet: Theme = defaultTheme
    const preference = window.localStorage.getItem(themeLocalStorageKey)

    if (themeIsValid(preference)) {
      themeToSet = preference
    } else {
      const implicitPreference = getImplicitPreference()

      if (implicitPreference) {
        themeToSet = implicitPreference
      }
    }

    document.documentElement.setAttribute('data-theme', themeToSet)
    // Persisted browser preferences are read after server hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setThemeState(themeToSet)
  }, [forcedTheme])

  return <ThemeContext.Provider value={{ setTheme, theme: forcedTheme || theme }}>{children}</ThemeContext.Provider>
}

export const useTheme = (): ThemeContextType => useContext(ThemeContext)
