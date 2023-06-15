// Variavel Master Carrinho
var carrinhoa = []

// Função que pesquisa CEP com a API viacep
async function pesquisarCEP(){
    // Lista de cidades que entregam
    var cidades = ['Campinas', 'Hortolândia', 'Monte Mor', 'Sumaré', 'Valinhos', 'Vinhedo', 'Louveira', 'Paulínia', 'Nova Odessa'];

    const cep = document.getElementById('CEP').value.replace('-', '');
    const url = `https://viacep.com.br/ws/${cep}/json/`;

    // Chamada da API e tratativa de erro
    fetch(url, {
        method: 'get'
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

// Função que muda adiciona uma cor no fundo com transparencia
document.addEventListener('scroll', () => {
  const header = document.querySelector('nav')

  if (window.scrollY > 0){
    header.classList.add('scrolled')
  } else {
    header.classList.remove('scrolled')
  }
})

// Função para definir cookies
function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  let expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

// Função para ler cookies
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

// Função que le os cookies e adiciona na variavel do carrinho
function cookiescarrinho() {
  try {
    carrinhoa = JSON.parse(getCookie("carrinhoa"))
    carrinhof()
  }
  catch{
    carrinhoa = []
    setCookie("carrinhoa", JSON.stringify(carrinhoa), 10)
    carrinhof()
  }
  return carrinhoa
}

// Função que salva os cookies antes da pagina descarregar
window.onbeforeunload = function a() {
    setCookie("carrinhoa", JSON.stringify(carrinhoa), 10)
};

// Função que remove itens do carrinho
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

// Função que adiciona itens ao carrinho
function addcarrinho(e){
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

// Função que adiciona itens ao carrinho quando na pagina do produto
function addcarrinhoidi(e){
  let tem = true;
  let produto = e.parentNode.parentNode.parentNode.parentNode;
  for(let i = 0; i < carrinhoa.length; i++){
    if(carrinhoa[i]["nome"] == produto.querySelector('#nomea').innerHTML){
      carrinhoa[i]['quatidade'] = parseInt(carrinhoa[i]['quatidade']) + parseInt(produto.getElementsByClassName('itenstota')[0].innerText);
      tem = false;
    }
  }
  if(tem){
    produtojson = {
      nome: produto.querySelector('h1').innerHTML,
      preco: produto.querySelector('h2').innerText.replace("R$", ""),
      quatidade: produto.getElementsByClassName('itenstota')[0].innerText,
      img: produto.querySelector('img').src
    }
    carrinhoa.push(produtojson)
  }
  carrinhof()
};

// Função que adiciona +1 itens a quantidade no carrinho
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

// Função que adiciona +1 itens a quantidade nos produtos
function addumprod(e){
  let produto = e.target.parentNode.parentNode;
  produto.querySelector("p").innerText = parseInt(produto.querySelector("p").innerText) + 1
}

// Função que remove -1 itens a quantidade no carrinho
function remoumprod(e){
  let produto = e.target.parentNode.parentNode;
  if(parseInt(produto.querySelector("p").innerText) == 1){
    return
  }
  produto.querySelector("p").innerText = parseInt(produto.querySelector("p").innerText) - 1
}

// Função que remove -1 itens a quantidade no produtos
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

// Função Principal do carrinho, que atualiza e adiciona os itens (componentização)
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
              <img src="${carrinhoa[i]["img"]}">
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
      totalindividual = parseInt(carrinhoa[i]["quatidade"])
      totaltodos = totaltodos + (parseFloat(carrinhoa[i]["preco"].replace(",",".")) * totalindividual)
      produtosa.append(strHTML)
  }
  nmrprod.innerHTML =  totalitens.toString()
  tot.innerHTML = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totaltodos)
  }
}

// Função que chama a API na azure que contem os produtos
async function chamaapi(url){
  await fetch(url, {
    method: 'get'
  })
  .then(function(response) {
    teste = response.json()
  })
  return teste
}

