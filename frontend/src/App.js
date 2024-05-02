import { BrowserRouter, Route, Routes} from 'react-router-dom'
import AdminRouter from './Routes/AdminRouter';
import AuthorRouter from './Routes/AuthorRouter';
import UserRouter from './Routes/UserRouter';
import Protect from './components/Auth/Protect';
import Home from './components/Home';
import LoginForm from './components/LoginForm';
import RegistrationForm from './components/RegisterForm';
import Loader from "./components/Loader/Loader";
import { Suspense } from 'react';
import AdminLogin from './components/AdminLogin';
import './App.css' 

function App() {

  return (
    <>
    <BrowserRouter>
    <Suspense fallback={<Loader />}>
    <Routes>
      <Route exact path='/' element={<LoginForm />}/>
      <Route path='/register' element={<RegistrationForm />}/>
      <Route path='/login' element={<LoginForm />}/>
      <Route path='/admin_login' element={<AdminLogin />}/>
      <Route element={<Protect role="is_admin" />}>
        <Route path={'/admin/*'} element={<AdminRouter />} />
      </Route>
      <Route element={<Protect role="author" />}>
        <Route path={'/author/*'} element={<AuthorRouter />} />
      </Route>
      <Route element={<Protect role="user" />}>
        <Route path={'/user/*'} element={<UserRouter />} />
      </Route>
    </Routes>
    </Suspense>
    </BrowserRouter>
    </>
  );
}

export default App;
