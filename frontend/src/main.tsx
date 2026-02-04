import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import router from './routers/router.tsx'
import 'sweetalert2/dist/sweetalert2.js'

import { Provider } from 'react-redux'
import { store } from './redux/Store.tsx'
import { AuthProvider } from "./context/AuthContext";

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </Provider>
);

