import "./css/index.css"
import IMask from "imask"
//Constantes de seleção do DOM, utilizando querySelector
const ccBgColor1 = document.querySelector(".cc-bg svg > g g:nth-child(1) path")
const ccBgColor2 = document.querySelector(".cc-bg svg > g g:nth-child(2) path")
const ccImg = document.querySelector(".cc-logo span:nth-child(2) img")

//função para alterar cores e imagem do cartão pelo tipo
function setCardType(type) {
  const color = {
    visa: ["#436D99", "#2D57F2"],
    mastercard: ["#DF6F29", "#C69347"],
    default: ["black", "gray"],
  }
  ccBgColor1.setAttribute("fill", color[type][0])
  ccBgColor2.setAttribute("fill", color[type][1])
  ccImg.setAttribute("src", `cc-${type}.svg`)
}

// setCardType("mastercard")
// globalThis.setCardType = setCardType

//Constantes de seleção do DOM, utilizando querySelector
const securityCode = document.querySelector("#security-code")
const securityCodePatter = {
  mask: "0000",
}
//Criando a mascara do campo usando Imask
const securityCodeMasked = IMask(securityCode, securityCodePatter)

//Constantes de seleção do DOM, utilizando querySelector
const expirationDate = document.querySelector("#expiration-date")
const expirationDatePatter = {
  mask: "MM{/}YY",
  blocks: {
    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12,
    },
    YY: {
      mask: IMask.MaskedRange,
      from: String(new Date().getFullYear()).slice(2),
      to: String(new Date().getFullYear() + 10).slice(2),
    },
  },
}
//Criando a mascara do campo usando Imask
const expirationDateMask = IMask(expirationDate, expirationDatePatter)

//Constantes de seleção do DOM, utilizando querySelector
const cardNumber = document.querySelector("#card-number")

//uso avançado de mask, realizado de forma dinamica
const cardNumberPatter = {
  mask: [
    {
      mask: "0000 0000 0000 0000",
      regex: /^4\d{0,15}/,
      cardType: "visa",
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
      cardType: "mastercard",
    },
    {
      mask: "0000 0000 0000 0000",
      cardType: "default",
    },
  ],
  dispatch: (appended, dynamicMasked) => {
    const number = (dynamicMasked.value + appended).replace(/\D/g, "")

    const foundMask = dynamicMasked.compiledMasks.find(({ regex }) =>
      number.match(regex)
    )

    return foundMask
  },
}

//Criando a mascara do campo usando Imask
const cardNumberMasked = IMask(cardNumber, cardNumberPatter)

//Manipulando eventos da DOM
//adicionando evento ao botão
const addButton = document.querySelector("#add-card")
addButton.addEventListener("click", () => {
  alert("Cartão adicionado")
})
//desabilitando o reload no submit
document.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault()
})

//capturando o nome do cartão e alterando no cartão
const cardHolder = document.querySelector("#card-holder")
cardHolder.addEventListener("input", () => {
  const ccHolder = document.querySelector(".cc-holder .value")
  ccHolder.innerText =
    cardHolder.value.length === 0 ? "Fulano de Tal" : cardHolder.value
})
//Manipulando eventos do Imask

securityCodeMasked.on("accept", () => {
  updateSecurityCode(securityCodeMasked.value)
})

function updateSecurityCode(code) {
  const ccSecurity = document.querySelector(".cc-security .value")
  ccSecurity.innerText = code.length === 0 ? "123" : code
}

cardNumberMasked.on("accept", () => {
  const cardtype = cardNumberMasked.masked.currentMask.cardType
  setCardType(cardtype)
  updateCardNumber(cardNumberMasked.value)
})

function updateCardNumber(number) {
  const ccNumber = document.querySelector(".cc-number")
  ccNumber.innerText = number.length === 0 ? "1234 5678 9012 3456" : number
}

expirationDateMask.on("accept", () => {
  updateExpirationDate(expirationDateMask.value)
})

function updateExpirationDate(date) {
  const ccExperation = document.querySelector(".cc-extra .value")
  ccExperation.innerText = date.length === 0 ? "02/32" : date
}
