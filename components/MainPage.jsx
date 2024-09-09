import { useState } from 'react';
import ImageInput from './ImageInput';
import LoadingPage from './LoadingPage';

export default function MainPage() {
    const [isLoading, setIsLoading] = useState(false); // Estado para controlar o carregamento

    return (
        <>
            {/* Renderização condicional dos componentes */}
            {isLoading ? <LoadingPage /> : <ImageInput onStartLoading={() => setIsLoading(true)} />}
        </>
    );
};