const form = document.getElementById('form');
const ulDicas = document.getElementById('dicas');
const sCategoria = document.getElementById('categoria');
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
}

//Deletar
const excluirDica = async (id) => {
    await fetch(`${URL_API}/dicas/${id}`, {
      method: 'DELETE',
    });
    // const item = document.getElementById(`dica_${id}`);
    // item.remove();
    buscarDicas();
}

//Renderizar Dicas
const renderizeDicas = (dicas) => {
    const item = document.createElement('li');
    const span = document.createElement('span');
    const button = document.createElement('button');
    const buttonEditar = document.createElement('button');
  
    item.id = `dica_${dicas.id}`;
  
    span.innerText = `${dicas.titulo} - ${dicas.categoria} `;
  
    button.innerText = 'Excluir';
    button.addEventListener('click', () => excluirDica(dicas.id));
  
    buttonEditar.innerText = 'Editar';
    buttonEditar.addEventListener('click', () => editarDicaHtml(dicas.id));
  
    item.appendChild(span);
    item.appendChild(buttonEditar);
    item.appendChild(button);
  
    ulDicas.appendChild(item);
}

//Renderizar Dicas
const renderizeDicasHtml = (dicas)=> {
    ulDicas.innerHTML = '';
    
    dicas.forEach((dicas) => {
        renderizeDicas(dicas);
    });
}

//Retornar a Dica
const buscarDica = async (id) => {
    const resultado = await fetch(`${URL_API}/dicas/${id}`);
    const dica = await resultado.json();
    return dica;
}

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
}

const buscarDicas = async()=> {
    const resultado = await fetch(`${URL_API}/dicas`);
    const dicas = await resultado.json();
    renderizeDicasHtml(dicas);
    renderizeTotais(dicas);

}

const filtrarDicas = (dicas, categoria) => {
    console.log(dicas);
    const dicasFiltradas = dicas.filter((dica) => null);
    return dicasFiltradas;
  };

  function obterTotal(dicas, categorias) {
    const dicasFiltradas = filtrarDicas([ dicas ], categorias);
    return dicasFiltradas.length;
  }

async function renderizeTotais(dicas) {
    const lista = document.getElementById('total');
    lista.innerHTML = '';
    
    for(let dica of await dicas) {
        const totalCategoria = obterTotal(dicas, dica.categoria);
      const li = document.createElement('li');
      li.classList.add('list-item', 'list-item-total');
        
    //   li.addEventListener('click', () => renderizaDicasFiltradasPorCategoria(dicas.categoria));
  
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
  }



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

}

window.addEventListener('load', buscarDicas);
form.addEventListener('submit', submitForm);