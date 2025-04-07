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

const uploadDirectory = path.join(__dirname, 'uploads')

if (!fs.existsSync(uploadDirectory)){
    fs.mkdirSync(uploadDirectory, { recursive: true })
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
       const dirPath = path.join(uploadDirectory, req.body.nome)

        fs.mkdir(dirPath, { recursive: true }, (err) => {
        if (err) {
            return cb(err, null); // Passa o erro para o callback se houver
        }
        cb(null, dirPath); // Chamando o callback com o caminho do diretório
        });
    },
    filename: (req, file, cb) =>{
        const fileExtension = path.extname(file.originalname)
        let fileName

        if(fileExtension === '.pdf'){
            fileName = `doc_${req.body.nome}_${file.originalname}${fileExtension}`
        } else{
            fileName = `foto_${req.body.nome}.avif`
        }

        cb(null, fileName)
    }
});

const upload = multer({ storage: storage, limits: { fileSize: 500 * 1024 * 1024 } });

app.use('/uploads', express.static(uploadDirectory))

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

app.post("/uploads", upload.fields([{ name: 'imagem' }, { name: 'pdfs', maxCount: 50 }]), (req, res) =>{
    const { idFuncionario } = req.body

    const imagemPath = req.files['imagem'] ? path.join('uploads', req.files['imagem'][0].filename) : null;
    const pdfsPath = req.files['pdfs'] ? req.files['pdfs'].map(file => path.join('uploads', req.body.nome, file.filename)) : ['null'];

    const query = "INSERT INTO documentos (filePath, idFuncionario, imagePath) VALUES (?, ?, ?)";
    db.query(query, [JSON.stringify(pdfsPath), idFuncionario, imagemPath], (err, result) => {
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

            if(dadosAtualizados.cpf || dadosAtualizados.pisPasep || dadosAtualizados.cnh || dadosAtualizados.rg || dadosAtualizados.rgDataExped || dadosAtualizados.rgOrgaoExped || dadosAtualizados.rgUf || dadosAtualizados.titulo || dadosAtualizados.tituloZona || dadosAtualizados.tituloSecao || dadosAtualizados.tituloUf || dadosAtualizados.docMilitar || dadosAtualizados.docMilitarSerie){
                const fields = []
                const values = []

                if(dadosAtualizados.pisPasep){
                    fields.push("pisPasep = ?")
                    values.push(dadosAtualizados.pisPasep)
                }

                if(dadosAtualizados.cnh){
                    fields.push("cnh = ?")
                    values.push(dadosAtualizados.cnh)
                }

                if(dadosAtualizados.rg){
                    fields.push("rg = ?")
                    values.push(dadosAtualizados.rg)
                }

                if(dadosAtualizados.rgDataExped){
                    fields.push("rgDataExped = ?")
                    values.push(dadosAtualizados.rgDataExped)
                }

                if(dadosAtualizados.rgOrgaoExped){
                    fields.push("rgOrgaoExped = ?")
                    values.push(dadosAtualizados.rgOrgaoExped)
                }

                if(dadosAtualizados.rgUf){
                    fields.push("rgUf = ?")
                    values.push(dadosAtualizados.rgUf)
                }

                if(dadosAtualizados.titulo){
                    fields.push("titulo = ?")
                    values.push(dadosAtualizados.titulo)
                }

                if(dadosAtualizados.tituloZona){
                    fields.push("tituloZona = ?")
                    values.push(dadosAtualizados.tituloZona)
                }

                if(dadosAtualizados.tituloSecao){
                    fields.push("tituloSecao = ?")
                    values.push(dadosAtualizados.tituloSecao)
                }

                if(dadosAtualizados.tituloUf){
                    fields.push("tituloUf = ?")
                    values.push(dadosAtualizados.tituloUf)
                }

                if(dadosAtualizados.docMilitar){
                    fields.push("docMilitar = ?")
                    values.push(dadosAtualizados.docMilitar)
                }

                if(dadosAtualizados.docMilitarSerie){
                    fields.push("docMilitarSerie = ?")
                    values.push(dadosAtualizados.docMilitarSerie)
                }
                values.push(idFuncionario)
                await db.promisse().query(`UPDATE dadospessoais SET ${fields.join(", ")} WHERE idFuncionario = ?`, values)
            }

            if(dadosAtualizados.bairro || dadosAtualizados.numCasa || dadosAtualizados.cep || dadosAtualizados.logadouro || dadosAtualizados.cidadeSelecionada || dadosAtualizados.estadoAtual){
                const fields = []
                const values = []

                if(dadosAtualizados.bairro){
                    fields.push("bairro = ?")
                    values.push(dadosAtualizados.bairro)
                }

                if(dadosAtualizados.numCasa){
                    fields.push("numCasa = ?")
                    values.push(dadosAtualizados.numCasa)
                }

                if(dadosAtualizados.cep){
                    fields.push("cep = ?")
                    values.push(dadosAtualizados.cep)
                }

                if(dadosAtualizados.logadouro){
                    fields.push("logadouro = ?")
                    values.push(dadosAtualizados.logadouro)
                }

                if(dadosAtualizados.cidadeSelecionada){
                    fields.push("cidadeSelecionada = ?")
                    values.push(dadosAtualizados.cidadeSelecionada)
                }

                if(dadosAtualizados.estadoAtual){
                    fields.push("estadoAtual = ?")
                    values.push(dadosAtualizados.estadoAtual)
                }

                if(dadosAtualizados.titulo){
                    fields.push("titulo = ?")
                    values.push(dadosAtualizados.titulo)
                }

                if(dadosAtualizados.tituloZona){
                    fields.push("tituloZona = ?")
                    values.push(dadosAtualizados.tituloZona)
                }

                if(dadosAtualizados.tituloSecao){
                    fields.push("tituloSecao = ?")
                    values.push(dadosAtualizados.tituloSecao)
                }

                if(dadosAtualizados.tituloUf){
                    fields.push("tituloUf = ?")
                    values.push(dadosAtualizados.tituloUf)
                }

                if(dadosAtualizados.docMilitar){
                    fields.push("docMilitar = ?")
                    values.push(dadosAtualizados.docMilitar)
                }

                if(dadosAtualizados.docMilitarSerie){
                    fields.push("docMilitarSerie = ?")
                    values.push(dadosAtualizados.docMilitarSerie)
                }
                values.push(idFuncionario)
                await db.promisse().query(`UPDATE dadospessoais SET ${fields.join(", ")} WHERE idFuncionario = ?`, values)
            }

            if(dadosAtualizados.banco || dadosAtualizados.bancoAgencia || dadosAtualizados.bancoConta){
                const fields = []
                const values = []

                if(dadosAtualizados.banco){
                    fields.push("banco = ?")
                    values.push(dadosAtualizados.banco)
                }

                if(dadosAtualizados.bancoAgencia){
                    fields.push("bancoAgencia = ?")
                    values.push(dadosAtualizados.bancoAgencia)
                }

                if(dadosAtualizados.bancoConta){
                    fields.push("bancoConta = ?")
                    values.push(dadosAtualizados.bancoConta)
                }
                values.push(idFuncionario)
                await db.promisse().query(`UPDATE dadospessoais SET ${fields.join(", ")} WHERE idFuncionario = ?`, values)
            }

            if(dadosAtualizados.escolaridade || dadosAtualizados.cursos || dadosAtualizados.curso1 || dadosAtualizados.curso2 || dadosAtualizados.curso3 || dadosAtualizados.curso4){
                const fields = []
                const values = []

                if(dadosAtualizados.escolaridade){
                    fields.push("escolaridade = ?")
                    values.push(dadosAtualizados.escolaridade)
                }

                if(dadosAtualizados.cursos){
                    fields.push("cursos = ?")
                    values.push(dadosAtualizados.cursos)
                }

                if(dadosAtualizados.curso1){
                    fields.push("curso1 = ?")
                    values.push(dadosAtualizados.curso1)
                }

                if(dadosAtualizados.curso2){
                    fields.push("curso2 = ?")
                    values.push(dadosAtualizados.curso2)
                }

                if(dadosAtualizados.curso3){
                    fields.push("curso3 = ?")
                    values.push(dadosAtualizados.curso3)
                }

                if(dadosAtualizados.curso4){
                    fields.push("curso4 = ?")
                    values.push(dadosAtualizados.curso4)
                }
                values.push(idFuncionario)
                await db.promisse().query(`UPDATE dadospessoais SET ${fields.join(", ")} WHERE idFuncionario = ?`, values)
            } 
            
            if(dadosAtualizados.vinculo || dadosAtualizados.setorDepartamento || dadosAtualizados.cargoFuncao || dadosAtualizados.cargoEfetivo || dadosAtualizados.statusServidor || dadosAtualizados.matriculaOrigem || dadosAtualizados.orgaoOrigem || dadosAtualizados.matriculaSeai || dadosAtualizados.dataEntregaDocs || dadosAtualizados.anotacoes){
                const fields = []
                const values = []

                if(dadosAtualizados.vinculo){
                    fields.push("vinculo = ?")
                    values.push(dadosAtualizados.vinculo)
                }

                if(dadosAtualizados.setorDepartamento){
                    fields.push("setorDepartamento = ?")
                    values.push(dadosAtualizados.setorDepartamento)
                }

                if(dadosAtualizados.cargoFuncao){
                    fields.push("cargoFuncao = ?")
                    values.push(dadosAtualizados.cargoFuncao)
                }

                if(dadosAtualizados.cargoEfetivo){
                    fields.push("cargoEfetivo = ?")
                    values.push(dadosAtualizados.cargoEfetivo)
                }

                if(dadosAtualizados.statusServidor){
                    fields.push("statusServidor = ?")
                    values.push(dadosAtualizados.statusServidor)
                }

                if(dadosAtualizados.matriculaOrigem){
                    fields.push("matriculaOrigem = ?")
                    values.push(dadosAtualizados.matriculaOrigem)
                }

                if(dadosAtualizados.matriculaSeai){
                    fields.push("matriculaSeai = ?")
                    values.push(dadosAtualizados.matriculaSeai)
                }

                if(dadosAtualizados.orgaoOrigem){
                    fields.push("orgaoOrigem = ?")
                    values.push(dadosAtualizados.orgaoOrigem)
                }

                if(dadosAtualizados.matriculaSeai){
                    fields.push("matriculaSeai = ?")
                    values.push(dadosAtualizados.matriculaSeai)
                }

                if(dadosAtualizados.dataEntregaDocs){
                    fields.push("dataEntregaDocs = ?")
                    values.push(dadosAtualizados.dataEntregaDocs)
                }

                if(dadosAtualizados.anotações){
                    fields.push("anotações = ?")
                    values.push(dadosAtualizados.anotações)
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


app.listen(5000, () => {
    console.log("↺ Serv rodando ↺")
});


