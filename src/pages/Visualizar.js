import React, { useState, useEffect } from 'react'
import styles from './styles.module.css'
import EMPRESA from '../config/empresa'
import { desenharCabecalho, desenharRodape, desenharTituloSecao } from '../utils/pdfMarca'
import { jsPDF } from 'jspdf'
import { useFuncionario } from './FuncionarioContext'
import Axios from 'axios'

import { FolderDown } from 'lucide-react'
import defaultImage from '../svg/icon-person.jpg'
import Header from '../components/Header'
import { useLanguage } from '../i18n/LanguageContext'

function Visualizar() {
  const { t, locale } = useLanguage()
  const endpoint = process.env.REACT_APP_API_BASE_URL;

  const { funcionario } = useFuncionario();
  const idFuncionario = funcionario.idFuncionario;

  const [files, setFiles] = useState([])
  
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

  const [imageUrl, setImageUrl] = useState(`${endpoint}/uploads/${funcionario.nomeFuncionario}/foto_${funcionario.nomeFuncionario}.avif`);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (funcionario?.idFuncionario) {
      Axios.get(`${endpoint}/getFiles/${funcionario.idFuncionario}`)
        .then(response => {
          const data = response.data[0];
          const paths = data?.filePath ? JSON.parse(data.filePath) : [];
          const names = data?.originalFileNames ? JSON.parse(data.originalFileNames) : [];

          const filesData = paths.map((path, i) => ({
            name: names[i] || `Arquivo ${i + 1}`,
            path: path
          }));

          setFiles(filesData);
          })
        .catch(error => {
          console.error("Erro ao buscar arquivos:", error);
        });
    }
  }, [funcionario]);

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

  const handleImageError = () =>{
    setImageUrl(defaultImage)
  }


  const getPdf = async() =>{
    try{
      const imageBase64 = await convertBase64(imageUrl);

      const doc = new jsPDF();

      const squareSize = 87; 
      const scaleFactor = 2; 
  
      const image = new Image();
      image.src = imageBase64;
  
      image.onload = () => {
        const cropCanvas = document.createElement('canvas');
        const cropCtx = cropCanvas.getContext('2d');
  
        cropCanvas.width = squareSize * scaleFactor;
        cropCanvas.height = squareSize * scaleFactor;
  
        cropCtx.imageSmoothingEnabled = true;
        cropCtx.imageSmoothingQuality = "high";
  
        const widthRatio = (squareSize * scaleFactor) / image.width;
        const heightRatio = (squareSize * scaleFactor) / image.height;
        const scaleRatio = Math.max(widthRatio, heightRatio);
  
        const cropWidth = (squareSize * scaleFactor) / scaleRatio;
        const cropHeight = (squareSize * scaleFactor) / scaleRatio;
  
        const cropX = (image.width - cropWidth) / 2;
        const cropY = (image.height - cropHeight) / 2;
  
        cropCtx.drawImage(
          image,
          cropX, cropY, cropWidth, cropHeight,
          0, 0, cropCanvas.width, cropCanvas.height 
        );
  
        const cropBase64 = cropCanvas.toDataURL('image/jpeg', 1.0);

        doc.setFont("helvetica");
        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0);

        doc.setFontSize(10)
        doc.setFont("helvetica", "bold");
        doc.text(EMPRESA.nomeCompleto.toUpperCase(), 105, 50, { align: "center" })
        doc.text(t('FICHA CADASTRAL DE FUNCIONÁRIOS'), 105, 59, { align: "center" })

      //  
        doc.addImage(cropBase64, 'JPEG', 12, 75, squareSize / scaleFactor, squareSize / scaleFactor);
        
        desenharTituloSecao(doc, t('1 - DADOS PESSOAIS'), 70)

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
        desenharTituloSecao(doc, t('2 - DADOS FAMILIARES'), 128)

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
        desenharTituloSecao(doc, t('3 - DOCUMENTOS'), 192)

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
        desenharTituloSecao(doc, t('4 - ENDEREÇO'), 225)

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
        desenharTituloSecao(doc, t('5 - DADOS BANCÁRIOS'), 48)

        doc.setFont("helvetica", "normal");
        doc.text(`${t('BANCO')}: ${t(funcionario.banco)}`, 12, 55)
        doc.text(`${t('AGÊNCIA')}: ${t(funcionario.bancoAgencia)}`, 90, 55)
        doc.text(`${t('CONTA')}: ${t(funcionario.bancoConta)}`, 140, 55)

      //

        doc.setFont("helvetica", "bold");
        desenharTituloSecao(doc, t('6 - FORMAÇÃO ESCOLAR'), 65)

        doc.setFont("helvetica", "normal");
        doc.text(`${t('ESCOLARIDADE')}: ${t(funcionario.escolaridade)}`, 12, 72)
        doc.text(`${t('CURSOS')}: ${t(funcionario.cursos)}`, 173.5, 72)
        doc.text(`${t('CURSO 1')}: ${t(funcionario.curso1)}`, 12, 77.5)
        doc.text(`${t('CURSO 2')}: ${t(funcionario.curso2)}`, 12, 83)
        doc.text(`${t('CURSO 3')}: ${t(funcionario.curso3)}`, 12, 89)
        doc.text(`${t('CURSO 4')}: ${t(funcionario.curso4)}`, 12, 94.5)

    //

        doc.setFont("helvetica", "bold");
        desenharTituloSecao(doc, t('7 - VÍNCULO'), 105)

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
    <div className={styles.container_register}>
      <Header title={t('Visualizar Dados')} links={[{ to: '/registro', label: 'Registrar Funcionário' }, { to: '/historico', label: 'Histórico de Funcionários' }]} />
      <div className={styles.container_record}>
        <div className={styles.record}>
          <div className={styles.foto_vis}>
            <img
                className={styles.img_vis}
                src={selectedImage || imageUrl} 
                alt={t('Imagem do Funcionário')} 
                onError={handleImageError}
            />
            <button type='button' onClick={getPdf} className={styles.button_download} title={t('Baixar ficha em PDF')}><FolderDown size={20} strokeWidth={1.75}/> {t('Baixar PDF')}</button>
          </div>

          <div className={styles.inputs}>
            {/***TODO: INPUT DADOS PESSOAIS***/}
            <form className={styles.form_dados_pessoais}>
              <div className={styles.form_group}>
                <div className={styles.div_input} id={styles.inptspan}>
                  <label for="nome">{t('Nome Completo:')}</label>
                  <span className={styles.span}>{t(funcionario.nomeFuncionario)}</span>
                </div>

                <div className={styles.div_input} id={styles.inptspan}>
                  <label for="sexo">{t('Sexo:')}</label>
                  <span className={styles.span}>{t(funcionario.sexo)}</span>
                </div>
              </div>

              <div className={styles.form_group}> 
                <div className={styles.div_input} id={styles.inptspan}>
                  <label for="dataNasc">{t('Data Nasc:')}</label>
                  <span className={styles.span}>{formatedDataNasc}</span>
                </div>

                <div className={styles.div_input} id={styles.inptspan}>
                  <label for="estado">{t('Estado:')}</label>
                  <span className={styles.span}>{t(funcionario.estadoAtual)}</span>
                </div>

                <div className={styles.div_input} id={styles.inptspan}>
                  <label for="nacionalidade">{t('Nacionalidade:')}</label>
                  <span className={styles.span}>{t(funcionario.nacionalidade)}</span>
                </div>
              </div>

              <div className={styles.form_group}>
                <div className={styles.div_input} id={styles.inptspan}>
                  <label for="Naturalidade">{t('Naturalidade:')}</label>
                  <span className={styles.span}>{t(funcionario.naturalidade)}</span>
                </div>

                <div className={styles.div_input} id={styles.inptspan}>
                  <label for="raca">{t('Raça:')}</label>
                  <span className={styles.span}>{t(funcionario.raca)}</span>
                </div>

                <div className={styles.div_input} id={styles.inptspan}>
                  <label for="telefone">{t('Telefone:')}</label>
                  <span className={styles.span}>{t(funcionario.telefone)}</span>
                </div>
              </div>

              <div className={styles.form_group}>
                <div className={styles.div_input} id={styles.inptspan}>
                  <label for="email">{t('Email:')}</label>
                  <span className={styles.span}>{t(funcionario.email)}</span>
                </div>
              </div>
            </form>


            {/***TODO: INPUT DADOS FAMILIARES***/}
            <form className={styles.form_dados_familiares}>
              <div className={styles.divisoria}>
                <hr></hr>
                <span className={styles.title_divis}>{t('Dados Familiares')}</span>
              </div>

              <span className={styles.spandf}>{t('Pai')}</span>
              <div className={styles.form_group}>
                <div className={styles.div_input} id={styles.inptspan}>
                  <label for="nome_pai">{t('Nome Completo:')}</label>
                  <span className={styles.span}>{t(funcionario.nomePai)}</span>
                </div>

                <div className={styles.div_input} id={styles.inptspan}>
                  <label for="cpf_pai">{t('CPF:')}</label>
                  <span className={styles.span}>{t(funcionario.cpfPai)}</span>
                </div>

                <div className={styles.div_input} id={styles.inptspan}>
                  <label for="data_nasc">{t('Data Nasc:')}</label>
                  <span className={styles.span}>{formatedDataNascPai}</span>
                </div>
              </div>

              <span className={styles.spandf}>{t('Mãe')}</span>
              <div className={styles.form_group}>
                <div className={styles.div_input} id={styles.inptspan}>
                  <label for="nome_mae">{t('Nome Completo:')}</label>
                  <span className={styles.span}>{t(funcionario.nomeMae)}</span>
                </div>

                <div className={styles.div_input} id={styles.inptspan}>
                  <label for="cpf_mae">{t('CPF:')}</label>
                  <span className={styles.span}>{t(funcionario.cpfMae)}</span>
                </div>

                <div className={styles.div_input} id={styles.inptspan}>
                  <label for="data_nasc_mae">{t('Data Nasc:')}</label>
                  <span className={styles.span}>{formatedDataNascMae}</span>
                </div>
              </div>

              <div className={styles.form_group}>
                <div className={styles.div_input} id={styles.inptspan}>
                  <label for="estado_civil">{t('Estado Civil:')}</label>
                  <span className={styles.span}>{t(funcionario.estadoCivil)}</span>
                </div>

                <div className={styles.div_input} id={styles.inptspan}>
                  <label for="nome_esposoa">{t('Nome Cônjuge:')}</label>
                  <span className={styles.span}>{t(funcionario.nomeEsposoa)}</span>
                </div>
              </div>

              <div className={styles.form_group}>
                <div className={styles.div_input} id={styles.inptspan}>
                  <label for="filhos">{t('Filhos:')}</label>
                  <span className={styles.span}>{t(funcionario.filhos)}</span>
                </div>

                <div className={styles.div_input} id={styles.inptspan}>
                  <label for="nome_filhos">{t('Nome Filhos:')}</label>
                  <span className={styles.span}>{t(funcionario.nomeFilhos)}</span>
                </div>
              </div>
            </form>

            {/***TODO: INPUT DOCUMENTOS***/}
            <form className={styles.form_dados_documentos}>
              <div className={styles.divisoria} id={styles.inptspan}>
                <hr></hr>
                <span className={styles.title_divis}>{t('Documentos')}</span>
              </div>

              <div className={styles.form_group}>
                <div className={styles.div_input} id={styles.inptspan}>
                  <label for="cpf">{t('CPF:')}</label>
                  <span className={styles.span}>{t(funcionario.cpf)}</span>
                </div>

                <div className={styles.div_input} id={styles.inptspan}>
                  <label for="pis_pasep">{t('PIS/PASEP:')}</label>
                  <span className={styles.span}>{t(funcionario.pisPasep)}</span>
                </div>

                <div className={styles.div_input} id={styles.inptspan}>
                  <label for="cnh">{t('CNH:')}</label>
                  <span className={styles.span}>{t(funcionario.cnh)}</span>
                </div>
              </div>

              <div className={styles.form_group}>
                <div className={styles.div_input} id={styles.inptspan}>
                  <label for="rg">{t('RG:')}</label>
                  <span className={styles.span}>{t(funcionario.rg)}</span>
                </div>

                <div className={styles.div_input} id={styles.inptspan}>
                  <label for="rg_data_exped">{t('Data Exped:')}</label>
                  <span className={styles.span}>{formatedDataExped}</span>
                </div>

                <div className={styles.div_input} id={styles.inptspan}>
                  <label for="rg_orgao_exped">{t('Orgão Exped:')}</label>
                  <span className={styles.span}>{t(funcionario.rgOrgaoExped)}</span>
                </div>

                <div className={styles.div_input} id={styles.inptspan}>
                  <label for="rg_uf">{t('UF:')}</label>
                  <span className={styles.span}>{t(funcionario.rgUf)}</span>
                </div>
              </div>

              <div className={styles.form_group}>
                <div className={styles.div_input} id={styles.inptspan}>
                  <label for="titulo">{t('Título:')}</label>
                  <span className={styles.span}>{t(funcionario.titulo)}</span>
                </div>

                <div className={styles.div_input} id={styles.inptspan}>
                  <label for="titulo_zona">{t('Zona:')}</label>
                  <span className={styles.span}>{t(funcionario.tituloZona)}</span>
                </div>

                <div className={styles.div_input} id={styles.inptspan}>
                  <label for="titulo_secao">{t('Seção:')}</label>
                  <span className={styles.span}>{t(funcionario.tituloSecao)}</span>
                </div>

                <div className={styles.div_input} id={styles.inptspan}>
                  <label for="titulo_uf">{t('UF:')}</label>
                  <span className={styles.span}>{t(funcionario.tituloUf)}</span>
                </div>
              </div>

              <div className={styles.form_group}>
                <div className={styles.div_input} id={styles.inptspan}>
                  <label for="doc_militar">{t('Doc. Militar:')}</label>
                  <span className={styles.span}>{t(funcionario.docMilitar)}</span>
                </div>

                <div className={styles.div_input} id={styles.inptspan}>
                  <label for="doc_militar_serie">{t('Série:')}</label>
                  <span className={styles.span}>{t(funcionario.docMilitarSerie)}</span>
                </div>
              </div>
            </form>

            {/***TODO: INPUT DADOS ENDEREÇO***/}
            <form className={styles.form_dados_endereco}>
              <div className={styles.divisoria} id={styles.divis_docs}>
                <hr></hr>
                <span className={styles.title_divis}>{t('Endereço')}</span>
              </div>

              <div className={styles.form_group}>
                <div className={styles.div_input} id={styles.inptspan}>
                  <label for="bairro">{t('Bairro:')}</label>
                  <span className={styles.span}>{t(funcionario.bairro)}</span>
                </div>

                <div className={styles.div_input} id={styles.inptspan}>
                  <label for="num_casa">{t('Número:')}</label>
                  <span className={styles.span}>{t(funcionario.numCasa)}</span>
                </div>

                <div className={styles.div_input} id={styles.inptspan}>
                  <label for="cep">{t('CEP:')}</label>
                  <span className={styles.span}>{t(funcionario.cep)}</span>
                </div>

                <div className={styles.div_input} id={styles.inptspan}>
                  <label for="rua">{t('Rua:')}</label>
                  <span className={styles.span}>{t(funcionario.rua)}</span>
                </div>                

                <div className={styles.div_input} id={styles.inptspan}>
                  <label for="logadouro">{t('Logadouro:')}</label>
                  <span className={styles.span}>{t(funcionario.logadouro)}</span>
                </div>
              </div>

              <div className={styles.form_group}>
                <div className={styles.div_input} id={styles.inptspan}>
                  <label for='estadoSelecionado'>{t('Estado:')}</label>
                  <span className={styles.span}>{t(funcionario.estado)}</span>
                </div>

                <div className={styles.div_input} id={styles.inptspan}>
                  <label for="cidadeSelecionada">{t('Cidade:')}</label>
                  <span className={styles.span}>{t(funcionario.cidade)}</span>
                </div>
              </div>
            </form>

            {/***TODO: INPUT DADOS BANCÁRIOS***/}
             <form className={styles.form_dados_bancarios}>
                <div className={styles.divisoria} id={styles.inptspan}>
                  <hr></hr>
                  <span className={styles.title_divis}>{t('Dados Bancários')}</span>
                </div>

                <div className={styles.form_group}>
                  <div className={styles.div_input} id={styles.inptspan}>
                    <label for="banco">{t('Banco:')}</label>
                    <span className={styles.span}>{t(funcionario.banco)}</span>
                  </div>

                <div className={styles.div_input} id={styles.inptspan}>
                  <label for="banco_agencia">{t('Agência:')}</label>
                  <span className={styles.span}>{t(funcionario.bancoAgencia)}</span>
                </div>

                <div className={styles.div_input} id={styles.inptspan}>
                  <label for="banco_conta">{t('Conta:')}</label>
                  <span className={styles.span}>{t(funcionario.bancoConta)}</span>
                </div>
              </div>
            </form>

            {/***TODO: INPUT DADOS ESCOLARES***/}
            <form className={styles.form_dados_escolares}>
              <div className={styles.divisoria} id={styles.divis_docs}>
                <hr></hr>
                <span className={styles.title_divis}>{t('Formação Escolar')}</span>
              </div>

              <div className={styles.form_group}>
                <div className={styles.div_input} id={styles.inptspan}>
                  <label for="escolaridade">{t('Escolaridade:')}</label>
                  <span className={styles.span}>{t(funcionario.escolaridade)}</span>
                </div>

                <div className={styles.div_input} id={styles.inptspan}>
                  <label for="cursos">{t('Cursos:')}</label>
                  <span className={styles.span}>{t(funcionario.cursos)}</span>
                </div>

                <div className={styles.div_input} id={styles.inptspan}>
                  <label for="curso1">{t('Curso 1:')}</label>
                  <span className={styles.span}>{t(funcionario.curso1)}</span>
                </div>
              </div>

              <div className={styles.form_group}>
                <div className={styles.div_input} id={styles.inptspan}>
                  <label for="curso2">{t('Curso 2:')}</label>
                  <span className={styles.span}>{t(funcionario.curso2)}</span>
                </div>

                <div className={styles.div_input} id={styles.inptspan}>
                  <label for="curso3">{t('Curso 3:')}</label>
                  <span className={styles.span}>{t(funcionario.curso3)}</span>
                </div>
              </div>

              <div className={styles.div_input}>
                <div className={styles.div_input} id={styles.inptspan}>
                  <label for="curso4">{t('Curso 4:')}</label>
                  <span className={styles.span}>{t(funcionario.curso4)}</span>
                </div>
              </div>
            </form>


            {/***TODO: INPUT DADOS VÍNCULO***/}
            <form className={styles.form_dados_vinculo}>
              <div className={styles.divisoria} id={styles.inptspan}>
                <hr></hr>
                <span className={styles.title_divis}>{t('Vínculo')}</span>
              </div>

              <div className={styles.form_group}>
                <div className={styles.div_input} id={styles.inptspan}>
                  <label for="vinculo">{t('Vínculo:')}</label>
                  <span className={styles.span}>{t(funcionario.vinculo)}</span>
                </div>

                <div className={styles.div_input} id={styles.inptspan}>
                  <label for="setorDepartamento">{t('Setor/Departamento:')}</label>
                  <span className={styles.span}>{t(funcionario.setorDepartamento)}</span>
                </div>

                <div className={styles.div_input} id={styles.inptspan}>
                  <label for="cargoFuncao">{t('Cargo/Função:')}</label>
                  <span className={styles.span}>{t(funcionario.cargoFuncao)}</span>
                </div>
              </div>

              <div className={styles.form_group}>
                <div className={styles.div_input} id={styles.inptspan}>
                  <label for="cargoEfetivo">{t('Cargo Efetivo:')}</label>
                  <span className={styles.span}>{t(funcionario.cargoEfetivo)}</span>
                </div>
                  
                <div className={styles.div_input} id={styles.inptspan}>
                  <label for="status">{t('Status:')}</label>
                  <span className={styles.span}>{t(funcionario.statusServidor)}</span>
                </div>

                <div className={styles.div_input} id={styles.inptspan}>
                  <label for="matriculaOrigem">{t('Matricula Origem:')}</label>
                  <span className={styles.span}>{t(funcionario.matriculaOrigem)}</span>
                </div>
              </div>

              <div className={styles.form_group}>
                <div className={styles.div_input} id={styles.inptspan}>
                  <label for="orgaoOrigem">{t('Orgão Origem:')}</label>
                  <span className={styles.span}>{t(funcionario.orgaoOrigem)}</span>
                </div>

                <div className={styles.div_input} id={styles.inptspan}>
                  <label for="matriculaEmpresa">{t('Matrícula {sigla}:', { sigla: EMPRESA.sigla })}</label>
                  <span className={styles.span}>{t(funcionario.matriculaEmpresa)}</span>
                </div>
              </div>
                  
              <div className={styles.form_group}>
                <div className={styles.div_input} id={styles.inptspan}>
                  <label for="dataEntregaDocs">{t('Data de entrega dos documentos:')}</label>
                  <span className={styles.span}>{formatedDataEntregaDocs}</span>
                </div>
              </div>

              <div className={styles.form_group}>
                  <div className={styles.div_input} id={styles.anexoss}>
                    <label for="nome_anexos">{t('Anexos:')}</label>

                    <div className={styles.name_file2_vis} id={styles.name_edit_vis}>
                      {files.length === 0 ? (
                        <p>{t('Não Possui')}</p>
                      ) : (
                        files.map((file, index) => (
                          <div key={index} className={styles.name_edits_pdf}>
                            <a href={`${endpoint}/${file.path}`} target="_blank" rel="noopener noreferrer">
                              📄 {file.name} {index + 1}
                            </a>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div className={styles.div_input}>
                    <label for="anotacoes">{t('Anotações:')}</label>
                    <p className={styles.span}>{t(funcionario.anotacoes)}</p>
                  </div>
              </div>

              <div className={styles.form_group} id={styles.anotacoes}>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Visualizar