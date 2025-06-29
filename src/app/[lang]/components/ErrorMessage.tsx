interface ErrorMessageProps {
  message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <p className="text-red-400 text-sm mt-1">
      {message}
    </p>
  );
}