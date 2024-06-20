import { menuArray } from "./data.js"

const menuList = document.getElementById("list-element");
const orderFooter = document.getElementById("order-footer")
const itemList = document.getElementById("item-list")
const totalPrice = document.getElementById("total-price")
const checkOutBtn = document.getElementById("complete-order-btn")

let orderArray = []

function generateMenu(){
    let listItem = ``

    menuArray.forEach(menuItem => { 
        listItem+=`
        <li class="spacing-menu">
        <div class="menu-item-container">
            <i>${menuItem.emoji}</i>
            <div>
                <span class="title-span">${menuItem.name}</span>
                <p class="ingredient-list">${menuItem.ingredients.join(", ")}</p>
                <span class="price-span">$${menuItem.price}</span>
            </div>
        </div>
        <button class="add-btn" data-id="${menuItem.id}">+</button>
        </li>`
    })

    menuList.innerHTML = listItem;

    const menuButtons = document.querySelectorAll(".add-btn");
    
    for(let btn of menuButtons){    
        btn.addEventListener("click" ,() => {
            const itemObject = menuArray.filter((menuItem)=>{
                return menuItem.id == btn.dataset.id
            })[0]

            if(orderFooter.className === "hidden")
                orderFooter.classList.toggle("hidden")

            // const childArray = [...itemList.children]

            // const duplicateItem = childArray.find((child) => child.dataset.id === btn.dataset.id)

            // if(!duplicateItem){

            const itemContainer = document.createElement("li")
            itemContainer.classList+="space-between"
            itemContainer.dataset.id = btn.dataset.id;

            const newItemInList = document.createElement("li")
            newItemInList.classList+="title-span"
            newItemInList.textContent = `${itemObject.name}`
            
            const removeBtn = document.createElement("button")
            removeBtn.classList+="remove-btn"
            removeBtn.textContent = "remove"

            removeBtn.addEventListener("click", ()=>{

                const removedItemPrice = Number(removeBtn.parentElement.parentElement.children[1].textContent.substring(1))
                removeBtn.parentElement.parentElement.parentElement.removeChild(removeBtn.parentElement.parentElement)

                let hasPriceBeenFound = false
                orderArray = orderArray.filter(function(orderItem){
                    if(orderItem == removedItemPrice && !hasPriceBeenFound){
                        hasPriceBeenFound = !hasPriceBeenFound;
                        return 0;
                    }
                    return 1
                })
                try{
                    const newTotal = orderArray.reduce(
                        (total, price) =>  total + price)
                
                    totalPrice.textContent = `$${newTotal}`
                }catch(err){
                    orderFooter.classList.toggle("hidden")
                }
            })

            newItemInList.appendChild(removeBtn)
            itemContainer.appendChild(newItemInList)

            const newPriceInList = document.createElement("li")
            newPriceInList.classList+="price-span"
            newPriceInList.textContent = `$${itemObject.price}`

            itemContainer.appendChild(newPriceInList)

            itemList.appendChild(itemContainer)

            orderArray.push(itemObject.price)

            const newTotal = orderArray.reduce( 
                (total, price) =>  total + price)
            
            totalPrice.textContent = `$${newTotal}`
            // }
        })
    }

}

generateMenu()

checkOutBtn.addEventListener("click", 
    function() {
        document.getElementById("modal").classList.toggle("hidden")
        this.disabled = !this.disabled
        document.body.scrollTop = document.documentElement.scrollTop = 0
    });