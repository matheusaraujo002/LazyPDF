import { useState, useEffect } from 'react';
import svg from '../public/loading.svg'
import Image from "next/image";
import styles from '../styles/LoadingPage.module.css';

export default function LoadingPage() {
    const [messageIndex, setMessageIndex] = useState(0);
    const messages = ["Analisando Imagem...", "Conectando API...", "Só mais um instante...", "Aceita um café? ☕"];

    useEffect(() => {
        const intervalId = setInterval(() => {
            setMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
        }, 3000);

        return () => clearInterval(intervalId);
    }, [messages.length]);
    
    return (
        <>
            <div className={styles.container}>
                <h1>Extraindo texto das imagens</h1>
                <h2>{messages[messageIndex]}</h2>
                <p>Por favor, aguarde.</p>
                <Image
                    src={svg}
                    className={styles.image}
                    alt="Image"
                    width={120}
                    height={120}
                    priority={true}
                />
            </div>
        </>
    )
}