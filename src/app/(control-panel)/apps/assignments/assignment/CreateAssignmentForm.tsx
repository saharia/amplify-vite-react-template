import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
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
import { useHandleErrors } from "@fuse/hooks/useHandleFormErrors";
import { LearningType, LearningStage } from "@shared/enums/Assignment";
import { createCustomErrorMap, extractLabelsFromSchema, getDefaultValues } from "src/utils/exceptions/ZodErrorMap";
import NavLinkAdapter from "@fuse/core/NavLinkAdapter";


const assignmentSchema = z.object({
  title: z.string().min(5),
  content: z.string().min(5),
  ageRange: z
    .object({
      lower: z.number().min(1).describe("Lower age"),
      upper: z.number().min(1).describe("Upper age"),
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

const fieldLabels = extractLabelsFromSchema(assignmentSchema);
z.setErrorMap(createCustomErrorMap(fieldLabels));

function CreateAssignmentForm() {
  const navigate = useNavigate();
  const { handleCatchError } = useHandleErrors<AssignmentFormValues>();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AssignmentFormValues>({
    resolver: zodResolver(assignmentSchema),
    defaultValues,
  });

  const onSubmit = async (data: AssignmentFormValues) => {
    console.log("Form Submitted:", data);
    try {

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
        <Button
          className=""
          variant="contained"
          color="secondary"
          component={NavLinkAdapter}
          to="/dashboard"
        >
          <span className="hidden sm:flex mx-2">View Assignments</span>
        </Button>
      </Box>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Title */}
        <Controller
          control={control}
          name="title"
          render={({ field }) => (
            <TextField
              className="mt-4"
              {...field}
              label="Title"
              placeholder="Title"
              id="title"
              error={!!errors.title}
              helperText={errors?.title?.message}
              variant="outlined"
              fullWidth
            />
          )}
        />

        {/* Content */}
        <Controller
          control={control}
          name="content"
          render={({ field }) => (
            <TextField
              className="mt-4"
              {...field}
              label="Content"
              placeholder="Content"
              id="content"
              error={!!errors.content}
              helperText={errors?.content?.message}
              variant="outlined"
              fullWidth
              multiline
              minRows={5}
              maxRows={10}
            />
          )}
        />

        {/* Age Range */}
        <Box display="flex" gap={2}>
          <Controller
            control={control}
            name="ageRange.lower"
            render={({ field }) => (
              <TextField
                type="number"
                className="mt-4"
                {...field}
                label="Lower Age"
                placeholder="Lower Age"
                id="title"
                error={!!errors.ageRange?.lower}
                helperText={errors?.ageRange?.lower?.message}
                onChange={(e) => {
                  const value = e.target.value === "" ? "" : Number(e.target.value);
                  field.onChange(value);
                }}
                value={field.value === undefined ? "" : field.value}
                variant="outlined"
                fullWidth
              />
            )}
          />

          <Controller
            control={control}
            name="ageRange.upper"
            render={({ field }) => (
              <TextField
                type="number"
                className="mt-4"
                {...field}
                label="Upper Age"
                placeholder="Upper Age"
                id="title"
                error={!!errors.ageRange?.upper}
                helperText={errors?.ageRange?.upper?.message}
                onChange={(e) => {
                  const value = e.target.value === "" ? "" : Number(e.target.value);
                  field.onChange(value);
                }}
                value={field.value === undefined ? "" : field.value}
                variant="outlined"
                fullWidth
              />
            )}
          />

        </Box>

        {/* Work Set */}
        <Controller
          control={control}
          name="workSet"
          render={({ field }) => (
            <TextField
              className="mt-4"
              {...field}
              label="Work Set"
              placeholder="Work Set"
              id="title"
              error={!!errors.workSet}
              helperText={errors?.workSet?.message}
              variant="outlined"
              fullWidth
            />
          )}
        />

        {/* Learning Type */}
        <FormControl
          fullWidth
          className="mt-4"
          error={!!errors.learningType}
        >
          <InputLabel id="learning-type-label">Type of Learning</InputLabel>
          <Controller
            control={control}
            name="learningType"
            render={({ field }) => (
              <Select
                {...field}
                labelId="learning-type-label"
                id="label-select"
                label="Type of Learning"
                classes={{ select: 'flex items-center space-x-3' }}
              >
                <MenuItem value="" className="space-x-3">Select</MenuItem>

                {Object.entries(LearningType).map(([value, key]) => (
                  <MenuItem key={key} value={key} className="space-x-3">
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


        {/* Learning Stage */}
        <FormControl
          fullWidth
          className="mt-4"
          error={!!errors.learningStage}
        >
          <InputLabel id="learning-stage-label">Stage of Learning</InputLabel>
          <Controller
            control={control}
            name="learningStage"
            render={({ field }) => (
              <Select
                {...field}
                labelId="learning-stage-label"
                id="label-select"
                label="Stage of Learning"
                classes={{ select: 'flex items-center space-x-3' }}
              >
                <MenuItem value="" className="space-x-3">Select</MenuItem>

                {Object.entries(LearningStage).map(([value, key]) => (
                  <MenuItem key={key} value={key} className="space-x-3">
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
          <Button
            className=""
            variant="outlined"
            color="secondary"
            disabled={isSubmitting}
            onClick={() => reset()}
          >
            <span className="hidden sm:flex mx-2">Reset</span>
          </Button>

          <Button
            className=""
            type="submit"
            variant="contained"
            color="secondary"
            disabled={isSubmitting}
          >
            <span className="hidden sm:flex mx-2">{isSubmitting ? "Submitting..." : "Create"}</span>
          </Button>
        </Box>
      </form>
    </Paper>
  );
}

export default CreateAssignmentForm;
