import axios from 'axios'

export const API_URL = process.env.REACT_APP_API_BASE_URL || ''

export const getToken = () => sessionStorage.getItem('token')

// Sessão inválida/expirada: limpa o token e volta para o login
function encerrarSessao() {
  sessionStorage.removeItem('token')
  if (window.location.pathname !== '/') window.location.assign('/')
}

const ehDaApi = (url = '') => !!API_URL && url.startsWith(API_URL)
const ehLogin = (url = '') => url.endsWith('/login')

// Chamado uma vez em index.js: todas as chamadas Axios para a API passam a enviar o token
export function configurarAutenticacao() {
  axios.interceptors.request.use((config) => {
    const token = getToken()
    if (token && ehDaApi(config.url) && !ehLogin(config.url)) {
      config.headers = config.headers || {}
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  })

  axios.interceptors.response.use(
    (resposta) => resposta,
    (erro) => {
      if (erro.response?.status === 401 && ehDaApi(erro.config?.url) && !ehLogin(erro.config?.url)
          && !erro.config.url.endsWith('/validateUser')) {
        encerrarSessao()
      }
      return Promise.reject(erro)
    }
  )
}

// fetch() com o token da sessão
export async function apiFetch(url, opcoes = {}) {
  const token = getToken()
  const resposta = await fetch(url, {
    ...opcoes,
    headers: { ...(opcoes.headers || {}), ...(token ? { Authorization: `Bearer ${token}` } : {}) },
  })
  if (resposta.status === 401) encerrarSessao()
  return resposta
}

// URLs usadas em <img src> e <a href>, que não enviam cabeçalho: o token vai na query string
export function urlApi(caminho) {
  const url = `${API_URL}/${String(caminho).replace(/^\//, '')}`
  const token = getToken()
  return token ? `${url}${url.includes('?') ? '&' : '?'}token=${encodeURIComponent(token)}` : url
}

export const urlFoto = (idFuncionario) => urlApi(`foto/${idFuncionario}`)
