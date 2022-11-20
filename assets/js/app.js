// #region Variaveis e Constantes
const form = document.getElementById('form');
const dvKnow = document.getElementById('div-know');
const sCategoria = document.getElementById('categoria');
const btnPesquisar = document.getElementById('btn-pesquisar');
const btnLimpar = document.getElementById('btn-limpar');
let dicas = [];
const URL_API = 'http://localhost:3000';
const CATEGORIAS = ['Selecione uma Categoria', 'FrontEnd', 'BackEnd','FullStack', 'Soft Skills'];
// #endregion

//Renredizar Select Dinamico no carregamento da Pagina e ediçaõ
const renderizeCategoria = (selecionado = 0) =>{

    //limpo para renderizar Novamente
    while (sCategoria.length) {
        sCategoria.remove(0);
    };

    for (let i = 0; i<CATEGORIAS.length; i++) {

        let elem = document.createElement('option');
        if ( i != 0){ elem.value =  CATEGORIAS[i] } else { elem.value = '' };
        elem.text = CATEGORIAS[i];
        if(selecionado === CATEGORIAS[i]){ elem.selected = 'selected' };
        sCategoria.appendChild(elem);

    }
}

//Cadastrar Alterar
const cadastrarAlterar = async (knows, metodo)=> {
    let alt = '';

    if(knows.id){
       alt = `/${knows.id}`;
    }

    const resultado = await fetch(`${URL_API}/dicas${alt}`, {
      method: metodo,
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(knows),
    });
  
    const cadastrado = await resultado.json();      
    return cadastrado;
};

//Deletar
const excluir = async (id) => {

    await fetch(`${URL_API}/dicas/${id}`, {
      method: 'DELETE',
    });

    buscarTodos();
    
};

//Renderizar Dicas
const renderizeknows = (know) => {

    const item = document.createElement('div');
    const titulo = document.createElement('span');
    const categoria = document.createElement('span');
    const descricao = document.createElement('span');
    const divBotoes = document.createElement('div');
    const imgEditar = document.createElement('img');
    const imgExcluir = document.createElement('img');
    const imgVideo = document.createElement('img');
    const buttonVideo = document.createElement('button');
    const linkVideo = document.createElement('a');

    item.classList.add('lista-cards-conteudo');
    divBotoes.classList.add('botoes-acoes');

    titulo.innerHTML = `<p><strong>Linguagem/Skill</strong> - ${know.titulo}</p>`;
    categoria.innerHTML = `<p><strong>Categoria</strong> - ${know.categoria}</p><br />`;
    descricao.innerHTML = `${know.descricao}`;
    
    imgExcluir.src ='assets/image/deletar.png';
    imgExcluir.alt = 'Excluir';
    imgExcluir.width = '32';
    imgExcluir.height = '32';
    imgExcluir.addEventListener('click', () => excluir(know.id));

    imgEditar.src ='assets/image/editar.png';
    imgEditar.alt = 'Editar';
    imgEditar.width = '32';
    imgEditar.height = '32';
    imgEditar.addEventListener('click', () => editarKnowHtml(know.id));

    linkVideo.href = know.video;
    linkVideo.target = '_blank';
    imgVideo.src ='assets/image/youtube.png';
    imgVideo.alt = 'Video';  
    imgVideo.width = '32';
    imgVideo.height = '32';
    linkVideo.appendChild(imgVideo);

    item.appendChild(titulo);
    item.appendChild(categoria);
    item.appendChild(descricao);
    item.appendChild(divBotoes);
    divBotoes.appendChild(imgEditar );
    divBotoes.appendChild(imgExcluir);
    
    if(know.video){
        divBotoes.appendChild(linkVideo);    
    }
  
    dvKnow.appendChild(item);
};

//Renderizar Dicas
const renderizeKnowHtml = (know)=> {
    dvKnow.innerHTML = '';
    know.forEach((knows) => {
        renderizeknows(knows);
    });
};

//Retornar a Dica
const buscarKnow = async (id) => {

    const resultado = await fetch(`${URL_API}/dicas/${id}`);
    const know = await resultado.json();
    return know;
};