// Função que exibe todos os produtos na pagina de produtos
async function itens(){
  carrinhoa = cookiescarrinho()
  carinho = await chamaapi("https://primavere.azurewebsites.net/produtos")

  try {
    carrinhoa = JSON.parse(getCookie("carrinhoa"))
    carrinhof()
  }
  catch{
    carrinhoa = []
    setCookie("carrinhoa", JSON.stringify(carrinhoa), 10)
    carrinhof()
  }


  var itensb = $(".galeriaprodutos");
  itensb.empty()
  for(let i = 0; i<carinho.length; i++){
      try{
        let string = `
        <div class="product">
            <div onclick="redireciona(event)" class="bga">
                <img src="${carinho[i]["src"]}"  alt="...">
            </div>
            <h1 onclick="redireciona(event)">${carinho[i]["nome"]}</h1>
            <div class="preco">
                <p onclick="redireciona(event)"><span>${carinho[i]["preco"]}</span> ${carinho[i]["detalhes"]}</p>
                <div class="areacompra">
                    <button type="button"  class="btncomprar">comprar</button>
                    <button type="button"  class="btncarrinho" onclick="addcarrinho(this)"><svg   xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 96 960 960" width="48"><path d="M465 443V320H341v-60h124V137h60v123h123v60H525v123h-60ZM289.788 976Q260 976 239 954.788q-21-21.213-21-51Q218 874 239.212 853q21.213-21 51-21Q320 832 341 853.212q21 21.213 21 51Q362 934 340.788 955q-21.213 21-51 21Zm404 0Q664 976 643 954.788q-21-21.213-21-51Q622 874 643.212 853q21.213-21 51-21Q724 832 745 853.212q21 21.213 21 51Q766 934 744.788 955q-21.213 21-51 21ZM290 769q-42 0-61.5-34t.5-69l61-111-150-319H62v-60h116l170 364h292l156-280 52 28-153 277q-9.362 16.667-24.681 25.833Q655 600 634 600H334l-62 109h494v60H290Z"/></svg></button>
                </div>
            </div>
        </div>
        `
        itensb.append(string)
      }
      catch{

      }

  }
}

// Função que exibe os produtos com filtro de pesquisa
async function itensfiltro(a){
  carinho = await chamaapi("https://primavere.azurewebsites.net/produtos")

  var itensb = $(".galeriaprodutos");
  itensb.empty()
  for(let i = 0; i<carinho.length; i++){
      if(carinho[i]["nome"].toUpperCase().includes(a.value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase())){
        let string = `
        <div class="product">
            <div onclick="redireciona(event)" class="bga">
                <img src="${carinho[i]["src"]}"  alt="...">
            </div>
            <h1 onclick="redireciona(event)">${carinho[i]["nome"]}</h1>
            <div class="preco">
                <p onclick="redireciona(event)"><span>${carinho[i]["preco"]}</span> ${carinho[i]["detalhes"]}</p>
                <div class="areacompra">
                    <button type="button"  class="btncomprar">comprar</button>
                    <button type="button"  class="btncarrinho" onclick="addcarrinho(this)"><svg   xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 96 960 960" width="48"><path d="M465 443V320H341v-60h124V137h60v123h123v60H525v123h-60ZM289.788 976Q260 976 239 954.788q-21-21.213-21-51Q218 874 239.212 853q21.213-21 51-21Q320 832 341 853.212q21 21.213 21 51Q362 934 340.788 955q-21.213 21-51 21Zm404 0Q664 976 643 954.788q-21-21.213-21-51Q622 874 643.212 853q21.213-21 51-21Q724 832 745 853.212q21 21.213 21 51Q766 934 744.788 955q-21.213 21-51 21ZM290 769q-42 0-61.5-34t.5-69l61-111-150-319H62v-60h116l170 364h292l156-280 52 28-153 277q-9.362 16.667-24.681 25.833Q655 600 634 600H334l-62 109h494v60H290Z"/></svg></button>
                </div>
            </div>
        </div>
        `
        itensb.append(string)
      }

  }
}

// Função que redireciona para a pagina de produto individual com ID no url
async function redireciona(e){
  carinho = await chamaapi("https://primavere.azurewebsites.net/produtos")

  switch (e.target.tagName){
    case "H1":
      for(let i = 0; i<carinho.length; i++){
        if(carinho[i].nome == e.target.innerText){
          window.open(`./produto.html?id=${i}`, "_self")
        }
      }
      break;
    case "DIV":
      for(let i = 0; i<carinho.length; i++){
        if(carinho[i].nome == e.target.parentNode.querySelector("h1").innerText){
          window.open(`./produto.html?id=${i}`, "_self")
        }
      }
      break
    case "IMG":
      for(let i = 0; i<carinho.length; i++){
        if(carinho[i].nome == e.target.parentNode.parentNode.querySelector("h1").innerText){
          window.open(`./produto.html?id=${i}`, "_self")
        }
      }
      break
    case "P":
      for(let i = 0; i<carinho.length; i++){
        if(carinho[i].nome == e.target.parentNode.parentNode.querySelector("h1").innerText){
          window.open(`./produto.html?id=${i}`, "_self")
        }
      }
      break
    case "SPAN":
      for(let i = 0; i<carinho.length; i++){
        if(carinho[i].nome == e.target.parentNode.parentNode.parentNode.querySelector("h1").innerText){
          window.open(`./produto.html?id=${i}`, "_self")
        }
      }
      break
  }
}

