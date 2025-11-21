import { BrowserRouter } from 'react-router-dom'
import Router from './router'
import useApp from './hooks/useApp'
import { useEffect } from 'react'
//informacion general de la app
//informacion de configuracion
//horarios, telefonos, correos 


export default function App() {
  const { initApp } = useApp()
  useEffect(() => {
    initApp()
  }, [])
  return (
    <BrowserRouter>
      <Router />
    </BrowserRouter>
  )
}
