//import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import router from './routers/router.tsx'
import 'sweetalert2/dist/sweetalert2.js'

import { Provider } from 'react-redux'
import { store } from './redux/Store.tsx'

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <RouterProvider router={router}/>
  </Provider>,
)
