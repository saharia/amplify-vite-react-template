import FusePageSimple from '@fuse/core/FusePageSimple';
import { styled } from '@mui/material/styles';
import { useThemeMediaQuery } from 'src/@fuse/hooks';
import CreateAssignmentForm from '../assignment/CreateAssignmentForm';

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

function CreateAssignment() {

	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));

  return (
    <Root
      header={
        <div className="p-6">
          <h4>Create Assignment</h4>
        </div>
      }
      content={
        <div className="p-6">
          <CreateAssignmentForm />
        </div>
      }
      scroll={isMobile ? 'normal' : 'page'}
    />
  );
}

export default CreateAssignment;
