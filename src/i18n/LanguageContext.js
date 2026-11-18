import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import en from './en'

// Idiomas disponíveis. O texto em português é a própria chave de tradução:
// t('Salvar') devolve 'Salvar' em pt e 'Save' em en (dicionário em ./en.js).
export const LANGUAGES = {
  pt: { label: 'PT', name: 'Português', locale: 'pt-BR', dict: null },
  en: { label: 'EN', name: 'English', locale: 'en-US', dict: en },
}

const DEFAULT_LANG = 'pt'
const STORAGE_KEY = 'idioma'

function lerIdiomaSalvo() {
  try {
    const salvo = localStorage.getItem(STORAGE_KEY)
    return LANGUAGES[salvo] ? salvo : DEFAULT_LANG
  } catch {
    return DEFAULT_LANG
  }
}

const LanguageContext = createContext({
  lang: DEFAULT_LANG,
  locale: LANGUAGES[DEFAULT_LANG].locale,
  setLang: () => {},
  t: (text) => text,
})

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(lerIdiomaSalvo)

  const setLang = useCallback((novo) => {
    if (!LANGUAGES[novo]) return
    setLangState(novo)
    try { localStorage.setItem(STORAGE_KEY, novo) } catch { /* sem storage: só não persiste */ }
  }, [])

  useEffect(() => {
    document.documentElement.lang = LANGUAGES[lang].locale
  }, [lang])

  // t('Olá {nome}', { nome: 'Ana' }) — textos sem tradução (nomes, dados livres) voltam como estão
  const t = useCallback((text, vars) => {
    if (typeof text !== 'string') return text
    const dict = LANGUAGES[lang].dict
    let out = (dict && dict[text]) || text
    if (vars) {
      out = out.replace(/\{(\w+)\}/g, (m, k) => (vars[k] !== undefined ? vars[k] : m))
    }
    return out
  }, [lang])

  const value = useMemo(() => ({ lang, locale: LANGUAGES[lang].locale, setLang, t }), [lang, setLang, t])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export const useLanguage = () => useContext(LanguageContext)
