import { useState } from 'react';
import Image from "next/image";
import img from '@/public/uploadImage.png';
import styles from '@/styles/Upload.module.css';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useRouter } from 'next/router';

export default function ImageInput({ onStartLoading }) {
    const [selectedImage, setSelectedImage] = useState(null);
    const [extractedText, setExtractedText] = useState('');
    const router = useRouter();

    const handleFileChange = (event) => {
        setSelectedImage(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!selectedImage) return;

        try {
            onStartLoading();

            const reader = new FileReader();
            reader.onloadend = async () => {
                try {
                    // Utiliza a API do Gemini para extração de texto da imagem dentro do arquivo .env.local
                    const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GOOGLE_API_KEY);
                    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
                    const imageBase64 = reader.result.split(',')[1];
                    const prompt = "Você recebeu uma imagem nesse prompt? Se sim, escreva tudo que tiver de texto nessa imagem.";
                    const imageParts = [
                        {
                            inlineData: {
                                data: imageBase64,
                                mimeType: selectedImage.type,
                            },
                        },
                    ];

                    // Aguarda a resposta da API do Gemini
                    const result = await model.generateContent([prompt, ...imageParts]);
                    const response = await result.response;
                    const text = response.text();
                    /* console.log(text); */ // Console.log para mostrar o texto gerado pela IA

                    // Define o texto extraído após a resposta da API
                    setExtractedText(text);
                    router.push(`/EditorPage?texto=${encodeURIComponent(text)}`);
                } catch (error) {
                    console.error('Erro ao extrair texto da imagem (Gemini API):', error);
                }
            };

            reader.readAsDataURL(selectedImage);
        } catch (error) {
            console.error('Erro ao ler a imagem:', error);
        }
    };

    return (
        <>
            <h1 className={styles.title}>Faça o upload de imagens</h1>
            <label htmlFor="fileInput" className={styles.fileInputLabel}>
                <div className={styles.uploadArea}>
                    {selectedImage && (
                        <>
                            <img src={URL.createObjectURL(selectedImage)} alt="Imagem selecionada" className={styles.imagemSelecionada} />
                            <p>Arquivo selecionado: {selectedImage.name}</p>
                            <div className={styles.botoes}>
                                <button onClick={() => setSelectedImage(null)}>Escolher outra</button>
                                <button onClick={handleSubmit} disabled={!selectedImage}>Enviar imagem</button>
                            </div>
                        </>
                    )}
                    {!selectedImage && (
                        <>
                            <Image src={img} alt="Ícone de upload" aria-label="Clique para selecionar um arquivo" className={styles.uploadImage} priority />
                            <span>Selecione uma imagem</span>
                        </>
                    )}
                    <input
                        id="fileInput"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                    />
                </div>
            </label>
        </>
    )
}