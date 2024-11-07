import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux'; 
import store from './redux/store';
import Signup from './Components/admin/Signup';
import Login from './Components/admin/Login';
import Home from './Components/admin/home';
import Home2 from './Components/user/Home';
import Profile from './Components/admin/Profile';
import Siswa from './Components/admin/Siswa';
import Laporan from './Components/admin/Laporan';
import ProtectedRoute from './Components/ProtectedRoute/ProtectedRoute';


const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
  },
  {
    path: '/Signup',
    element: <Signup />,
  },
  {
    path: '/Home',
    element: (
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    ),
  },
  {
    path: '/Home2',
    element: (
      <ProtectedRoute>
        <Home2 />
      </ProtectedRoute>
    ),
  },
  {
    path: '/Profile',
    element: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    ),
  },
  {
    path: '/Siswa',
    element: (
      <ProtectedRoute>
        <Siswa />
      </ProtectedRoute>
    ),
  },
  {
    path: '/Laporan',
    element: (
      <ProtectedRoute>
        <Laporan />
      </ProtectedRoute>
    ),
  },
]);

function App() {
  return (
    <Provider store={store}> 
      <div>
        <RouterProvider router={appRouter} />
      </div>
    </Provider>
  );
}

export default App;
