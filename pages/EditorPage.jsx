import { useRouter } from 'next/router';

export default function ResultadoPage() {
  const router = useRouter();
  const { texto } = router.query; // Acessa o parâmetro de consulta 'texto'

  return (
    <div>
      <h1>Texto Extraído:</h1>
      <p>{decodeURIComponent(texto)}</p> {/* Exibe o texto */}
    </div>
  );
}