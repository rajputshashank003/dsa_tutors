import { BrowserRouter, Routes, Route } from 'react-router-dom'
// import { topics } from './Topics'
import Chat from './Chat'
import AllTutors from './AllTutors'
import Footer from './Footer'

const AppRoutes = () => {
  return (
    <BrowserRouter>
        <Routes>
            <Route path='/' element={<AllTutors/>} />
            <Route path={"/" + "hashmap"} key={0} element={< Chat topic={"hashmap"} />} />
            {/* {
                topics.map( (topic , ind) => (
                ))
            } */}
        </Routes>
        <Footer/>
    </BrowserRouter>
  )
}

export default AppRoutes