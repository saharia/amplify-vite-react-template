import { useEffect, useState } from "react";
import type { Schema } from "../../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import {
  Box,
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { Buttons } from "../../utils/icons/ButtonWithIcon";
import { useHandleErrors } from "../../utils/exceptions/HandleFormErrors";

const client = generateClient<Schema>();

const AssignmentList: React.FC = () => {
  const [assignments, setAssignment] = useState<Array<Schema["Assignment"]["type"]>>([]);
  const { CreateButton } = Buttons();
  const { handleCatchError } = useHandleErrors<{}>();

  useEffect(() => {
    client.models.Assignment.observeQuery().subscribe({
      next: (data) => setAssignment([...data.items]),
      error: (error) => {
        handleCatchError(error);
      },
    });
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Panel */}
      <Box
        sx={{
          border: '1px solid #ddd',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          padding: '1.5rem',
          backgroundColor: '#fff',
        }}
      >
        {/* Header Section */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h1" fontWeight="bold" color="text.primary">
            Assignments
          </Typography>
            <CreateButton route="/assignments/create" />
        </Box>

        {/* Table Section */}
        <TableContainer component={Box} sx={{ border: '1px solid #ddd', borderRadius: '8px' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Title</strong></TableCell>
                <TableCell><strong>Content</strong></TableCell>
                <TableCell><strong>Age Range</strong></TableCell>
                <TableCell><strong>Work Set</strong></TableCell>
                <TableCell><strong>Learning Type</strong></TableCell>
                <TableCell><strong>Learning Stage</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {assignments.map((assignment, index) => (
                <TableRow
                  key={assignment.id}
                  sx={{
                    backgroundColor: index % 2 === 0 ? 'grey.50' : 'white',
                    '&:hover': { backgroundColor: 'grey.100' },
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
      </Box>
    </Container>
  );
}

export default AssignmentList;
