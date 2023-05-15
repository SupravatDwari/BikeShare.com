import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes,Navigate} from "react-router-dom";
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import BookingBike from './pages/BookingBike';
import AddBike from './pages/AddBike';

import 'antd/dist/reset.css';
import AdminHome from './pages/AdminHome';
import EditBike from './pages/EditBike';
function App() {
  return (
    <div className="App">
     <Router>
        <Routes>
          <Route exact path="/" element={<PrivateRoute><Home /></PrivateRoute>}/>
          <Route exact path="/register" element={<Register />} />
          <Route exact path="/login" element={<Login />}/>
          <Route exact path="/booking/:bikeid" element={<PrivateRoute><BookingBike /></PrivateRoute>}/>
           <Route exact path='/addbike' element={<PrivateRoute><AddBike/></PrivateRoute>}/>
           <Route exact path='/admin' element={<PrivateRoute><AdminHome/></PrivateRoute>}/>
           <Route exact path='/editbike/:bikeid' element={<PrivateRoute><EditBike/></PrivateRoute>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;

 export function PrivateRoute({ children }) {
  
  return localStorage.getItem('user') ? children : <Navigate to="/login" />;
}