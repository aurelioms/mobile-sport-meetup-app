import { useCallback, useState } from "react";
import { FieldErrorData } from "../api";

type Error<T> = Record<keyof T, string | undefined>;

export const useForm = <T>(values: T) => {
  const [formData, setFormData] = useState(values);
  const [errors, setErrors] = useState<Error<T>>({} as Error<T>);

  const onChange = useCallback((value: any, name: string) => {
    setFormData((formData) => ({ ...formData, [name]: value }));
    setErrors({
      ...errors,
      [name]: undefined,
    });
  }, []);

  const handleError = useCallback((error: FieldErrorData) => {
    const fieldErrors = error.fields.reduce((acc, item) => {
      acc[item.key] = item.message;
      return acc;
    }, {} as any);

    setErrors(fieldErrors);
  }, []);

  const setValue = useCallback((value: Partial<T>) => {
    setFormData({ ...formData, ...value });
  }, []);

  return { values: formData, onChange, errors, handleError, setValue };
};
