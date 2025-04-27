import FuseSvgIcon from '@/@fuse/core/FuseSvgIcon';
import NavLinkAdapter from '@/@fuse/core/NavLinkAdapter';
import {
	Box,
	Typography,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Button
} from '@mui/material';
import { Assignment } from 'src/app/(control-panel)/apps/assignments/AssignmentApi';

type AssignmentListProps = {
	assignments: Assignment[];
};

const AssignmentList: React.FC<AssignmentListProps> = ({ assignments }) => {
	return (
		<Paper className="flex flex-col flex-auto p-6 shadow-sm rounded-xl overflow-hidden">
			<div className="flex flex-col sm:flex-row items-start justify-between">
				<Typography className="text-xl font-medium tracking-tight leading-6 truncate">Assignments</Typography>
				<div className="mt-3 sm:mt-0">
					<Button
						className=""
						variant="contained"
						color="secondary"
						component={NavLinkAdapter}
						to="/assignments/create"
					>
						<FuseSvgIcon size={20}>heroicons-outline:plus</FuseSvgIcon>
						<span className="hidden sm:flex mx-2">Add</span>
					</Button>
				</div>
			</div>
			{/* Table Section */}
			<div className="grid grid-cols-1 grid-flow-row gap-6 w-full mt-8 sm:mt-4">
				<TableContainer
					component={Box}
					sx={{ border: '1px solid #ddd', borderRadius: '8px' }}
				>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell>
									<strong>Title</strong>
								</TableCell>
								<TableCell>
									<strong>Content</strong>
								</TableCell>
								<TableCell>
									<strong>Age Range</strong>
								</TableCell>
								<TableCell>
									<strong>Work Set</strong>
								</TableCell>
								<TableCell>
									<strong>Learning Type</strong>
								</TableCell>
								<TableCell>
									<strong>Learning Stage</strong>
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{assignments.map((assignment, index) => (
								<TableRow
									key={assignment.id}
									sx={{
										backgroundColor: index % 2 === 0 ? 'grey.50' : 'white',
										'&:hover': { backgroundColor: 'grey.100' }
									}}
								>
									<TableCell>{assignment.title}</TableCell>
									<TableCell>{assignment.content}</TableCell>
									<TableCell>{`${assignment.ageRange?.lower} - ${assignment.ageRange?.upper}`}</TableCell>
									<TableCell>{assignment.workSet}</TableCell>
									<TableCell>{assignment.learningType}</TableCell>
									<TableCell>{assignment.learningStage}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			</div>
		</Paper>
	);
};

export default AssignmentList;
