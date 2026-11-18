import React, { useState, useEffect } from 'react'
import styles from '../pages/styles.module.css'
import EMPRESA from '../config/empresa'
import { desenharCabecalho, desenharRodape } from '../utils/pdfMarca'
import { Link } from 'react-router-dom'
import { jsPDF } from 'jspdf'

import { FolderDown } from 'lucide-react'
import { ClipboardPen } from 'lucide-react'
import { Trash2 } from 'lucide-react'
import clipBoardPen from '../svg/clipboard-pen.svg'
import defaultImage from '../svg/icon-person.jpg'

import { useFuncionario } from '../pages/FuncionarioContext'
import { useLanguage } from '../i18n/LanguageContext'

const Person = ({ funcionario, handleOpenDeleteModal }) => {
  const { t, locale } = useLanguage()
  const endpoint = process.env.REACT_APP_API_BASE_URL;

  const { setFuncionario } = useFuncionario();
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    const url = `${endpoint}/uploads/${funcionario.nomeFuncionario}/foto_${funcionario.nomeFuncionario}.avif`;
    setImageUrl(url);
  }, [funcionario]);

  const handleVis = () =>{
    setFuncionario(funcionario)
  }

  const handleDelete = () =>{
    handleOpenDeleteModal(funcionario);
  }
 
  const handleImageError = () =>{
    setImageUrl(defaultImage)
  }

  const dataNasc = new Date(`${funcionario.dataNasc}T00:00:00`)
  const formatedDataNasc = dataNasc.toLocaleDateString(locale)

  const dataNascPai = new Date(`${funcionario.dataNascPai}T00:00:00`)
  const formatedDataNascPai = dataNascPai.toLocaleDateString(locale)

  const dataNascMae = new Date(`${funcionario.dataNascMae}T00:00:00`)
  const formatedDataNascMae = dataNascMae.toLocaleDateString(locale)

  const dataDocs = new Date(`${funcionario.dataEntregaDocs}T00:00:00`)
  const formatedDataEntregaDocs = dataDocs.toLocaleDateString(locale)

  const dataExped = new Date(`${funcionario.rgDataExped}T00:00:00`)
  const formatedDataExped = dataExped.toLocaleDateString(locale)


  const convertBase64 = async (imageUrl) =>{
    try{
      const response = await fetch(imageUrl)
      const avifBlob = await response.blob()

      const image = new Image()
      const objetcURL = URL.createObjectURL(avifBlob)

      return new Promise((resolve, reject) =>{
        image.onload = () =>{
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')

          canvas.width = image.width
          canvas.height = image.height

          ctx.drawImage(image, 0, 0, image.width, image.height)

          const base64Image = canvas.toDataURL('image/png')

          resolve(base64Image)
        }

        image.onerror = (err) => reject(err)

        image.src = objetcURL
      })
    } catch (error){
      console.error(error)
      throw error
    }
  }


  const getPdf = async() =>{
    try{
      const imageBase64 = await convertBase64(imageUrl);

      const doc = new jsPDF();

      const squareWidth = 87; // Largura fixa da imagem
      const squareHeight = 95; // Aumentando a altura da imagem no PDF
      const scaleFactor = 2; // Fator de escala para aumentar a resolução do canvas
  
      const image = new Image();
      image.src = imageBase64;
  
      image.onload = () => {
        // Criar um canvas de recorte em alta resolução
        const cropCanvas = document.createElement('canvas');
        const cropCtx = cropCanvas.getContext('2d');
  
        cropCanvas.width = squareWidth * scaleFactor;
        cropCanvas.height = squareHeight * scaleFactor;
  
        cropCtx.imageSmoothingEnabled = true;
        cropCtx.imageSmoothingQuality = "high";
  
        // Calcular a proporção de escala para preencher o quadrado
        const widthRatio = (squareWidth * scaleFactor) / image.width;
        const heightRatio = (squareHeight * scaleFactor) / image.height;
        const scaleRatio = Math.max(widthRatio, heightRatio);
  
        // Calcular as dimensões da imagem recortada
        const cropWidth = (squareWidth * scaleFactor) / scaleRatio;
        const cropHeight = (squareHeight * scaleFactor) / scaleRatio;
  
        // Calcular o deslocamento para centralizar a imagem recortada
        const cropX = (image.width - cropWidth) / 2;
        const cropY = (image.height - cropHeight) / 2;
  
        // Desenhar a imagem no canvas de recorte
        cropCtx.drawImage(
          image,
          cropX, cropY, cropWidth, cropHeight, // Recorte da imagem original
          0, 0, cropCanvas.width, cropCanvas.height // Redimensionamento para o canvas
        );
  
        // Obter a string Base64 do canvas de recorte com qualidade melhorada
        const cropBase64 = cropCanvas.toDataURL('image/jpeg', 1.0);

        doc.setFont("helvetica");
        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0);

        doc.setFontSize(10)
        doc.setFont("helvetica", "bold");
        doc.text(EMPRESA.nomeCompleto.toUpperCase(), 105, 50, { align: "center" })
        doc.text(t('FICHA CADASTRAL DE FUNCIONÁRIOS'), 105, 59, { align: "center" })

      //  
        // Adicionar ao PDF no tamanho desejado (convertendo para uma escala normal
        doc.addImage(cropBase64, 'JPEG', 12, 73, squareWidth / scaleFactor, squareHeight / scaleFactor);
        
        doc.text(t('1 - DADOS PESSOAIS'), 30, 70, { align: "center" })
        doc.line(52, 68.5, 196, 68.5)

        doc.setFont("helvetica", "normal");
        doc.setFontSize(11)
        doc.text(`${t('NOME')}: ${t(funcionario.nomeFuncionario)}`, 60, 77)
        doc.text(`${t('DATA NASC.')}: ${formatedDataNasc}`, 60, 82.5)
        doc.text(`${t('ESTADO')}: ${t(funcionario.estadoAtual)}`, 60, 88.5)
        doc.text(`${t('NACIONALIDADE')}: ${t(funcionario.nacionalidade)}`, 60, 94.5)
        doc.text(`${t('NATURALIDADE')}: ${t(funcionario.naturalidade)}`, 60, 100.8)
        doc.text(`${t('RAÇA')}: ${t(funcionario.raca)}`, 60, 106.5)
        doc.text(`${t('TELEFONE')}: ${t(funcionario.telefone)}`, 60, 118.5)
        doc.text(`${t('EMAIL')}: ${t(funcionario.email)}`, 60, 112.5)

      //   

        doc.setFont("helvetica", "bold");
        doc.text(t('2 - DADOS FAMILIARES'), 34, 128, { align: "center" })
        doc.line(60, 126.5, 195, 126.5)

        doc.text(t('Pai'), 12, 136)
        doc.setFont("helvetica", "normal");
        doc.text(`${t('NOME')}: ${t(funcionario.nomePai)}`, 12, 141)
        doc.text(`${t('DATA NASC.')}: ${formatedDataNascPai}`, 150, 141)
        doc.text(`${t('CPF')}: ${t(funcionario.cpfPai)}`, 12, 146)

        doc.setFont("helvetica", "bold");
        doc.text(t('Mãe'), 12, 153)
        doc.setFont("helvetica", "normal");
        doc.text(`${t('NOME')}: ${t(funcionario.nomeMae)}`, 12, 158)
        doc.text(`${t('DATA NASC.')}: ${formatedDataNascMae}`, 150, 158)
        doc.text(`${t('CPF')}: ${t(funcionario.cpfMae)}`, 12, 163)

        doc.text(`${t('ESTADO CIVIL')}: ${t(funcionario.estadoCivil)}`, 12, 172)
        doc.text(`${t('NOME CÔNJUGE')}: ${t(funcionario.nomeEsposoa)}`, 85, 172)
        doc.text(`${t('FILHOS')}: ${t(funcionario.filhos)}`, 12, 177.5)
        doc.text(`${t('NOME FILHOS')}: ${t(funcionario.nomeFilhos)}`, 12, 183)

      //

        doc.setFont("helvetica", "bold");
        doc.text(t('3 - DOCUMENTOS'), 29, 192, { align: "center" })
        doc.line(49, 190.5, 195, 190.5)

        doc.setFont("helvetica", "normal");
        doc.text(`${t('CPF')}: ${t(funcionario.cpf)}`, 12, 199)
        doc.text(`${t('PIS/PASEP')}: ${t(funcionario.pisPasep)}`, 70, 199)
        doc.text(`${t('CNH')}: ${t(funcionario.cnh)}`, 140, 199)
        doc.text(`${t('RG')}: ${t(funcionario.rg)}`, 12, 204.5)
        doc.text(`${t('DATA EXPED.')}: ${formatedDataExped}`, 60, 204.5)
        doc.text(`${t('ORGÃO EXPED.')}: ${t(funcionario.rgOrgaoExped)}`, 120, 204.5)
        doc.text(`${t('UF')}: ${t(funcionario.rgUf)}`, 180, 204.5)
        doc.text(`${t('TÍTULO')}: ${t(funcionario.titulo)}`, 12, 210.5)
        doc.text(`${t('ZONA')}: ${t(funcionario.tituloZona)}`, 75, 210.5)
        doc.text(`${t('SEÇÃO')}: ${t(funcionario.tituloSecao)}`, 120, 210.5)
        doc.text(`${t('UF')}: ${t(funcionario.tituloUf)}`, 180, 210.5)
        doc.text(`${t('DOC. MILITAR')}: ${t(funcionario.docMilitar)}`, 12, 216)
        doc.text(`${t('SÉRIE')}: ${t(funcionario.docMilitarSerie)}`, 120, 216)

      //

        doc.setFont("helvetica", "bold");
        doc.text(t('4 - ENDEREÇO'), 25.5, 225, { align: "center" })
        doc.line(43, 224, 195, 224)

        doc.setFont("helvetica", "normal");
        doc.text(`${t('BAIRRO')}: ${t(funcionario.bairro)}`, 12, 232)
        doc.text(`${t('LOGADOURO')}: ${t(funcionario.logadouro)}`, 140, 232)
        doc.text(`${t('RUA')}: ${t(funcionario.rua)}`, 12, 237.5)
        doc.text(`${t('NÚMERO')}: ${t(funcionario.numCasa)}`, 150, 237.5)
        doc.text(`${t('CEP')}: ${t(funcionario.cep)}`, 12, 243.5)
        doc.text(`${t('ESTADO')}: ${t(funcionario.estado)}`, 140, 243.5)
        doc.text(`${t('CIDADE')}: ${t(funcionario.cidade)}`, 60, 243.5)

        desenharCabecalho(doc, t)

        desenharRodape(doc, t)
      //
        doc.addPage()
      //
        doc.setFont("helvetica", "bold");
        doc.text(t('5 - DADOS BANCÁRIOS'), 34, 48, { align: "center" })
        doc.line(60, 46.5, 194, 46.5)

        doc.setFont("helvetica", "normal");
        doc.text(`${t('BANCO')}: ${t(funcionario.banco)}`, 12, 55)
        doc.text(`${t('AGÊNCIA')}: ${t(funcionario.bancoAgencia)}`, 90, 55)
        doc.text(`${t('CONTA')}: ${t(funcionario.bancoConta)}`, 140, 55)

      //

        doc.setFont("helvetica", "bold");
        doc.text(t('6 - FORMAÇÃO ESCOLAR'), 36, 65, { align: "center" })
        doc.line(64, 64, 194, 64)

        doc.setFont("helvetica", "normal");
        doc.text(`${t('ESCOLARIDADE')}: ${t(funcionario.escolaridade)}`, 12, 72)
        doc.text(`${t('CURSOS')}: ${t(funcionario.cursos)}`, 173.5, 72)
        doc.text(`${t('CURSO 1')}: ${t(funcionario.curso1)}`, 12, 77.5)
        doc.text(`${t('CURSO 2')}: ${t(funcionario.curso2)}`, 12, 83)
        doc.text(`${t('CURSO 3')}: ${t(funcionario.curso3)}`, 12, 89)
        doc.text(`${t('CURSO 4')}: ${t(funcionario.curso4)}`, 12, 94.5)

    //

        doc.setFont("helvetica", "bold");
        doc.text(t('7 - VÍNCULO'), 23.5, 105, { align: "center" })
        doc.line(39, 103.5, 194, 103.5)

        doc.setFont("helvetica", "normal");
        doc.text(`${t('VÍNCULO')}: ${t(funcionario.vinculo)}`, 12, 112)
        doc.text(`${t('SETOR/DEPARTAMENTO')}: ${t(funcionario.setorDepartamento)}`, 80, 112)
        doc.text(`${t('CARGO EFETIVO')}: ${t(funcionario.cargoEfetivo)}`, 12, 117.5)
        doc.text(`${t('CARGO/FUNÇÃO')}: ${t(funcionario.cargoFuncao)}`, 130, 117.5)
        doc.text(`${t('ORGÃO ORIGEM')}: ${t(funcionario.orgaoOrigem)}`, 12, 123.5)
        doc.text(`${t('MATRÍCULA ORIGEM')}: ${t(funcionario.matriculaOrigem)}`, 130, 123)
        doc.text(`${t('MATRÍCULA {sigla}', { sigla: EMPRESA.sigla })}: ${t(funcionario.matriculaEmpresa)}`, 12, 129.5)
        doc.text(`${t('STATUS')}: ${t(funcionario.statusServidor)}`, 130, 129)
        doc.text(`${t('DATA DE ENTREGA DOS DOCUMENTOS')}: ${formatedDataEntregaDocs}`, 12, 135)
        doc.text(`${t('ANOTAÇÕES')}: ${t(funcionario.anotacoes)}`, 12, 140.5)

        desenharCabecalho(doc, t)

        desenharRodape(doc, t)
      //
        doc.save(`${t('FICHA')} ${funcionario.nomeFuncionario}.pdf`);
        //doc.output('dataurlnewwindow') 
      }
    } catch (error){
      console.error("Erro ao gerar a imagem: ", error)
    }
  }

  return (
    <div className={styles.container_person}>

        <img
          className={styles.img_history}
          src={imageUrl}
          alt=''
          onError={handleImageError}
        />

        <div className={styles.texts}>
          <div key={funcionario.id} className={styles.textss}>
            <h1>{funcionario.nomeFuncionario}</h1>
            <span>{t(funcionario.vinculo)}</span>
          </div>

          <div className={styles.buttons}>
            <div className={styles.button}>
              <FolderDown size={35} strokeWidth={1.5} onClick={getPdf}/>
            </div>
            <div className={styles.button}>
              <Link to='/visualizar' onClick={handleVis}><img src={clipBoardPen} alt='' className={styles.clipBoardPen}></img></Link>
            </div>
            <div className={styles.button}>
              <Link to='/editar' onClick={handleVis}><ClipboardPen size={35} strokeWidth={1.5}/></Link>
            </div>
            <div className={styles.button} onClick={handleDelete}>
              <Trash2 size={35} strokeWidth={1.5}/>
            </div>
          </div>
        </div>
    </div>
  )
}

export default Person