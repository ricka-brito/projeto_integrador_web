async function pesquisarCEP(){
    var cidades = ['Campinas', 'Hortolândia', 'Monte Mor', 'Sumaré', 'Valinhos', 'Vinhedo', 'Louveira', 'Paulínia', 'Nova Odessa'];


    const cep = document.getElementById('CEP').value.replace('-', '');
    const url = `https://viacep.com.br/ws/${cep}/json/`;

    fetch(url, {
        method: 'get' // opcional
      })
      .then(function(response) {
        response.json()
        .then(function(result) {
          if(result['erro']=="true"){
            $(document).ready(function(){
                $('.naoexiste').toast('show');
              });
          }
          else{
            if(cidades.indexOf(result['localidade']) > -1){
                $(document).ready(function(){
                    $('.entrega').toast('show');
                  });
                  
            }
            else{
                $(document).ready(function(){
                    $('.naoentrega').toast('show');
                  });
            }
          }
        })
      })
      .catch(function(err) { 
        console.error(err);
      });
}

$(document).keypress(
    function(event){
      if (event.which == '13') {
        event.preventDefault();
      }
  });


