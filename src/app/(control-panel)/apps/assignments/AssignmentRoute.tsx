import { lazy } from 'react';
import { FuseRouteItemType } from '@fuse/utils/FuseUtils';

const Assignment = lazy(() => import('./Assignment'));

/**
 * The Assignment page route.
 */
const AssignmentRoute: FuseRouteItemType = {
	path: 'assignments/create',
	element: <Assignment />
};

export default AssignmentRoute;
