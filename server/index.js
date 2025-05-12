const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require('body-parser');
const multer = require('multer');
const fs = require('fs');
const path = require("path");
require('dotenv').config()

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json({ limit: '700mb' }));
app.use(express.urlencoded({ extended: true, limit: "700mb" }));
app.use(bodyParser.json());

const uploadDirectory = path.join(__dirname, 'uploads')

if (!fs.existsSync(uploadDirectory)){
    fs.mkdirSync(uploadDirectory, { recursive: true })
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const nome = req.body.nomeFuncionario || req.body.nome;
      const nomeAntigo = req.body.nomeAntigo;
  
      if (!nome) {
        return cb(new Error("Nome do funcionário não fornecido."), null);
      }
  
      const uploadDirectory = path.join(__dirname, 'uploads');
      const oldPath = nomeAntigo ? path.join(uploadDirectory, nomeAntigo) : null;
      const newPath = path.join(uploadDirectory, nome);
      console.log('📂 Salvando em pasta:', newPath);
  
      if (nomeAntigo && nomeAntigo !== nome && fs.existsSync(oldPath)) {
        try {
          fs.renameSync(oldPath, newPath);
        } catch (error) {
          return cb(error, null);
        }
      }
  
      fs.mkdir(newPath, { recursive: true }, (err) => {
        if (err) return cb(err, null);
        cb(null, newPath);
      });
    },
  
    filename: (req, file, cb) => {
        const nome = req.body.nomeFuncionario || req.body.nome;
        const originalName = path.basename(file.originalname);
        const fileExtension = path.extname(originalName).toLowerCase();
        const baseName = path.basename(originalName, fileExtension);
      
        let fileName;
        if (file.mimetype === "application/pdf") {
          fileName = `doc_${nome}_${Date.now()}_${baseName}${fileExtension}`;
        } else {
          fileName = `foto_${nome}.avif`;
        }
      
        console.log('➡️ Salvando arquivo:', fileName);
        cb(null, fileName);  
    }
  });
  


const upload = multer({ storage: storage, limits: { fileSize: 500 * 1024 * 1024 } });

app.use('/uploads', express.static(uploadDirectory))

const db = mysql.createConnection({
    host: "localhost",
    user: "dev",
    password: "123456",
    database: "seaifuncionariosdev",
    port: "3307"
});
db.connect((err) => {
    if (err) {
        console.error("Erro ao conectar com o banco de dados:", err);
        return;
    }
    console.log("⚯  Conectado ao banco de dados ⚯\n");
});


