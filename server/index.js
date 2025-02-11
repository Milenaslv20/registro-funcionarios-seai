const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bodyParser = require('body-parser')

const app = express();

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "4908246miM@!@#",
    database: "seaifuncionarios",
});

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(bodyParser.json());

app.post("/cadastrar", (req, res) =>{
    const { foto, nome, sexo, data_nasc, estado, nacionalidade, naturalidade, raca, telefone, email, 
        nomePai, cpfPai, dataNascPai, nomeMae, cpfMae, dataNascMae, estadoCivil, nomeEsposoa, filhos, nomeFilhos,
        cpf, pisPasep, cnh, 
    } = req.body;


    let sqlFuncionario = "INSERT INTO funcionario(nomeFuncionario) VALUES (?)";
    db.query(sqlFuncionario, [nome], (err, result) =>{
        if (err) {
            console.log("Erro ao cadastrar funcionario:", err);
        }

        let idFuncionario = result.insertId;
        console.log("Dados recebidos (formatado):", JSON.stringify(req.body, null, 2));

        let sqlPessoais = "INSERT INTO dadospessoais(idFuncionario, fotoFuncionario, sexo, dataNasc, estado, nacionalidade, naturalidade, raca, telefone, email) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        db.query(sqlPessoais, [idFuncionario, foto, sexo, data_nasc, estado, nacionalidade, naturalidade, raca, telefone, email], (err, res) =>{
            if (err) {
                console.log("Erro ao cadastrar dados pessoais:", err);
            }

            let sqlFamiliares = "INSERT INTO dadosfamiliares(idFuncionario, nomePai, cpfPai, dataNascPai, nomeMae, cpfMae, dataNascMae, estadoCivil, nomeEsposoA, filhos, nomeFilhos) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            db.query(sqlFamiliares, [idFuncionario, nomePai, cpfPai, dataNascPai, nomeMae, cpfMae, dataNascMae, estadoCivil, nomeEsposoa, filhos, nomeFilhos], (err, res) =>{
                if (err) {
                    console.log("Erro ao cadastrar dados familiares:", err);
                }

                console.log("Dados cadastrados com sucesso \n");
            });
        });
    });
});

app.listen(3001, '0.0.0.0', () => {
    console.log("Rodando \n")
});
