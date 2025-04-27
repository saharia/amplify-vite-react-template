import { lazy } from 'react';
import { FuseRouteItemType } from '@fuse/utils/FuseUtils';

const CreateAssignment = lazy(() => import('./pages/CreateAssignment'));

/**
 * The Assignment page route.
 */
const AssignmentRoute: FuseRouteItemType = {
	path: 'assignments/create',
	element: <CreateAssignment />
};

export default AssignmentRoute;
