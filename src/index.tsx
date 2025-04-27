import '@i18n/i18n';
import './styles/index.css';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import routes from '@/configs/routesConfig';
import outputs from '../amplify_outputs.json';
import { Amplify } from 'aws-amplify';

Amplify.configure(outputs);



/**
 * The root element of the application.
 */
const container = document.getElementById('app');

if (!container) {
	throw new Error('Failed to find the root element');
}

/**
 * The root component of the application.
 */
const root = createRoot(container);

const router = createBrowserRouter(routes);

root.render(<RouterProvider router={router} />);
