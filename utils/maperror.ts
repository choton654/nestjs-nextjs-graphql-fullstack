import { Error } from "../generated/graphql";

export const toErrorMap = (errors: Error[]) => {
  console.log(errors);

  const errorMap: Record<string, string> = {};
  errors.forEach(({ field, message }) => {
    errorMap[field] = message;
  });

  return errorMap;
};
