import React, { useState } from 'react';
import axios from 'axios';
import styles from '@/styles/Upload.module.css';
import Image from "next/image";
import img from '@/public/uploadImage.png';

const UploadPage = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [extractedText, setExtractedText] = useState('');

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedImage(file);
    };

    const apiKey = 'API_KEY'; // Substitua pela sua chave de API
    const imageUrl = 'https://example.com/image.jpg';

    const handleSubmit = async () => {
      try {
        const response = await axios.post('https://vision.googleapis.com/v1/images:annotate',
            {
            requests: [
                {
                    image: {
                      source: {
                        imageUri: imageUrl
                      }
                    },
                    features: [
                      { type: 'TEXT_DETECTION' }
                    ]
                }
            ]
            },
            {
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        // Processar a resposta da API
        console.log(response.data);
      } catch (error) {
        console.error('Erro ao enviar a imagem:', error);
      }
    };

  return (
    <div className={styles.body}>
      <header className={styles.header}>
        <h1>LazyPDF</h1>
      </header>

      <main className={styles.main}>
        <div className={styles.containerMain}>
          <h1 className={styles.title}>Faça o upload de imagens</h1>
          <label htmlFor="fileInput" className={styles.fileInputLabel}>
            <div className={styles.uploadArea}>
              {selectedImage && (
                <>
                  <img src={URL.createObjectURL(selectedImage)} alt="Imagem selecionada" />
                  <p>Arquivo selecionado: {selectedImage.name}</p>
                  <div className={styles.botoes}>
                    <button onClick={() => setSelectedImage(null)}>Escolher outra</button>
                    <button onClick={handleSubmit} disabled={!selectedImage}>Enviar imagem</button>
                  </div>
                </>
            )}
            {!selectedImage && (
              <>
                <Image src={img} alt="Ícone de upload" aria-label="Clique para selecionar um arquivo" className={styles.uploadImage} />
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
      </div>
    </main>
  </div>
);
};

export default UploadPage;