//Editar
const editarKnowHtml = async (id) => {

    const dica = await buscarKnow(id);
  
    const codigo = document.getElementById('id');
    codigo.value = dica.id;
  
    const titulo = document.getElementById('titulo');
    titulo.value = dica.titulo;
  
    const linguagem = document.getElementById('linguagem');
    linguagem.value = dica.linguagem
  
    const categoria = document.getElementById('categoria');
    renderizeCategoria(dica.categoria);
    //categoria.value = dica.categoria;
    
    const descricao = document.getElementById('descricao');
    descricao.value = dica.descricao;
    
    const video = document.getElementById('video');
    video.value = dica.video;
};

const buscarTodos = async()=> {

    const resultado = await fetch(`${URL_API}/dicas`);
    dicas = await resultado.json();
    renderizeKnowHtml(dicas);
    renderizeTotais(dicas);
    renderizeCategoria();

};

const filtrarTituloDescr = (knows, categoria) => {

    const knowsFiltradas = knows.filter((know) => know.categoria === categoria);
    return knowsFiltradas;
};

const obterTotal = (know, categoria) => {

    const knowFiltradas = filtrarTituloDescr(know, categoria);
    let total = knowFiltradas.length;
    return total? total : 0;
};

const renderizeTotais = (knows) => {

    const lista = document.getElementById('dicas');
    lista.innerHTML = '';

    const li = document.createElement('li');
    li.classList.add('card-totalizadores');
       
    const titulo = document.createElement('h2');
    titulo.innerText = 'Total';
    li.appendChild(titulo);

    const total = document.createElement('p');
    total.innerText = knows.length;
    li.appendChild(total);

    lista.appendChild(li);
    
    for(let i=1;i<CATEGORIAS.length; i++){
    //for(let dica of await dicas) {
      
      const totalCategoria = obterTotal(knows, CATEGORIAS[i]);
      const li = document.createElement('li');
      li.classList.add('card-totalizadores');
         
      const titulo = document.createElement('h2');
      titulo.innerText = CATEGORIAS[i];
      li.appendChild(titulo);
  
      const total = document.createElement('p');
      total.innerText = totalCategoria;
      li.appendChild(total);
  
      lista.appendChild(li);
    };


};

const filtrarTitulo = () => {

    const titulo = document.getElementById('pesquisar').value;

    const dicasFiltradas = dicas.filter((dica) =>{
        //Junção par Pesquisar no titulo e Descrição
      let know = dica.titulo.toLowerCase() + dica.descricao.toLowerCase();
      return know.includes(titulo.toLowerCase())
    });
  
    renderizeKnowHtml(dicasFiltradas);
};

const submitForm = async(event)=> {

        try{
            event.preventDefault();
            
            const codigo = event.target.id;
            const titulo = event.target.titulo;
            const linguagem = event.target.linguagem;
            const categoria = event.target.categoria;
            const descricao = event.target.descricao;
            const video = event.target.video;
          
            const dica = {
              id : codigo.value,
              titulo: titulo.value,
              linguagem: linguagem.value,
              categoria: categoria.value,
              descricao: descricao.value,
              video: video.value
            };
            console.log(dica);

            if(codigo.value>0){
                //Alterar
                const dicaAlterada = await cadastrarAlterar(dica,'PUT');
                buscarTodos();
                form.reset();
                codigo.value = '';
                alert('Dica Alterada na Base de conhecimento!');

            }else{
                //Cadastrar
                const dicaCadastrada = await cadastrarAlterar(dica,'POST');
                buscarTodos();
                form.reset();
                codigo.value='';
                alert('Dica Cadastrada na Base de conhecimento!');
            }

        }catch(err){
            alert(`Erro ao Cadastrar/Alterar Dica - ${err}`);
           
        }

};

const limparPesquisa = () => {
    
    document.getElementById('pesquisar').value = '';
    buscarTodos();
}

// #region Eventos
window.addEventListener('load', buscarTodos);
form.addEventListener('submit', submitForm);
btnPesquisar.addEventListener('click', filtrarTitulo);
btnLimpar.addEventListener('click', limparPesquisa);
// #endregion