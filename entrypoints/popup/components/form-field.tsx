type FormFieldProps = {
  label: string;
  children: React.ReactNode;
};

function FormField(props: FormFieldProps) {
  const { label, children } = props;

  return (
    <div className="display-flex-column gap-sm">
      <label>
        <strong>{label}</strong>
      </label>
      {children}
    </div>
  );
}

export { FormField };
