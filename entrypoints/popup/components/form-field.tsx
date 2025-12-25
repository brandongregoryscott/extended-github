type FormFieldProps = {
  inputId: string;
  label: string;
  description?: string;
  children: React.ReactNode;
};

function FormField(props: FormFieldProps) {
  const { inputId, label, description, children } = props;

  return (
    <label className="display-flex-column gap-sm" htmlFor={inputId}>
      <strong>{label}</strong>
      {description != null && (
        <span className="font-size-sm">{description}</span>
      )}
      {children}
    </label>
  );
}

export { FormField };
