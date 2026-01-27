import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { HomePage } from './pages/HomePage'
import { ClassementPage } from './pages/ClassementPage'
import { EquipesPage } from './pages/EquipesPage'
import { TestsPage } from './pages/TestsPage'

function App() {
  return (
    <BrowserRouter basename="/usftt">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="classement" element={<ClassementPage />} />
          <Route path="equipes" element={<EquipesPage />} />
          <Route path="tests" element={<TestsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
