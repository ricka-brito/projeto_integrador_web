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


var carinho = [
  {
      nome: "Kit 3 vasos - Ambiente Externo PRIMAVERA",
      src: "/assets/img/image2.png",
      preco: "R$ 199,90",
      detalhes: " ou 4x R$ 49,90"
  },
  {
      nome: "Vaso ornamentado - 40cm PRIMAVERA",
      src: "/assets/img/image1.png",
      preco: "R$ 120,00",
      detalhes: " ou 3x R$ 40,00"
  },
  {
      nome: "Estatua Buda Grande - 40cm PRIMAVERA",
      src: "/assets/img/image3.png",
      preco: "R$ 99,90",
      detalhes: " ou 2x R$ 49,90"
  },
  {
      nome: "Cobogó Chines Vazado - 40cm PRIMAVERA",
      src: "/assets/img/Elemento Vazado Taco Chinês 39x39x7_1.png",
      preco: "R$ 29,90",
      detalhes: " à unidade"
  },
  {
      nome: "Estatua Cristo Grande - 90cm PRIMAVERA",
      src: "/assets/img/D_NQ_NP_943571-MLB46881873244_072021-W-removebg-preview.png",
      preco: "R$ 249,90",
      detalhes: " ou 5x 49,90"
  },
  {
      nome: "Banco liso Externo - 90cm PRIMAVERA",
      src: "/assets/img/preco-medio-custo-banco-de-concreto-pre-moldado-removebg-preview.png",
      preco: "R$ 399,90",
      detalhes: " ou 4x 99,90"
  },
  {
      nome: "Terra vegetal TERRAL - 3kg PRIMAVERA",
      src: "/assets/img/e071b6_2bdc93c2a25b47dd8b75cc70ffa469be~mv2.png",
      preco: "R$ 39,90",
      detalhes: " à unidade"
  },
  {
      nome: "Kit Balaustre completo - PRIMAVERA",
      src: "/assets/img/kitbalau.png",
      preco: "R$ 69,90",
      detalhes: " por metro"
  },
  {
      nome: "Balaustre avulso - PRIMAVERA",
      src: "/assets/img/balaustre_concreto_tipo_principe_0_60x13cm_atacadao_lazer_89827906_0002_600x600-removebg-preview.png",
      preco: "R$ 39,90",
      detalhes: " à unidade"
  }
];

var itensa = 8;

function itens(){
  var itensb = $(".galeriaprodutos");
  itensb.empty()
  for(let i = 0; i<itensa; i++){
      try{
        let string = `
        <div class="product">
            <div onclick="redireciona(event)" class="bga">
                <img src="${carinho[i]["src"]}"  alt="...">
            </div>
            <h1 onclick="redireciona(event)">${carinho[i]["nome"]}</h1>
            <div class="preco">
                <p onclick="redireciona(event)"><span>${carinho[i]["preco"]}</span>${carinho[i]["detalhes"]}</p>
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

function itensfiltro(){
  var itensb = $(".galeriaprodutos");
  itensb.empty()
  for(let i = 0; i<carinho.length; i++){
      if(carinho[i]["nome"].includes('Buda')){
        let string = `
        <div class="product">
            <div class="bga">
                <img src="${carinho[i]["src"]}"  alt="...">
            </div>
            <h1>${carinho[i]["nome"]}</h1>
            <div class="preco">
                <p><span>${carinho[i]["preco"]}</span>${carinho[i]["detalhes"]}</p>
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

function add(){
  itensa = itensa + 4
  itens()
  var itensb = document.getElementsByClassName("galeriaprodutos")[0]
  console.log(carinho.length)
  console.log(itensb.childElementCount)
  if(itensb.childElementCount==carinho.length){
    document.getElementById("butao1").style.display = "none";
  }
}


function redireciona(e){
  console.log(e.target.tagName)
  switch (e.target.tagName){
    case "H1":
      for(let i = 0; i<carinho.length; i++){
        if(carinho[i].nome == e.target.innerText){
          window.open(`../produtos.html?id=${i}`, "_self")
        }
      }
      break;
    case "DIV":
      for(let i = 0; i<carinho.length; i++){
        if(carinho[i].nome == e.target.parentNode.querySelector("h1").innerText){
          window.open(`../produtos.html?id=${i}`, "_self")
        }
      }
    case "IMG":
      for(let i = 0; i<carinho.length; i++){
        if(carinho[i].nome == e.target.parentNode.parentNode.querySelector("h1").innerText){
          window.open(`../produtos.html?id=${i}`, "_self")
        }
      }
    case "P":
      for(let i = 0; i<carinho.length; i++){
        if(carinho[i].nome == e.target.parentNode.parentNode.querySelector("h1").innerText){
          window.open(`../produtos.html?id=${i}`, "_self")
        }
      }
    case "SPAN":
      for(let i = 0; i<carinho.length; i++){
        if(carinho[i].nome == e.target.parentNode.parentNode.parentNode.querySelector("h1").innerText){
          window.open(`../produtos.html?id=${i}`, "_self")
        }
      }
      
  }
}