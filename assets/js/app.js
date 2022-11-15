const form = document.getElementById('form');
const URL_API = 'http://localhost:3000';

//Cadastro
async function cadastrarDica(dica) {
    const resultado = await fetch(`${URL_API}/dicas`, {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(dica),
    });
  
    const dicaCadastrada = await resultado.json();
 
    return dicaCadastrada;
  }
 

async function submitForm(event) {

        try{
            event.preventDefault();
  
            const titulo = event.target.titulo;
            const linguagem = event.target.linguagem;
            const categoria = event.target.categoria;
            const descricao = event.target.descricao;
            const video = event.target.video;
          
            const dica = {
              titulo: titulo.value,
              linguagem: linguagem.value,
              categoria: categoria.value,
              descricao: descricao.value,
              video: video.value
            };

            const dicaCadastrada = await cadastrarDica(dica);
            form.reset();
            alert('Dica Cadastrada na Base de conhecimento!');

        }catch(err){
            alert(`Erro ao Cadastrar Dica - ${err}`);

        }
         
}

form.addEventListener('submit', submitForm);