import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { topics } from './Topics'
import Chat from './Chat'
import AllTutors from './AllTutors'
import Footer from './Footer'

const AppRoutes = () => {
  return (
    <BrowserRouter>
        <Routes>
            <Route path='/' element={<AllTutors/>} />
            {
                topics.map( (topic , ind) => (
                    <Route path={"/" + topic} key={ind} element={< Chat topic={topic} />} />
                ))
            }
        </Routes>
        <Footer/>
    </BrowserRouter>
  )
}

export default AppRoutes