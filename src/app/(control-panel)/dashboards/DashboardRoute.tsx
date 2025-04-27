import { lazy } from 'react';
import { FuseRouteItemType } from '@fuse/utils/FuseUtils';

const Dashboard = lazy(() => import('./Dashboard'));

/**
 * The Dashboard page route.
 */
const DashboardRoute: FuseRouteItemType = {
	path: 'dashboard',
	element: <Dashboard />
};

export default DashboardRoute;
