const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bodyParser = require('body-parser');
const multer = require('multer');
const fs = require('fs');
const path = require("path");

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json({ limit: '700mb' }));
app.use(express.urlencoded({ extended: true, limit: "700mb" }));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const nome = req.body.nome;
        const uploadDir = `uploads/${nome}/`;
    
        console.log("Caminho do diretório de upload:", uploadDir);  // Adicione o log para depuração
    
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage, limits: { fileSize: 100 * 1024 * 1024 } });

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "4908246miM@!@#",
    database: "seaifuncionarios",
});
db.connect((err) => {
    if (err) {
        console.error("Erro ao conectar com o banco de dados:", err);
        return;
    }
    console.log("⚯  Conectado ao banco de dados ⚯\n");
});


//TODO: CREATE
app.post("/cadastrar", upload.none(), (req, res) =>{
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
                //res.status(500).send("Erro ao cadastrar funcionário");
            })
        }

        let idFuncionario = result.insertId;
        console.log("● Dados recebidos (formatado):", JSON.stringify(req.body, null, 2));

        let sqlPessoais = "INSERT INTO dadospessoais(idFuncionario, sexo, dataNasc, estadoAtual, nacionalidade, naturalidade, raca, telefone, email) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        db.query(sqlPessoais, [idFuncionario, sexo, data_nasc, estadoAtual, nacionalidade, naturalidade, raca, telefone, email], (err, res) =>{
            if (err) {
                return db.rollback(() =>{
                    console.log("Erro ao cadastrar dados pessoais:", err);
                    //res.status(500).send("Erro ao cadastrar dados pessoais");
                })
            } else{
                console.log("-Dados pessoais cadastrados com sucesso");
            }

            let sqlFamiliares = "INSERT INTO dadosfamiliares(idFuncionario, nomePai, cpfPai, dataNascPai, nomeMae, cpfMae, dataNascMae, estadoCivil, nomeEsposoA, filhos, nomeFilhos) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            db.query(sqlFamiliares, [idFuncionario, nomePai, cpfPai, dataNascPai, nomeMae, cpfMae, dataNascMae, estadoCivil, nomeEsposoa, filhos, nomeFilhos], (err, res) =>{
                if (err) {
                    return db.rollback(() =>{
                        console.log("Erro ao cadastrar dados familiares:", err);
                        //res.status(500).send("Erro ao cadastrar dados familiares");
                    })
                } else{
                    console.log("-Dados familiares cadastrados com sucesso");
                }

                let sqlDocumentos = "INSERT INTO dadosdocumentos(idFuncionario, cpf, pisPasep, cnh, rg, rgDataExped, rgOrgaoExped, rgUf, titulo, tituloZona, tituloSecao, tituloUf, docMilitar, docMilitarSerie) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                db.query(sqlDocumentos, [idFuncionario, cpf, pisPasep, cnh, rg, rgDataExped, rgOrgaoExped, rgUf, titulo, tituloZona, tituloSecao, tituloUf, docMilitar, docMilitarSerie], (err, res) =>{
                    if (err) {
                        return db.rollback(() =>{
                            console.log("Erro ao cadastrar dados documentos:", err);
                            //res.status(500).send("Erro ao cadastrar dados documentos");
                        })
                    } else{
                        console.log("-Dados documentos cadastrados com sucesso");
                    }

                    let sqlEndereco = "INSERT INTO dadosendereco(idFuncionario, bairro, numCasa, cep, logadouro, estado, cidade) VALUES (?, ?, ?, ?, ?, ?, ?)";
                    db.query(sqlEndereco, [idFuncionario, bairro, numCasa, cep, logadouro, estadoSelecionado, cidadeSelecionada], (err, res) =>{
                        if (err) {
                            return db.rollback(() =>{
                                console.log("Erro ao cadastrar dados endereço:", err);
                                //res.status(500).send("Erro ao cadastrar dados endereço");
                            })
                        } else{
                            console.log("-Dados endereço cadastrados com sucesso");
                        }

                        let sqlDadosBancarios = "INSERT INTO dadosbancarios(idFuncionario, banco, bancoAgencia, bancoConta) VALUES (?, ?, ?, ?)";
                        db.query(sqlDadosBancarios, [idFuncionario, banco, bancoAgencia, bancoConta], (err, res) =>{
                            if (err) {
                                return db.rollback(() =>{
                                    console.log("Erro ao cadastrar dados bancários:", err);
                                    //res.status(500).send("Erro ao cadastrar dados bancários");
                                })
                            } else{
                                console.log("-Dados bancários cadastrados com sucesso");
                            }

                            let sqlformacaoEscolar = "INSERT INTO dadosescolaridade(idFuncionario, escolaridade, cursos, curso1, curso2, curso3, curso4) VALUES (?, ?, ?, ?, ?, ?, ?)";
                            db.query(sqlformacaoEscolar, [idFuncionario, escolaridade, cursos, curso1, curso2, curso3, curso4], (err, res) =>{
                                if (err) {
                                    return db.rollback(() =>{
                                        console.log("Erro ao cadastrar dados escolares:", err);
                                        //res.status(500).send("Erro ao cadastrar dados escolares");
                                    })
                                } else{
                                    console.log("-Dados escolares cadastrados com sucesso");
                                }

                                let sqlVinculo = "INSERT INTO dadosvinculo(idFuncionario, vinculo, setorDepartamento, cargoFuncao, cargoEfetivo, statusServidor, matriculaOrigem, orgaoOrigem, matriculaSeai, dataEntregaDocs, anotacoes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                                db.query(sqlVinculo, [idFuncionario, vinculo, setorDepartamento, cargoFuncao, cargoEfetivo, statusServidor, matriculaOrigem, orgaoOrigem, matriculaSeai, dataEntregaDocs, anotacoes], (err, res) =>{
                                    if (err) {
                                        return db.rollback(() =>{
                                            console.log("Erro ao cadastrar dados vínculo:", err);
                                            //res.status(500).send("Erro ao cadastrar dados vínculo");
                                        })
                                    } else{
                                        console.log("-Dados vínculo cadastrados com sucesso\n");
                                    }
                                })

                                db.commit((err) => {
                                    if (err) {
                                        return db.rollback(() => {
                                            console.error("Erro ao finalizar a transação:", err);
                                            //res.status(500).send("Erro ao finalizar a transação.");
                                        });
                                    }
                                    console.log("✔ Cadastro realizado com sucesso ✔\n");
                                    //res.status(200).send("Cadastro realizado com sucesso");
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});

app.post("/uploads", upload.fields([{ name: 'imagem' }, { name: 'pdfs', maxCount: 50 }]), (req, res) =>{
    const imagemPath = path.join('uploads', req.body.nome, req.files['imagem'][0].filename);
    const pdfsPath = req.files['pdfs'].map(file => path.join('uploads', req.body.nome, file.filename));

    const query = "INSERT INTO documentos (imagePath, filePath) VALUES (?, ?)";
    db.query(query, [imagemPath, JSON.stringify(pdfsPath)], (err, result) => {
        if (err) {
          return res.status(500).json({ message: 'Erro ao salvar no banco de dados', error: err });
        }
        res.status(200).json({ message: 'Arquivos enviados e salvos no banco de dados', result });
    });
})


//TODO: READ
app.get("/getRegisters", (req, res) =>{
    const dbData = 
    ` SELECT 
        fun.idFuncionario,
        fun.nomeFuncionario,
        
        /*anexos*/
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
        /*anexos*/
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

//TODO: UPDATE

app.put("/editRegister", (req, res) =>{
    const { idFuncionario, ...dadosAtualizados} = req.body

    if(!idFuncionario){
        console.log("ID obrigatório")
        return res.status(400).json({ message: "ID obrigatório" })
    }

    db.beginTransaction(async (err) =>{
        if (err) throw err;

        try{
            if (dadosAtualizados.nomeFuncionario){
                await db.promisse().query("UPDATE funcionario SET nomeFuncionario = ? WHERE idFuncionario  = ?", [dadosAtualizados.nomeFuncionario, idFuncionario])
            }

            if(dadosAtualizados.sexo || dadosAtualizados.dataNasc || dadosAtualizados.estado || dadosAtualizados.nacionalidade || dadosAtualizados.naturalidade || dadosAtualizados.raca || dadosAtualizados.telefone || dadosAtualizados.email){
                const fields = []
                const values = []

                if(dadosAtualizados.sexo){
                    fields.push("sexo = ?")
                    values.push(dadosAtualizados.sexo)
                }

                if(dadosAtualizados.dataNasc){
                    fields.push("dataNasc = ?")
                    values.push(dadosAtualizados.dataNasc)
                }

                if(dadosAtualizados.estado){
                    fields.push("estado = ?")
                    values.push(dadosAtualizados.estado)
                }

                if(dadosAtualizados.nacionalidade){
                    fields.push("nacionalidade = ?")
                    values.push(dadosAtualizados.nacionalidade)
                }

                if(dadosAtualizados.naturalidade){
                    fields.push("naturalidade = ?")
                    values.push(dadosAtualizados.naturalidade)
                }

                if(dadosAtualizados.raca){
                    fields.push("raca = ?")
                    values.push(dadosAtualizados.raca)
                }

                if(dadosAtualizados.telefone){
                    fields.push("telefone = ?")
                    values.push(dadosAtualizados.telefone)
                }

                if(dadosAtualizados.email){
                    fields.push("email = ?")
                    values.push(dadosAtualizados.email)
                }
                values.push(idFuncionario)
                await db.promisse().query(`UPDATE dadospessoais SET ${fields.join(", ")} WHERE idFuncionario = ?`, values)
            }

            if(dadosAtualizados.nomePai || dadosAtualizados.cpfPai || dadosAtualizados.dataNascPai || dadosAtualizados.nomeMae || dadosAtualizados.cpfMae || dadosAtualizados.dataNascMae || dadosAtualizados.estadoCivil || dadosAtualizados.nomeEsposoA || dadosAtualizados.filhos || dadosAtualizados.nomeFilhos){
                const fields = []
                const values = []

                if(dadosAtualizados.nomePai){
                    fields.push("nomePai = ?")
                    values.push(dadosAtualizados.nomePai)
                }

                if(dadosAtualizados.cpfPai){
                    fields.push("cpfPai = ?")
                    values.push(dadosAtualizados.cpfPai)
                }

                if(dadosAtualizados.dataNascPai){
                    fields.push("dataNascPai = ?")
                    values.push(dadosAtualizados.dataNascPai)
                }

                if(dadosAtualizados.nomeMae){
                    fields.push("nomeMae = ?")
                    values.push(dadosAtualizados.nomeMae)
                }

                if(dadosAtualizados.cpfMae){
                    fields.push("cpfMae = ?")
                    values.push(dadosAtualizados.cpfMae)
                }

                if(dadosAtualizados.dataNascMae){
                    fields.push("dataNascMae = ?")
                    values.push(dadosAtualizados.dataNascMae)
                }

                if(dadosAtualizados.estadoCivil){
                    fields.push("estadoCivil = ?")
                    values.push(dadosAtualizados.estadoCivil)
                }

                if(dadosAtualizados.nomeEsposoA){
                    fields.push("nomeEsposoA = ?")
                    values.push(dadosAtualizados.nomeEsposoA)
                }

                if(dadosAtualizados.filhos){
                    fields.push("filhos = ?")
                    values.push(dadosAtualizados.filhos)
                }

                if(dadosAtualizados.nomeFilhos){
                    fields.push("nomeFilhos = ?")
                    values.push(dadosAtualizados.nomeFilhos)
                }
                values.push(idFuncionario)
                await db.promisse().query(`UPDATE dadospessoais SET ${fields.join(", ")} WHERE idFuncionario = ?`, values)
            }

            db.commit()
            res.status(200).json({ message: "Dados atualizados com sucesso" })
            console.log("Dados atualizados com sucesso")
        } catch (err){
            db.rollback()
            res.status(500).json({ message: "Erro ao atualizar dados", error: err })
        }
    })
})


//TODO: DELETE
app.delete("/deleteRegister/:id", (req, res) =>{
    const { id } = req.params;

    db.beginTransaction((err) =>{
        if (err){
            return res.status(500).json({ error: 'Erro ao iniciar transação' })
        }
    })

    let sqlDeleteFuncionario = "DELETE FROM funcionario WHERE idFuncionario = ?";
    db.query(sqlDeleteFuncionario, [id], (err, res) =>{
        if (err){
            return db.rollback(() =>{
                console.log("Erro ao excluir registro", err);
            })
        } 

        db.commit((err) =>{
            if (err){
                    return db.rollback(() =>{
                    console.error("Erro ao finalizar a transação:", err);
                })
            }
        })
    })
})


app.listen(5000, () => {
    console.log("↺ Serv rodando ↺")
});
