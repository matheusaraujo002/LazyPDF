import { useState } from 'react';
import Image from "next/image";
import img from '@/public/uploadImage.png';
import styles from '@/styles/Upload.module.css';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useRouter } from 'next/router';

export default function ImageInput({ onStartLoading }) {
  const [selectedImage, setSelectedImage] = useState(null);
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
          const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GOOGLE_API_KEY);
          const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
          const imageBase64 = reader.result.split(',')[1];
          const prompt = "Você recebeu uma imagem nesse prompt? Se sim, escreva tudo que tiver de texto nessa imagem. Não adicione icones ou imagem nesse texto gerado. Entregue o texto em um formato adequado para PDF. E não comente NADA que não seja somente o retorno do texto que você vai extrair da imagem";
          const imageParts = [
            {
              inlineData: {
                data: imageBase64,
                mimeType: selectedImage.type,
              },
            },
          ];

          const result = await model.generateContent([prompt, ...imageParts]);
          const response = await result.response;
          const text = response.text();

          // Armazena o texto na sessão
          sessionStorage.setItem('extractedText', text);

          // Redireciona para a página '/editor' 
          router.push('/EditorPage');
        } catch (error) {
          console.error('Erro ao extrair texto da imagem (Gemini API):', error);
          // Tratamento de erro: remove a tela de carregamento
          onStartLoading(); 
        }
      };

      reader.readAsDataURL(selectedImage);
    } catch (error) {
      console.error('Erro ao ler a imagem:', error);
      // Tratamento de erro: remove a tela de carregamento
      onStartLoading(); 
    }
  };

  return (
    <>
      <h1 className={styles.title}>Faça o upload de imagens</h1>
      <label htmlFor="fileInput" className={styles.fileInputLabel}>
        <div className={styles.uploadArea}>
          {selectedImage && (
            <>
              <img
                src={URL.createObjectURL(selectedImage)}
                alt="Imagem selecionada"
                className={styles.imagemSelecionada}
              />
              <p>Arquivo selecionado: {selectedImage.name}</p>
              <div className={styles.botoes}>
                <button onClick={() => setSelectedImage(null)}>
                  Escolher outra
                </button>
                <button onClick={handleSubmit} disabled={!selectedImage}>
                  Enviar imagem
                </button>
              </div>
            </>
          )}
          {!selectedImage && (
            <>
              <Image
                src={img}
                alt="Ícone de upload"
                aria-label="Clique para selecionar um arquivo"
                className={styles.uploadImage}
                priority
              />
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
  );
}