import { Spinner } from "./ui/spinner";

interface LoadingProps {
  message?: string;
}

// Componente de carregamento
export default function Loading({ message = "Carregando..." }: LoadingProps) {
  return (
    <div className="flex min-h-52 flex-col items-center justify-center gap-5 p-10">
      <Spinner />
      <p className="text-gray-600">{message}</p>
    </div>
  );
}
