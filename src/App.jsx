import { BrowserRouter } from 'react-router-dom'
import Router from './router'
import useApp from './hooks/useApp'
import { useEffect } from 'react'

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
