import React, { useState, useRef, useEffect } from 'react'
import styles from './styles.module.css'
import { Link } from 'react-router-dom'
import Axios from 'axios'
import { useFuncionario } from './FuncionarioContext'
import { IMaskInput } from 'react-imask';

import { Paperclip } from 'lucide-react'
import defaultImage from '../svg/icon-person.jpg'

import Modal from '../components/Modal'
import ModalError from '../components/ModalError'

const Editar = () =>{
  const endpoint = process.env.REACT_APP_API_BASE_URL;

  const { funcionario } = useFuncionario();
  const { usuario } = useFuncionario();
  const [imageUrl, setImageUrl] = useState(`${endpoint}/uploads/${funcionario.nomeFuncionario}/foto_${funcionario.nomeFuncionario}.avif`);

  const handleImageError = () =>{
    setImageUrl(defaultImage)
  }

  //ao retornar a data do banco de dados ela retornava, exemplo, como 4444-04-04T14:30:00.000Z(datetime) mesno que no banco de dados esteja como date e o input só aceita yyyy-mm-dd, entao para que o valor seja aceito pelo input esse valor do banco foi transformado para yyyy-mm-dd(4444-04-04)
  const formateDataInput = (date) =>{
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
    matriculaSeai: funcionario.matriculaSeai,
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
        matriculaSeai: funcionario.matriculaSeai,
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
      return
    }
    if(regex.test(visData.nomeFuncionario) === true){
      setModalMessageError("Preencha o nome apenas com letras")
      setOpenModalError(true)
      return
    }

    if(visData.sexo === ''){
      setModalMessageError("Preencha o sexo")
      setOpenModalError(true)
      return
    }

    if(visData.dataNasc === ''){
      setModalMessageError("Peencha a data de nascimento")
      setOpenModalError(true)
      return
    }

    if(visData.estadoAtual === ''){
      setModalMessageError("Preencha o estado")
      setOpenModalError(true)
      return
    }

    if(visData.nacionalidade.trim() === ''){
      setModalMessageError("Preencha a nacionalidade")
      setOpenModalError(true)
      return
    }
    if(regex.test(visData.nacionalidade) === true){
      setModalMessageError("Preencha a nacionalidade apenas com letras")
      setOpenModalError(true)
      return
    }

    if(visData.naturalidade.trim() === ''){
      setModalMessageError("Preencha a naturalidade")
      setOpenModalError(true)
      return
    }
    if(regex.test(visData.naturalidade) === true){
      setModalMessageError("Preencha a naturalidade apenas com letras")
      setOpenModalError(true)
      return
    }

    if(visData.raca === ''){
      setModalMessageError("Preencha a raça")
      setOpenModalError(true)
      return
    }

    if(visData.telefone.trim() === ''){
      setModalMessageError("Digite o telefone")
      setOpenModalError(true)
      return
    }

    if(visData.email.trim() === ''){
      setModalMessageError("Preencha o email")
      setOpenModalError(true)
      return
    }

    if(visData.nomePai.trim() === ''){
      setModalMessageError("Preencha o nome do pai")
      setOpenModalError(true)
      return
    }
    if(regex.test(visData.nomePai) === true){
      setModalMessageError("Preencha o nome do pai apenas com letras")
      setOpenModalError(true)
      return
    }

    if(visData.cpfPai.trim() === ''){
      setModalMessageError("Preencha o cpf do pai")
      setOpenModalError(true)
    }

    if(formatedDataNascPai.trim() === ''){
      setModalMessageError("Preencha a data de nascimento do pai")
      setOpenModalError(true)
    }

    if(visData.nomeMae.trim() === ''){
      setModalMessageError("Preencha o nome da mãe")
      setOpenModalError(true)
      return
    }
    if(regex.test(visData.nomeMae) === true){
      setModalMessageError("Preencha o nome da mãe apenas com letras")
      setOpenModalError(true)
      return
    }

    if(visData.cpfMae.trim() === ''){
      setModalMessageError("Preencha o cpf da mãe")
      setOpenModalError(true)
    }

    if(formatedDataNascMae.trim() === ''){
      setModalMessageError("Preencha a data de nascimento da mãe")
      setOpenModalError(true)
    }

    if(visData.estadoCivil === ''){
      setModalMessageError("Preencha o Estado Civil")
      setOpenModalError(true)
      return
    }

    if(visData.filhos === ''){
      setModalMessageError("Preencha a quantidade de filhos")
      setOpenModalError(true)
      return
    }

    if(visData.cpf.trim() === ''){
      setModalMessageError("Preencha o CPF")
      setOpenModalError(true)
    }

    if(visData.pisPasep.trim() === ''){
      setModalMessageError("Preencha o PIS/PASEP")
      setOpenModalError(true)
    }

    if(visData.rg.trim() === ''){
      setModalMessageError("Preencha o RG")
      setOpenModalError(true)
    }

    if(visData.rgDataExped.trim() === ''){
      setModalMessageError("Preencha a data de expedição do RG")
      setOpenModalError(true)
    }

    if(visData.rgOrgaoExped.trim() === ''){
      setModalMessageError("Preencha o orgão de expedição do RG")
      setOpenModalError(true)
    }

    if(visData.rgUf.trim() === ''){
      setModalMessageError("Preencha a UF do RG")
      setOpenModalError(true)
    }

    if(visData.titulo.trim() === ''){
      setModalMessageError("Preencha o Título")
      setOpenModalError(true)
    }

    if(visData.tituloZona.trim() === ''){
      setModalMessageError("Preencha a zona do título")
      setOpenModalError(true)
    }

    if(visData.tituloSecao.trim() === ''){
      setModalMessageError("Preencha a seção do título")
      setOpenModalError(true)
    }

    if(visData.tituloUf.trim() === ''){
      setModalMessageError("Preencha a UF do título")
      setOpenModalError(true)
    }

    if(visData.bairro.trim() === ''){
      setModalMessageError("Preencha o Bairro")
      setOpenModalError(true)
    }

    if(visData.numCasa.trim() === ''){
      setModalMessageError("Preencha o número da casa")
      setOpenModalError(true)
    }

    if(visData.cep.trim() === ''){
      setModalMessageError("Preencha o CEP")
      setOpenModalError(true)
    }

    if(visData.logadouro.trim() === ''){
      setModalMessageError("Preencha o Logadouro")
      setOpenModalError(true)
    }

    if(visData.banco.trim() === ''){
      setModalMessageError("Preencha o nome do banco")
      setOpenModalError(true)
    }
    if(regex.test(visData.banco) === true){
      setModalMessageError("Preencha o nome do banco apenas com letras")
      setOpenModalError(true)
    }

    if(visData.bancoAgencia.trim() === ''){
      setModalMessageError("Preencha a agência do banco")
      setOpenModalError(true)
    }

    if(visData.bancoConta.trim() === ''){
      setModalMessageError("Preencha a conta do banco")
      setOpenModalError(true)
    }

    if(visData.escolaridade.trim() === ''){
      setModalMessageError("Preencha a Escolaridade")
      setOpenModalError(true)
    }

    if(visData.cursos.trim() === ''){
      setModalMessageError("Preencha a quantidade de cursos")
      setOpenModalError(true)
    }

    if(visData.vinculo.trim() === ''){
      setModalMessageError("Preencha o Vínculo")
      setOpenModalError(true)
    }

    if(visData.setorDepartamento.trim() === ''){
      setModalMessageError("Preencha o Setor/Departamento")
      setOpenModalError(true)
    }

    if(visData.cargoFuncao.trim() === ''){
      setModalMessageError("Preencha o Cargo/Função")
      setOpenModalError(true)
    }

    if(visData.cargoEfetivo.trim() === ''){
      setModalMessageError("Preencha o Cargo Efetivo")
      setOpenModalError(true)
    }

    if(visData.statusServidor.trim() === ''){
      setModalMessageError("Preencha o Status do servidor")
      setOpenModalError(true)
    }

    if(visData.matriculaOrigem.trim() === ''){
      setModalMessageError("Preencha a Matrícula de Origem")
      setOpenModalError(true)
    }

    if(visData.orgaoOrigem.trim() === ''){
      setModalMessageError("Preencha o Orgão de origem")
      setOpenModalError(true)
    }

    if(visData.matriculaSeai.trim() === ''){
      setModalMessageError("Preencha a Matrícula SEAI")
      setOpenModalError(true)
    }

    if(visData.cursos.trim() === ''){
      setModalMessageError("Preencha a quantidade de cursos")
      setOpenModalError(true)
    }

    if(visData.dataEntregaDocs.trim() === ''){
      setModalMessageError("Preencha a Data de entrega dos documentos")
      setOpenModalError(true)
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
    formData.append('cpfPai', visData.cpfPai)
    formData.append('dataNascPai', visData.dataNascPai)
    formData.append('nomeMae', visData.nomeMae)
    formData.append('cpfMae', visData.cpfMae)
    formData.append('dataNascMae', visData.dataNascMae)
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
    formData.append('matriculaSeai', visData.matriculaSeai)
    formData.append('dataEntregaDocs', visData.dataEntregaDocs)
    formData.append('anotacoes', visData.anotacoes)

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
      <div className={styles.nav_edit}>
        <div className={styles.navigation_bar_edit}>
          <h1 className={styles.nav_history_edit}>Editar Dados</h1>
        </div>
      </div>

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
                  <label for="nome">Nome Completo:</label>
                  <input 
                    className={styles.input_nome} 
                    type='text' 
                    id='nome' 
                    name='nomeFuncionario' 
                    autoFocus 
                    value={visData.nomeFuncionario} 
                    maxLength={85}
                    onChange={handleEditValue}>
                  </input>
                </div>

                <div className={styles.div_input}>
                  <label for="sexo">Sexo:</label>
                  <select id="sexo" name='sexo' value={visData.sexo} onChange={handleEditValue}>
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
                    name='dataNasc' 
                    value={visData.dataNasc} 
                    onChange={handleEditValue}>
                  </input>
                </div>

                <div className={styles.div_input}>
                  <label for="estadoAtual">Estado:</label>
                  <select id='estadoAtual' name='estadoAtual' value={visData.estadoAtual} onChange={handleEditValue}>
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
                    value={visData.nacionalidade}
                    onChange={handleEditValue}>
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
                    value={visData.naturalidade} 
                    onChange={handleEditValue}>
                  </input>
                </div>

                <div className={styles.div_input}>
                  <label for="raca">Raça:</label>
                  <select id='raca' name='raca' value={visData.raca} onChange={handleEditValue}>
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
                  <label for="email">Email:</label>
                  <input 
                    className={styles.input_email} 
                    type='email' 
                    id='email' 
                    name='email' 
                    value={visData.email} 
                    maxLength={35}
                    onChange={handleEditValue}>
                  </input>
                </div>
              </div>
            </form>


            {/***TODO: INPUT DADOS FAMILIARES***/}
            <form className={styles.form_dados_familiares} autoComplete='off' method='post' encType='multipart/form-data'>
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
                    name='nomePai' 
                    value={visData.nomePai} 
                    maxLength={85}
                    onChange={handleEditValue}>
                  </input>
                </div>

                <div className={styles.div_input}>
                  <label for="cpf_pai">CPF:</label>
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
                  <label for="data_nasc">Data Nasc:</label>
                  <input 
                    type='date' 
                    id='data_nasc_pai' 
                    name='dataNascPai' 
                    value={visData.dataNascPai}
                    onChange={handleEditValue}>
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
                    name='nomeMae' 
                    value={visData.nomeMae} 
                    maxLength={85}
                    onChange={handleEditValue}>
                  </input>
                </div>

                <div className={styles.div_input}>
                  <label for="cpf_mae">CPF:</label>
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
                  <label for="data_nasc_mae">Data Nasc:</label>
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
                  <label for="estado_civil">Estado Civil:</label>
                  <select id='estado_civil' name='estadoCivil' value={visData.estadoCivil} onChange={handleEditValue}>
                    <option disabled={true} value="">Selecione</option>
                    <option value="Solteiro">Solteiro</option>
                    <option value="Casado">Casado</option>
                    <option value="Separado">Separado</option>
                    <option value="Divorciado">Divorciado</option>
                    <option value="Viúvo">Viúvo</option>
                  </select>
                </div>

                <div className={`${styles.div_input} ${visData.estadoCivil !== "Casado" || visData.estadoCivil === "" ? styles.disabled : ""}`}>
                  <label for="nome_esposoa">Nome Cônjuge:</label>
                  <input 
                    className={styles.input_nome_esposoa} 
                    type='text' 
                    id='nome_esposoa' 
                    name='nomeEsposoa' 
                    value={visData.nomeEsposoa} 
                    maxLength={85}
                    disabled={visData.estadoCivil !== "Casado" || visData.setEstadoCivil === ""} 
                    onChange={handleEditValue}>
                  </input>
                </div>
              </div>

              <div className={styles.form_group}>
                <div className={styles.div_input} id={styles.input_filhos}>
                  <label for="filhos">Filhos:</label>
                  <select id='filhos' name='filhos' value={visData.filhos} onChange={handleEditValue}>
                    <option disabled={true} value="">Selecione</option>
                    <option value="0">0</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                  </select>
                </div>

                <div className={`${styles.div_input} ${visData.filhos === "0" || visData.nomeFilhos === "" ? styles.disabled : ""}`}>
                  <label for="nome_filhos">Nome Filhos:</label>
                  <input 
                    className={styles.input_nome_filhos} 
                    type='text' 
                    id='nome_filhos' 
                    name='nomeFilhos' 
                    value={visData.nomeFilhos} 
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
                <span className={styles.title_divis}>Documentos</span>
              </div>

              <div className={styles.form_group}>
                <div className={styles.div_input}>
                  <label for="cpf">CPF:</label>
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
                  <label for="pis_pasep">PIS/PASEP:</label>
                  <input 
                    className={styles.input_pis_pasep} 
                    type='text' 
                    id='pis_pasep' 
                    name='pisPasep' 
                    value={visData.pisPasep} 
                    maxLength={14}
                    onChange={handleEditValue}>
                  </input>
                </div>

                <div className={styles.div_input}>
                  <select id='selectCnh' name='selectCnh' value={selectCnh} onChange={(e) => {setSelectCnh(e.target.value)}}>
                    <option value="Não">Não</option>
                    <option value="Sim">Sim</option>
                  </select>
                </div>

                <div className={`${styles.div_input} ${selectCnh === "Não" || selectCnh === "" ? styles.disabled : ""}`}>
                  <label for="cnh">CNH:</label>
                  <input 
                    className={styles.input_cnh}
                    type='number' 
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
                  <label for="rg">RG:</label>
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
                  <label for="rg_data_exped">Data Exped:</label>
                  <input 
                    type='date' 
                    id='rg_data_exped' 
                    name='rgDataExped' 
                    value={visData.rgDataExped} 
                    onChange={handleEditValue}>
                  </input>
                </div>

                <div className={styles.div_input}>
                  <label for="rg_orgao_exped">Orgão Exped:</label>
                  <select id='rg_orgao_exped' name='rgOrgaoExped' value={visData.rgOrgaoExped} onChange={handleEditValue}>
                    <option disabled={true} value="">Selecione</option>
                    <option value="SSP">SSP</option>
                    <option value="PC">PC</option>
                    <option value="PM">PM</option>
                    <option value="Detran">Detran</option>
                    <option value="Outros">Outros</option>
                  </select>
                </div>

                <div className={styles.div_input}>
                  <label for="rg_uf">UF:</label>
                  <select id="rg_uf" name="rgUf" value={visData.rgUf} onChange={handleEditValue}>
                    <option disabled={true} value="">Selecione:</option>
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
                  </select>
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
                    value={visData.titulo} 
                    maxLength={10}
                    onChange={handleEditValue}>
                  </input>
                </div>

                <div className={styles.div_input}>
                  <label for="titulo_zona">Zona:</label>
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
                  <label for="titulo_secao">Seção:</label>
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
                  <label for="titulo_uf">UF:</label>
                  <select id="titulo_uf" name="tituloUf" value={visData.tituloUf} onChange={handleEditValue}>
                    <option disabled={true} value="">Selecione:</option>
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
                  </select>
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
                    name='docMilitar' 
                    value={visData.docMilitar} 
                    maxLength={7}
                    disabled={selectDocMilitar === "Não" || selectDocMilitar === "" ? styles.disabled : ""} 
                    onChange={handleEditValue}>
                  </input>
                </div>

                <div className={`${styles.div_input} ${selectDocMilitar === "Não" || selectDocMilitar === "" ? styles.disabled : ""}`}>
                  <label for="doc_militar_serie">Série:</label>
                  <input 
                    className={styles.input_doc_militar_serie} 
                    type='text' 
                    id='doc_militar_serie' 
                    name='docMilitarSerie' 
                    value={visData.docMilitarSerie} 
                    maxLength={2}
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
                    value={visData.bairro} 
                    maxLength={50}
                    onChange={handleEditValue}>
                  </input>
                </div>

                <div className={styles.div_input}>
                  <label for="num_casa">Número:</label>
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
                  <label for="cep">CEP:</label>
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

                <div className={styles.div_input}>
                  <label for="logadouro">Logadouro:</label>
                  <select id='logadouro' name='logadouro' value={visData.logadouro} onChange={handleEditValue}>
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
                  <label for='estadoSelecionado'>Estado:</label>
                  <select id="estadoSelecionado" name='estadoSelecionado' value={visData.estadoSelecionado} onChange={handleEstados}>
                    <option value="" disabled>Selecione</option>
                    {Object.keys(estadosCidades).map(estado =>(
                      <option key={estado} value={estado}>{estado}</option>
                    ))}
                  </select>
                </div>

                <div className={styles.div_input}>
                  <label for="cidadeSelecionada">Cidade</label>
                  <select id="cidadeSelecionada" name='cidadeSelecionada' value={visData.cidadeSelecionada} onChange={handleCidade}>
                    <option value="" disabled>Selecione</option>
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
                      value={visData.banco} 
                      maxLength={55}
                      onChange={handleEditValue}>
                    </input>
                  </div>

                <div className={styles.div_input}>
                  <label for="banco_agencia">Agência:</label>
                  <input 
                    className={styles.input_banco_agencia} 
                    type='text' 
                    id='banco_agencia' 
                    name='bancoAgencia' 
                    value={visData.bancoAgencia} 
                    maxLength={6}
                    onChange={handleEditValue}>
                  </input>
                </div>

                <div className={styles.div_input}>
                  <label for="banco_conta">Conta:</label>
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
                <span className={styles.title_divis}>Formação Escolar</span>
              </div>

              <div className={styles.form_group}>
                <div className={styles.div_input}>
                  <label for="escolaridade">Escolaridade:</label>
                  <select id='escolaridade' name='escolaridade' value={visData.escolaridade} onChange={handleEditValue}>
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
                  <select id='cursos' name='cursos' value={visData.cursos} onChange={handleEditValue}>
                    <option disabled={true} value="">Selecione</option>
                    <option value="0">0</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                  </select>
                </div>

                <div className={`${styles.div_input} ${visData.cursos === "" || visData.cursos === "0" ? styles.disabled : ""}`}>
                  <label for="curso1">Curso 1:</label>
                  <input 
                    className={styles.input_curso1} 
                    type='text' 
                    id='curso1' 
                    name='curso1' 
                    value={visData.curso1} 
                    maxLength={70}
                    disabled={visData.cursos === "" || visData.cursos === "0" ? styles.disabled : ""}
                    onChange={handleEditValue}>
                  </input> 
                </div>
              </div>

              <div className={styles.form_group}>
                <div className={`${styles.div_input} ${visData.cursos === "" || visData.cursos === "0" || visData.cursos === "1" ? styles.disabled : ""}`}>
                  <label for="curso2">Curso 2:</label>
                  <input 
                    className={styles.input_curso2} 
                    type='text' 
                    id='curso2' 
                    name='curso2' 
                    value={visData.curso2} 
                    maxLength={70}
                    disabled={visData.cursos === "" || visData.cursos === "0" || visData.cursos === "1" ? styles.disabled : ""}
                    onChange={handleEditValue}>
                  </input>
                </div>

                <div className={`${styles.div_input} ${visData.cursos === "" || visData.cursos === "0" || visData.cursos === "1" || visData.cursos === "2" ? styles.disabled : ""}`}>
                  <label for="curso3">Curso 3:</label>
                  <input 
                    className={styles.input_curso3} 
                    type='text' 
                    id='curso3' 
                    name='curso3' 
                    value={visData.curso3} 
                    maxLength={70}
                    disabled={visData.cursos === "" || visData.cursos === "0" || visData.cursos === "1" || visData.cursos === "2" ? styles.disabled : ""}
                    onChange={handleEditValue}>
                  </input>
                </div>
              </div>

              <div className={`${styles.div_input} ${visData.cursos === "" || visData.cursos === "0" || visData.cursos === "1" || visData.cursos === "2" || visData.cursos === "3" ? styles.disabled : ""}`}>
                <label for="curso4">Curso 4:</label>
                <input 
                  className={styles.input_curso3} 
                  type='text' 
                  id='curso4' 
                  name='curso4' 
                  value={visData.curso4} 
                  maxLength={70}
                  disabled={visData.cursos === "" || visData.cursos === "0" || visData.cursos === "1" || visData.cursos === "2" || visData.cursos === "3" ? styles.disabled : ""}
                  onChange={handleEditValue}>
                </input>
              </div>
            </form>


            {/***TODO: INPUT DADOS VÍNCULO***/}
            <form className={styles.form_dados_vinculo} autoComplete='off' method='post' encType='multipart/form-data'>
              <div className={styles.divisoria} id={styles.divis_docs}>
                <hr></hr>
                <span className={styles.title_divis}>Vínculo</span>
              </div>

              <div className={styles.form_group}>
                <div className={styles.div_input}>
                  <label for="vinculo">Vínculo:</label>
                  <select id='vinculo' name='vinculo' value={visData.vinculo} onChange={handleEditValue}>
                    <option disabled={true} value="">Selecione</option>
                    <option value="Cargo Comissionado">Cargo Comissionado</option>
                    <option value="Estagiário(a)">Estagiário(a)</option>
                    <option value="Temporário">Temporário</option>
                    <option value="Efetivo">Efetivo</option>
                  </select>
                </div>

                <div className={styles.div_input}>
                  <label for="setorDepartamento">Setor/Departamento:</label>
                  <select id='setorDepartamento' name='setorDepartamento' value={visData.setorDepartamento} onChange={handleEditValue}>
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
                    value={visData.cargoFuncao} 
                    maxLength={20}
                    onChange={handleEditValue}>
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
                    value={visData.cargoEfetivo} 
                    maxLength={60}
                    onChange={handleEditValue}>
                  </input>
                </div>
                  
                <div className={styles.div_input}>
                  <label for="status">Status:</label>
                  <select id='status' name='statusServidor' value={visData.statusServidor} onChange={handleEditValue}>
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
                    value={visData.matriculaOrigem} 
                    maxLength={15}
                    onChange={handleEditValue}>
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
                    value={visData.orgaoOrigem} 
                    maxLength={65}
                    onChange={handleEditValue}>
                  </input>
                </div>

                <div className={styles.div_input}>
                  <label for="matriculaSeai">Matricula SEAI:</label>
                  <input 
                    className={styles.input_matriculaSeai} 
                    type='text' 
                    id='matriculaSeai' 
                    name='matriculaSeai' 
                    value={visData.matriculaSeai} 
                    maxLength={12}
                    onChange={handleEditValue}>
                  </input>
                </div>
              </div>
                  
              <div className={styles.form_group}>
                <div className={styles.div_input} id={styles.data_docs}>
                  <label for="dataEntregaDocs">Data de entrega dos documentos:</label>
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
                    <label for="nome_anexos">Anexos:</label>
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
                          <a href={`${endpoint}/${file.path}`} target="_blank" rel="noopener noreferrer">
                            📄 {file.name} {index + 1}
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className={styles.div_input} id={styles.anotacoes_vis}>
                    <label for="anotacoes">Anotações:</label>
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

        <button onClick={submitForm} className={styles.button_send}>Salvar</button>
      </div>

      {/***TODO: MODALS***/}
      <Modal openModal={openModal} setOpenModal={setOpenModal} message={modalMessage} />
      <ModalError openModalError={openModalError} setOpenModalError={setOpenModalError} message={modalMessageError} />
    </div>
  )
}

export default Editar