// Função que calcula frete
function infosproduto(){
  var origin1 = '13185-521';
  var origin2 = document.getElementById("frete").value;

  let cidadesgratis = ['Hortolândia'];
  let cidades = ['Campinas', 'Hortolândia', 'Monte Mor', 'Sumaré', 'Valinhos', 'Vinhedo', 'Louveira', 'Paulínia', 'Nova Odessa'];

  const cep = document.getElementById('frete').value.replace('-', '');
  const url = `https://viacep.com.br/ws/${cep}/json/`;
  fetch(url, {
    method: 'get'
  })
  .then(function(response) {
    response.json()
    .then(function(result) {
      if(result.erro == true){
        $(document).ready(function(){
          $(document).ready(function(){
            $('.naoexiste').toast('show');
          });
          });
      }
      else{
        if(cidades.indexOf(result['localidade']) == -1){
          $(document).ready(function(){
            $(document).ready(function(){
              $('.naoentrega').toast('show');
            });
            });
        }
        else{
          if(cidadesgratis.indexOf(result['localidade']) > -1){
            $(document).ready(function(){
              $(document).ready(function(){
                $('.gratis').toast('show');
              });
              });
              
        }
        else{
          var service = new google.maps.DistanceMatrixService();
          service.getDistanceMatrix(
            {
              origins: [origin1],
              destinations: [origin2],
              travelMode: 'DRIVING',
              unitSystem: 0,  
            }, callback);

            function callback(response, status) {
              if (status == 'OK') {
                var origins = response.originAddresses;
                var destinations = response.destinationAddresses;
            
                for (var i = 0; i < origins.length; i++) {
                  var results = response.rows[i].elements;
                  for (var j = 0; j < results.length; j++) {
                    var element = results[j];
                    distancea = element.distance.value
                    document.getElementById("precoa").innerText = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(6*((distancea/1000)/9)**1.1)

                    $(document).ready(function(){
                      $(document).ready(function(){
                        $('.precofrete').toast('show');
                      });
                      });
                  }
                }
              }
            }


        }
        }
        
      }
    })
  })




  
}

// Função que define os valores das tags da pagina de produto individual
async function definevalores(){
  cookiescarrinho()
  carinho = await chamaapi("https://primavere.azurewebsites.net/produtos")

  try {
    carrinhoa = JSON.parse(getCookie("carrinhoa"))
    carrinhof()
  }
  catch{
    carrinhoa = []
    setCookie("carrinhoa", JSON.stringify(carrinhoa), 10)
    carrinhof()
  }


  var params = window.location.search.substring(1).split('&');
  var paramArray = {};
  for (var i = 0; i < params.length; i++) {
      var param = params[i].split('=');
      paramArray[param[0]] = param[1];
  }

  let id = paramArray.id

  document.getElementById("imagem").src = carinho[parseInt(id)].src
  document.getElementById("nomea").innerText = carinho[parseInt(id)].nome
  document.getElementById("precospan").innerText = carinho[parseInt(id)].preco
  document.getElementById("conditions").innerText = carinho[parseInt(id)].detalhes + " " + document.getElementById("conditions").innerText
  document.getElementById("descp").innerText = carinho[parseInt(id)].descricao

  document.title = carinho[parseInt(id)].nome;
}

// Função que redireciona para a pagina inicial
function telaincial(){
  window.open("./index.html", "_self")
}

// Função que redireciona para a tela de produtos
function telaprodutos(){
  window.open("./produtos.html", "_self")

}

// Função para tremer o form quando mal preenchido
function erro(e){
  var element = e
  element.classList.add('erro');
  setTimeout(removeclasse, 5000, element)
}

// Função auxiliar a função erro
function removeclasse(e){
  e.classList.remove('erro');
}

// Função para abrir email com corpo do email preenchido
function abreemail(e){

  let body = `Olá me chamo ${document.getElementById('nome').value}. %0D%0A%0D%0A${document.getElementById('exampleFormControlTextarea1').value}`

  window.open(`mailto:contato@primavera.com?subject=Contato&body=${body}`, "_self")
  document.getElementById('emailenvi').reset();
}

// Função para adicionar interatividade com o like
function like(e){
  e.classList.toggle("fa-solid");
}

async function loadpaginaincial(){
  carrinhoa = cookiescarrinho()
}

function finaliza(){
  carrinhoa = []
  setCookie("carrinhoa", JSON.stringify(carrinhoa), 10)
  carrinhof()
}

async function excel(){

  carinho = await chamaapi("https://primavere.azurewebsites.net/excel")
  filename='reports.xlsx';
  data=carinho
  var ws = XLSX.utils.json_to_sheet(data);
  var wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  XLSX.writeFile(wb,filename);
  
}