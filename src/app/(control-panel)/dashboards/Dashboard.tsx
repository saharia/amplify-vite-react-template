import FusePageSimple from '@fuse/core/FusePageSimple';
import { styled } from '@mui/material/styles';
import { useGetAssignmentsQuery } from 'src/app/(control-panel)/apps/assignments/AssignmentApi';
import FuseLoading from '@fuse/core/FuseLoading';
import { useThemeMediaQuery } from '@/@fuse/hooks';
import AssignmentList from 'src/app/(control-panel)/apps/assignments/assignment-list/AssignmentList';

const Root = styled(FusePageSimple)(({ theme }) => ({
	'& .FusePageSimple-header': {
		backgroundColor: theme.palette.background.paper,
		borderBottomWidth: 1,
		borderStyle: 'solid',
		borderColor: theme.palette.divider
	},
	'& .FusePageSimple-content': {},
	'& .FusePageSimple-sidebarHeader': {},
	'& .FusePageSimple-sidebarContent': {}
}));

function Dashboard() {
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));

	const { data, isLoading } = useGetAssignmentsQuery({});

	if (isLoading) {
		return <FuseLoading />;
	}

	return (
		<Root
			header={
				<div className="p-6">
					<h4>Dashboard</h4>
				</div>
			}
			content={
				<div className="p-6">
					<AssignmentList assignments={data} />
				</div>
			}
			scroll={isMobile ? 'normal' : 'page'}
		/>
	);
}

export default Dashboard;
