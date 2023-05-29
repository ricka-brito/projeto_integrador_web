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


document.addEventListener('scroll', () => {
  const header = document.querySelector('nav')

  if (window.scrollY > 0){
    header.classList.add('scrolled')
  } else {
    header.classList.remove('scrolled')
  }
})


var carrinhoa = []

function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  let expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

window.onload = function() {
  try {
    carrinhoa = JSON.parse(getCookie("carrinhoa"))
    carrinhof()
  }
  catch{
    carrinhoa = []
    setCookie("carrinhoa", JSON.stringify(carrinhoa), 10)
    console.log(getCookie("carrinhoa"))
  }

}
 
window.onbeforeunload = function a() {
    setCookie("carrinhoa", JSON.stringify(carrinhoa), 10)
};





function excloi(e){
  for(let i = 0; i < carrinhoa.length; i++){
    if(carrinhoa[i]["nome"] == e.target.parentNode.parentNode.innerText){
      carrinhoa.splice(i, 1)
    }
  }
  e.target.parentNode.parentNode.parentNode.parentNode.remove()
  e.stopPropagation();

  carrinhof()
}

function addcarrinho(e){
  console.log(carrinhoa)
  let tem = true;
  let produto = e.parentNode.parentNode.parentNode;
  for(let i = 0; i < carrinhoa.length; i++){
    if(carrinhoa[i]["nome"] == produto.querySelector('h1').innerHTML){
      carrinhoa[i]['quatidade'] = parseInt(carrinhoa[i]['quatidade']) + 1;
      tem = false;
    }
  }
  if(tem){
    produtojson = {
      nome: produto.querySelector('h1').innerHTML,
      preco: produto.querySelector('span').innerText.replace("R$", ""),
      quatidade: "1",
      img: produto.querySelector('img').src
    }
    carrinhoa.push(produtojson)
  }
  carrinhof()
};

function addum(e){
  let produto = e.target.parentNode.parentNode.parentNode.parentNode;
  for(let i = 0; i < carrinhoa.length; i++){
    if(carrinhoa[i]["nome"] == produto.querySelector('p').innerText){
      carrinhoa[i]['quatidade'] = parseInt(carrinhoa[i]['quatidade']) + 1;
    }
  }
  carrinhof()
  e.stopPropagation();
}

function remoum(e){
  if(parseInt(e.target.parentNode.parentNode.querySelector('p').innerText) - 1 == 0){
    for(let i = 0; i < carrinhoa.length; i++){
      if(carrinhoa[i]["nome"] == e.target.parentNode.parentNode.parentNode.parentNode.querySelector('p').innerText){
        carrinhoa.splice(i, 1)
      }
    }
    e.target.parentNode.parentNode.parentNode.parentNode.remove()
  }
  let produto = e.target.parentNode.parentNode.parentNode.parentNode;
  for(let i = 0; i < carrinhoa.length; i++){
    if(carrinhoa[i]["nome"] == produto.querySelector('p').innerText){
      carrinhoa[i]['quatidade'] = parseInt(carrinhoa[i]['quatidade']) - 1;
    }
  }
  carrinhof()
  e.stopPropagation();
}

function carrinhof(){
  var produtosa = $("#produtos"); 
  var nmrprod = document.getElementById("itens")
  var tot = document.getElementById("valortotal")
  let totalitens = 0;
  let totaltodos = 0;
  produtosa.empty()


  if(carrinhoa.length == 0){
    let strHTML = `<h2 style="color:#0D8F08;" class="d-flex align-items-center flex-column p-4 text-center"><i class="fa-solid fa-cart-shopping fa-2x mb-4"></i>seu carrinho esta vazio</h2>`
    produtosa.append(strHTML)
    nmrprod.innerText = "0";
    tot.innerText = "R$ 0,00";
  }
  else{
    for(let i = 0; i < carrinhoa.length; i++){
      let strHTML = `
      <div class="produto d-flex" style="max-height: 200px;">
          <div class="bga-mini">
              <img src="assets/img${carrinhoa[i]["img"].slice(carrinhoa[i]["img"].lastIndexOf("/"))}">
          </div>
          <div class="desc p-3 pt-4">
              <p class="nomeprodut">${carrinhoa[i]["nome"]}<button role="button" onclick="excloi(event)" class="btn-excud" href=""><i class="fa-solid fa-circle-xmark"></i></button></p>
              <div class="qtd">
                  <div class="additis d-flex align-items-center">
                      <button onclick="remoum(event)" class="btsadex"><i class="fa-solid fa-circle-minus fa-2x me-1"></i></button>                                
                      <p class="itenstot">${carrinhoa[i]["quatidade"]}</p>
                      <button onclick="addum(event)" class="btsadex"><i class="fa-solid fa-circle-plus fa-2x ms-1"></i></button>
                  </div>
                  <p>${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(parseFloat(carrinhoa[i]["preco"].replace(",","."))*parseInt(carrinhoa[i]["quatidade"]))}</p>
              </div>
          </div>
      </div>`
      totalitens = totalitens + parseInt(carrinhoa[i]["quatidade"])
      totaltodos = totaltodos + (parseFloat(carrinhoa[i]["preco"].replace(",",".")) * totalitens)
      produtosa.append(strHTML)
  }
  nmrprod.innerHTML =  totalitens.toString()
  tot.innerHTML = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totaltodos)
  }
}
