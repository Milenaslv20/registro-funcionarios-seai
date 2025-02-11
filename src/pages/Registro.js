import React, { useState, useRef } from 'react'
import styles from './styles.module.css'
import { Link } from 'react-router-dom'
import Axios from 'axios'

import { Paperclip } from 'lucide-react'

import Modal from '../components/Modal'
import ModalError from '../components/ModalError'

function Registro() {
  //TODO: DECLARATION MODAL
  const [openModal, setOpenModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [openModalError, setOpenModalError] = useState(false);
  const [modalMessageError, setModalMessageError] = useState('');

  //TODO: INPUT VALUES
  const [nome, setNome] = useState('');
  const [sexo, setSexo] = useState('');
  const [data_nasc, setDataNasc] = useState('');
  const [estado, setEstado] = useState('');
  const [nacionalidade, setNacionalidade] = useState('');
  const [naturalidade, setNaturalidade] = useState('');
  const [raca, setRaca] = useState('');
  const [telefone, setTelefone] = useState('(92)');
  const [email, setEmail] = useState('');

  const [nomePai, setNomePai] = useState('');
  const [cpfPai, setCpfPai] = useState('');
  const [dataNascPai , setDataNascPai] = useState(null);
  const [nomeMae, setNomeMae] = useState('');
  const [cpfMae, setCpfMae] = useState('');
  const [dataNascMae, setDataNascMae] = useState(null);

  const [estadoCivil, setEstadoCivil] = useState('');
  const [nomeEsposoa, setNomeEsposoa] = useState('');
  const [filhos, setFilhos] = useState('');
  const [nomeFilhos, setNomeFilhos] = useState('');

  const [cpf, setCpf] = useState('')
  const [pisPasep, setPisPasep] = useState('');
  const [cnh, setCnh] = useState('')
  const [rg, setRg] = useState('')
  const [rgDataExped, setRgDataExped] = useState('')
  const [rgOrgaoExped, setRgOrgaoExped] = useState('')
  const [rgUf, setRgUf] = useState('')
  const [titulo, setTitulo] = useState('')
  const [tituloZona, setTituloZona] = useState('')
  const [tituloSecao, setTituloSecao] = useState('')
  const [tituloUf, setTituloUf] = useState('')
  const [selectDocMilitar, setSelectDocMilitar] = useState('')
  const [docMilitar, setDocMilitar] = useState('')
  const [docMilitarSerie, setDocMilitarSerie] = useState('')

  const [logadouro, setLogadouro] = useState('')
  const [logadouroNumero, setLogadouroNumero] = useState('')
  const [cep, setCep] = useState('')
  const [bairro, setBairro] = useState('')
  const [logadouroEstado, setLogadouroEstado] = useState('')
  const [cidade, setCidade] = useState('')

  const [banco, setBanco] = useState('')
  const [bancoAgencia, setBancoAgencia] = useState('')
  const [bancoConta, setBancoConta] = useState('')

  const [escolaridade, setEscolaridade] = useState('')
  const [cursos, setCursos] = useState('')
  const [curso1, setCurso1] = useState('')
  const [curso2, setCurso2] = useState('')
  const [curso3, setCurso3] = useState('')
  const [curso4, setCurso4] = useState('')

  const [vinculo, setVinculo] = useState('')
  const [setorDepartamento, setSetorDepartamento] = useState('')
  const [cargoFuncao, setCargoFuncao] = useState('')
  const [cargoEfetivo, setCargoEfetivo] = useState('')
  const [statusServidor, setStatusServidor] = useState('')
  const [matriculaOrigem, setMatriculaOrigem] = useState('')
  const [orgaoOrigem, setOrgaoOrigem] = useState('')
  const [matriculaSeai, setMatriculaSeai] = useState('')
  const [anexos, setAnexos] = useState('')
  const [anexo1, setAnexo1] = useState('')
  const [anexo1Nome, setAnexo1Nome] = useState('')
  const [anexo2, setAnexo2] = useState('')
  const [anexo2Nome, setAnexo2Nome] = useState('')
  const [anexo3, setAnexo3] = useState('')
  const [anexo3Nome, setAnexo3Nome] = useState('')
  const [anexo4, setAnexo4] = useState('')
  const [anexo4Nome, setAnexo4Nome] = useState('')
  const [dataEntregaDocs, setDataEntregaDocs] = useState('')
  const [anotacoes, setAnotacoes] = useState('')

  //TODO: INPUT IMAGE
  const [selectedImage, setSelectedImage] = useState(null);
  const inputRef = useRef(null);

  const handleImageChange = (e) =>{
    const file = e.target.files[0];
    if (file){
      const reader = new FileReader();
      reader.onload = () =>{
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  //TODO: INPUT FILES
  const handleFileChange = (e, anexo) =>{
    const file = e.target.files[0]
    if(file && file.type === 'application/pdf'){
      if(anexo === 'anexo1'){
        setAnexo1(file);
        setAnexo1Nome(file.name);
      } else if(anexo === 'anexo2'){
        setAnexo2(file);
        setAnexo2Nome(file.name);
      } else if(anexo === 'anexo3'){
        setAnexo3(file);
        setAnexo3Nome(file.name);
      } else if(anexo === 'anexo4'){
        setAnexo4(file);
        setAnexo4Nome(file.name);
      }
    } else{
      setModalMessageError("Anexos apenas do tipo pdf");
      setOpenModalError(true);
    }
  };

  //TODO: VALIDATION INPUTS AND SEND TO BACKEND
  const regex = /[0-9!#$%&'"()*+,-./:;?@[\\\]_`{|}~]/
  const regex_num = /^[0-9()-]*$/
  const regex_cpf = /^[0-9-.]*$/

  const naoPossui = (value) =>{
    return value.trim() === '' ? 'Não Possui' : value;
  }

  const validateForm = async () =>{
    if(nome.trim() === ''){
      setModalMessageError("Preencha o nome")
      setOpenModalError(true)
      return
    } 
    if(regex.test(nome) === true){
      setModalMessageError("Preencha o nome apenas com letras")
      setOpenModalError(true)
      return
    }

    if(sexo === ''){
      setModalMessageError("Preencha o sexo")
      setOpenModalError(true)
      return
    }

    if(data_nasc === ''){
      setModalMessageError("Peencha a data de nascimento")
      setOpenModalError(true)
      return
    }

    if(estado === ''){
      setModalMessageError("Preencha o estado")
      setOpenModalError(true)
      return
    }

    if(nacionalidade.trim() === ''){
      setModalMessageError("Preencha a nacionalidade")
      setOpenModalError(true)
      return
    }
    if(regex.test(nacionalidade) === true){
      setModalMessageError("Preencha a nacionalidade apenas com letras")
      setOpenModalError(true)
      return
    }

    if(naturalidade.trim() === ''){
      setModalMessageError("Preencha a naturalidade")
      setOpenModalError(true)
      return
    }
    if(regex.test(naturalidade) === true){
      setModalMessageError("Preencha a naturalidade apenas com letras")
      setOpenModalError(true)
      return
    }

    if(raca === ''){
      setModalMessageError("Preencha o Sexo")
      setOpenModalError(true)
      return
    }

    if(telefone.trim() === ''){
      setModalMessageError("Digite o telefone")
      setOpenModalError(true)
      return
    }
    if(!regex_num.test(telefone)){
      setModalMessageError("Preencha o telefone apenas com números, parênteses e hífem")
      setOpenModalError(true)
      return
    }

    if(email.trim() === ''){
      setModalMessageError("Preencha o email")
      setOpenModalError(true)
      return
    }

    if(nomePai.trim() === ''){
      setModalMessageError("Preencha o nome do pai")
      setOpenModalError(true)
      return
    }
    if(regex.test(nomePai) === true){
      setModalMessageError("Preencha o nome do pai apenas com letras")
      setOpenModalError(true)
      return
    }
    if(cpfPai.trim() === ''){
      setModalMessageError("Preencha o cpf do pai")
      setOpenModalError(true)
    }
    if(regex_cpf.test(cpfPai) === true){
      setModalMessageError("Preencha o cpf do pai corretamente")
      setOpenModalError(true)
    }
    if(dataNascPai.trim() === ''){
      setModalMessageError("Preencha a data de nascimento do pai")
      setOpenModalError(true)
    }

    if(nomeMae.trim() === ''){
      setModalMessageError("Preencha o nome da mãe")
      setOpenModalError(true)
      return
    }
    if(regex.test(nomeMae) === true){
      setModalMessageError("Preencha o nome da mãe apenas com letras")
      setOpenModalError(true)
      return
    }
    if(cpfMae.trim() === ''){
      setModalMessageError("Preencha o cpf da mãe")
      setOpenModalError(true)
    }
    if(regex_cpf.test(cpfMae) === true){
      setModalMessageError("Preencha o cpf da mãe corretamente")
      setOpenModalError(true)
    }
    if(dataNascMae.trim() === ''){
      setModalMessageError("Preencha a data de nascimento da mãe")
      setOpenModalError(true)
    }

    if(estadoCivil === ''){
      setModalMessageError("Preencha o Estado Civil")
      setOpenModalError(true)
      return
    }

    if(filhos === ''){
      setModalMessageError("Preencha a quantidade de filhos")
      setOpenModalError(true)
      return
    }

    if(cpf.trim() === ''){
      setModalMessageError("Preencha o CPF")
      setOpenModalError(true)
    }
    if(regex_cpf.test(cpf) === true){
      setModalMessageError("Preencha o CPF corretamente")
      setOpenModalError(true)
    }

    if(pisPasep.trim() === ''){
      setModalMessageError("Preencha o PIS/PASEP")
      setOpenModalError(true)
    }

    if(cnh.trim() === ''){
      setModalMessageError("Preencha a CNH")
      setOpenModalError(true)
    }

    //TODO: CONST NAO POSSUI
    const nomeEsposoaf = naoPossui(nomeEsposoa)
    const nomeFilhosf = naoPossui(nomeFilhos)
    const curso1f = naoPossui(curso1)
    const curso2f = naoPossui(curso2)
    const curso3f = naoPossui(curso3)
    const curso4f = naoPossui(anexo4)
    const docMilitarf = naoPossui(docMilitar)
    const docMilitarSerief = naoPossui(docMilitarSerie) 
    const anexo1f = naoPossui(anexo1)
    const anexo2f = naoPossui(anexo2)
    const anexo3f = naoPossui(anexo3)
    const anexo4f = naoPossui(anexo4)

    //TODO: SEND TO BACKEND
    try{
      console.log("Enviando requisição...");
      const response = await Axios.post("http://localhost:3001/cadastrar",{
        foto: selectedImage,
        nome,
        sexo,
        data_nasc,
        estado,
        nacionalidade,
        naturalidade,
        raca,
        telefone,
        email,

        nomePai,
        cpfPai,
        dataNascPai,
        nomeMae,
        cpfMae,
        dataNascMae,
        estadoCivil,
        nomeEsposoa:nomeEsposoaf,
        filhos,
        nomeFilhos:nomeFilhosf,

        cpf,
        pisPasep,
        cnh,
        rg,
        rgDataExped,
        rgOrgaoExped,
        rgUf,
        titulo,
        tituloZona,
        tituloSecao,
        tituloUf,
        docMilitar:docMilitarf,
        docMilitarSerie:docMilitarSerief,

        logadouro,
        logadouroNumero,
        cep,
        bairro,
        logadouroEstado,
        cidade,

        banco,
        bancoAgencia,
        bancoConta,

        escolaridade,
        cursos,
        curso1:curso1f,
        curso2:curso2f,
        curso3:curso3f,
        curso4:curso4f,

        vinculo,
        setorDepartamento,
        cargoFuncao,
        cargoEfetivo,
        statusServidor,
        matriculaOrigem,
        orgaoOrigem,
        matriculaSeai,
        anexos,
        anexo1:anexo1f,
        anexo2:anexo2f,
        anexo3:anexo3f,
        anexo4:anexo4f,
        dataEntregaDocs,
        anotacoes
      });
      window.location.reload() /* **NADA FUNCIONA DPS DO TRY, SERVIDOR NÃO CONECTANDO** */
    } catch (err){
      setOpenModalError(true);
      setModalMessageError("Ocorreu um erro, tente novamente");
      console.log(err);
    }
  }
    

  const teste = () =>{
  }


  return (
    <div className={styles.container_register}>
      <div className={styles.nav_register}>
        <div className={styles.navigation_bar}>
        <button onClick={teste()}>teste</button>
          <h1 className={styles.link_register}>Registrar Funcionário</h1>
          <Link to={"/historico"} className={styles.link_history}>Histórico de Funcionários</Link>
        </div>
        {/***TODO: NAVIGATION BAR***/}
        <div className={styles.navigation_history}>
          <a href='#'>Dados Pessoais</a>
          <a href='#'>Documentos</a>
          <a href='#'>Endereço</a>
          <a href='#'>Dados Bancários</a>
          <a href='#'>Formação Escolar</a>
          <a href='#'>Vínculo</a>
          <a href='#'>Anotações</a>
        </div>
      </div>


      <div className={styles.container_record}>
        <div className={styles.record}>
          {/***TODO: INPUT IMAGEM***/}
          <div className={styles.foto}>
            <input 
              className={styles.img}
              type='file' 
              accept='image/*' 
              ref={inputRef} 
              onChange={handleImageChange}>
            </input>
            <button onClick={() => inputRef.current.click()}><Paperclip size={25}/></button>
            {selectedImage && <img src={selectedImage} alt='img selecionada'></img>}
          </div>

          <div className={styles.inputs}>
            {/***TODO: INPUT DADOS PESSOAIS***/}
            <form className={styles.form_dados_pessoais} autoComplete='off'>
              <div className={styles.form_group}>
                <div className={styles.div_input}>
                  <label for="nome">Nome Completo:</label>
                  <input 
                    className={styles.input_nome} 
                    type='text' 
                    id='nome' 
                    name='nome' 
                    autoFocus 
                    value={nome} 
                    maxLength={85}
                    onChange={(e) => {setNome(e.target.value)}}>
                  </input>
                </div>

                <div className={styles.div_input}>
                  <label for="sexo">Sexo:</label>
                  <select id="sexo" name='sexo' value={sexo} onChange={e => setSexo(e.target.value)}>
                    <option disabled={true} value="">Selecione</option>
                    <option value="M">M</option>
                    <option value="F">F</option>
                    <option value="Outros">Outros</option>
                    <option value="NI">NI</option>
                  </select>
                </div>
              </div>

              <div className={styles.form_group}> 
                <div className={styles.div_input}>
                  <label for="data_nasc">Data Nasc:</label>
                  <input 
                    type='date' 
                    id='data_nasc' 
                    name='data_nasc' 
                    value={data_nasc} 
                    onChange={(e) => {setDataNasc(e.target.value)}}>
                  </input>
                </div>

                <div className={styles.div_input}>
                  <label for="estado">Estado:</label>
                  <select id='estado' name='estado' value={estado} onChange={(e) => {setEstado(e.target.value)}}>
                    <option disabled={true} value="">Selecione</option>
                    <option value="AM">AM</option>
                    <option value="Outros">Outros</option>
                  </select>
                </div>

                <div className={styles.div_input}>
                  <label for="nacionalidade">Nacionalidade:</label>
                  <input 
                    className={styles.input_nacionalidade} 
                    type='text' 
                    id='nacionalidade' 
                    name='nacionalidade' 
                    value={nacionalidade} 
                    onChange={(e) => {setNacionalidade(e.target.value)}}>
                  </input>
                </div>
              </div>

              <div className={styles.form_group}>
                <div className={styles.div_input}>
                  <label for="Naturalidade">Naturalidade:</label>
                  <input 
                    className={styles.input_naturalidade} 
                    type='text' 
                    id='naturalidade' 
                    name='naturalidade' 
                    value={naturalidade} 
                    onChange={(e) => {setNaturalidade(e.target.value)}}>
                  </input>
                </div>

                <div className={styles.div_input}>
                  <label for="raca">Raça:</label>
                  <select id='raca' name='raca' value={raca} onChange={(e) => {setRaca(e.target.value)}}>
                    <option disabled={true} value="">Selecione</option>
                    <option value="Branco">Branco</option>
                    <option value="Pardo">Pardo</option>
                    <option value="Preto">Preto</option>
                    <option value="Amarelo">Amarelo</option>
                    <option value="Indígena">Indígena</option>
                  </select>
                </div>

                <div className={styles.div_input}>
                  <label for="telefone">Telefone:</label>
                  <input 
                    type='text' 
                    id='telefone' 
                    name='telefone' 
                    value={telefone} 
                    maxLength={14}
                    onChange={(e) => {setTelefone(e.target.value)}}>
                  </input>
                </div>
              </div>

              <div className={styles.form_group}>
                <div className={styles.div_input}>
                  <label for="email">Email:</label>
                  <input 
                    className={styles.input_email} 
                    type='text' 
                    id='email' 
                    name='email' 
                    value={email} 
                    maxLength={35}
                    onChange={(e) => {setEmail(e.target.value)}}>
                  </input>
                </div>
              </div>
            </form>

            {/***TODO: INPUT DADOS FAMILIARES***/}
            <form className={styles.form_dados_familiares} autoComplete='off'>
              <div className={styles.divisoria}>
                <hr></hr>
                <span className={styles.title_divis}>Dados Familiares</span>
              </div>

              <span className={styles.span}>Pai</span>
              <div className={styles.form_group}>
                <div className={styles.div_input}>
                  <label for="nome_pai">Nome Completo:</label>
                  <input 
                    className={styles.input_nome_pai} 
                    type='text' 
                    id='nome_pai' 
                    name='nome_pai' 
                    value={nomePai} 
                    maxLength={85}
                    onChange={(e) => {setNomePai(e.target.value)}}>
                  </input>
                </div>

                <div className={styles.div_input}>
                  <label for="cpf_pai">CPF:</label>
                  <input 
                    className={styles.input_cpf_pai} 
                    type='text' 
                    id='cpf_pai' 
                    name='cpf_pai' 
                    value={cpfPai} 
                    maxLength={14}
                    onChange={(e) => {setCpfPai(e.target.value)}}>
                  </input>
                </div>

                <div className={styles.div_input}>
                  <label for="data_nasc">Data Nasc:</label>
                  <input 
                    type='date' 
                    id='data_nasc_pai' 
                    name='data_nasc_pai' 
                    value={dataNascPai} 
                    onChange={(e) => {setDataNascPai(e.target.value)}}>
                  </input>
                </div>
              </div>

              <span className={styles.span}>Mãe</span>
              <div className={styles.form_group} id={styles.form_group_mae}>
                <div className={styles.div_input}>
                  <label for="nome_mae">Nome Completo:</label>
                  <input 
                    className={styles.input_nome_mae} 
                    type='text' 
                    id='nome_mae' 
                    name='nome_mae' 
                    value={nomeMae} 
                    maxLength={85}
                    onChange={(e) => {setNomeMae(e.target.value)}}>
                  </input>
                </div>

                <div className={styles.div_input}>
                  <label for="cpf_mae">CPF:</label>
                  <input 
                    className={styles.input_cpf_mae} 
                    type='text' 
                    id='cpf_mae' 
                    name='cpf_mae' 
                    value={cpfMae} 
                    maxLength={14}
                    onChange={(e) => {setCpfMae(e.target.value)}}>
                  </input>
                </div>

                <div className={styles.div_input}>
                  <label for="data_nasc_mae">Data Nasc:</label>
                  <input 
                    type='date' 
                    id='data_nasc_mae' 
                    name='data_nasc_mae' 
                    value={dataNascMae} 
                    onChange={(e) => {setDataNascMae(e.target.value)}}>
                  </input>
                </div>
              </div>

              <div className={styles.form_group}>
                <div className={styles.div_input} id={styles.input_estado_civil}>
                  <label for="estado_civil">Estado Civil:</label>
                  <select id='estado_civil' name='estado_civil' value={estadoCivil} onChange={(e) => {setEstadoCivil(e.target.value)}}>
                    <option disabled={true} value="">Selecione</option>
                    <option value="Solteiro">Solteiro</option>
                    <option value="Casado">Casado</option>
                    <option value="Separado">Separado</option>
                    <option value="Divorciado">Divorciado</option>
                    <option value="Viúvo">Viúvo</option>
                  </select>
                </div>

                <div className={`${styles.div_input} ${estadoCivil !== "Casado" || estadoCivil === "" ? styles.disabled : ""}`}>
                  <label for="nome_esposoa">Nome Esposo(a):</label>
                  <input 
                    className={styles.input_nome_esposoa} 
                    type='text' 
                    id='nome_esposoa' 
                    name='nome_esposoa' 
                    value={nomeEsposoa} 
                    maxLength={85}
                    disabled={estadoCivil !== "Casado" || estadoCivil === ""} 
                    onChange={(e) => {setNomeEsposoa(e.target.value)}}>
                  </input>
                </div>
              </div>

              <div className={styles.form_group}>
                <div className={styles.div_input} id={styles.input_filhos}>
                  <label for="filhos">Filhos:</label>
                  <select id='filhos' name='filhos' value={filhos} onChange={(e) => {setFilhos(e.target.value)}}>
                    <option disabled={true} value="">Selecione</option>
                    <option value="0">0</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                  </select>
                </div>

                <div className={`${styles.div_input} ${filhos === "0" || filhos === "" ? styles.disabled : ""}`}>
                  <label for="nome_filhos">Nome Filhos:</label>
                  <input 
                    className={styles.input_nome_filhos} 
                    type='text' 
                    id='nome_filhos' 
                    name='nome_filhos' 
                    value={nomeFilhos} 
                    disabled={filhos === "0" || filhos === ""} 
                    onChange={(e) => {setNomeFilhos(e.target.value)}}>
                  </input>
                </div>
              </div>
            </form>

            {/***TODO: INPUT DOCUMENTOS***/}
            <form className={styles.form_dados_documentos} autoComplete='off'>
              <div className={styles.divisoria} id={styles.divis_docs}>
                <hr></hr>
                <span className={styles.title_divis}>Documentos</span>
              </div>

              <div className={styles.form_group}>
                <div className={styles.div_input}>
                  <label for="cpf">CPF:</label>
                  <input 
                    className={styles.input_cpf} 
                    type='text' 
                    id='cpf' 
                    name='cpf' 
                    value={cpf} 
                    maxLength={14}
                    onChange={(e) => {setCpf(e.target.value)}}>
                  </input>
                </div>

                <div className={styles.div_input}>
                  <label for="pis_pasep">PIS/PASEP:</label>
                  <input 
                    className={styles.input_pis_pasep} 
                    type='text' 
                    id='pis_pasep' 
                    name='pis_pasep' 
                    value={pisPasep} 
                    maxLength={14}
                    onChange={(e) => {setPisPasep(e.target.value)}}>
                  </input>
                </div>

                <div className={styles.div_input}>
                  <label for="cnh">CNH:</label>
                  <input 
                    className={styles.input_cnh}
                    type='text' 
                    id='cnh' 
                    name='cnh' 
                    value={cnh} 
                    maxLength={11}
                    onChange={(e) => {setCnh(e.target.value)}}>
                  </input>
                </div>
              </div>

              <div className={styles.form_group}>
                <div className={styles.div_input}>
                  <label for="rg">RG:</label>
                  <input 
                    className={styles.input_rg} 
                    type='text' 
                    id='rg' 
                    name='rg' 
                    value={rg} 
                    maxLength={9}
                    onChange={(e) => {setRg(e.target.value)}}>
                  </input>
                </div>

                <div className={styles.div_input}>
                  <label for="rg_data_exped">Data Exped:</label>
                  <input 
                    type='date' 
                    id='rg_data_exped' 
                    name='rg_data_exped' 
                    value={rgDataExped} 
                    onChange={(e) => {setRgDataExped(e.target.value)}}>
                  </input>
                </div>

                <div className={styles.div_input}>
                  <label for="rg_orgao_exped">Orgão Exped:</label>
                  <select id='rg_orgao_exped' name='rg_orgao_exped' value={rgOrgaoExped} onChange={(e) => {setRgOrgaoExped(e.target.value)}}>
                    <option disabled={true} value="">Selecione</option>
                    <option value="SSP">SSP</option>
                    <option value="PC">PC</option>
                    <option value="Detran">Detran</option>
                    <option value="Outros">Outros</option>
                  </select>
                </div>

                <div className={styles.div_input}>
                  <label for="rg_uf">UF:</label>
                  <input 
                    className={styles.input_rg_uf} 
                    type='text' 
                    id='rg_uf' 
                    name='rg_uf' 
                    value={rgUf} 
                    onChange={(e) => {setRgUf(e.target.value)}}>
                  </input>
                </div>
              </div>

              <div className={styles.form_group}>
                <div className={styles.div_input}>
                  <label for="titulo">Título:</label>
                  <input 
                    className={styles.input_titulo} 
                    type='text' 
                    id='titulo' 
                    name='titulo' 
                    value={titulo} 
                    maxLength={10}
                    onChange={(e) => {setTitulo(e.target.value)}}>
                  </input>
                </div>

                <div className={styles.div_input}>
                  <label for="titulo_zona">Zona:</label>
                  <input 
                    className={styles.input_titulo_zona} 
                    type='text' 
                    id='titulo_zona'
                    name='titulo_zona' 
                    value={tituloZona} 
                    maxLength={4}
                    onChange={(e) => {setTituloZona(e.target.value)}}>
                  </input>
                </div>

                <div className={styles.div_input}>
                  <label for="titulo_secao">Seção:</label>
                  <input 
                    className={styles.input_titulo_secao} 
                    type='text' 
                    id='titulo_secao' 
                    name='titulo_secao' 
                    value={tituloSecao} 
                    maxLength={5}
                    onChange={(e) => {setTituloSecao(e.target.value)}}>
                  </input>
                </div>

                <div className={styles.div_input}>
                  <label for="titulo_uf">UF:</label>
                  <input 
                    className={styles.input_titulo_uf} 
                    type='text' 
                    id='titulo_uf' 
                    name='titulo_uf' 
                    value={tituloUf} 
                    onChange={(e) => {setTituloUf(e.target.value)}} 
                    maxLength={5}>
                  </input>
                </div>

                <div className={styles.div_input}>
                  <select id='selectDocMilitar' name='selectDocMilitar' value={selectDocMilitar} onChange={(e) => {setSelectDocMilitar(e.target.value)}}>
                    <option value="Não">Não</option>
                    <option value="Sim">Sim</option>
                  </select>
                </div>

                <div className={`${styles.div_input} ${selectDocMilitar === "Não" || selectDocMilitar === "" ? styles.disabled : ""}`}>
                  <label for="doc_militar">Doc. Militar:</label>
                  <input 
                    className={styles.input_doc_militar} 
                    type='text' 
                    id='doc_militar' 
                    name='doc_militar' 
                    value={docMilitar} 
                    disabled={selectDocMilitar === "Não" || selectDocMilitar === "" ? styles.disabled : ""} 
                    onChange={(e) => {setDocMilitar(e.target.value)}}>
                  </input>
                </div>

                <div className={`${styles.div_input} ${selectDocMilitar === "Não" || selectDocMilitar === "" ? styles.disabled : ""}`}>
                  <label for="doc_militar_serie">Série:</label>
                  <input 
                    className={styles.input_doc_militar_serie} 
                    type='text' 
                    id='doc_militar_serie' 
                    name='doc_militar_serie' 
                    value={docMilitarSerie} 
                    disabled={selectDocMilitar === "Não" || selectDocMilitar === "" ? styles.disabled : ""} 
                    onChange={(e) => {setDocMilitarSerie(e.target.value)}}>
                  </input>
                </div>


              </div>
            </form>

            {/***TODO: INPUT DADOS ENDEREÇO***/}
            <form className={styles.form_dados_endereco} autoComplete='off'>
              <div className={styles.divisoria} id={styles.divis_docs}>
                <hr></hr>
                <span className={styles.title_divis}>Endereço</span>
              </div>

              <div className={styles.form_group}>
                <div className={styles.div_input}>
                  <label for="bairro">Bairro:</label>
                  <input 
                    className={styles.input_bairro} 
                    type='text' 
                    id='bairro' 
                    name='bairro' 
                    value={bairro} 
                    maxLength={50}
                    onChange={(e) => {setBairro(e.target.value)}}>
                  </input>
                </div>

                <div className={styles.div_input}>
                  <label for="logadouro_numero">Número:</label>
                  <input 
                    className={styles.input_logadouro_numero} 
                    type='text' 
                    id='logadouro_numero' 
                    name='logadouro_numero' 
                    value={logadouroNumero} 
                    maxLength={5}
                    onChange={(e) => {setLogadouroNumero(e.target.value)}}>
                  </input>
                </div>

                <div className={styles.div_input}>
                  <label for="cep">CEP:</label>
                  <input 
                    className={styles.input_cep} 
                    type='text' 
                    id='cep' 
                    name='cep' 
                    value={cep} 
                    maxLength={9}
                    onChange={(e) => {setCep(e.target.value)}}>
                  </input>
                </div>

                <div className={styles.div_input}>
                  <label for="logadouro">Logadouro:</label>
                  <select id='logadouro' name='logadouro' value={logadouro} onChange={(e) => {setLogadouro(e.target.value)}}>
                    <option disabled={true} value="">Selecione</option>
                    <option value="Rua">Rua</option>
                    <option value="Avenida">Avenida</option>
                    <option value="Travessa">Travessa</option>
                    <option value="Estrada">Estrada</option>
                    <option value="Outros">Outros</option>
                  </select>
                </div>
              </div>

              <div className={styles.form_group}>
                <div className={styles.div_input}>
                  <label for="estado">Estado:</label>
                  <select id='estado' name='estado' value={logadouroEstado} onChange={(e) => {setLogadouroEstado(e.target.value)}}>
                    <option disabled={true} value="">Selecione</option>
                    <option value="AM">AM</option>
                    <option value="Outros">Outros</option>
                  </select>
                </div>

                <div className={styles.div_input}>
                  <label for="cidade">Cidade:</label>
                  <select id='cidade' name='cidade' value={cidade} onChange={(e) => {setCidade(e.target.value)}}>
                    <option disabled={true} value="">Selecione</option>
                    <option value="AM">Manaus</option>
                    <option value="Outros">Outros</option>
                  </select>
                </div>
              </div>
            </form>

            {/***TODO: INPUT DADOS BANCÁRIOS***/}
             <form className={styles.form_dados_bancarios} autoComplete='off'>
                <div className={styles.divisoria} id={styles.divis_docs}>
                  <hr></hr>
                  <span className={styles.title_divis}>Dados Bancários</span>
                </div>

                <div className={styles.form_group}>
                  <div className={styles.div_input}>
                    <label for="banco">Banco:</label>
                    <input 
                      className={styles.input_banco} 
                      type='text' 
                      id='banco' 
                      name='banco' 
                      value={banco} 
                      maxLength={55}
                      onChange={(e) => {setBanco(e.target.value)}}>
                    </input>
                  </div>

                <div className={styles.div_input}>
                  <label for="banco_agencia">Agência:</label>
                  <input 
                    className={styles.input_banco_agencia} 
                    type='text' 
                    id='banco_agencia' 
                    name='banco_agencia' 
                    value={bancoAgencia} 
                    maxLength={6}
                    onChange={(e) => {setBancoAgencia(e.target.value)}}>
                  </input>
                </div>

                <div className={styles.div_input}>
                  <label for="banco_conta">Conta:</label>
                  <input 
                    className={styles.input_banco_conta} 
                    type='text' 
                    id='banco_conta' 
                    name='banco_conta' 
                    value={bancoConta} 
                    maxLength={20}
                    onChange={(e) => {setBancoConta(e.target.value)}}>
                  </input>
                </div>
              </div>
            </form>

            {/***TODO: INPUT DADOS ESCOLARES***/}
            <form className={styles.form_dados_escolares} autoComplete='off'>
              <div className={styles.divisoria} id={styles.divis_docs}>
                <hr></hr>
                <span className={styles.title_divis}>Formação Escolar</span>
              </div>

              <div className={styles.form_group}>
                <div className={styles.div_input}>
                  <label for="escolaridade">Escolaridade:</label>
                  <select id='escolaridade' name='escolaridade' value={escolaridade} onChange={(e) => {setEscolaridade(e.target.value)}}>
                    <option disabled={true} value="">Selecione</option>
                    <option value="Ensino Fundamental">Ensino Fundamental</option>
                    <option value="Ensino Médio">Ensino Médio</option>
                    <option value="Ensino Médio">Ensino Médio</option>
                    <option value="EJA">EJA</option>
                    <option value="Ensino Superior">Ensino Superior</option>
                    <option value="Tecnólogo">Tecnólogo</option>
                  </select>
                </div>

                <div className={styles.div_input}>
                  <label for="cursos">cursos:</label>
                  <select id='cursos' name='cursos' value={cursos} onChange={(e) => {setCursos(e.target.value)}}>
                    <option disabled={true} value="">Selecione</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                  </select>
                </div>

                <div className={`${styles.div_input} ${cursos === "" ? styles.disabled : ""}`}>
                  <label for="curso1">Curso 1:</label>
                  <input 
                    className={styles.input_curso1} 
                    type='text' 
                    id='curso1' 
                    name='curso1' 
                    value={curso1} 
                    maxLength={70}
                    onChange={(e) => {setCurso1(e.target.value)}}>
                  </input>
                </div>
              </div>

              <div className={styles.form_group}>
                <div className={`${styles.div_input} ${cursos === "" || cursos === "1" ? styles.disabled : ""}`}>
                  <label for="curso2">Curso 2:</label>
                  <input 
                    className={styles.input_curso2} 
                    type='text' 
                    id='curso2' 
                    name='curso2' 
                    value={curso2} 
                    maxLength={70}
                    onChange={(e) => {setCurso2(e.target.value)}}>
                  </input>
                </div>

                <div className={`${styles.div_input} ${cursos === "" || cursos === "1" || cursos === "2" ? styles.disabled : ""}`}>
                  <label for="curso3">Curso 3:</label>
                  <input 
                    className={styles.input_curso3} 
                    type='text' 
                    id='curso3' 
                    name='curso3' 
                    value={curso3} 
                    maxLength={70}
                    onChange={(e) => {setCurso3(e.target.value)}}>
                  </input>
                </div>
              </div>

              <div className={`${styles.div_input} ${cursos === "" || cursos === "1" || cursos === "2" || cursos === "3" ? styles.disabled : ""}`}>
                <div className={styles.div_input}>
                  <label for="curso4">Curso 4:</label>
                  <input 
                    className={styles.input_curso4} 
                    type='text' 
                    id='curso4' 
                    name='curso4' 
                    value={curso4} 
                    maxLength={70}
                    onChange={(e) => {setCurso4(e.target.value)}}>
                  </input>
                </div>
              </div>
            </form>

            {/***TODO: INPUT DADOS VÍNCULO***/}
            <form className={styles.form_dados_vinculo} autoComplete='off'>
              <div className={styles.divisoria} id={styles.divis_docs}>
                <hr></hr>
                <span className={styles.title_divis}>Vínculo</span>
              </div>

              <div className={styles.form_group}>
                <div className={styles.div_input}>
                  <label for="vinculo">Vínculo:</label>
                  <select id='vinculo' name='vinculo' value={vinculo} onChange={(e) => {setVinculo(e.target.value)}}>
                    <option disabled={true} value="">Selecione</option>
                    <option value="Cargo Comissionado">Cargo Comissionado</option>
                    <option value="Estagiário(a)">Estagiário(a)</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                  </select>
                </div>

                <div className={styles.div_input}>
                  <label for="setorDepartamento">Setor/Departamento:</label>
                  <select id='setorDepartamento' name='setorDepartamento' value={setorDepartamento} onChange={(e) => {setSetorDepartamento(e.target.value)}}>
                    <option disabled={true} value="">Selecione</option>
                    <option value="Apoio Administrativo">Apoio Administrativo</option>
                    <option value="Transporte">Transporte</option>
                    <option value="Gabinete">Gabinete</option>
                    <option value="Gerência de Análise">Gerência de Análise</option>
                    <option value="Gerência de Operações">Gerência de Operações</option>
                    <option value="Gerência de Contra Inteligência">Gerência de Contra Inteligência</option>
                    <option value="Laboratório">Laboratório</option>
                    <option value="Inteligência Cibernética">Inteligência Cibernética</option>
                    <option value="Outros">Outros</option>
                  </select>
                </div>

                <div className={styles.div_input}>
                  <label for="cargoFuncao">Cargo/Função:</label>
                  <input 
                    className={styles.input_cargoFuncao} 
                    type='text' 
                    id='cargoFuncao' 
                    name='cargoFuncao' 
                    value={cargoFuncao} 
                    maxLength={20}
                    onChange={(e) => {setCargoFuncao(e.target.value)}}>
                  </input>
                </div>
              </div>

              <div className={styles.form_group}>
                <div className={styles.div_input}>
                  <label for="cargoEfetivo">Cargo Efetivo:</label>
                  <input 
                    className={styles.input_cargoEfetivo} 
                    type='text' 
                    id='cargoEfetivo' 
                    name='cargoEfetivo' 
                    value={cargoEfetivo} 
                    maxLength={60}
                    onChange={(e) => {setCargoEfetivo(e.target.value)}}>
                  </input>
                </div>
                  
                <div className={styles.div_input}>
                  <label for="status">Status:</label>
                  <select id='status' name='status' value={statusServidor} onChange={(e) => {setStatusServidor(e.target.value)}}>
                    <option disabled={true} value="">Selecione</option>
                    <option value="Ativo">Ativo</option>
                    <option value="Desligado">Desligado</option>
                  </select>
                </div>

                <div className={styles.div_input}>
                  <label for="matriculaOrigem">Matricula Origem:</label>
                  <input 
                    className={styles.input_matriculaOrigem} 
                    type='text' 
                    id='matriculaOrigem' 
                    name='matriculaOrigem' 
                    value={matriculaOrigem} 
                    maxLength={15}
                    onChange={(e) => {setMatriculaOrigem(e.target.value)}}>
                  </input>
                </div>
              </div>

              <div className={styles.form_group}>
                <div className={styles.div_input}>
                  <label for="orgaoOrigem">Orgão Origem:</label>
                  <input 
                    className={styles.input_orgaoOrigem} 
                    type='text' 
                    id='orgaoOrigem' 
                    name='orgaoOrigem' 
                    value={orgaoOrigem} 
                    maxLength={65}
                    onChange={(e) => {setOrgaoOrigem(e.target.value)}}>
                  </input>
                </div>

                <div className={styles.div_input}>
                  <label for="matriculaSeai">Matricula SEAI:</label>
                  <input 
                    className={styles.input_matriculaSeai} 
                    type='text' 
                    id='matriculaSeai' 
                    name='matriculaSeai' 
                    value={matriculaSeai} 
                    maxLength={12}
                    onChange={(e) => {setMatriculaSeai(e.target.value)}}>
                  </input>
                </div>

                <div className={styles.div_input}>
                  <label for="anexos">Anexos:</label>
                  <select id='anexos' name='anexos' value={anexos} onChange={(e) => {setAnexos(e.target.value)}}>
                    <option disabled={true} value="">Selecione</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                  </select>
                </div>
              </div>

              <div className={styles.form_group}>
                <div className={`${styles.div_input} ${anexos === ""  ? styles.disabled: ""}`} id={styles.anexo}>
                  <label for="anexo1">Anexo 1:</label>
                  {anexo1Nome &&(
                    <span className={styles.name_file} id={styles.name_file}>{anexo1Nome}</span>
                  )}
                  <input 
                    className={styles.input_anexo} 
                    type='file' 
                    accept='application/pdf' 
                    id='anexo1' 
                    name='anexo1' 
                    disabled={anexos === ""} 
                    onChange={(e) => handleFileChange(e, 'anexo1')}>
                  </input>
                </div>

                <div className={`${styles.div_input} ${anexos === "" || anexos === "1" ? styles.disabled : ""}`} id={styles.anexo}>
                  <label for="anexo2">Anexo 2:</label>
                  {anexo2Nome &&(
                    <span className={styles.name_file} id={styles.name_file}>{anexo2Nome}</span>
                  )}
                  <input 
                    className={styles.input_anexo} 
                    type='file' 
                    accept='application/pdf' 
                    id='anexo2' 
                    name='anexo2' 
                    disabled={anexos === "" || anexos === "1"} 
                    onChange={(e) => handleFileChange(e, 'anexo2')}>
                  </input>
                </div>
              </div>

              <div className={styles.form_group}>
                <div className={`${styles.div_input} ${anexos === "" || anexos === "1" || anexos === "2" ? styles.disabled : ""}`} id={styles.anexo}>
                  <label for="anexo3">Anexo 3:</label>
                  {anexo3Nome &&(
                    <span className={styles.name_file} id={styles.name_file}>{anexo3Nome}</span>
                  )}
                  <input 
                    className={styles.input_anexo} 
                    type='file' 
                    accept='application/pdf' 
                    id='anexo3' 
                    name='anexo3' 
                    disabled={anexos === "" || anexos === "1" || anexos === "2"} 
                    onChange={(e) => handleFileChange(e, 'anexo3')}>
                  </input>
                </div>

                <div className={`${styles.div_input} ${anexos === "" || anexos === "1" || anexos === "2" || anexos === "3" ? styles.disabled : ""}`} id={styles.anexo}>
                  <label for="anexo4">Anexo 4:</label>
                  {anexo4Nome &&(
                    <span className={styles.name_file} id={styles.name_file}>{anexo4Nome}</span>
                  )}
                  <input 
                    className={styles.input_anexo} 
                    type='file' 
                    accept='application/pdf' 
                    id='anexo4' 
                    name='anexo4' 
                    disabled={anexos === "" || anexos === "1" || anexos === "2" || anexos === "3"} 
                    onChange={(e) => handleFileChange(e, 'anexo4')}>
                  </input>
                </div>
              </div>

              <div className={styles.form_group}>
                <div className={styles.div_input}>
                  <label for="dataEntregaDocs">Data de entrega dos documentos:</label>
                  <input 
                    type='date' 
                    id='dataEntregaDocs' 
                    name='dataEntregaDocs' 
                    value={dataEntregaDocs} 
                    onChange={(e) => {setDataEntregaDocs(e.target.value)}}>
                  </input>
                </div>
              </div>

              <div className={styles.form_group} id={styles.anotacoes}>
                <div className={styles.div_input} id={styles.anexo}>
                  <label for="anotacoes">Anotações:</label>
                  <textarea 
                    className={styles.input_anotacoes} 
                    type='text' 
                    id='anotacoes' 
                    name='anotacoes' 
                    value={anotacoes} 
                    onChange={(e) => {setAnotacoes(e.target.value)}}>
                  </textarea>
                </div>
              </div>
            </form>
          </div>
        </div>

        <button onClick={validateForm} className={styles.button_send}>Salvar</button>
      </div>

      {/***TODO: MODALS***/}
      <Modal isOpen={openModal} setIsOpen={setOpenModal} message={modalMessage} />
      <ModalError isOpen={openModalError} setIsOpen={setOpenModalError} message={modalMessageError} />
    </div>
  )
}

export default Registro