import React, { useEffect, useState } from 'react'
import styles from './styles.module.css'
import Axios from 'axios'
import { useFuncionario } from './FuncionarioContext'

import Person from '../components/Person'

import Modal from '../components/Modal'
import ModalError from '../components/ModalError'

import { FilterX } from 'lucide-react'
import Header from '../components/Header'
import { useLanguage } from '../i18n/LanguageContext'
import { apiFetch } from '../api'

function Historico ({ funcionarios }){
  const { t } = useLanguage()
  const endpoint = process.env.REACT_APP_API_BASE_URL;

  const [dataFuncionarios, setDataFuncionarios] = useState([])
  const [totalFunc, setTotalFunc] = useState(0)

  const { usuario } = useFuncionario();

  const [data, setData] = useState('')

  const [deleteFuncionario, setDeleteFuncionario] = useState(null)
  const [filtros, setFiltros] = useState(funcionarios || [])

  const [openModal, setOpenModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [openModalError, setOpenModalError] = useState(false);
  const [modalMessageError, setModalMessageError] = useState('');
  const [reload, setReload] = useState(false);

  const[filtroNome, setFiltroNome] = useState('')
  const[filtroSexo, setFiltroSexo] = useState('')
  const[filtroSetorDepartamento, setfiltroSetorDepartamento] = useState('')
  const[filtroVinculo, setFiltroVinculo] = useState('')

  //TODO: GET TOTALFUNC AND TOTAL DATA
  useEffect(() =>{
    const fetchFuncionarios = async() =>{
      const reqData = await apiFetch(`${endpoint}/getRegisters`)
      const json = await reqData.json()
      const resData = Array.isArray(json) ? json : [] // erro (ex.: 401) vira lista vazia
      setDataFuncionarios(resData)
      setFiltros(resData || [])

      const reqTotal = await apiFetch(`${endpoint}/getRegisterstot`);
      const resTotal = await reqTotal.json();
      setTotalFunc(resTotal.totalFunc ?? 0);
    }
    fetchFuncionarios()
  }, [])

  //TODO: DELETE FUNC
  const handleOpenDeleteModal = (funcionario) =>{
    setDeleteFuncionario(funcionario)
    setOpenModalError(true)
    setModalMessageError(t('O registro {nome} será excluído', { nome: funcionario.nomeFuncionario }))
  }


  const confirmedDeleteFunc = async () =>{
    try{

      if(deleteFuncionario){
        const res = await apiFetch(`${endpoint}/deleteRegister/${deleteFuncionario.idFuncionario}`, {
          method: 'DELETE',
          headers: {
            'Content-type': 'application/json',
          },
          body: JSON.stringify({
            nome: deleteFuncionario.nomeFuncionario
          }),
        })

        const exclusao = `Excluiu registro ${deleteFuncionario.nomeFuncionario}`
        const resLogEdit = await Axios.post(`${endpoint}/logEdicao`, {
          nomeUsuario: usuario,
          nomeFuncionario: exclusao
        });
      
        if (res.status && resLogEdit.status === 200) {
            setOpenModalError(false)
            setOpenModal(true)
            setModalMessage(t('O registro {nome} foi excluído com sucesso', { nome: deleteFuncionario.nomeFuncionario }))
            setFiltros(prevFiltros => prevFiltros.filter(func => func.idFuncionario !== deleteFuncionario.idFuncionario));
            setTotalFunc(prevTotal => prevTotal -1)
        } else{
          setOpenModalError(true)
          setModalMessageError("falha ao excluir")
        }
      }
    } catch (error) {
      console.error('Erro ao tentar excluir funcionário:', error);
    }
  }

  //TODO: FILTERS
  const filtro = filtros.filter(funcionario =>{
    const nomeFunc = filtroNome ? funcionario.nomeFuncionario.toLowerCase().startsWith(filtroNome.toLocaleLowerCase()) : true
    const sexoFunc = filtroSexo ? funcionario.sexo.toLowerCase().startsWith(filtroSexo.toLocaleLowerCase()) : true
    const setorFunc = filtroSetorDepartamento ? funcionario.setorDepartamento.toLowerCase().startsWith(filtroSetorDepartamento.toLocaleLowerCase()) : true
    const vinculoFunc = filtroVinculo ? funcionario.vinculo.toLowerCase().startsWith(filtroVinculo.toLocaleLowerCase()) : true

    return nomeFunc & sexoFunc & setorFunc & vinculoFunc
  })

  function clearFilters(){
    setFiltroNome('')
    setFiltroSexo('')
    setfiltroSetorDepartamento('')
    setFiltroVinculo('')
  }


  return (
    <div>
      <Header />
      <div className={styles.page}>
        <div>

          <div className={styles.filters_history}>
            <div className={styles.totalFunc}>
              <span>{t('Total de Funcionários:')} {totalFunc}</span>
            </div>

            <div className={styles.input_filters}>
              <input 
                className={styles.input_filters_nome}
                type='text'
                id='nome'
                name='nome'
                placeholder={t('Nome')}
                maxLength={85}
                onChange={(e) => setFiltroNome(e.target.value)}
                value={filtroNome}
              />
            </div>

            <div className={styles.input_filters}>
              <select id='sexo' name='sexo' onChange={(e) => setFiltroSexo(e.target.value)} value={filtroSexo}>
                <option disabled={true} value="">{t('Sexo')}</option>
                <option value="M">M</option>
                <option value="F">F</option>
                <option value="Outros">{t('Outros')}</option>
                <option value="NI">{t('NI')}</option>
                <option value="">{t('-Limpar-')}</option>
              </select>
            </div>

            <div className={styles.input_filters}>
              <select id='setorDepartamento' name='setorDepartamento' onChange={(e) => setfiltroSetorDepartamento(e.target.value)} value={filtroSetorDepartamento}>
                <option disabled={true} value="">{t('Setor/Departamento')}</option>
                <option value="Administrativo">{t('Administrativo')}</option>
                <option value="Financeiro">{t('Financeiro')}</option>
                <option value="Recursos Humanos">{t('Recursos Humanos')}</option>
                <option value="Tecnologia da Informação">{t('Tecnologia da Informação')}</option>
                <option value="Comercial">{t('Comercial')}</option>
                <option value="Operações">{t('Operações')}</option>
                <option value="Logística">{t('Logística')}</option>
                <option value="Jurídico">{t('Jurídico')}</option>
                <option value="Outros">{t('Outros')}</option>
                <option value="">{t('-Limpar-')}</option>
              </select>
            </div>

            <div className={styles.input_filters}>
              <select id='vinculo' name='vinculo' onChange={(e) => setFiltroVinculo(e.target.value)} value={filtroVinculo}>
                <option disabled={true} value="">{t('Vínculo')}</option>
                <option value="Cargo Comissionado">{t('Cargo Comissionado')}</option>
                <option value="Estagiário(a)">{t('Estagiário(a)')}</option>
                <option value="Temporário">{t('Temporário')}</option>
                <option value="Efetivo">{t('Efetivo')}</option>
                <option value="">{t('-Limpar-')}</option>
              </select>
            </div>

            <button type='button' className={styles.filter_icon} onClick={clearFilters} title={t('Limpar filtros')}><FilterX size={20}/></button>
          </div>
        </div>

        <div className={styles.container_people}>
          {filtro.length > 0 ?(
            filtro.map((funcionario) =>(
              <Person key={funcionario.id} funcionario={funcionario} handleOpenDeleteModal={handleOpenDeleteModal} parenttochild={data}/>
            ))
          ) : (
            <p className={styles.error_msg}>{t('Nenhum funcionário encontrado')}</p>
          )}
        </div>
      </div>
      
      <Modal openModal={openModal} setOpenModal={setOpenModal} message={modalMessage} />
      <ModalError openModalError={openModalError} setOpenModalError={setOpenModalError} message={modalMessageError} reload={reload} onConfirm={confirmedDeleteFunc}/>
    </div>
  )
}

export default Historico