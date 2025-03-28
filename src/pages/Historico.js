import React, { useEffect, useState } from 'react'
import styles from './styles.module.css'
import { Link } from 'react-router-dom'

import Person from '../components/Person'

import Modal from '../components/Modal'
import ModalError from '../components/ModalError'

import { FilterX } from 'lucide-react'

function Historico (){
  const [dataSeaiFuncionarios, setDataSeaiFuncionarios] = useState([])
  const [totalFunc, setTotalFunc] = useState(0)

  const [data, setData] = useState('')

  const [openModal, setOpenModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [openModalError, setOpenModalError] = useState(false);
  const [modalMessageError, setModalMessageError] = useState('');

  const[filtroNome, setFiltroNome] = useState('')
  const[filtroSexo, setFiltroSexo] = useState('')
  const[filtroSetorDepartamento, setfiltroSetorDepartamento] = useState('')
  const[filtroVinculo, setFiltroVinculo] = useState('')

  //TODO: GET TOTALFUNC AND TOTAL DATA
  useEffect(() =>{
    const dataSeaiFuncionarios = async() =>{
      const reqData = await fetch("http://localhost:5000/getRegisters")
      const resData = await reqData.json()

      setDataSeaiFuncionarios(resData)
    }
    dataSeaiFuncionarios()
  }, [])

  useEffect(() =>{
    const totalFunc = async() =>{
      const reqDatatot = await fetch("http://localhost:5000/getRegisterstot")
      const resDatatot = await reqDatatot.json()
      setTotalFunc(resDatatot.totalFunc)
    }
    totalFunc()
  }, [])

  //TODO: DELETE FUNC
  const deleteFunc = async (id, funcionario) =>{
    try{
      setOpenModalError(true)
      setModalMessageError(`O registro ${funcionario.nomeFuncionario} será excluido`)
      const res = await fetch(`http://localhost:5000/deleteRegister/${id}`, {
        method: 'DELETE',
      })
    
      if (res == 200) {
        setDataSeaiFuncionarios((prevData) => 
          prevData.filter((funcionario) => funcionario.idFuncionario !== id)
        );
        setOpenModal(true);
        setModalMessage("Funcionário excluido com sucesso");
      } 
    } catch (error) {
      console.error('Erro ao tentar excluir funcionário:', error);
    }
  }

  //TODO: FILTERS
  const filtro = dataSeaiFuncionarios.filter(funcionario =>{
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

  function modal(){
    setOpenModalError(true)
    setModalMessageError("O registro sera excluido ")
  }


  return (
    <div>
      <div className={styles.nav_register2}>
        <button onClick={modal}>modal</button>
        <div className={styles.navigation_bar2}>
          <div className={styles.nav_history}>
            <Link to={"/registro"} className={styles.link_register2}>Registrar Funcionário</Link>
            <h1 className={styles.link_history2}>Histórico Funcionários</h1>
          </div>

          <div className={styles.filters_history}>
            <div className={styles.totalFunc}>
              <span>Total de Funcionários: {totalFunc}</span>
            </div>

            <div className={styles.input_filters}>
              <input 
                className={styles.input_filters_nome}
                type='text'
                id='nome'
                name='nome'
                placeholder='Nome'
                maxLength={85}
                onChange={(e) => setFiltroNome(e.target.value)}
                value={filtroNome}
              />
            </div>

            <div className={styles.input_filters}>
              <select id='sexo' name='sexo' onChange={(e) => setFiltroSexo(e.target.value)} value={filtroSexo}>
                <option disabled={true} value="">Sexo</option>
                <option value="M">M</option>
                <option value="F">F</option>
                <option value="Outros">Outros</option>
                <option value="NI">NI</option>
                <option value="">-Limpar-</option>
              </select>
            </div>

            <div className={styles.input_filters}>
              <select id='setorDepartamento' name='setorDepartamento' onChange={(e) => setfiltroSetorDepartamento(e.target.value)} value={filtroSetorDepartamento}>
                <option disabled={true} value="">Setor/Departamento</option>
                <option value="Apoio Administrativo">Apoio Administrativo</option>
                <option value="Transporte">Transporte</option>
                <option value="Gabinete">Gabinete</option>
                <option value="Gerência de Análise">Gerência de Análise</option>
                <option value="Gerência de Operações">Gerência de Operações</option>
                <option value="Gerência de Contra Inteligência">Gerência de Contra Inteligência</option>
                <option value="Laboratório">Laboratório</option>
                <option value="Inteligência Cibernética">Inteligência Cibernética</option>
                <option value="Outros">Outros</option>
                <option value="">-Limpar-</option>
              </select>
            </div>

            <div className={styles.input_filters} onChange={(e) => setFiltroVinculo(e.target.value)} value={filtroVinculo}>
              <select id='vinculo' name='vinculo'>
                <option disabled={true} value="">Vínculo</option>
                <option value="Cargo Comissionado">Cargo Comissionado</option>
                <option value="Estagiário(a)">Estagiário(a)</option>
                <option value="Temporário">Temporário</option>
                <option value="Efetivo">Efetivo</option>
                <option value="">-Limpar-</option>
              </select>
            </div>

            <FilterX className={styles.filter_icon} size={30} onClick={clearFilters}></FilterX>
          </div>
        </div>

        <div className={styles.container_people}>
          {filtro.length > 0 ?(
            filtro.map((funcionario) =>(
              <Person key={funcionario.id} funcionario={funcionario} deleteFunc={deleteFunc} parenttochild={data}/>
            ))
          ) : (
            <p className={styles.error_msg}>Nenhum funcionário encontrado</p>
          )}
        </div>
      </div>
      
      <Modal isOpen={openModal} setIsOpen={setOpenModal} message={modalMessage} />
      <ModalError isOpen={openModalError} setIsOpen={setOpenModalError} message={modalMessageError}/>
    </div>
  )
}

export default Historico