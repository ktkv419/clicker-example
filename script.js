const item = document.querySelector("#item")
const container = document.querySelector("#container")
const counter = document.querySelector(".counter__value")
const counterPerSec = document.querySelector(".counter__per-sec")
// const click = document.querySelector(".click")
const powerUpElements = [...document.querySelectorAll(".power-up")]
const finish = document.querySelector(".finish")
const finishScore = 100000
const clickPowerUps = [0, 3]

let clickValue = 1
let score = +JSON.parse(window.localStorage.getItem("score")) || 0

const powerUps = powerUpElements.map((element, index) => {
  return {
    id: index,
    price: +element.querySelector(".price__value").innerHTML,
    baseReward: +element.querySelector(".power-up__reward").innerHTML,
    reward: +element.querySelector(".power-up__reward").innerHTML,
    amount: 0,
    auto: !clickPowerUps.includes(index),
    element: element,
    buy: function () {
      if (score >= this.price) {
        score -= this.price
        setScore(score)
        this.amount += 1
        this.element.querySelector(".power-up__amount").innerHTML = this.amount
        this.price = Math.round(this.price * 1.2)
        this.element.querySelector(".price__value").innerHTML = this.price
        this.reward = this.baseReward * this.amount
        // this.element.querySelector(".power-up__reward").innerHTML = this.reward
        this.element.classList.add("power-up--active")
        if (!this.auto) clickValue += this.reward
      }
    },
  }
})

const setScore = (newScore) => {
	console.log(score, finishScore, score >= finishScore)
  if (score >= finishScore) finish.classList.remove("finish--inactive")
  counter.innerHTML = newScore
}

const calculateTick = () => {
  const perSec = powerUps.reduce(
    (acc, powerUp) =>
      powerUp.auto === true ? (acc += powerUp.reward * powerUp.amount) : acc,
    0
  )
  counterPerSec.innerHTML = perSec
  return perSec
}

const buyPowerUp = (id) => {
  const powerUp = powerUps.find((powerUp) => powerUp.id === id)
  powerUp.buy()
}

const handleClick = (e) => {
  score += clickValue
  setScore(score)
  // click.style.left = `${e.clientX}px`
  // click.style.top = `${e.clientY}px`
}

// Click on the item
item.addEventListener("mousedown", handleClick)

const init = () => {
  setInterval(() => {
    score += calculateTick()
    setScore(score)
    window.localStorage.setItem("score", JSON.stringify(score))
  }, 1000)

  powerUps.forEach((el) => {
    el.element.addEventListener("mousedown", () => {
      buyPowerUp(el.id)
    })
  })
}

init()
