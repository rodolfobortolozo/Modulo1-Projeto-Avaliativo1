# Módulo 1 - Projeto Avaliativo 1 da Turma DevInHouse Turma Philips

## Projeto desenvolvido para a avaliação no módulo Inicial de Full-Stack, onde era preciso desenvolver uma aplicação para criar uma base de conhecimento.
Desenvolvido em HTML e Javascript consumindo uma Api por fecth.


# Configuração JSON Server Fake API

##1.Instalando via npm

```npm install -g json-server```

##2.Criando o arquivo .json

Crie um arquivo com o nome db.json

### Exemplo
```[
  {
    "id": 1,
    "titulo": "HTML é uma linguagem de marcação!",
    "linguagem": "HTML",
    "categoria": "FrontEnd",
    "descricao": "HTML é uma linguagem de marcação utilizada na construção de páginas na Web. Documentos HTML podem ser interpretados por navegadores. A tecnologia é fruto da junção entre os padrões HyTime e SGML. HyTime é um padrão para a representação estruturada de hipermídia e conteúdo baseado em tempo",
    "video": "https://www.youtube.com/watch?v=3oSIqIqzN3M"
  }
]```

##3.Acrescente a linha no arquivo package.sjn

```"scripts": {
    "start": "json-server --watch data/db.json"
}
 ```

##4.Rodando JSON Server Fake API

``` npm start ```
 
