import { z, ZodErrorMap } from "zod";

const formatLabel = (field?: string): string => {
  if (!field) return "Field";
  return field
    .replace(/([A-Z])/g, " $1")
    .replace(/[_\.]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^./, s => s.toUpperCase());
};

export const createCustomErrorMap = (labels: Record<string, string>): ZodErrorMap => {
  return (issue, ctx) => {
  // console.log("Custom error map called", issue, ctx);
  console.log("Field", issue, ctx, labels);

  const field = (issue as any).path?.[0] as string;

  const label = labels[issue.path?.join(".")] ?? formatLabel(field);


  // const label = field ? capitalize(field) : "This field";
  if (!ctx.data || ctx.data === null || ctx.data === undefined) {
    return {
      message: `${label} is required`,
    };
  }
  if (issue.code === z.ZodIssueCode.invalid_type && issue.received === "undefined") {
    return {
      message: `${label} is required`,
    };
  }
  if (issue.code === z.ZodIssueCode.invalid_type && issue.message === "Required") {
    return {
      message: `${label} is required`,
    };
  }
  if (issue.code === z.ZodIssueCode.too_small && issue.type === "string") {
    return {
      message: `${label} must be at least ${issue.minimum} characters`,
    };
  }

  if (issue.code === z.ZodIssueCode.too_big && issue.type === "string") {
    return {
      message: `${label} must be at most ${issue.maximum} characters`,
    };
  }
  if (issue.code === z.ZodIssueCode.invalid_enum_value) {
    return {
      message: `${label} has an invalid value`,
    };
  }

  if (issue.code === z.ZodIssueCode.invalid_type && issue.expected === "number" && issue.received === "string") {
    return {
      message: `${label} must be a number`,
    };
  }

  if (issue.code === z.ZodIssueCode.too_small && issue.type === "number") {
    return {
      message: `${label} must be greater than or equal to ${issue.minimum}`,
    };
  }

  if (issue.code === z.ZodIssueCode.too_big && issue.type === "number") {
    return {
      message: `${label} must be less than or equal to ${issue.maximum}`,
    };
  }



  return { message: ctx.defaultError };
};
};


const unwrapSchema = (schema: z.ZodTypeAny): z.ZodTypeAny => {
  let current = schema;
  while (
    current._def.typeName === "ZodOptional" ||
    current._def.typeName === "ZodNullable" ||
    current._def.typeName === "ZodDefault" ||
    current._def.typeName === "ZodEffects" ||
    current._def.typeName === "ZodPreprocess"
  ) {
    current = current._def.innerType || current._def.schema;
  }
  return current;
};

export const getDefaultValues = (schema: z.ZodTypeAny): any => {
  const baseSchema = unwrapSchema(schema);

  if (baseSchema._def.typeName === "ZodObject") {
    const shape = baseSchema._def.shape();
    return Object.keys(shape).reduce((acc, key) => {
      acc[key] = getDefaultValues(shape[key]);
      return acc;
    }, {} as Record<string, any>);
  }

  if (schema._def.typeName === "ZodDefault") {
    return schema._def.defaultValue();
  }

  switch (baseSchema._def.typeName) {
    case "ZodString":
      return "";
    case "ZodNumber":
      return '';
    case "ZodBoolean":
      return false;
    case "ZodNativeEnum":
      return "";
    case "ZodArray":
      return [];
    case "ZodRecord":
      return {};
    case "ZodUnion":
      return getDefaultValues(baseSchema._def.options[0]);
    default:
      return null;
  }
};

export function extractLabelsFromSchema(schema: z.ZodTypeAny): Record<string, string> {
  const labels: Record<string, string> = {};

  const traverseSchema = (currentSchema: z.ZodTypeAny, path: string[] = []) => {
    const baseSchema = unwrapSchema(currentSchema);

    if (baseSchema._def.typeName === "ZodObject") {
      const shape = baseSchema._def.shape();
      for (const key in shape) {
        traverseSchema(shape[key], [...path, key]);
      }
    } else if (baseSchema._def.description) {
      const fieldPath = path.join(".");
      labels[fieldPath] = baseSchema._def.description;
    }
  };

  traverseSchema(schema);
  return labels;
}


// Set the custom error map globally
// z.setErrorMap(customErrorMap);
