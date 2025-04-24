import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../../amplify/data/resource";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
  Box,
  Typography,
  Paper,
} from "@mui/material";
import { useHandleErrors } from "../../utils/exceptions/HandleFormErrors";
import { LearningType, LearningStage } from "../../../shared/enums/Assignment";
import { getDefaultValues } from "../../utils/exceptions/ZodErrorMap";

const client = generateClient<Schema>();

const assignmentSchema = z.object({
  title: z.string().min(5),
  content: z.string().min(5),
  ageRange: z
    .object({
      lower: z.number().min(1),
      upper: z.number().min(1),
    })
    .refine((data) => data.upper > data.lower, {
      message: "Upper age must be greater than lower age.",
      path: ["upper"], // This will attach the error to the "upper" field
    }),
  workSet: z.string().optional(),
  learningType: z.nativeEnum(LearningType),
  learningStage: z.nativeEnum(LearningStage),
  scaffolding: z.object({
    chunks: z.boolean(),
    guidance: z.boolean(),
    visualAids: z.boolean(),
  }),
});

const defaultValues: z.infer<typeof assignmentSchema> = getDefaultValues(assignmentSchema);

type AssignmentFormValues = z.infer<typeof assignmentSchema>;

function CreateAssignment() {

  console.log(defaultValues);
  const navigate = useNavigate();
  const { handleErrors, handleCatchError } = useHandleErrors<AssignmentFormValues>();
  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<AssignmentFormValues>({
    resolver: zodResolver(assignmentSchema),
    defaultValues,
  });

  const onSubmit = async (data: AssignmentFormValues) => {
    console.log("Form Submitted:", data);
    try {
      const response = await client.models.Assignment.create(data);
      if (response?.errors) {
        handleErrors(response.errors, setError);
        return;
      }
      navigate("/");
    } catch (error) {
      handleCatchError(error);
    }
  };

  return (
    <Paper elevation={3} sx={{ maxWidth: 600, mx: "auto", p: 3, mt: 4 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight="bold">
          Create New Assignment
        </Typography>
        <Button variant="contained" color="primary" onClick={() => navigate("/")}>
          View Assignments
        </Button>
      </Box>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Title */}
        <Box mb={2}>
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Title"
                fullWidth
                error={!!errors.title}
                helperText={errors.title?.message}
              />
            )}
          />
        </Box>

        {/* Content */}
        <Box mb={2}>
          <Controller
            name="content"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Content"
                fullWidth
                multiline
                rows={4}
                error={!!errors.content}
                helperText={errors.content?.message}
              />
            )}
          />
        </Box>

        {/* Age Range */}
        <Box display="flex" gap={2} mb={2}>
          <Controller
            name="ageRange.lower"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Lower Age"
                type="number"
                fullWidth
                error={!!errors.ageRange?.lower}
                helperText={errors.ageRange?.lower?.message}
                onChange={(e) => {
                  const value = e.target.value === "" ? "" : Number(e.target.value);
                  field.onChange(value);
                }}
                value={field.value === undefined ? "" : field.value}
              />
            )}
          />
          <Controller
            name="ageRange.upper"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Upper Age"
                type="number"
                fullWidth
                error={!!errors.ageRange?.upper}
                helperText={errors.ageRange?.upper?.message}
                onChange={(e) => {
                  const value = e.target.value === "" ? "" : Number(e.target.value);
                  field.onChange(value);
                }}
                value={field.value === undefined ? "" : field.value}
              />
            )}
          />
        </Box>

        {/* Work Set */}
        <Box mb={2}>
          <Controller
            name="workSet"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Work Set"
                fullWidth
                error={!!errors.workSet}
                helperText={errors.workSet?.message}
              />
            )}
          />
        </Box>

        {/* Learning Type */}
        <Box mb={2}>
          <FormControl fullWidth error={!!errors.learningType}>
            <InputLabel id="learning-type-label">Type of Learning</InputLabel>
            <Controller
              name="learningType"
              control={control}
              render={({ field }) => (
                <Select {...field} labelId="learning-type-label" label="Type of Learning">
                  <MenuItem value="">Select</MenuItem>
                  {Object.entries(LearningType).map(([value, key]) => (
                    <MenuItem key={key} value={key}>
                      {value}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            {errors.learningType?.message && (
              <FormHelperText error>
                {errors.learningType.message}
              </FormHelperText>
            )}
          </FormControl>
        </Box>

        {/* Learning Stage */}
        <Box mb={2}>
          <FormControl fullWidth error={!!errors.learningStage}>
            <InputLabel id="learning-stage-label">Stage of Learning</InputLabel>
            <Controller
              name="learningStage"
              control={control}
              render={({ field }) => (
                <Select {...field} labelId="learning-stage-label" label="Stage of Learning">
                  <MenuItem value="">Select</MenuItem>
                  {Object.entries(LearningStage).map(([value, key]) => (
                    <MenuItem key={key} value={key}>
                      {value}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            {errors.learningStage?.message && (
              <FormHelperText error>
                {errors.learningStage.message}
              </FormHelperText>
            )}
          </FormControl>
        </Box>

        {/* Scaffolding */}
        <Box mb={2}>
          <FormGroup>
            <Controller
              name="scaffolding.chunks"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={<Checkbox {...field} checked={field.value} />}
                  label="Break the assignment into smaller chunks"
                />
              )}
            />
            <Controller
              name="scaffolding.guidance"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={<Checkbox {...field} checked={field.value} />}
                  label="Demonstration or ongoing guidance and supervision"
                />
              )}
            />
            <Controller
              name="scaffolding.visualAids"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={<Checkbox {...field} checked={field.value} />}
                  label="Additional visual aids, cheat sheets"
                />
              )}
            />
          </FormGroup>
        </Box>

        {/* Footer */}
        <Box display="flex" justifyContent="space-between" mt={3}>
          <Button variant="outlined" color="secondary" onClick={() => reset()}>
            Reset
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Create"}
          </Button>
        </Box>
      </form>
    </Paper>
  );
}

export default CreateAssignment;