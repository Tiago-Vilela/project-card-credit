import "./css/index.css"
import IMask from "imask"

const ccBgColor01 = document.querySelector(".cc-bg svg > g g:nth-child(1) path")
const ccBgColor02 = document.querySelector(".cc-bg svg > g g:nth-child(2) path")
const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img ")


function setCardType(type) {
    const colors = {
        visa: ["#436D99" , "2D57F2"], 
        mastercard: ["#DF6F29" , "#C69347"],
        default: ["black" , "gray" ],
    }

    ccBgColor01.setAttribute('fill' , colors[type][0])
    ccBgColor02.setAttribute('fill' , colors[type][1])
    ccLogo.setAttribute('src' , `cc-${type}.svg`)
}

globalThis.setCardType = setCardType;

const securityCode = document.querySelector('#security-code')
const securityCodePattern = {
    mask: '0000' ,
}
const securityCodeMask = IMask(securityCode , securityCodePattern)

const expirationDate = document.querySelector('#expiration-date')

const expirationDatePattern = {
    mask: 'MM{/}YY' ,
    blocks: {
        YY: {
            mask: IMask.MaskedRange,
            from: String(new Date().getFullYear()).slice(2),
            to: String(new Date().getFullYear() + 10).slice(2),
        },
        MM: {
            mask: IMask.MaskedRange ,
            from: 1,
            to: 12
        },
    },
}
const expirationDateMask = IMask(expirationDate , expirationDatePattern)

/*Expressoes Regulares
Tambem conhecida como Regular Expression ou Regex e uma tecnologia usada para buscar padroes dentro
de textos e funciona em diversas linguagens 

Exemplo: Busque por todos os caracteres numericos dentro de algum texto
*/

const cardNumber = document.querySelector('#card-number')
const cardNumberPattern = {
    mask: [
        {
            mask: '0000 0000 0000 0000' , 
             regex: /^4\d{0,15}/,                                               
            cardType: 'visa' , 
        },
        {
            mask: '0000 0000 0000 0000' , 
            regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
            cardType: 'mastercard' , 
        },
        {
            mask: '0000 0000 0000 0000' ,
            
            cardType: 'default' , 
        },
    ],
    //dispatch uma propriedade que e uma funçao que vai ser executada toda vez que digitarmos no input
    dispatch: function (appended ,  dynamicMaske ) {
        const number = (dynamicMaske.value + appended).replace(/\D/g,'');
        const foundMask = dynamicMaske.compiledMasks.find(function (item){
            return number.match(item.regex)
        })
       
        return foundMask
    },
}

const cardNumberMasked = IMask(cardNumber , cardNumberPattern)


const addButton = document.querySelector('#add-card')

addButton.addEventListener('click' ,  handleButton)
function handleButton (event) {
    event.preventDefault()
  console.log('O botao foi clicado!')
}


const inputHolder = document.querySelector('#card-holder')
inputHolder.addEventListener('input' , () => {
    handleInputHolder()
})

function handleInputHolder() {
    const ccHolder = document.querySelector('.cc-holder .value ')
    ccHolder.innerText = inputHolder.value.length === 0 ? 'FULANO DA SILVA' : inputHolder.value
}

//evento parecido com o input, mas ele so observa o conteudo do input, vai capturar o conteudo quando aceito (accept)
securityCodeMask.on('accept' , ()=>{
    updateSecurityCode(securityCodeMask.value)
})

function updateSecurityCode(code) {
    const ccSecurity = document.querySelector('.cc-security .value')
    ccSecurity.innerText = code.length === 0 ? '123' : code  
}


cardNumberMasked.on('accept' , () => {
    //Aqui verifica o tipo da bandeira do cartao ao digitar os numeros no mask cardNumber.
    const cardType =  cardNumberMasked.masked.currentMask.cardType 
    setCardType(cardType)
    UpdateNumberCard(cardNumberMasked.value)
})

function UpdateNumberCard(number) {
    const ccInfoNumber = document.querySelector('.cc-number')                           
    ccInfoNumber.innerText = number.length === 0 ? '1234 5678 9012 3456' : number
}


expirationDateMask.on('accept' , ()=> {
    updateCardExpiration(expirationDateMask.value)
})

function updateCardExpiration(date) {
    const ccExpiration = document.querySelector('.cc-extra .value')
    ccExpiration.innerText =  date.length === 0 ? '02/32' : date 
}