//TODO: CREATE
app.post("/cadastrar", (req, res) =>{
    console.log("Body recebido:", req.body);
    const { nome, sexo, data_nasc, estadoAtual, nacionalidade, naturalidade, raca, telefone, email, 
        nomePai, cpfPai, dataNascPai, nomeMae, cpfMae, dataNascMae, estadoCivil, nomeEsposoa, filhos, nomeFilhos,
        cpf, pisPasep, cnh, rg, rgDataExped, rgOrgaoExped, rgUf, titulo, tituloZona, tituloSecao, tituloUf, docMilitar, docMilitarSerie,
        bairro, numCasa, cep, logadouro, estadoSelecionado, cidadeSelecionada,
        banco, bancoAgencia, bancoConta,
        escolaridade, cursos, curso1, curso2, curso3, curso4,
        vinculo, setorDepartamento, cargoFuncao, cargoEfetivo, statusServidor, matriculaOrigem, orgaoOrigem, matriculaSeai, dataEntregaDocs, anotacoes
    } = req.body;

    db.beginTransaction((err) =>{
        if(err){
            console.log("erro ao iniciar transação")
        }
    })

    let sqlFuncionario = "INSERT INTO funcionario(nomeFuncionario) VALUES (?)";
    db.query(sqlFuncionario, [nome], (err, result) =>{
        if (err) {
            return db.rollback(() =>{
                console.log("Erro ao cadastrar funcionario:", err);
                res.status(500).send("Erro ao cadastrar funcionário");
            })
        }

        let idFuncionario = result.insertId;
        console.log("● Dados recebidos (formatado):", JSON.stringify(req.body, null, 2));
        console.log(`*idFuncionario rota cadastro: ${idFuncionario}*`)

        let sqlPessoais = "INSERT INTO dadospessoais(idFuncionario, sexo, dataNasc, estadoAtual, nacionalidade, naturalidade, raca, telefone, email) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        db.query(sqlPessoais, [idFuncionario, sexo, data_nasc, estadoAtual, nacionalidade, naturalidade, raca, telefone, email], (err, result) =>{
            if (err) {
                return db.rollback(() =>{
                    console.log("Erro ao cadastrar dados pessoais:", err);
                    result.status(500).send("Erro ao cadastrar dados pessoais");
                })
            } else{
                console.log("-Dados pessoais cadastrados com sucesso");
            }

            let sqlFamiliares = "INSERT INTO dadosfamiliares(idFuncionario, nomePai, cpfPai, dataNascPai, nomeMae, cpfMae, dataNascMae, estadoCivil, nomeEsposoA, filhos, nomeFilhos) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            db.query(sqlFamiliares, [idFuncionario, nomePai, cpfPai, dataNascPai, nomeMae, cpfMae, dataNascMae, estadoCivil, nomeEsposoa, filhos, nomeFilhos], (err, result) =>{
                if (err) {
                    return db.rollback(() =>{
                        console.log("Erro ao cadastrar dados familiares:", err);
                        result.status(500).send("Erro ao cadastrar dados familiares");
                    })
                } else{
                    console.log("-Dados familiares cadastrados com sucesso");
                }

                let sqlDocumentos = "INSERT INTO dadosdocumentos(idFuncionario, cpf, pisPasep, cnh, rg, rgDataExped, rgOrgaoExped, rgUf, titulo, tituloZona, tituloSecao, tituloUf, docMilitar, docMilitarSerie) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                db.query(sqlDocumentos, [idFuncionario, cpf, pisPasep, cnh, rg, rgDataExped, rgOrgaoExped, rgUf, titulo, tituloZona, tituloSecao, tituloUf, docMilitar, docMilitarSerie], (err, result) =>{
                    if (err) {
                        return db.rollback(() =>{
                            console.log("Erro ao cadastrar dados documentos:", err);
                            result.status(500).send("Erro ao cadastrar dados documentos");
                        })
                    } else{
                        console.log("-Dados documentos cadastrados com sucesso");
                    }

                    let sqlEndereco = "INSERT INTO dadosendereco(idFuncionario, bairro, numCasa, cep, logadouro, estado, cidade) VALUES (?, ?, ?, ?, ?, ?, ?)";
                    db.query(sqlEndereco, [idFuncionario, bairro, numCasa, cep, logadouro, estadoSelecionado, cidadeSelecionada], (err, result) =>{
                        if (err) {
                            return db.rollback(() =>{
                                console.log("Erro ao cadastrar dados endereço:", err);
                                result.status(500).send("Erro ao cadastrar dados endereço");
                            })
                        } else{
                            console.log("-Dados endereço cadastrados com sucesso");
                        }

                        let sqlDadosBancarios = "INSERT INTO dadosbancarios(idFuncionario, banco, bancoAgencia, bancoConta) VALUES (?, ?, ?, ?)";
                        db.query(sqlDadosBancarios, [idFuncionario, banco, bancoAgencia, bancoConta], (err, result) =>{
                            if (err) {
                                return db.rollback(() =>{
                                    console.log("Erro ao cadastrar dados bancários:", err);
                                    result.status(500).send("Erro ao cadastrar dados bancários");
                                })
                            } else{
                                console.log("-Dados bancários cadastrados com sucesso");
                            }

                            let sqlformacaoEscolar = "INSERT INTO dadosescolaridade(idFuncionario, escolaridade, cursos, curso1, curso2, curso3, curso4) VALUES (?, ?, ?, ?, ?, ?, ?)";
                            db.query(sqlformacaoEscolar, [idFuncionario, escolaridade, cursos, curso1, curso2, curso3, curso4], (err, result) =>{
                                if (err) {
                                    return db.rollback(() =>{
                                        console.log("Erro ao cadastrar dados escolares:", err);
                                        result.status(500).send("Erro ao cadastrar dados escolares");
                                    })
                                } else{
                                    console.log("-Dados escolares cadastrados com sucesso");
                                }

                                let sqlVinculo = "INSERT INTO dadosvinculo(idFuncionario, vinculo, setorDepartamento, cargoFuncao, cargoEfetivo, statusServidor, matriculaOrigem, orgaoOrigem, matriculaSeai, dataEntregaDocs, anotacoes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                                db.query(sqlVinculo, [idFuncionario, vinculo, setorDepartamento, cargoFuncao, cargoEfetivo, statusServidor, matriculaOrigem, orgaoOrigem, matriculaSeai, dataEntregaDocs, anotacoes], (err, result) =>{
                                    if (err) {
                                        return db.rollback(() =>{
                                            console.log("Erro ao cadastrar dados vínculo:", err);
                                            result.status(500).send("Erro ao cadastrar dados vínculo");
                                        })
                                    } else{
                                        console.log("-Dados vínculo cadastrados com sucesso\n");
                                    }
                                })

                                db.commit((err) => {
                                    if (err) {
                                        return db.rollback(() => {
                                            console.error("Erro ao finalizar a transação:", err);
                                            res.status(500).send("Erro ao finalizar a transação.");
                                        });
                                    }
                                    console.log("✔ Cadastro realizado com sucesso ✔\n");
                                    //res.status(200).send("Cadastro realizado com sucesso");
                                    res.status(200).json({ idFuncionario: idFuncionario })
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});

/*
app.post("/uploads", upload.fields([{ name: 'imagem' }, { name: 'pdfs', maxCount: 50 }]), (req, res) =>{
    const { idFuncionario } = req.body
    const nome = req.body.nomeFuncionario || req.body.nome;

    const pasta = path.join('uploads', nome);

    const imagemPath = path.join(pasta, req.files['imagem'][0].filename);
    const pdfsPath = req.files['pdfs'].map(file => path.join(pasta, file.filename));
    const originalNames = req.files['pdfs'].map(file => file.originalname);
  
    const query = "INSERT INTO documentos (idFuncionario, originalFileNames, filePath, imagePath) VALUES (?, ?, ?, ?)";
    db.query(query, [
      idFuncionario,
      JSON.stringify(originalNames),
      JSON.stringify(pdfsPath),
      imagemPath
    ], (err, result) => {
      if (err) {
        console.error("Erro ao salvar documentos:", err);
        return res.status(500).json({ message: 'Erro ao salvar no banco de dados', error: err });
      }
      res.status(200).json({ message: 'Arquivos enviados e salvos no banco de dados', result });
    });
});
*/

app.post("/uploads", upload.fields([{ name: 'imagem' }, { name: 'pdfs', maxCount: 50 }]), (req, res) =>{
    const { idFuncionario } = req.body
    const nome = req.body.nomeFuncionario || req.body.nome;

    let imagemPath = null;
    const pasta = path.join('uploads', nome);
    
    if (req.files && req.files['imagem'] && req.files['imagem'][0]) {
      imagemPath = path.join(pasta, req.files['imagem'][0].filename);
    }
    const pdfsPath = req.files['pdfs'].map(file => path.join(pasta, file.filename));
    const originalNames = req.files['pdfs'].map(file => file.originalname);

    const query = "INSERT INTO documentos (idFuncionario, originalFileNames, filePath, imagePath) VALUES (?, ?, ?, ?)";
    db.query(query, [idFuncionario, JSON.stringify(originalNames), JSON.stringify(pdfsPath), imagemPath], (err, result) => {
        if (err) {
          return res.status(500).json({ message: 'Erro ao salvar no banco de dados', error: err });
        }
        res.status(200).json({ message: 'Arquivos enviados e salvos no banco de dados', result });
    });
})

app.post("/cadastrarUsuario", (req, res) =>{
    console.log("Body recebido:", req.body);
    const { nomeUsuario, senhaUsuario, tipoAcesso, } = req.body;

    db.beginTransaction((err) =>{
        if(err){
            console.log("erro ao iniciar transação")
        }
    })

    let sqlUsuarios = "INSERT INTO usuarios(nomeUsuario, senhaUsuario, tipoAcesso) VALUES (?, ?, ?)";
    db.query(sqlUsuarios, [nomeUsuario, senhaUsuario, tipoAcesso], (err, result) =>{
        if (err) {
            return db.rollback(() =>{
                console.log("Erro ao cadastrar usuário:", err);
                res.status(500).send("Erro ao cadastrar usuArio");
            })
        }

        db.commit((err) => {
            if (err) {
                return db.rollback(() => {
                    console.error("Erro ao finalizar a transação:", err);
                    res.status(500).send("Erro ao finalizar a transação.");
                });
            }
            console.log("✔ Usuário cadastrado com sucesso ✔\n");
            //res.status(200).send("Cadastro realizado com sucesso");
            res.status(200).json({ message: 'Usuário cadastrado com sucesso', result })
        });
    })
})

//TODO: READ
app.get("/getRegisters", (req, res) =>{
    const dbData = 
    ` SELECT 
        fun.idFuncionario,
        fun.nomeFuncionario,
        
        dp.sexo,
        dp.dataNasc,
        dp.estadoAtual,
        dp.nacionalidade,
        dp.naturalidade,
        dp.raca,
        dp.telefone,
        dp.email,
        
        dfam.nomePai,
        dfam.cpfPai,
        dfam.dataNascPai,
        dfam.nomeMae,
        dfam.cpfMae,
        dfam.dataNascMae,
        dfam.estadoCivil,
        dfam.nomeEsposoA,
        dfam.filhos,
        dfam.nomeFilhos,
        
        dd.cpf,
        dd.pisPasep,
        dd.cnh,
        dd.rg,
        dd.rgDataExped,
        dd.rgOrgaoExped,
        dd.rgUf,
        dd.titulo,
        dd.tituloZona,
        dd.tituloSecao,
        dd.tituloUf,
        dd.docMilitar,
        dd.docMilitarSerie,
        
        de.bairro,
        de.numCasa,
        de.cep,
        de.logadouro,
        de.estado,
        de.cidade,
        
        dbc.banco,
        dbc.bancoAgencia,
        dbc.bancoConta,
        
        dfe.escolaridade,
        dfe.cursos,
        dfe.curso1,
        dfe.curso2,
        dfe.curso3,
        dfe.curso4,

        dv.vinculo,
        dv.setorDepartamento,
        dv.cargoFuncao,
        dv.cargoEfetivo,
        dv.statusServidor,
        dv.matriculaOrigem,
        dv.orgaoOrigem,
        dv.matriculaSeai,
        dv.dataEntregaDocs,
        dv.anotacoes

      FROM funcionario f
      JOIN funcionario fun ON f.idFuncionario = fun.idFuncionario
      JOIN dadospessoais dp ON f.idFuncionario = dp.idFuncionario
      JOIN dadosfamiliares dfam ON f.idFuncionario = dfam.idFuncionario
      JOIN dadosdocumentos dd ON f.idFuncionario = dd.idFuncionario
      JOIN dadosendereco de ON f.idFuncionario = de.idFuncionario
      JOIN dadosbancarios dbc ON f.idFuncionario = dbc.idFuncionario
      JOIN dadosescolaridade dfe ON f.idFuncionario = dfe.idFuncionario
      JOIN dadosvinculo dv ON f.idFuncionario = dv.idFuncionario;
    `

    db.query(dbData, (err, data) =>{
        if (err) {
            return res.status(500).json({ error: 'Erro ao consultar banco' });
        }
        return res.json(data)
    })
})

app.get('/getFiles/:idFuncionario', (req, res) =>{
    const idFuncionario = req.params.idFuncionario

    const query = 'SELECT filePath, originalFileNames FROM documentos WHERE idFuncionario = ?'
    db.query(query, [idFuncionario], (err, result) =>{
        if(err){
            return res.status(500).json({ message: 'Erro ao recuperar arquivos', error: err })
        }
        res.json(result)
    })
})

app.get('/getImage/:idFuncionario', (req, res) =>{
    const idFuncionario = req.params.idFuncionario

    const query = 'SELECT imagePath FROM documentos WHERE idFuncionario = ?'
    db.query(query, [idFuncionario], (err, result) =>{
        if(err){
            return res.status(500).json({ message: 'Erro ao recuperar imagem', error: err })
        }
        res.json(result[0].imagePath)
    })
})

app.get("/getRegisterstot", (req, res) =>{
    const dbDatatot = `
        SELECT COUNT(*) AS totalFunc FROM funcionario;
    `

    db.query(dbDatatot, (err, datatot) =>{
        if (err) {
            return res.status(500).json({ error: 'Erro ao consultar banco' });
        }

        const restot = {
            totalFunc: datatot[0]?.totalFunc || 0
        }

        return res.json(restot)
    })
})

app.get("/getLogsLogin", (req, res) =>{
    const dbLogsLogin = `
    SELECT nomeUsuario, DATE_FORMAT(dataLogin,'%e/%m/%y') AS dataLogin, TIME_FORMAT(horaLogin, '%H:%i:%s') AS horaLogin FROM logslogin;
    `

    db.query(dbLogsLogin, (err, result) =>{
        if (err) {
            return res.status(500).json({ error: 'Erro ao consultar logs de login' });
        }

        return res.json(result)
    })
})

app.get("/getLogsEdit", (req, res) =>{
    const dbLogsEdit = `
    SELECT nomeUsuario, DATE_FORMAT(dataEdit,'%e/%m/%y') AS dataEdit, registroEditado, TIME_FORMAT(horaEdit, '%H:%i:%s') AS horaEdit FROM logsedicao;
    `

    db.query(dbLogsEdit, (err, response) =>{
        if (err) {
            return res.status(500).json({ error: 'Erro ao consultar logs de edição' });
        }

        return res.json(response)
    })
})

app.post("/validateUser", (req, res) =>{
    const { usuario, senha } = req.body

    const validateUser = `
        SELECT * FROM usuarios 
        WHERE nomeUsuario = ? AND senhaUsuario = ? AND tipoAcesso = 'ADM'
        LIMIT 1;
    `;

    db.query(validateUser, [usuario, senha], (err, result) =>{
        if (result.length > 0) {
            return res.status(200).json({ success: true, message: 'Usuário ADM validado' });
        } else {
            return res.status(401).json({ success: false, message: 'Usuário não autorizado' });
        }
    })
})


//TODO: UPDATE
app.post("/editRegister", upload.none(), (req, res) =>{
    console.log("Body recebido:", req.body);
    const { idFuncionario, nomeFuncionario, sexo, dataNasc, estadoAtual, nacionalidade, naturalidade, raca, telefone, email, 
        nomePai, cpfPai, dataNascPai, nomeMae, cpfMae, dataNascMae, estadoCivil, nomeEsposoa, filhos, nomeFilhos,
        cpf, pisPasep, cnh, rg, rgDataExped, rgOrgaoExped, rgUf, titulo, tituloZona, tituloSecao, tituloUf, docMilitar, docMilitarSerie,
        bairro, numCasa, cep, logadouro, estadoSelecionado, cidadeSelecionada,
        banco, bancoAgencia, bancoConta,
        escolaridade, cursos, curso1, curso2, curso3, curso4,
        vinculo, setorDepartamento, cargoFuncao, cargoEfetivo, statusServidor, matriculaOrigem, orgaoOrigem, matriculaSeai, dataEntregaDocs, anotacoes
    } = req.body;

    
    if (!idFuncionario) {
        console.log("ID do funcionário obrigatório");
        return res.status(400).json({ message: "ID do funcionário obrigatório" });
    }

    db.beginTransaction((err) =>{
        if(err){
            console.log("erro ao iniciar transação")
        }
    })

    let sqlFuncionario = "UPDATE funcionario SET nomeFuncionario = ? WHERE idFuncionario = ?";
    db.query(sqlFuncionario, [nomeFuncionario, idFuncionario], (err, result) =>{
        if (err) {
            return db.rollback(() =>{
                console.log("Erro ao atualizar funcionario:", err);
                res.status(500).send("Erro ao atualizar funcionário");
            })
        }

        let sqlPessoais = "UPDATE dadospessoais SET sexo = ?, dataNasc = ?, estadoAtual = ?, nacionalidade = ?, naturalidade = ?, raca = ?, telefone = ?, email = ? WHERE idFuncionario = ?";
        db.query(sqlPessoais, [sexo, dataNasc, estadoAtual, nacionalidade, naturalidade, raca, telefone, email, idFuncionario], (err, result) =>{
            if (err) {
                return db.rollback(() =>{
                    console.log("Erro ao atualizar dados pessoais:", err);
                    result.status(500).send("Erro ao atualizar dados pessoais");
                })
            } else{
                console.log("-Dados pessoais editados com sucesso");
            }

            let sqlFamiliares = "UPDATE dadosfamiliares SET nomePai = ?, cpfPai = ?, dataNascPai = ?, nomeMae = ?, cpfMae = ?, dataNascMae = ?, estadoCivil = ?, nomeEsposoA = ?, filhos = ?, nomeFilhos = ? WHERE idFuncionario = ?";
            db.query(sqlFamiliares, [nomePai, cpfPai, dataNascPai, nomeMae, cpfMae, dataNascMae, estadoCivil, nomeEsposoa, filhos, nomeFilhos, idFuncionario], (err, result) =>{
                if (err) {
                    return db.rollback(() =>{
                        console.log("Erro ao atualizar dados familiares:", err);
                        result.status(500).send("Erro ao atualizar dados familiares");
                    })
                } else{
                    console.log("-Dados familiares editados com sucesso");
                }

                let sqlDocumentos = "UPDATE dadosdocumentos SET cpf = ?, pisPasep = ?, cnh = ?, rg = ?, rgDataExped = ?, rgOrgaoExped = ?, rgUf = ?, titulo = ?, tituloZona = ?, tituloSecao = ?, tituloUf = ?, docMilitar = ?, docMilitarSerie = ? WHERE idFuncionario = ?";
                db.query(sqlDocumentos, [cpf, pisPasep, cnh, rg, rgDataExped, rgOrgaoExped, rgUf, titulo, tituloZona, tituloSecao, tituloUf, docMilitar, docMilitarSerie, idFuncionario], (err, result) =>{
                    if (err) {
                        return db.rollback(() =>{
                            console.log("Erro ao atualizar dados documentos:", err);
                            result.status(500).send("Erro ao atualizar dados documentos");
                        })
                    } else{
                        console.log("-Dados documentos editados com sucesso");
                    }

                    let sqlEndereco = "UPDATE dadosendereco SET bairro = ?, numCasa = ?, cep = ?, logadouro = ?, estado = ?, cidade = ? WHERE idFuncionario = ?";
                    db.query(sqlEndereco, [bairro, numCasa, cep, logadouro, estadoSelecionado, cidadeSelecionada, idFuncionario], (err, result) =>{
                        if (err) {
                            return db.rollback(() =>{
                                console.log("Erro ao atualizar dados endereço:", err);
                                result.status(500).send("Erro ao atualizar dados endereço");
                            })
                        } else{
                            console.log("-Dados endereço editados com sucesso");
                        }

                        let sqlDadosBancarios = "UPDATE dadosbancarios SET banco = ?, bancoAgencia = ?, bancoConta = ? WHERE idFuncionario = ?";
                        db.query(sqlDadosBancarios, [banco, bancoAgencia, bancoConta, idFuncionario], (err, result) =>{
                            if (err) {
                                return db.rollback(() =>{
                                    console.log("Erro ao atualizar dados bancários:", err);
                                    result.status(500).send("Erro ao atualizar dados bancários");
                                })
                            } else{
                                console.log("-Dados bancários editados com sucesso");
                            }

                            let sqlformacaoEscolar = "UPDATE dadosescolaridade SET escolaridade = ?, cursos = ?, curso1 = ?, curso2 = ?, curso3 = ?, curso4 = ? WHERE idFuncionario = ?";
                            db.query(sqlformacaoEscolar, [escolaridade, cursos, curso1, curso2, curso3, curso4, idFuncionario], (err, result) =>{
                                if (err) {
                                    return db.rollback(() =>{
                                        console.log("Erro ao atualizar dados escolares:", err);
                                        result.status(500).send("Erro ao atualizar dados escolares");
                                    })
                                } else{
                                    console.log("-Dados escolares editados com sucesso");
                                }

                                let sqlVinculo = "UPDATE dadosvinculo SET vinculo = ?, setorDepartamento = ?, cargoFuncao = ?, cargoEfetivo = ?, statusServidor = ?, matriculaOrigem = ?, orgaoOrigem = ?, matriculaSeai = ?, dataEntregaDocs = ?, anotacoes = ? WHERE idFuncionario = ?";
                                db.query(sqlVinculo, [vinculo, setorDepartamento, cargoFuncao, cargoEfetivo, statusServidor, matriculaOrigem, orgaoOrigem, matriculaSeai, dataEntregaDocs, anotacoes, idFuncionario], (err, result) =>{
                                    if (err) {
                                        return db.rollback(() =>{
                                            console.log("Erro ao atualizar dados vínculo:", err);
                                            result.status(500).send("Erro ao atualizar dados vínculo");
                                        })
                                    } else{
                                        console.log("-Dados vínculo editados com sucesso\n");
                                    }
                                })

                                db.commit((err) => {
                                    if (err) {
                                        return db.rollback(() => {
                                            console.error("Erro ao finalizar a transação:", err);
                                            res.status(500).send("Erro ao finalizar a transação.");
                                        });
                                    }
                                    console.log("✔ Cadastro realizado com sucesso ✔\n");
                                    //res.status(200).send("Cadastro realizado com sucesso");
                                    res.status(200).json({ idFuncionario: idFuncionario })
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});

app.post("/uploadsEdit", upload.fields([{ name: 'imagem' }, { name: 'pdfs', maxCount: 50 }]), (req, res) => {
    console.log('👀 req.files front:', req.files);
    console.log('🧾 req.body front:', req.body);
  
    const { idFuncionario, nomeFuncionario, nomeAntigo } = req.body;
    const nomeNovo = nomeFuncionario || req.body.nome;
  
    if (!idFuncionario || !nomeNovo) {
      return res.status(400).json({ message: 'ID ou nome do funcionário ausente' });
    }
  
    const pastaBase = path.join(__dirname, 'uploads');
    const pastaAntiga = nomeAntigo ? path.join(pastaBase, nomeAntigo) : null;
    const pastaNova = path.join(pastaBase, nomeNovo);
  
    try {
      // Renomeia a pasta se o nome foi alterado
      if (pastaAntiga && pastaAntiga !== pastaNova && fs.existsSync(pastaAntiga)) {
        fs.renameSync(pastaAntiga, pastaNova);
  
        // Renomeia os arquivos dentro da nova pasta
        const arquivos = fs.readdirSync(pastaNova);
  
        arquivos.forEach((nomeArquivo) => {
          const ext = path.extname(nomeArquivo);
          const caminhoAntigo = path.join(pastaNova, nomeArquivo);
  
          // Renomear imagem antiga
          if (nomeArquivo.startsWith("foto_") && ext === ".avif") {
            const novoNome = `foto_${nomeNovo}.avif`;
            const caminhoNovo = path.join(pastaNova, novoNome);
            fs.renameSync(caminhoAntigo, caminhoNovo);
          }
  
          // Renomear PDFs antigos
          if (nomeArquivo.startsWith("doc_") && ext === ".pdf") {
            const partes = nomeArquivo.split('_');
            if (partes.length >= 4) {
              const timestamp = partes[2];
              const base = partes.slice(3).join('_');
              const novoNome = `doc_${nomeNovo}_${timestamp}_${base}`;
              const caminhoNovo = path.join(pastaNova, novoNome);
              fs.renameSync(caminhoAntigo, caminhoNovo);
            }
          }
        });
      }
  
      // Cria a nova pasta caso não exista
      if (!fs.existsSync(pastaNova)) {
        fs.mkdirSync(pastaNova, { recursive: true });
      }
  
      // Busca dados antigos do banco
      const queryBusca = "SELECT filePath, imagePath, originalFileNames FROM documentos WHERE idFuncionario = ?";
      db.query(queryBusca, [idFuncionario], (err, results) => {
        if (err || results.length === 0) {
          return res.status(500).json({ message: 'Erro ao buscar documentos antigos', error: err });
        }
  
        const antigos = results[0];
        let imagemPath = antigos.imagePath;
        let pdfsPath = antigos.filePath ? JSON.parse(antigos.filePath) : [];
        let originalNames = antigos.originalFileNames ? JSON.parse(antigos.originalFileNames) : [];
  
        // === ATUALIZAÇÃO DE IMAGEM ===
  
        if (req.files['imagem'] && req.files['imagem'][0]) {
          const imgFile = req.files['imagem'][0];
          const newImageName = `foto_${nomeNovo}.avif`;
          const newImagePath = path.join(pastaNova, newImageName);
          fs.renameSync(imgFile.path, newImagePath);
          imagemPath = path.join('uploads', nomeNovo, newImageName);
        } else if (nomeAntigo && nomeAntigo !== nomeNovo && antigos.imagePath) {
          const caminhoAntigo = path.join(__dirname, antigos.imagePath);
          const novoNomeImagem = `foto_${nomeNovo}.avif`;
          const caminhoNovo = path.join(pastaNova, novoNomeImagem);
  
          if (fs.existsSync(caminhoAntigo)) {
            fs.renameSync(caminhoAntigo, caminhoNovo);
            imagemPath = path.join('uploads', nomeNovo, novoNomeImagem);
          }
          imagemPath = `uploads\\${nomeNovo}\\${novoNomeImagem}`
        }
  
        // === ATUALIZAÇÃO DE PDFs ===
  
        if (req.files['pdfs'] && req.files['pdfs'].length > 0) {
          const novosPdfsPath = [];
          const novosOriginalNames = [];
  
          req.files['pdfs'].forEach((file) => {
            const ext = path.extname(file.originalname);
            const baseName = path.basename(file.originalname, ext);
            const newPdfName = `doc_${nomeNovo}_${Date.now()}_${baseName}${ext}`;
            const newPdfPath = path.join(pastaNova, newPdfName);
  
            fs.renameSync(file.path, newPdfPath);
            novosPdfsPath.push(path.join('uploads', nomeNovo, newPdfName));
            novosOriginalNames.push(file.originalname);
          });
  
          // Remove arquivos antigos do disco
          pdfsPath.forEach(file => {
            const fullPath = path.join(__dirname, file);
            if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
          });
  
          pdfsPath = novosPdfsPath;
          originalNames = novosOriginalNames;
        } else if (nomeAntigo && nomeAntigo !== nomeNovo && pdfsPath.length > 0) {
          // Renomeia os PDFs antigos se apenas o nome foi alterado
          const arquivosNaNovaPasta = fs.readdirSync(pastaNova);
          const novosPdfsPath = [];
          const novosOriginalNames = [];
  
          arquivosNaNovaPasta.forEach((arquivo) => {
            const ext = path.extname(arquivo);
            if (arquivo.startsWith("doc_") && ext === ".pdf") {
              const caminhoAntigo = path.join(pastaNova, arquivo);
        
              // Gera novo nome com base no nome novo
              const base = path.basename(arquivo, ext).split('_').slice(3).join('_'); // pega o nome original
              const novoNome = `doc_${nomeNovo}_${Date.now()}_${base}${ext}`;
              const caminhoNovo = path.join(pastaNova, novoNome);
        
              fs.renameSync(caminhoAntigo, caminhoNovo);
        
              novosPdfsPath.push(path.join('uploads', nomeNovo, novoNome));
              novosOriginalNames.push(base + ext);
            }
          });
  
          pdfsPath = novosPdfsPath;
          originalNames = novosOriginalNames;
        }
  
        // === ATUALIZAÇÃO NO BANCO DE DADOS ===
        console.log(originalNames)
        console.log(pdfsPath)
        const queryUpdate = `UPDATE documentos SET originalFileNames = ?, filePath = ?, imagePath = ? WHERE idFuncionario = ?`;
        db.query(queryUpdate, [
          JSON.stringify(originalNames),
          JSON.stringify(pdfsPath),
          imagemPath,
          idFuncionario
        ], (err, result) => {
          if (err) {
            console.error("Erro ao atualizar documentos:", err);
            return res.status(500).json({ message: 'Erro ao atualizar documentos', error: err });
          }
          return res.status(200).json({ message: 'Arquivos atualizados com sucesso' });
        });
      });
  
    } catch (err) {
      console.error("Erro geral no upload edit:", err);
      return res.status(500).json({ message: 'Erro no servidor', error: err });
    }
  });



app.post("/logEdicao", (req, res) =>{
    const date = new Date()
    const hour = date.toLocaleTimeString()
    const { nomeUsuario, nomeFuncionario } = req.body;

    const dataMySQL = date.toISOString().split('T')[0];

    db.beginTransaction((err) =>{
        if(err){
            console.log("erro ao iniciar transação")
        }
    })

    let sqlLogEdicao = "INSERT INTO logsedicao(nomeUsuario, registroEditado, dataEdit, horaEdit) VALUES (?, ?, ?, ?)";
    db.query(sqlLogEdicao, [nomeUsuario, nomeFuncionario, dataMySQL, hour], (err, result) =>{
        if (err) {
            return db.rollback(() =>{
                console.log("Erro ao cadastrar log de edição:", err);
                res.status(500).send("Erro ao cadastrar log de edição");
            })
        }

        db.commit((err) => {
            if (err) {
                return db.rollback(() => {
                    console.error("Erro ao finalizar a transação:", err);
                    res.status(500).send("Erro ao finalizar a transação.");
                });
            }
            console.log("✔ Log edição cadastrado com sucesso ✔\n");
            //res.status(200).send("Cadastro realizado com sucesso");
            res.status(200).json({ message: 'Log edição cadastrado com sucesso', result })
        });
    })
})


//TODO: DELETE
app.delete("/deleteRegister/:id", (req, res) =>{
    const { id } = req.params;
    const { nome } = req.body

    console.log(req.body);

    db.beginTransaction((err) =>{
        if (err){
            console.error('Erro ao iniciar transação', err);
            return res.status(500).json({ error: 'Erro ao iniciar transação' })
        }

        let sqlDeleteFuncionario = "DELETE FROM funcionario WHERE idFuncionario = ?";

        db.query(sqlDeleteFuncionario, [id], (err, result) =>{
            if (err){
                console.error('Erro ao excluir registro', err);
                return db.rollback(() =>{
                    return result.status(500).json({ error: 'Erro ao excluir registro' });
                })
            } 

            // Remover o diretório do funcionário
            const dirPath = path.join(uploadDirectory, nome);
            console.log('Excluindo diretório: ', dirPath);
            fs.rm(dirPath, { recursive: true, force: true }, (err) => {
                if (err) {
                    console.error('Erro ao excluir a pasta do funcionário', err);
                    return db.rollback(() => {
                        return res.status(500).json({ error: 'Erro ao excluir pasta do funcionário' });
                    });
                }

                db.commit((err) =>{
                    if (err){
                            console.error('Erro ao finalizar a transação', err);
                            return db.rollback(() =>{
                            return result.status(500).json({ error: 'Erro ao finalizar transação' });
                        })
                    }

                    const sqlTotalFuncs = "SELECT COUNT(*) AS totalFunc FROM funcionario"

                    db.query(sqlTotalFuncs, (err, totResult) =>{
                        if (err) {
                            console.error('Erro ao obter o total de funcionários', err);
                            return res.status(500).json({ error: 'Erro ao obter total de funcionários' });
                        }

                        return res.status(200).json({
                            message: 'Funcionário excluido com sucesso',
                            affectedRows: res.affectedRows,
                            totalFunc: totResult[0].totalFunc
                        })
                    })
                })
            })
        })
    })
})

//TODO: LOGIN
app.post("/login", (req, res) =>{
    const date = new Date()
    const hour = date.toLocaleTimeString()
    const { nomeUsuario, senhaUsuario } = req.body;
    const jwt = require('jsonwebtoken');

    const dataMySQL = date.toISOString().split('T')[0];

    db.query(
        "SELECT * FROM usuarios WHERE nomeUsuario = ? AND senhaUsuario = ?",
        [nomeUsuario, senhaUsuario],
        (err, results) => {
            if(err) throw err
            if(results.length > 0){
                const token = jwt.sign({ userId: results[0].id }, '140946')
                res.json({ sucess: true, token });
                console.log("\n☑ Usuário %s Logado com sucesso dia %s ☑\n", nomeUsuario, dataMySQL)
                db.query(
                    "INSERT INTO logslogin(nomeUsuario, dataLogin, horaLogin) VALUES (?, ?, ?)", 
                    [nomeUsuario, dataMySQL, hour],
                )
            }
            else{
                res.json({ sucess: false });
                console.log("\n☒ Erro de login em usuário: %s ☒\n", nomeUsuario)
            }
        } 
    )
})


app.listen(5000, '0.0.0.0', () => {
    console.log("↺ Serv rodando, porta 5000 ↺")
});