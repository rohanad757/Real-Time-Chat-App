import { createRoot } from 'react-dom/client';
import './index.css';
import { useContext } from 'react';
import App from './App.jsx';
import Auth from './Pages/Auth/Auth.jsx';
import Profile from './Pages/Profile/Profile.jsx';
import Chat from './Pages/Chat/Chat.jsx';
import NewDm from './Pages/Chat/components/new_Dm/NewDm.jsx';
import { createBrowserRouter , RouterProvider } from 'react-router-dom';
import { Toaster } from "@/components/ui/sonner";
import AppState from './Context/AppState.jsx';

const Router = createBrowserRouter([
  {
    path: '/',
    element: <><Toaster position="bottom-right" closeButton/><Auth /></>,
  },
  {
    path: '/auth',
    element: <><Toaster position="bottom-right" closeButton/><Auth /></>,
  },
  {
    path: '/profile',
    element: <><Toaster position="bottom-right"/><Profile /></>,
  },
  {
    path: '/chat',
    element:<><Toaster position="bottom-right"/><Chat /></>
  },
  {
    path : "*",
    element : <div>404</div>
  },
]);

createRoot(document.getElementById('root')).render(
<>
  <AppState>
    <RouterProvider router={Router}>
      <App />
    </RouterProvider>
  </AppState>
</>
)
