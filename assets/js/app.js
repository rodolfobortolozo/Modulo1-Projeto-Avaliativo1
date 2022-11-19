const form = document.getElementById('form');
const ulDicas = document.getElementById('div-dicas');
const sCategoria = document.getElementById('categoria');
const btnPesquisar = document.getElementById('btn-pesquisar');
let dicas = [];
const URL_API = 'http://localhost:3000';


//Cadastrar Alterar
const cadastrarAltDica = async (dica, metodo)=> {
    console.log(dica.id);
    let alt = '';
    if(dica.id){
       alt = `/${dica.id}`;     }
    const resultado = await fetch(`${URL_API}/dicas${alt}`, {
      method: metodo,
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(dica),
    });
  
    const dicaCadastrada = await resultado.json();      
    return dicaCadastrada;
};

//Deletar
const excluirDica = async (id) => {
    await fetch(`${URL_API}/dicas/${id}`, {
      method: 'DELETE',
    });
    // const item = document.getElementById(`dica_${id}`);
    // item.remove();
    buscarDicas();
};

//Renderizar Dicas
const renderizeDicas = (dicas) => {
    const item = document.createElement('div');
    const titulo = document.createElement('span');
    const categoria = document.createElement('span');
    const descricao = document.createElement('span');

    const button = document.createElement('button');
    const buttonEditar = document.createElement('button');

    item.classList.add('listacards');

    titulo.innerHTML = `<p><strong>Linguagem/Skill</strong> - ${dicas.titulo}</p>`;
    categoria.innerHTML = `<p><strong>Categoria</strong> - ${dicas.categoria}</p><br />`;
    descricao.innerHTML = `${dicas.descricao}`;
    
    
  
    button.innerText = 'Excluir';
    button.addEventListener('click', () => excluirDica(dicas.id));
  
    buttonEditar.innerText = 'Editar';
    buttonEditar.addEventListener('click', () => editarDicaHtml(dicas.id));
  
    item.appendChild(titulo);
    item.appendChild(categoria);
    item.appendChild(descricao);
    item.appendChild(buttonEditar);
    item.appendChild(button);
  
    ulDicas.appendChild(item);
};

//Renderizar Dicas
const renderizeDicasHtml = (dicas)=> {
    ulDicas.innerHTML = '';
    dicas.forEach((dicas) => {
        renderizeDicas(dicas);
    });
};

//Retornar a Dica
const buscarDica = async (id) => {
    const resultado = await fetch(`${URL_API}/dicas/${id}`);
    const dica = await resultado.json();
    return dica;
};

//Editar
const editarDicaHtml = async (id) => {
    const dica = await buscarDica(id);
  
    const codigo = document.getElementById('id');
    codigo.value = dica.id;
  
    const titulo = document.getElementById('titulo');
    titulo.value = dica.titulo;
  
    const linguagem = document.getElementById('linguagem');
    linguagem.value = dica.linguagem
  
    const categoria = document.getElementById('categoria');
    //renderizeCategoria(dica.categoria);
    categoria.value = dica.categoria;
    
    const descricao = document.getElementById('descricao');
    descricao.value = dica.descricao;
    
    const video = document.getElementById('video');
    video.value = dica.video;
};

const buscarDicas = async()=> {
    const resultado = await fetch(`${URL_API}/dicas`);
    dicas = await resultado.json();
    renderizeDicasHtml(dicas);
    renderizeTotais(dicas);

};

const filtrarDicas = (dica, categoria) => {
    const dicasFiltradas = dica.filter((dica) => dica.categoria === categoria);
    return dicasFiltradas;
};

const obterTotal = (dicas, categoria) => {
    const dicasFiltradas = filtrarDicas(dicas, categoria);
    let total = dicasFiltradas.length;
    console.log(total);
    return total? total : 0;
};

async function renderizeTotais(dicas) {
    const lista = document.getElementById('total');
    lista.innerHTML = '';
    
    for(let dica of await dicas) {
    
      const totalCategoria = obterTotal(dicas, dica.categoria);
      const li = document.createElement('li');
      li.classList.add('list-item', 'list-item-total');
         
      const titulo = document.createElement('h2');
      titulo.innerText = dica.categoria;
      titulo.classList.add('total-title');
      li.appendChild(titulo);
  
      const total = document.createElement('p');
      total.innerText = totalCategoria;
      total.classList.add('subtitle');
      li.appendChild(total);
  
      lista.appendChild(li);
    };
};

const filtrarTitulo = () => {

    const titulo = document.getElementById('pesquisar').value;

    const dicasFiltradas = dicas.filter((dica) =>
      dica.titulo.toLowerCase().includes(titulo.toLowerCase())
    );
  
    renderizeDicasHtml(dicasFiltradas);
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
                
                const dicaAlterada = await cadastrarAltDica(dica,'PUT');
                buscarDicas();
                form.reset();
                codigo.value = '';
                alert('Dica Alterada na Base de conhecimento!');

            }else{
                const dicaCadastrada = await cadastrarAltDica(dica,'POST');
                buscarDicas();
                form.reset();
                codigo.value='';
                alert('Dica Cadastrada na Base de conhecimento!');
            }

        }catch(err){
            alert(`Erro ao Cadastrar/Alterar Dica - ${err}`);
           
        }

};

window.addEventListener('load', buscarDicas);
form.addEventListener('submit', submitForm);
btnPesquisar.addEventListener('click', filtrarTitulo);