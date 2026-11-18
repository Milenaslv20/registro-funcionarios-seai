import React, { useState, useRef, useEffect } from 'react'
import styles from './styles.module.css'
import EMPRESA from '../config/empresa'
import Axios from 'axios'
import { useFuncionario } from './FuncionarioContext'
import { IMaskInput } from 'react-imask';

import { Paperclip } from 'lucide-react'
import defaultImage from '../svg/icon-person.jpg'

import Modal from '../components/Modal'
import ModalError from '../components/ModalError'
import Header from '../components/Header'
import { useLanguage } from '../i18n/LanguageContext'
import { urlApi, urlFoto } from '../api'

const Editar = () =>{
  const { t } = useLanguage()
  const endpoint = process.env.REACT_APP_API_BASE_URL;

  const { funcionario } = useFuncionario();
  const { usuario } = useFuncionario();
  const [imageUrl, setImageUrl] = useState(urlFoto(funcionario.idFuncionario));

  const handleImageError = () =>{
    setImageUrl(defaultImage)
  }

  //ao retornar a data do banco de dados ela retornava, exemplo, como 4444-04-04T14:30:00.000Z(datetime) mesno que no banco de dados esteja como date e o input só aceita yyyy-mm-dd, entao para que o valor seja aceito pelo input esse valor do banco foi transformado para yyyy-mm-dd(4444-04-04)
  const formateDataInput = (date) =>{
    // a API já devolve 'YYYY-MM-DD': usa direto (new Date() leria como UTC e voltaria um dia no fuso do Brasil)
    if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) return date
    const data  = new Date(date)
    const year = data.getFullYear()
    const month = (data.getMonth() + 1).toString().padStart(2, '0')
    const day = data.getDate().toString().padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const formatedDataNasc = formateDataInput(funcionario.dataNasc)
  const formatedDataNascPai = formateDataInput(funcionario.dataNascPai)
  const formatedDataNascMae = formateDataInput(funcionario.dataNascMae)
  const formatedDataEntregaDocs = formateDataInput(funcionario.dataEntregaDocs)
  const formatedrgDataExped = formateDataInput(funcionario.rgDataExped)

  const [visData, setVisData] = useState({
    idFuncionario: funcionario.idFuncionario,
    nomeFuncionario: funcionario.nomeFuncionario,

    sexo: funcionario.sexo,
    dataNasc: formatedDataNasc,
    estadoAtual: funcionario.estadoAtual,
    nacionalidade: funcionario.nacionalidade,
    naturalidade: funcionario.naturalidade,
    raca: funcionario.raca,
    telefone: funcionario.telefone,
    email: funcionario.email,

    nomePai: funcionario.nomePai,
    cpfPai: funcionario.cpfPai,
    dataNascPai: funcionario.dataNascPai,
    nomeMae: funcionario.nomeMae,
    cpfMae: funcionario.cpfMae,
    dataNascMae: funcionario.dataNascMae,
    estadoCivil: funcionario.estadoCivil,
    nomeEsposoa: funcionario.nomeEsposoa,
    filhos: funcionario.filhos,
    nomeFilhos: funcionario.nomeFilhos,

    cpf: funcionario.cpf,
    pisPasep: funcionario.pisPasep,
    cnh: funcionario.cnh,
    rg: funcionario.rg,
    rgDataExped: funcionario.rgDataExped,
    rgOrgaoExped: funcionario.rgOrgaoExped,
    rgUf: funcionario.rgUf,
    titulo: funcionario.titulo,
    tituloZona: funcionario.tituloZona,
    tituloSecao: funcionario.tituloSecao,
    tituloUf: funcionario.tituloUf,
    docMilitar: funcionario.docMilitar,
    docMilitarSerie: funcionario.docMilitarSerie,

    bairro: funcionario.bairro,
    numCasa: funcionario.numCasa,
    cep: funcionario.cep,
    rua: funcionario.rua,
    logadouro: funcionario.logadouro,
    estadoSelecionado: funcionario.estado,
    cidadeSelecionada: funcionario.cidade,

    banco: funcionario.banco,
    bancoAgencia: funcionario.bancoAgencia,
    bancoConta: funcionario.bancoConta,

    escolaridade: funcionario.escolaridade,
    cursos: funcionario.cursos,
    curso1: funcionario.curso1,
    curso2: funcionario.curso2,
    curso3: funcionario.curso3,
    curso4: funcionario.curso4,

    vinculo: funcionario.vinculo,
    setorDepartamento: funcionario.setorDepartamento,
    cargoFuncao: funcionario.cargoFuncao,
    cargoEfetivo: funcionario.cargoEfetivo,
    statusServidor: funcionario.statusServidor,
    matriculaOrigem: funcionario.matriculaOrigem,
    orgaoOrigem: funcionario.orgaoOrigem,
    matriculaEmpresa: funcionario.matriculaEmpresa,
    dataEntregaDocs: funcionario.dataEntregaDocs,
    anotacoes: funcionario.anotacoes,

    filePath: funcionario.filePath,
    image: funcionario.imageUrl
  })
  console.log(visData)

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
  
  useEffect(() => {
    if (funcionario) {
      setVisData({
        idFuncionario: funcionario.idFuncionario,
        nomeFuncionario: funcionario.nomeFuncionario,

        sexo: funcionario.sexo,
        dataNasc: formatedDataNasc,
        estadoAtual: funcionario.estadoAtual,
        nacionalidade: funcionario.nacionalidade,
        naturalidade: funcionario.naturalidade,
        raca: funcionario.raca,
        telefone: funcionario.telefone,
        email: funcionario.email,

        nomePai: funcionario.nomePai,
        cpfPai: funcionario.cpfPai,
        dataNascPai: formatedDataNascPai,
        nomeMae: funcionario.nomeMae,
        cpfMae: funcionario.cpfMae,
        dataNascMae: formatedDataNascMae,
        estadoCivil: funcionario.estadoCivil,
        nomeEsposoa: funcionario.nomeEsposoa,
        filhos: funcionario.filhos,
        nomeFilhos: funcionario.nomeFilhos,

        cpf: funcionario.cpf,
        pisPasep: funcionario.pisPasep,
        cnh: funcionario.cnh,
        rg: funcionario.rg,
        rgDataExped: formatedrgDataExped,
        rgOrgaoExped: funcionario.rgOrgaoExped,
        rgUf: funcionario.rgUf,
        titulo: funcionario.titulo,
        tituloZona: funcionario.tituloZona,
        tituloSecao: funcionario.tituloSecao,
        tituloUf: funcionario.tituloUf,
        docMilitar: funcionario.docMilitar,
        docMilitarSerie: funcionario.docMilitarSerie,

        bairro: funcionario.bairro,
        numCasa: funcionario.numCasa,
        cep: funcionario.cep,
        rua: funcionario.rua,
        logadouro: funcionario.logadouro,
        estadoSelecionado: funcionario.estado,
        cidadeSelecionada: funcionario.cidade,

        banco: funcionario.banco,
        bancoAgencia: funcionario.bancoAgencia,
        bancoConta: funcionario.bancoConta,

        escolaridade: funcionario.escolaridade,
        cursos: funcionario.cursos,
        curso1: funcionario.curso1,
        curso2: funcionario.curso2,
        curso3: funcionario.curso3,
        curso4: funcionario.curso4,

        vinculo: funcionario.vinculo,
        setorDepartamento: funcionario.setorDepartamento,
        cargoFuncao: funcionario.cargoFuncao,
        cargoEfetivo: funcionario.cargoEfetivo,
        statusServidor: funcionario.statusServidor,
        matriculaOrigem: funcionario.matriculaOrigem,
        orgaoOrigem: funcionario.orgaoOrigem,
        matriculaEmpresa: funcionario.matriculaEmpresa,
        dataEntregaDocs: formatedDataEntregaDocs,
        anotacoes: funcionario.anotacoes
      });  // Atualiza os dados caso o funcionario mude
      if (funcionario.estado && estadosCidades[funcionario.estado]) {
        setCidades(estadosCidades[funcionario.estado]);
      }
    }
  }, [funcionario]);

  const handleEditValue = (event) =>{
    const { name, value } = event.target

    setVisData({
      ...visData,
      [name]: value,
    })
  }

  //TODO: DECLARATION MODAL
  const [openModal, setOpenModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [openModalError, setOpenModalError] = useState(false);
  const [modalMessageError, setModalMessageError] = useState('');

  //TODO: INPUT VALUES
  const [imagem, setImagem] = useState(null)
  const [selectedImage, setSelectedImage] = useState(null);
  const inputRef = useRef(null);

  const [selectCnh, setSelectCnh] = useState('')
  const [selectDocMilitar, setSelectDocMilitar] = useState('')

  const [cidades, setCidades] = useState([])
  const estadosCidades = {
    "Amazonas" : ["Manaus", "Parintins", "Itacoatiara", "Manacapuru", "Coari", "Tefé", "Tabatinga", "Maués", "São Gabriel da Cachoeira",
      "Humaitá", "Lábrea", "Borba", "Autazes", "Manicoré", "Careiro", "Presidente Figueiredo", "Nova Olinda do Norte", "Boca do Acre",
      "Iranduba", "Barreirinha"],
    "Acre" : ["Acrelândia", "Assis Brasil", "Brasiléia", "Bujari", "Capixaba", "Cruzeiro do Sul", "Epitaciolândia", "Feijó", "Jordão",
      "Mâncio Lima", "Manoel Urbano", "Marechal Thaumaturgo", "Plácido de Castro", "Porto Acre", "Porto Walter", "Rio Branco", "Rodrigues Alves",
      "Santa Rosa do Purus", "Sena Madureira", "Senador Guiomard", "Tarauacá","Xapuri"],  
    "Alagoas" : ["Água Branca", "Anadia", "Arapiraca", "Atalaia", "Barra de Santo Antônio", "Barra de São Miguel", "Batalha", "Belém",
      "Belo Monte", "Boca da Mata", "Branquinha", "Cacimbinhas", "Cajueiro", "Campestre", "Campo Alegre", "Campo Grande", "Canapi",
      "Capela", "Carneiros", "Chã Preta", "Coité do Nóia", "Colônia Leopoldina", "Coqueiro Seco", "Coruripe", "Craíbas", "Delmiro Gouveia",
      "Dois Riachos", "Estrela de Alagoas", "Feira Grande", "Feliz Deserto", "Flexeiras", "Girau do Ponciano", "Ibateguara", "Igaci", "Igreja Nova",
      "Inhapi", "Jacaré dos Homens", "Jacuípe", "Japaratinga", "Jaramataia", "Jequiá da Praia", "Joaquim Gomes", "Jundiá", "Junqueiro",
      "Lagoa da Canoa", "Limoeiro de Anadia", "Maceió", "Major Isidoro", "Mar Vermelho", "Maragogi", "Maravilha", "Marechal Deodoro",
      "Maribondo", "Mata Grande", "Matriz de Camaragibe", "Messias", "Minador do Negrão", "Monteirópolis", "Murici", "Novo Lino",
      "Olho d'Água das Flores", "Olho d'Água do Casado", "Olho d'Água Grande", "Olivença", "Ouro Branco", "Palestina", "Palmeira dos Índios",
      "Pão de Açúcar", "Pariconha", "Paripueira", "Passo de Camaragibe", "Paulo Jacinto", "Penedo", "Piaçabuçu", "Pilar", "Pindoba",
      "Piranhas", "Poço das Trincheiras", "Porto Calvo", "Porto de Pedras", "Porto Real do Colégio", "Quebrangulo", "Rio Largo",
      "Roteiro", "Santa Luzia do Norte", "Santana do Ipanema", "Santana do Mundaú", "São Brás", "São José da Laje", "São José da Tapera",
      "São Luís do Quitunde", "São Miguel dos Campos", "São Miguel dos Milagres", "São Sebastião", "Satuba", "Senador Rui Palmeira",
      "Tanque d'Arca", "Taquarana", "Teotônio Vilela", "Traipu", "União dos Palmares", "Viçosa"],
    "Amapá" : ["Macapá", "Santana", "Laranjal do Jari", "Oiapoque", "Porto Grande", "Mazagão", "Tartarugalzinho", "Vitória do Jari",
      "Calçoene", "Ferreira Gomes", "Cutias", "Itaubal", "Serra do Navio", "Pracuúba"],   
    "Bahia" : ["Salvador", "Feira de Santana", "Vitória da Conquista", "Camaçari", "Itabuna", "Juazeiro", "Lauro de Freitas", "Ilhéus",
      "Jequié", "Teixeira de Freitas", "Alagoinhas", "Barreiras", "Porto Seguro", "Simões Filho"],  
    "Ceará" : ["Fortaleza", "Caucaia", "Juazeiro do Norte", "Maracanaú", "Sobral", "Crato", "Itapipoca", "Maranguape", "Iguatu", "Quixadá",
      "Pacatuba", "Canindé", "Aquiraz", "Crateús", "Pacajus", "Quixeramobim"],  
    "Espírito Santo" : ["Vitória", "Vila Velha", "Serra", "Cariacica", "Linhares", "Colatina", "Guarapari", "Aracruz", "São Mateus",
      "Viana", "Nova Venécia", "Barra de São Francisco", "Santa Maria de Jetibá"],  
    "Goiás" : ["Goiânia", "Aparecida de Goiânia", "Anápolis", "Rio Verde", "Luziânia", "Águas Lindas de Goiás", "Valparaíso de Goiás",
      "Trindade", "Formosa", "Novo Gama", "Catalão", "Itumbiara", "Jataí", "Senador Canedo", "Caldas Novas"],  
    "Maranhão" : ["São Luís", "Imperatriz", "Caxias", "Timon", "Codó", "Paço do Lumiar", "Açailândia", "Bacabal", "Balsas", "Barra do Corda",
      "Pinheiro", "Santa Inês", "Chapadinha", "Itapecuru-Mirim"],  
    "Mato Grosso" : ["Cuiabá", "Várzea Grande", "Rondonópolis", "Sinop", "Tangará da Serra", "Cáceres", "Sorriso", "Lucas do Rio Verde",
      "Primavera do Leste", "Barra do Garças", "Alta Floresta", "Pontes e Lacerda"],  
    "Mato Grosso do Sul" : ["Campo Grande", "Dourados", "Três Lagoas", "Corumbá", "Ponta Porã", "Naviraí", "Nova Andradina", "Aquidauana",
      "Sidrolândia", "Paranaíba", "Coxim", "Maracaju", "Rio Brilhante", "Amambai"],  
    "Minas Gerais" : ["Belo Horizonte", "Uberlândia", "Contagem", "Juiz de Fora", "Betim", "Montes Claros", "Ribeirão das Neves", "Uberaba",
      "Governador Valadares", "Ipatinga", "Sete Lagoas", "Divinópolis", "Poços de Caldas"],  
    "Pará" : ["Belém", "Ananindeua", "Santarém", "Marabá", "Castanhal", "Parauapebas", "Abaetetuba", "Cametá", "Bragança", "Marituba",
      "Itaituba", "Altamira", "Tucuruí", "Barcarena", "Breves"],  
    "Paraíba" : ["João Pessoa", "Campina Grande", "Santa Rita","Patos", "Bayeux", "Sousa", "Cabedelo", "Cajazeiras", "Guarabira", "Sapé",
      "Mamanguape", "Queimadas", "São Bento", "Monteiro", "Esperança"],  
    "Paraná" : ["Curitiba","Londrina", "Maringá", "Ponta Grossa", "Cascavel", "São José dos Pinhais", "Foz do Iguaçu", "Colombo", "Guarapuava",
      "Paranaguá", "Toledo", "Apucarana", "Pinhais", "Araucária"],  
    "Pernambuco" : ["Recife", "Jaboatão dos Guararapes", "Olinda", "Caruaru", "Petrolina", "Paulista", "Cabo de Santo Agostinho", "Camaragibe",
      "Garanhuns", "Vitória de Santo Antão", "Igarassu", "São Lourenço da Mata"],  
    "Piauí" : ["Teresina", "Parnaíba", "Picos", "Floriano", "Piripiri", "Campo Maior", "Barras", "Altos", "José de Freitas", "União",
      "Pedro II", "Esperantina", "Oeiras"],  
    "Rio de Janeiro" : ["Rio de Janeiro", "São Gonçalo", "Duque de Caxias", "Nova Iguaçu", "Niterói", "Belford Roxo", "Campos dos Goytacazes",
      "Petrópolis", "Volta Redonda", "Macaé", "Angra dos Reis"],  
    "Rio Grande do Norte" : ["Natal", "Mossoró", "Parnamirim", "São Gonçalo do Amarante", "Macaíba", "Ceará-Mirim", "Caicó", "Açu", "Currais Novos",
      "São José de Mipibu", "Santa Cruz", "Nova Cruz"],  
    "Rio Grande do Sul" : ["Porto Alegre", "Caxias do Sul", "Pelotas", "Canoas", "Santa Maria", "Gravataí", "Viamão", "Novo Hamburgo","São Leopoldo",
      "Rio Grande", "Alvorada", "Passo Fundo", "Sapucaia do Sul"],  
    "Rondônia" : ["Porto Velho", "Ji-Paraná", "Ariquemes", "Vilhena", "Cacoal", "Rolim de Moura", "Jaru", "Guajará-Mirim"],  
    "Roraima" : ["Boa Vista", "Rorainópolis", "Caracaraí", "Mucajaí", "Alto Alegre", "Pacaraima", "Amajari", "Bonfim"],  
    "Santa Catarina" : ["Florianópolis", "Joinville", "Blumenau", "São José", "Chapecó", "Criciúma", "Itajaí", "Jaraguá do Sul", "Palhoça",
      "Lages", "Balneário Camboriú", "Brusque", "Tubarão"],  
    "São Paulo" : ["São Paulo", "Guarulhos", "Campinas", "São Bernardo do Campo", "Santo André", "Osasco", "São José dos Campos", "Ribeirão Preto",
      "Sorocaba", "Mauá", "São José do Rio Preto", "Mogi das Cruzes"],  
    "Sergipe" : ["Aracaju", "Nossa Senhora do Socorro", "Lagarto", "Itabaiana", "Estância", "Tobias Barreto", "Itabaianinha", "Simão Dias",
      "Nossa Senhora da Glória", "Poço Redondo", "Capela", "Propriá"],  
    "Tocantins" : ["Palmas", "Araguaína", "Gurupi", "Porto Nacional", "Paraíso do Tocantins", "Guaraí", "Colinas do Tocantins", "Dianópolis",
      "Tocantinópolis", "Augustinópolis"]  
  }

  const [files, setFiles] = useState([])

  //TODO: INPUT CIDADES
  const handleEstados = (e) =>{
    const estado = e.target.value;

    // Atualiza as cidades
    if (estado && estadosCidades[estado]) {
      setCidades(estadosCidades[estado]);
    } else {
      setCidades([]);
    }
  
    // Atualiza o visData
    setVisData((prevData) => ({
      ...prevData,
      estadoSelecionado: estado,
      cidadeSelecionada: '' // limpa cidade ao trocar estado
    }));
  };

  const handleCidade = (e) => {
    const cidade = e.target.value;
    setVisData((prevData) => ({
      ...prevData,
      cidadeSelecionada: cidade
    }));
  };

  //TODO: INPUT IMAGE
  const handleImageChange = (e) =>{
    const file = e.target.files[0];
    if (file) {
      setImagem(file);

      // Criar URL de visualização da imagem
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result);  // Armazena a URL da imagem no estado
      };
      reader.readAsDataURL(file);  // Lê o arquivo como URL de dados
    }
  };


  //TODO: INPUT FILES
  const handleFileChange = (e) =>{
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
  };

  //TODO: VALIDATION INPUTS AND SEND TO BACKEND
  const regex = /[0-9!#$%&'"()*+,-./:;?@[\\\]_`{|}~]/

  const validateForm = () =>{
    if(visData.nomeFuncionario === ''){
      setModalMessageError("Preencha o nome")
      setOpenModalError(true)
      return false;
    }
    if(regex.test(visData.nomeFuncionario) === true){
      setModalMessageError("Preencha o nome apenas com letras")
      setOpenModalError(true)
      return false;
    }

    if(visData.sexo === ''){
      setModalMessageError("Preencha o sexo")
      setOpenModalError(true)
      return false;
    }

    if(visData.dataNasc === ''){
      setModalMessageError("Peencha a data de nascimento")
      setOpenModalError(true)
      return false;
    }

    if(visData.estadoAtual === ''){
      setModalMessageError("Preencha o estado")
      setOpenModalError(true)
      return false;
    }

    if(visData.nacionalidade.trim() === ''){
      setModalMessageError("Preencha a nacionalidade")
      setOpenModalError(true)
      return false;
    }
    if(regex.test(visData.nacionalidade) === true){
      setModalMessageError("Preencha a nacionalidade apenas com letras")
      setOpenModalError(true)
      return false;
    }

    if(visData.naturalidade.trim() === ''){
      setModalMessageError("Preencha a naturalidade")
      setOpenModalError(true)
      return false;
    }
    if(regex.test(visData.naturalidade) === true){
      setModalMessageError("Preencha a naturalidade apenas com letras")
      setOpenModalError(true)
      return false;
    }

    if(visData.raca === ''){
      setModalMessageError("Preencha a raça")
      setOpenModalError(true)
      return false;
    }

    if(visData.telefone.trim() === ''){
      setModalMessageError("Digite o telefone")
      setOpenModalError(true)
      return false;
    }

    if(visData.nomePai.trim() === ''){
      setModalMessageError("Preencha o nome do pai")
      setOpenModalError(true)
      return false;
    }
    if(regex.test(visData.nomePai) === true){
      setModalMessageError("Preencha o nome do pai apenas com letras")
      setOpenModalError(true)
      return false;
    }

    if(visData.nomeMae.trim() === ''){
      setModalMessageError("Preencha o nome da mãe")
      setOpenModalError(true)
      return false;
    }
    if(regex.test(visData.nomeMae) === true){
      setModalMessageError("Preencha o nome da mãe apenas com letras")
      setOpenModalError(true)
      return false;
    }

    if(visData.estadoCivil === ''){
      setModalMessageError("Preencha o Estado Civil")
      setOpenModalError(true)
      return false;
    }

    if(visData.filhos === ''){
      setModalMessageError("Preencha a quantidade de filhos")
      setOpenModalError(true)
      return false;
    }

    if(visData.cpf.trim() === ''){
      setModalMessageError("Preencha o CPF")
      setOpenModalError(true)
      return false;
    }

    if(visData.pisPasep.trim() === ''){
      setModalMessageError("Preencha o PIS/PASEP")
      setOpenModalError(true)
      return false;
    }

    if(visData.rg.trim() === ''){
      setModalMessageError("Preencha o RG")
      setOpenModalError(true)
      return false;
    }

    if(visData.rgDataExped.trim() === ''){
      setModalMessageError("Preencha a data de expedição do RG")
      setOpenModalError(true)
      return false;
    }

    if(visData.rgOrgaoExped.trim() === ''){
      setModalMessageError("Preencha o orgão de expedição do RG")
      setOpenModalError(true)
      return false;
    }

    if(visData.rgUf.trim() === ''){
      setModalMessageError("Preencha a UF do RG")
      setOpenModalError(true)
      return false;
    }

    if(visData.titulo.trim() === ''){
      setModalMessageError("Preencha o Título")
      setOpenModalError(true)
      return false;
    }

    if(visData.tituloZona.trim() === ''){
      setModalMessageError("Preencha a zona do título")
      setOpenModalError(true)
      return false;
    }

    if(visData.tituloSecao.trim() === ''){
      setModalMessageError("Preencha a seção do título")
      setOpenModalError(true)
      return false;
    }

    if(visData.tituloUf.trim() === ''){
      setModalMessageError("Preencha a UF do título")
      setOpenModalError(true)
      return false;
    }

    if(visData.bairro.trim() === ''){
      setModalMessageError("Preencha o Bairro")
      setOpenModalError(true)
      return false;
    }

    if(visData.numCasa.trim() === ''){
      setModalMessageError("Preencha o número da casa")
      setOpenModalError(true)
      return false;
    }

    if(visData.cep.trim() === ''){
      setModalMessageError("Preencha o CEP")
      setOpenModalError(true)
      return false;
    }

    if(visData.logadouro.trim() === ''){
      setModalMessageError("Preencha o Logadouro")
      setOpenModalError(true)
      return false;
    }

    if(visData.banco.trim() === ''){
      setModalMessageError("Preencha o nome do banco")
      setOpenModalError(true)
      return false;
    }
    if(regex.test(visData.banco) === true){
      setModalMessageError("Preencha o nome do banco apenas com letras")
      setOpenModalError(true)
      return false;
    }

    if(visData.bancoAgencia.trim() === ''){
      setModalMessageError("Preencha a agência do banco")
      setOpenModalError(true)
      return false;
    }

    if(visData.bancoConta.trim() === ''){
      setModalMessageError("Preencha a conta do banco")
      setOpenModalError(true)
      return false;
    }

    if(visData.escolaridade.trim() === ''){
      setModalMessageError("Preencha a Escolaridade")
      setOpenModalError(true)
      return false;
    }

    if(visData.cursos.trim() === ''){
      setModalMessageError("Preencha a quantidade de cursos")
      setOpenModalError(true)
      return false;
    }

    if(visData.vinculo.trim() === ''){
      setModalMessageError("Preencha o Vínculo")
      setOpenModalError(true)
      return false;
    }

    if(visData.setorDepartamento.trim() === ''){
      setModalMessageError("Preencha o Setor/Departamento")
      setOpenModalError(true)
      return false;
    }

    if(visData.cargoFuncao.trim() === ''){
      setModalMessageError("Preencha o Cargo/Função")
      setOpenModalError(true)
      return false;
    }

    if(visData.cargoEfetivo.trim() === ''){
      setModalMessageError("Preencha o Cargo Efetivo")
      setOpenModalError(true)
      return false;
    }

    if(visData.statusServidor.trim() === ''){
      setModalMessageError("Preencha o Status do servidor")
      setOpenModalError(true)
      return false;
    }

    if(visData.matriculaOrigem.trim() === ''){
      setModalMessageError("Preencha a Matrícula de Origem")
      setOpenModalError(true)
      return false;
    }

    if(visData.orgaoOrigem.trim() === ''){
      setModalMessageError("Preencha o Orgão de origem")
      setOpenModalError(true)
      return false;
    }

    if(visData.matriculaEmpresa.trim() === ''){
      setModalMessageError(t('Preencha a Matrícula {sigla}', { sigla: EMPRESA.sigla }))
      setOpenModalError(true)
      return false;
    }

    if(visData.cursos.trim() === ''){
      setModalMessageError("Preencha a quantidade de cursos")
      setOpenModalError(true)
      return false;
    }

    if(visData.dataEntregaDocs.trim() === ''){
      setModalMessageError("Preencha a Data de entrega dos documentos")
      setOpenModalError(true)
      return false;
    }
    return true
  }

  const submitForm = async () => {
    const isValidInputs = validateForm();

    if(!isValidInputs){
      return;
    }

    const emptyInputs = (value) =>{
      return value === '' ? 'Não Possui' : value;
    }

    const emptyInputsCpf = (value) =>{
      return value.trim() === '' ? '000.000.000-00' : value;
    }

    const emptyInputsDate = (value) =>{
      if (!value || typeof value !== 'string') return '1111-01-01';
      return value.trim() === '' ? '1111-01-01' : value;
    }

    console.log(visData.idFuncionario)

    const formData = new FormData();
    formData.append('idFuncionario', visData.idFuncionario);
    formData.append('nomeFuncionario', visData.nomeFuncionario);

    formData.append('sexo', visData.sexo)
    formData.append('dataNasc', visData.dataNasc)
    formData.append('estadoAtual', visData.estadoAtual)
    formData.append('nacionalidade', visData.nacionalidade)
    formData.append('naturalidade', visData.naturalidade)
    formData.append('raca', visData.raca)
    formData.append('telefone', visData.telefone)
    formData.append('email', visData.email)

    formData.append('nomePai', visData.nomePai)
    formData.append('cpfPai', emptyInputsCpf(visData.cpfPai))
    formData.append('dataNascPai', emptyInputsDate(visData.dataNascPai))
    formData.append('nomeMae', visData.nomeMae)
    formData.append('cpfMae', emptyInputsCpf(visData.cpfMae))
    formData.append('dataNascMae', emptyInputsDate(visData.dataNascMae))
    formData.append('estadoCivil', visData.estadoCivil)
    formData.append('nomeEsposoa', emptyInputs(visData.nomeEsposoa))
    formData.append('filhos', visData.filhos)
    formData.append('nomeFilhos', emptyInputs(visData.nomeFilhos))

    formData.append('cpf', visData.cpf)
    formData.append('pisPasep', visData.pisPasep)
    formData.append('cnh', emptyInputs(visData.cnh))
    formData.append('rg', visData.rg)
    formData.append('rgDataExped', visData.rgDataExped)
    formData.append('rgOrgaoExped', visData.rgOrgaoExped)
    formData.append('rgUf', visData.rgUf)
    formData.append('titulo', visData.titulo)
    formData.append('tituloZona', visData.tituloZona)
    formData.append('tituloSecao', visData.tituloSecao)
    formData.append('tituloUf', visData.tituloUf)
    formData.append('docMilitar', emptyInputs(visData.docMilitar))
    formData.append('docMilitarSerie', emptyInputs(visData.docMilitarSerie))

    formData.append('bairro', visData.bairro)
    formData.append('numCasa', visData.numCasa)
    formData.append('cep', visData.cep)
    formData.append('rua', visData.rua)
    formData.append('logadouro', visData.logadouro)
    formData.append('estadoSelecionado', visData.estadoSelecionado)
    formData.append('cidadeSelecionada', visData.cidadeSelecionada)

    formData.append('banco', visData.banco)
    formData.append('bancoAgencia', visData.bancoAgencia)
    formData.append('bancoConta', visData.bancoConta)

    formData.append('escolaridade', visData.escolaridade)
    formData.append('cursos', visData.cursos)
    formData.append('curso1', emptyInputs(visData.curso1))
    formData.append('curso2', emptyInputs(visData.curso2))
    formData.append('curso3', emptyInputs(visData.curso3))
    formData.append('curso4', emptyInputs(visData.curso4))

    formData.append('vinculo', visData.vinculo)
    formData.append('setorDepartamento', visData.setorDepartamento)
    formData.append('cargoFuncao', visData.cargoFuncao)
    formData.append('cargoEfetivo', emptyInputs(visData.cargoEfetivo))
    formData.append('statusServidor', visData.statusServidor)
    formData.append('matriculaOrigem', visData.matriculaOrigem)
    formData.append('orgaoOrigem', visData.orgaoOrigem)
    formData.append('matriculaEmpresa', visData.matriculaEmpresa)
    formData.append('dataEntregaDocs', emptyInputsDate(visData.dataEntregaDocs))
    formData.append('anotacoes', emptyInputs(visData.anotacoes))

    console.log(formData)


    //TODO: SEND TO BACKEND
    try{
      console.log("Enviando requisição...");
      const response = await Axios.post(`${endpoint}/editRegister`, formData, {
        headers: { 
          "Content-Type": 'multipart/form-data', 
        }
      });

      console.log(response.data)
      const formDatas = new FormData();
      formDatas.append('idFuncionario', visData.idFuncionario)
      formDatas.append('nomeFuncionario', visData.nomeFuncionario);
      formDatas.append('nomeAntigo', funcionario.nomeFuncionario)

      if(imagem) {
        formDatas.append('imagem', imagem)
      }

      if(files.length > 0){
        files.forEach(file =>{
          formDatas.append('pdfs', file);
        });
      } 
      
      console.log("📝 PDFs enviados:", files);
      files.forEach(f => console.log(f.name));
      const uploadRes = await Axios.post(`${endpoint}/uploadsEdit`, formDatas, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log("Resposta do upload:", uploadRes.data);

      const edicao = `Editou registro ${visData.nomeFuncionario}`
      const resLogEdit = await Axios.post(`${endpoint}/logEdicao`, {
        nomeUsuario: usuario,
        nomeFuncionario: edicao
      });


      if(uploadRes.status && response.status && resLogEdit.status === 200){
        setOpenModal(true);
        setModalMessage("Funcionário editado com sucesso");
      } else if (uploadRes.status || response.status || resLogEdit.status !== 200){
        setOpenModalError(true)
        setModalMessageError("Ocorreu um erro ao editar, tente novamente");
      }
    } catch(err){
      setModalMessageError("Ocorreu um erro ao editar, tente novamente");
      console.error("Erro:", err);
    }
  }


  return (
    <div className={styles.container_register}>
      <Header title={t('Editar Dados')} links={[{ to: '/registro', label: 'Registrar Funcionário' }, { to: '/historico', label: 'Histórico de Funcionários' }]} />

      <div className={styles.container_record}>
        <div className={styles.record}>
          {/***TODO: INPUT IMAGEM***/}
          <form className={styles.foto} method='post' encType='multipart/form-data'>
            <input
              name='imagem'
              ref={inputRef} 
              alt=''
              onError={handleImageError}
              multiple
              type='file' 
              accept='image/*' 
              onChange={handleImageChange}
              style={{ display: 'none' }}>
            </input>
            
            <img 
              src={selectedImage || imageUrl} 
              alt='' 
              onError={handleImageError} // Caso ocorra erro no carregamento da imagem
            />
            <button type='button' onClick={() => inputRef.current?.click()}><Paperclip size={25}/></button>
          </form>

          <div className={styles.inputs}>
            {/***TODO: INPUT DADOS PESSOAIS***/}
            <form className={styles.form_dados_pessoais} autoComplete='off' method='post' encType='multipart/form-data'>
              <div className={styles.form_group}>
                <div className={styles.div_input}>
                  <label for="nome">{t('Nome Completo:')}</label>
                  <input 
                    className={styles.input_nome} 
                    type='text' 
                    id='nome' 
                    name='nomeFuncionario' 
                    autoFocus 
                    value={visData.nomeFuncionario} 
                    maxLength={120}
                    onChange={handleEditValue}>
                  </input>
                </div>

                <div className={styles.div_input}>
                  <label for="sexo">{t('Sexo:')}</label>
                  <select id="sexo" name='sexo' value={visData.sexo} onChange={handleEditValue}>
                    <option disabled={true} value="">{t('Selecione')}</option>
                    <option value="M">M</option>
                    <option value="F">F</option>
                    <option value="Outros">{t('Outros')}</option>
                    <option value="NI">{t('NI')}</option>
                  </select>
                </div>
              </div>

              <div className={styles.form_group}> 
                <div className={styles.div_input}>
                  <label for="data_nasc">{t('Data Nasc:')}</label>
                  <input 
                    type='date' 
                    id='data_nasc' 
                    name='dataNasc' 
                    value={visData.dataNasc} 
                    onChange={handleEditValue}>
                  </input>
                </div>

                <div className={styles.div_input}>
                  <label for="estadoAtual">{t('Estado:')}</label>
                  <select id='estadoAtual' name='estadoAtual' value={visData.estadoAtual} onChange={handleEditValue}>
                    <option disabled={true} value="">{t('Selecione')}</option>
                    <option value="AM">AM</option>
                    <option value="Outros">{t('Outros')}</option>
                  </select>
                </div>

                <div className={styles.div_input}>
                  <label for="nacionalidade">{t('Nacionalidade:')}</label>
                  <input 
                    className={styles.input_nacionalidade} 
                    type='text' 
                    id='nacionalidade' 
                    name='nacionalidade' 
                    maxLength={100}                    
                    value={visData.nacionalidade}
                    onChange={handleEditValue}>
                  </input>
                </div>
              </div>

              <div className={styles.form_group}>
                <div className={styles.div_input}>
                  <label for="Naturalidade">{t('Naturalidade:')}</label>
                  <input
                    className={styles.input_naturalidade} 
                    type='text' 
                    id='naturalidade' 
                    name='naturalidade' 
                    maxLength={100}                    
                    value={visData.naturalidade} 
                    onChange={handleEditValue}>
                  </input>
                </div>

                <div className={styles.div_input}>
                  <label for="raca">{t('Raça:')}</label>
                  <select id='raca' name='raca' value={visData.raca} onChange={handleEditValue}>
                    <option disabled={true} value="">{t('Selecione')}</option>
                    <option value="Branco">{t('Branco')}</option>
                    <option value="Pardo">{t('Pardo')}</option>
                    <option value="Preto">{t('Preto')}</option>
                    <option value="Amarelo">{t('Amarelo')}</option>
                    <option value="Indígena">{t('Indígena')}</option>
                    <option value="NI">{t('NI')}</option>
                  </select>
                </div>

                <div className={styles.div_input}>
                  <label for="telefone">{t('Telefone:')}</label>
                  <IMaskInput
                    mask="(00) 00000-0000"
                    id='telefone' 
                    name='telefone' 
                    value={visData.telefone}
                    onAccept={(value) => {
                      handleEditValue({
                        target: {
                          name: 'telefone',
                          value: value,
                        },
                      })
                    }}
                  />                
                </div>
              </div>

              <div className={styles.form_group}>
                <div className={styles.div_input}>
                  <label for="email">{t('Email:')}</label>
                  <input 
                    className={styles.input_email} 
                    type='email' 
                    id='email' 
                    name='email' 
                    value={visData.email} 
                    maxLength={50}
                    onChange={handleEditValue}>
                  </input>
                </div>
              </div>
            </form>


            {/***TODO: INPUT DADOS FAMILIARES***/}
            <form className={styles.form_dados_familiares} autoComplete='off' method='post' encType='multipart/form-data'>
              <div className={styles.divisoria}>
                <hr></hr>
                <span className={styles.title_divis}>{t('Dados Familiares')}</span>
              </div>

              <span className={styles.span}>{t('Pai')}</span>
              <div className={styles.form_group}>
                <div className={styles.div_input}>
                  <label for="nome_pai">{t('Nome Completo:')}</label>
                  <input 
                    className={styles.input_nome_pai} 
                    type='text' 
                    id='nome_pai' 
                    name='nomePai' 
                    value={visData.nomePai} 
                    maxLength={100}
                    onChange={handleEditValue}>
                  </input>
                </div>

                <div className={styles.div_input}>
                  <label for="cpf_pai">{t('CPF:')}</label>
                  <IMaskInput
                    id='cpf_pai' 
                    name='cpf_pai' 
                    mask="000.000.000-00"
                    value={visData.cpfPai}
                    onAccept={(value) => {
                      handleEditValue({
                        target: {
                          name: 'cpfPai',
                          value: value,
                        },
                      })
                    }}
                  /> 
                </div>

                <div className={styles.div_input}>
                  <label for="data_nasc">{t('Data Nasc:')}</label>
                  <input 
                    type='date' 
                    id='data_nasc_pai' 
                    name='dataNascPai' 
                    value={visData.dataNascPai}
                    onChange={handleEditValue}>
                  </input>
                </div>
              </div>

              <span className={styles.span}>{t('Mãe')}</span>
              <div className={styles.form_group} id={styles.form_group_mae}>
                <div className={styles.div_input}>
                  <label for="nome_mae">{t('Nome Completo:')}</label>
                  <input 
                    className={styles.input_nome_mae} 
                    type='text' 
                    id='nome_mae' 
                    name='nomeMae' 
                    value={visData.nomeMae} 
                    maxLength={100}
                    onChange={handleEditValue}>
                  </input>
                </div>

                <div className={styles.div_input}>
                  <label for="cpf_mae">{t('CPF:')}</label>
                  <IMaskInput
                    id='cpf_mae' 
                    name='cpf_mae' 
                    mask="000.000.000-00"
                    value={visData.cpfMae}
                    onAccept={(value) => {
                      handleEditValue({
                        target: {
                          name: 'cpfMae',
                          value: value,
                        },
                      })
                    }}
                  />
                </div>

                <div className={styles.div_input}>
                  <label for="data_nasc_mae">{t('Data Nasc:')}</label>
                  <input 
                    type='date' 
                    id='data_nasc_mae' 
                    name='dataNascMae' 
                    value={visData.dataNascMae} 
                    onChange={handleEditValue}>
                  </input>
                </div>
              </div>

              <div className={styles.form_group}>
                <div className={styles.div_input} id={styles.input_estado_civil}>
                  <label for="estado_civil">{t('Estado Civil:')}</label>
                  <select id='estado_civil' name='estadoCivil' value={visData.estadoCivil} onChange={handleEditValue}>
                    <option disabled={true} value="">{t('Selecione')}</option>
                      <option value="Solteiro">{t('Solteiro')}</option>
                      <option value="Casado">{t('Casado')}</option>
                      <option value="União Estável">{t('União Estável')}</option>
                      <option value="Separado">{t('Separado')}</option>
                      <option value="Divorciado">{t('Divorciado')}</option>
                      <option value="Viúvo">{t('Viúvo')}</option>
                      <option value="NI">{t('NI')}</option>
                  </select>
                </div>

                <div className={`${styles.div_input} ${visData.estadoCivil !== "Casado" || visData.estadoCivil === "" ? styles.disabled : ""}`}>
                  <label for="nome_esposoa">{t('Nome Cônjuge:')}</label>
                  <input 
                    className={styles.input_nome_esposoa} 
                    type='text' 
                    id='nome_esposoa' 
                    name='nomeEsposoa' 
                    value={visData.nomeEsposoa} 
                    maxLength={100}
                    disabled={visData.estadoCivil !== "Casado" || visData.setEstadoCivil === ""} 
                    onChange={handleEditValue}>
                  </input>
                </div>
              </div>

              <div className={styles.form_group}>
                <div className={styles.div_input} id={styles.input_filhos}>
                  <label for="filhos">{t('Filhos:')}</label>
                  <select id='filhos' name='filhos' value={visData.filhos} onChange={handleEditValue}>
                    <option disabled={true} value="">{t('Selecione')}</option>
                    <option value="0">0</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="Mais de 3">{t('Mais de 3')}</option>
                  </select>
                </div>

                <div className={`${styles.div_input} ${visData.filhos === "0" || visData.nomeFilhos === "" ? styles.disabled : ""}`}>
                  <label for="nome_filhos">{t('Nome Filhos:')}</label>
                  <input 
                    className={styles.input_nome_filhos} 
                    type='text' 
                    id='nome_filhos' 
                    name='nomeFilhos' 
                    value={visData.nomeFilhos} 
                    maxLength={250}
                    disabled={visData.filhos === "0" || visData.nomeFilhos === ""} 
                    onChange={handleEditValue}>
                  </input>
                </div>
              </div>
            </form>

            {/***TODO: INPUT DOCUMENTOS***/}
            <form className={styles.form_dados_documentos} autoComplete='off' method='post' encType='multipart/form-data'>
              <div className={styles.divisoria} id={styles.divis_docs}>
                <hr></hr>
                <span className={styles.title_divis}>{t('Documentos')}</span>
              </div>

              <div className={styles.form_group}>
                <div className={styles.div_input}>
                  <label for="cpf">{t('CPF:')}</label>
                  <IMaskInput
                    id='cpf' 
                    name='cpf' 
                    mask="000.000.000-00"
                    value={visData.cpf}
                    onAccept={(value) => {
                      handleEditValue({
                        target: {
                          name: 'cpf',
                          value: value,
                        },
                      })
                    }}
                  />
                </div>

                <div className={styles.div_input}>
                  <label for="pis_pasep">{t('PIS/PASEP:')}</label>
                  <input 
                    className={styles.input_pis_pasep} 
                    type='text' 
                    id='pis_pasep' 
                    name='pisPasep' 
                    value={visData.pisPasep} 
                    maxLength={15}
                    onChange={handleEditValue}>
                  </input>
                </div>

                <div className={styles.div_input}>
                  <label for="selectCnh">{t('Possui CNH?')}</label>
                  <select id='selectCnh' name='selectCnh' value={selectCnh} onChange={(e) => {setSelectCnh(e.target.value)}}>
                    <option value="Não">{t('Não')}</option>
                    <option value="Sim">{t('Sim')}</option>
                  </select>
                </div>

                <div className={`${styles.div_input} ${selectCnh === "Não" || selectCnh === "" ? styles.disabled : ""}`}>
                  <label for="cnh">{t('CNH:')}</label>
                  <input 
                    className={styles.input_cnh}
                    type='text' 
                    id='cnh' 
                    name='cnh' 
                    value={visData.cnh} 
                    maxLength={11}
                    disabled={selectCnh === "Não" || selectCnh === "" ? styles.disabled : ""}
                    onChange={handleEditValue}>
                  </input>
                </div>
              </div>

              <div className={styles.form_group}>
                <div className={styles.div_input}>
                  <label for="rg">{t('RG:')}</label>
                  <input 
                    className={styles.input_rg} 
                    type='text' 
                    id='rg' 
                    name='rg' 
                    value={visData.rg} 
                    maxLength={9}
                    onChange={handleEditValue}>
                  </input>
                </div>

                <div className={styles.div_input}>
                  <label for="rg_data_exped">{t('Data Exped:')}</label>
                  <input 
                    type='date' 
                    id='rg_data_exped' 
                    name='rgDataExped' 
                    value={visData.rgDataExped} 
                    onChange={handleEditValue}>
                  </input>
                </div>

                <div className={styles.div_input}>
                  <label for="rg_orgao_exped">{t('Orgão Exped:')}</label>
                  <select id='rg_orgao_exped' name='rgOrgaoExped' value={visData.rgOrgaoExped} onChange={handleEditValue}>
                    <option disabled={true} value="">{t('Selecione')}</option>
                    <option value="SSP/AM">{t('SSP/AM')}</option>
                    <option value="PC/AM">{t('PC/AM')}</option>
                    <option value="PM/AM">{t('PM/AM')}</option>
                    <option value="Detran/AM">{t('Detran/AM')}</option>
                    <option value="Outros">{t('Outros')}</option>
                    <option value="NI">{t('NI')}</option>
                  </select>
                </div>

                <div className={styles.div_input}>
                  <label for="rg_uf">{t('UF:')}</label>
                  <select id="rg_uf" name="rgUf" value={visData.rgUf} onChange={handleEditValue}>
                    <option disabled={true} value="">{t('Selecione:')}</option>
                    <option value="AM">AM</option>
                    <option value="AC">AC</option>
                    <option value="AL">AL</option>
                    <option value="AP">AP</option>
                    <option value="BA">BA</option>
                    <option value="CE">CE</option>
                    <option value="DF">DF</option>
                    <option value="ES">ES</option>
                    <option value="GO">GO</option>
                    <option value="MA">MA</option>
                    <option value="MT">MT</option>
                    <option value="MS">MS</option>
                    <option value="MG">MG</option>
                    <option value="PA">PA</option>
                    <option value="PB">PB</option>
                    <option value="PR">PR</option>
                    <option value="PE">PE</option>
                    <option value="PI">PI</option>
                    <option value="RJ">RJ</option>
                    <option value="RN">RN</option>
                    <option value="RS">RS</option>
                    <option value="RO">RO</option>
                    <option value="RR">RR</option>
                    <option value="SC">SC</option>
                    <option value="SP">SP</option>
                    <option value="SE">SE</option>
                    <option value="TO">TO</option>
                    <option value="NI">{t('NI')}</option>
                  </select>
                </div>
              </div>

              <div className={styles.form_group}>
                <div className={styles.div_input}>
                  <label for="titulo">{t('Título:')}</label>
                  <input 
                    className={styles.input_titulo} 
                    type='text' 
                    id='titulo' 
                    name='titulo' 
                    value={visData.titulo} 
                    maxLength={15}
                    onChange={handleEditValue}>
                  </input>
                </div>

                <div className={styles.div_input}>
                  <label for="titulo_zona">{t('Zona:')}</label>
                  <input 
                    className={styles.input_titulo_zona} 
                    type='text' 
                    id='titulo_zona'
                    name='tituloZona' 
                    value={visData.tituloZona} 
                    maxLength={4}
                    onChange={handleEditValue}>
                  </input>
                </div>

                <div className={styles.div_input}>
                  <label for="titulo_secao">{t('Seção:')}</label>
                  <input 
                    className={styles.input_titulo_secao} 
                    type='text' 
                    id='titulo_secao' 
                    name='tituloSecao' 
                    value={visData.tituloSecao} 
                    maxLength={5}
                    onChange={handleEditValue}>
                  </input>
                </div>

                <div className={styles.div_input}>
                  <label for="titulo_uf">{t('UF:')}</label>
                  <select id="titulo_uf" name="tituloUf" value={visData.tituloUf} onChange={handleEditValue}>
                    <option disabled={true} value="">{t('Selecione:')}</option>
                    <option value="AM">AM</option>
                    <option value="AC">AC</option>
                    <option value="AL">AL</option>
                    <option value="AP">AP</option>
                    <option value="BA">BA</option>
                    <option value="CE">CE</option>
                    <option value="DF">DF</option>
                    <option value="ES">ES</option>
                    <option value="GO">GO</option>
                    <option value="MA">MA</option>
                    <option value="MT">MT</option>
                    <option value="MS">MS</option>
                    <option value="MG">MG</option>
                    <option value="PA">PA</option>
                    <option value="PB">PB</option>
                    <option value="PR">PR</option>
                    <option value="PE">PE</option>
                    <option value="PI">PI</option>
                    <option value="RJ">RJ</option>
                    <option value="RN">RN</option>
                    <option value="RS">RS</option>
                    <option value="RO">RO</option>
                    <option value="RR">RR</option>
                    <option value="SC">SC</option>
                    <option value="SP">SP</option>
                    <option value="SE">SE</option>
                    <option value="TO">TO</option>
                    <option value="NI">{t('NI')}</option>
                  </select>
                </div>

                <div className={styles.div_input}>
                  <label for="selectDocMilitar">{t('Possui Doc. Militar?')}</label>
                  <select id='selectDocMilitar' name='selectDocMilitar' value={selectDocMilitar} onChange={(e) => {setSelectDocMilitar(e.target.value)}}>
                    <option value="Não">{t('Não')}</option>
                    <option value="Sim">{t('Sim')}</option>
                  </select>
                </div>

                <div className={`${styles.div_input} ${selectDocMilitar === "Não" || selectDocMilitar === "" ? styles.disabled : ""}`}>
                  <label for="doc_militar">{t('Doc. Militar:')}</label>
                  <input
                    className={styles.input_doc_militar} 
                    type='text' 
                    id='doc_militar' 
                    name='docMilitar' 
                    value={visData.docMilitar} 
                    maxLength={15}
                    disabled={selectDocMilitar === "Não" || selectDocMilitar === "" ? styles.disabled : ""} 
                    onChange={handleEditValue}>
                  </input>
                </div>

                <div className={`${styles.div_input} ${selectDocMilitar === "Não" || selectDocMilitar === "" ? styles.disabled : ""}`}>
                  <label for="doc_militar_serie">{t('Série:')}</label>
                  <input 
                    className={styles.input_doc_militar_serie} 
                    type='text' 
                    id='doc_militar_serie' 
                    name='docMilitarSerie' 
                    value={visData.docMilitarSerie} 
                    maxLength={12}
                    disabled={selectDocMilitar === "Não" || selectDocMilitar === "" ? styles.disabled : ""} 
                    onChange={handleEditValue}>
                  </input>
                </div>
              </div>
            </form>

            {/***TODO: INPUT DADOS ENDEREÇO***/}
            <form className={styles.form_dados_endereco} autoComplete='off' method='post' encType='multipart/form-data'>
              <div className={styles.divisoria} id={styles.divis_docs}>
                <hr></hr>
                <span className={styles.title_divis}>{t('Endereço')}</span>
              </div>

              <div className={styles.form_group}>
                <div className={styles.div_input}>
                  <label for="bairro">{t('Bairro:')}</label>
                  <input
                    className={styles.input_bairro} 
                    type='text' 
                    id='bairro' 
                    name='bairro' 
                    value={visData.bairro} 
                    maxLength={50}
                    onChange={handleEditValue}>
                  </input>
                </div>

                <div className={styles.div_input}>
                  <label for="num_casa">{t('Número:')}</label>
                  <input 
                    className={styles.input_num_casa} 
                    type='text' 
                    id='num_casa' 
                    name='numCasa' 
                    value={visData.numCasa} 
                    maxLength={5}
                    onChange={handleEditValue}>
                  </input>
                </div>

                <div className={styles.div_input}>
                  <label for="cep">{t('CEP:')}</label>
                  <IMaskInput
                    id='cep' 
                    name='cep' 
                    mask="00000-000"
                    value={visData.cep}
                    onAccept={(value) => {
                      handleEditValue({
                        target: {
                          name: 'cep',
                          value: value,
                        },
                      })
                    }}
                  />
                </div>

                <div className={styles.div_input} id={styles.inptspan}>
                  <label for="rua">{t('Rua:')}</label>
                  <input 
                    type='text' 
                    id='rua' 
                    name='rua' 
                    value={visData.rua} 
                    maxLength={100}
                    onChange={handleEditValue}>
                  </input>
                </div>                

                <div className={styles.div_input}>
                  <label for="logadouro">{t('Logadouro:')}</label>
                  <select id='logadouro' name='logadouro' value={visData.logadouro} onChange={handleEditValue}>
                    <option disabled={true} value="">{t('Selecione')}</option>
                    <option value="Rua">{t('Rua')}</option>
                    <option value="Avenida">{t('Avenida')}</option>
                    <option value="Travessa">{t('Travessa')}</option>
                    <option value="Estrada">{t('Estrada')}</option>
                    <option value="Outros">{t('Outros')}</option>
                    <option value="NI">{t('NI')}</option>
                  </select>
                </div>
              </div>

              <div className={styles.form_group}>
                <div className={styles.div_input}>
                  <label for='estadoSelecionado'>{t('Estado:')}</label>
                  <select id="estadoSelecionado" name='estadoSelecionado' value={visData.estadoSelecionado} onChange={handleEstados}>
                    <option value="" disabled>{t('Selecione')}</option>
                    {Object.keys(estadosCidades).map(estado =>(
                      <option key={estado} value={estado}>{estado}</option>
                    ))}
                  </select>
                </div>

                <div className={styles.div_input}>
                  <label for="cidadeSelecionada">{t('Cidade')}</label>
                  <select id="cidadeSelecionada" name='cidadeSelecionada' value={visData.cidadeSelecionada} onChange={handleCidade}>
                    <option value="" disabled>{t('Selecione')}</option>
                    {cidades.map((cidade, index) =>(
                      <option key={index} value={cidade}>{cidade}</option>
                    ))}
                  </select>
                </div>
              </div>
            </form>

            {/***TODO: INPUT DADOS BANCÁRIOS***/}
             <form className={styles.form_dados_bancarios} autoComplete='off' method='post' encType='multipart/form-data'>
                <div className={styles.divisoria} id={styles.divis_docs}>
                  <hr></hr>
                  <span className={styles.title_divis}>{t('Dados Bancários')}</span>
                </div>

                <div className={styles.form_group}>
                  <div className={styles.div_input}>
                    <label for="banco">{t('Banco:')}</label>
                    <input
                      className={styles.input_banco} 
                      type='text' 
                      id='banco' 
                      name='banco' 
                      value={visData.banco} 
                      maxLength={80}
                      onChange={handleEditValue}>
                    </input>
                  </div>

                <div className={styles.div_input}>
                  <label for="banco_agencia">{t('Agência:')}</label>
                  <input 
                    className={styles.input_banco_agencia} 
                    type='text' 
                    id='banco_agencia' 
                    name='bancoAgencia' 
                    value={visData.bancoAgencia} 
                    maxLength={9}
                    onChange={handleEditValue}>
                  </input>
                </div>

                <div className={styles.div_input}>
                  <label for="banco_conta">{t('Conta:')}</label>
                  <input 
                    className={styles.input_banco_conta} 
                    type='text' 
                    id='banco_conta' 
                    name='bancoConta' 
                    value={visData.bancoConta} 
                    maxLength={20}
                    onChange={handleEditValue}>
                  </input>
                </div>
              </div>
            </form>

            {/***TODO: INPUT DADOS ESCOLARES***/}
            <form className={styles.form_dados_escolares} autoComplete='off' method='post' encType='multipart/form-data'>
              <div className={styles.divisoria} id={styles.divis_docs}>
                <hr></hr>
                <span className={styles.title_divis}>{t('Formação Escolar')}</span>
              </div>

              <div className={styles.form_group}>
                <div className={styles.div_input}>
                  <label for="escolaridade">{t('Escolaridade:')}</label>
                  <select id='escolaridade' name='escolaridade' value={visData.escolaridade} onChange={handleEditValue}>
                    <option disabled={true} value="">{t('Selecione')}</option>
                    <option value="Ensino Fundamental">{t('Ensino Fundamental')}</option>
                    <option value="Ensino Médio">{t('Ensino Médio')}</option>
                    <option value="Ensino Médio">{t('Ensino Médio')}</option>
                    <option value="EJA">{t('EJA')}</option>
                    <option value="Ensino Superior">{t('Ensino Superior')}</option>
                    <option value="Tecnólogo">{t('Tecnólogo')}</option>
                    <option value="Outros">{t('Outros')}</option>
                    <option value="NI">{t('NI')}</option>
                  </select>
                </div>

                <div className={styles.div_input}>
                  <label for="cursos">{t('cursos:')}</label>
                  <select id='cursos' name='cursos' value={visData.cursos} onChange={handleEditValue}>
                    <option disabled={true} value="">{t('Selecione')}</option>
                    <option value="0">0</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="Mais de 4">{t('Mais de 4')}</option>
                  </select>
                </div>

                <div className={`${styles.div_input} ${visData.cursos === "" || visData.cursos === "0" ? styles.disabled : ""}`}>
                  <label for="curso1">{t('Curso 1:')}</label>
                  <input 
                    className={styles.input_curso1} 
                    type='text' 
                    id='curso1' 
                    name='curso1' 
                    value={visData.curso1} 
                    maxLength={100}
                    disabled={visData.cursos === "" || visData.cursos === "0" ? styles.disabled : ""}
                    onChange={handleEditValue}>
                  </input> 
                </div>
              </div>

              <div className={styles.form_group}>
                <div className={`${styles.div_input} ${visData.cursos === "" || visData.cursos === "0" || visData.cursos === "1" ? styles.disabled : ""}`}>
                  <label for="curso2">{t('Curso 2:')}</label>
                  <input 
                    className={styles.input_curso2} 
                    type='text' 
                    id='curso2' 
                    name='curso2' 
                    value={visData.curso2} 
                    maxLength={100}
                    disabled={visData.cursos === "" || visData.cursos === "0" || visData.cursos === "1" ? styles.disabled : ""}
                    onChange={handleEditValue}>
                  </input>
                </div>

                <div className={`${styles.div_input} ${visData.cursos === "" || visData.cursos === "0" || visData.cursos === "1" || visData.cursos === "2" ? styles.disabled : ""}`}>
                  <label for="curso3">{t('Curso 3:')}</label>
                  <input 
                    className={styles.input_curso3} 
                    type='text' 
                    id='curso3' 
                    name='curso3' 
                    value={visData.curso3} 
                    maxLength={100}
                    disabled={visData.cursos === "" || visData.cursos === "0" || visData.cursos === "1" || visData.cursos === "2" ? styles.disabled : ""}
                    onChange={handleEditValue}>
                  </input>
                </div>
              </div>

              <div className={`${styles.div_input} ${visData.cursos === "" || visData.cursos === "0" || visData.cursos === "1" || visData.cursos === "2" || visData.cursos === "3" ? styles.disabled : ""}`}>
                <label for="curso4">{t('Curso 4:')}</label>
                <input 
                  className={styles.input_curso3} 
                  type='text' 
                  id='curso4' 
                  name='curso4' 
                  value={visData.curso4} 
                  maxLength={100}
                  disabled={visData.cursos === "" || visData.cursos === "0" || visData.cursos === "1" || visData.cursos === "2" || visData.cursos === "3" ? styles.disabled : ""}
                  onChange={handleEditValue}>
                </input>
              </div>
            </form>


            {/***TODO: INPUT DADOS VÍNCULO***/}
            <form className={styles.form_dados_vinculo} autoComplete='off' method='post' encType='multipart/form-data'>
              <div className={styles.divisoria} id={styles.divis_docs}>
                <hr></hr>
                <span className={styles.title_divis}>{t('Vínculo')}</span>
              </div>

              <div className={styles.form_group}>
                <div className={styles.div_input}>
                  <label for="vinculo">{t('Vínculo:')}</label>
                  <select id='vinculo' name='vinculo' value={visData.vinculo} onChange={handleEditValue}>
                    <option disabled={true} value="">{t('Selecione')}</option>
                    <option value="Cargo Comissionado">{t('Cargo Comissionado')}</option>
                    <option value="Estagiário(a)">{t('Estagiário(a)')}</option>
                    <option value="Temporário">{t('Temporário')}</option>
                    <option value="Efetivo">{t('Efetivo')}</option>
                    <option value="Outros">{t('Outros')}</option>
                  </select>
                </div>

                <div className={styles.div_input}>
                  <label for="setorDepartamento">{t('Setor/Departamento:')}</label>
                  <select id='setorDepartamento' name='setorDepartamento' value={visData.setorDepartamento} onChange={handleEditValue}>
                    <option disabled={true} value="">{t('Selecione')}</option>
                    <option value="Administrativo">{t('Administrativo')}</option>
                    <option value="Financeiro">{t('Financeiro')}</option>
                    <option value="Recursos Humanos">{t('Recursos Humanos')}</option>
                    <option value="Tecnologia da Informação">{t('Tecnologia da Informação')}</option>
                    <option value="Comercial">{t('Comercial')}</option>
                    <option value="Operações">{t('Operações')}</option>
                    <option value="Logística">{t('Logística')}</option>
                    <option value="Jurídico">{t('Jurídico')}</option>
                    <option value="Outros">{t('Outros')}</option>
                    <option value="NI">{t('NI')}</option>
                  </select>
                </div>

                <div className={styles.div_input}>
                  <label for="cargoFuncao">{t('Cargo/Função:')}</label>
                  <input 
                    className={styles.input_cargoFuncao} 
                    type='text' 
                    id='cargoFuncao' 
                    name='cargoFuncao' 
                    value={visData.cargoFuncao} 
                    maxLength={30}
                    onChange={handleEditValue}>
                  </input>
                </div>
              </div>

              <div className={styles.form_group}>
                <div className={styles.div_input}>
                  <label for="cargoEfetivo">{t('Cargo Efetivo:')}</label>
                  <input 
                    className={styles.input_cargoEfetivo} 
                    type='text' 
                    id='cargoEfetivo' 
                    name='cargoEfetivo' 
                    value={visData.cargoEfetivo} 
                    maxLength={30}
                    onChange={handleEditValue}>
                  </input>
                </div>
                  
                <div className={styles.div_input}>
                  <label for="status">{t('Status:')}</label>
                  <select id='status' name='statusServidor' value={visData.statusServidor} onChange={handleEditValue}>
                    <option disabled={true} value="">{t('Selecione')}</option>
                    <option value="Ativo">{t('Ativo')}</option>
                    <option value="Desligado">{t('Desligado')}</option>
                  </select>
                </div>

                <div className={styles.div_input}>
                  <label for="matriculaOrigem">{t('Matricula Origem:')}</label>
                  <input 
                    className={styles.input_matriculaOrigem} 
                    type='text' 
                    id='matriculaOrigem' 
                    name='matriculaOrigem' 
                    value={visData.matriculaOrigem} 
                    maxLength={15}
                    onChange={handleEditValue}>
                  </input>
                </div>
              </div>

              <div className={styles.form_group}>
                <div className={styles.div_input}>
                  <label for="orgaoOrigem">{t('Orgão Origem:')}</label>
                  <input 

                    className={styles.input_orgaoOrigem} 
                    type='text' 
                    id='orgaoOrigem' 
                    name='orgaoOrigem' 
                    value={visData.orgaoOrigem} 
                    maxLength={50}
                    onChange={handleEditValue}>
                  </input>
                </div>

                <div className={styles.div_input}>
                  <label for="matriculaEmpresa">{t('Matrícula {sigla}:', { sigla: EMPRESA.sigla })}</label>
                  <input 
                    className={styles.input_matriculaEmpresa} 
                    type='text' 
                    id='matriculaEmpresa' 
                    name='matriculaEmpresa' 
                    value={visData.matriculaEmpresa} 
                    maxLength={15}
                    onChange={handleEditValue}>
                  </input>
                </div>
              </div>
                  
              <div className={styles.form_group}>
                <div className={styles.div_input} id={styles.data_docs}>
                  <label for="dataEntregaDocs">{t('Data de entrega dos documentos:')}</label>
                  <input 
                    className={styles.input_data_docs}
                    type='date' 
                    id='dataEntregaDocs' 
                    name='dataEntregaDocs' 
                    value={visData.dataEntregaDocs} 
                    onChange={handleEditValue}>
                  </input>
                </div>
              </div>

              <div className={styles.form_group}>
                  <div className={styles.div_input} id={styles.anexoss}>
                    <label for="nome_anexos">{t('Anexos:')}</label>
                    <input
                     name='pdfs'
                     id={styles.input_files}
                     type='file'
                     accept='application/pdf'
                     multiple
                     onChange={handleFileChange}
                     >
                    </input>

                    <div className={styles.name_file2} id={styles.name_edit}>
                      {files.map((file, index) => (
                        <div key={index}>
                          <a href={urlApi(file.path)} target="_blank" rel="noopener noreferrer">
                            📄 {file.name} {index + 1}
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className={styles.div_input} id={styles.anotacoes_vis}>
                    <label for="anotacoes">{t('Anotações:')}</label>
                    <textarea 
                      className={styles.input_anotacoes} 
                      type='text' 
                      id='anotacoes' 
                      name='anotacoes' 
                      value={visData.anotacoes} 
                      onChange={handleEditValue}>
                    </textarea>
                </div>
              </div>

              <div className={styles.form_group} id={styles.anotacoes}>

              </div>
            </form>
          </div>
        </div>

        <button onClick={submitForm} className={styles.button_send}>{t('Salvar')}</button>
      </div>

      {/***TODO: MODALS***/}
      <Modal openModal={openModal} setOpenModal={setOpenModal} message={modalMessage} />
      <ModalError openModalError={openModalError} setOpenModalError={setOpenModalError} message={modalMessageError} />
    </div>
  )
}

export default Editar