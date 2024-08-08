import React from 'react'
import ReactDOM from 'react-dom/client'
import App from "./components/app/App.tsx";
import CssBaseline from '@mui/material/CssBaseline';
import './index.css'
import {Provider} from 'react-redux';
import store from "./redux/store/store.ts";


ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<Provider store={store}>
			<CssBaseline/>
			<App/>
		</Provider>
	</React.StrictMode>,
)
