import { menuArray } from "./data.js"

const menuList = document.getElementById("list-element");
const orderFooter = document.getElementById("order-footer")
const itemList = document.getElementById("item-list")
const totalPrice = document.getElementById("total-price")
const checkOutBtn = document.getElementById("complete-order-btn")
const modalForm = document.getElementById("modal").children[0]
const afterpayMessage = document.getElementById("afterpay-message-container")

let orderArray = []

generateMenu()

function generateMenu(){

    addItemsToMenu(menuArray)

    const menuButtons = document.querySelectorAll(".add-btn");
    
    for(let btn of menuButtons){    
        btn.addEventListener("click" , addItemsToOrder)
    }

}

function addItemsToMenu(menuArray){
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
}


function addItemsToOrder(){
    const itemObject = menuArray.filter(menuItem=>
        menuItem.id == this.dataset.id)[0]

    if(orderFooter.className === "hidden")
        orderFooter.classList.toggle("hidden")

    const childArray = [...itemList.children]

    const duplicateItem = childArray.find((child) => 
        child.dataset.id === this.dataset.id)

    if(!duplicateItem){
        createItem(this, itemObject)       
    }else{
        ModifyDuplicate(duplicateItem.children[0], itemObject)
    }
}

function ModifyDuplicate(duplicate, itemObject, isDecrementing=false){
        let duplicateText = duplicate.innerHTML
        const indexOfCount = duplicateText.indexOf('x')+1

        let substring = duplicateText.substring(indexOfCount)
        const buttonSubString = substring.substring(substring.indexOf('<'))

        if(!isDecrementing)
        substring = Number(substring.
            substring(0, substring.indexOf('<')))+1
        else
            substring = Number(substring.
                substring(0, substring.indexOf('<')))-1

        const count = Number(substring)
        
        substring+=buttonSubString

        duplicateText = duplicateText.split('x')[0] + "x " + substring
        duplicate.innerHTML = duplicateText

        if(count ===1)
            duplicate.children[0].addEventListener("click", removeItem);
        else
            duplicate.children[0].addEventListener("click", removeDuplicate);

        if(itemObject){
            orderArray.push(itemObject.price)
            recalculateTotal(orderArray)
        }
}

function createItem(btn, itemObject){
    const itemContainer = document.createElement("li")
    itemContainer.classList+="space-between"
    itemContainer.dataset.id = btn.dataset.id;

    const newItemInList = document.createElement("li")
    newItemInList.classList+="title-span"
    newItemInList.textContent = `${itemObject.name} x 1`
    
    const removeBtn = document.createElement("button")
    removeBtn.classList+="remove-btn"
    removeBtn.textContent = "remove"

    removeBtn.addEventListener("click", removeItem)

    newItemInList.appendChild(removeBtn)
    itemContainer.appendChild(newItemInList)

    const newPriceInList = document.createElement("li")
    newPriceInList.classList+="price-span"
    newPriceInList.textContent = `$${itemObject.price}`

    itemContainer.appendChild(newPriceInList)

    itemList.appendChild(itemContainer)

    orderArray.push(itemObject.price)
    recalculateTotal(orderArray)
}


function removeItem(){
    const removedItemPrice = Number(this.parentElement.parentElement.children[1].textContent.substring(1))
    this.parentElement.parentElement.parentElement.removeChild(this.parentElement.parentElement)

    let hasPriceBeenFound = false
    orderArray = orderArray.filter(function(orderItem){
    if(orderItem == removedItemPrice && !hasPriceBeenFound){
        hasPriceBeenFound = !hasPriceBeenFound;
        return 0;
    }
    return 1
    })
    try{
        recalculateTotal(orderArray)
    }catch(err){
        orderFooter.classList.toggle("hidden")
    }
}

function removeDuplicate(){
    const removedItemPrice = Number(this.parentElement.parentElement.children[1].textContent.substring(1))

    let hasPriceBeenFound = false
    orderArray = orderArray.filter(function(orderItem){
    if(orderItem == removedItemPrice && !hasPriceBeenFound){
        hasPriceBeenFound = !hasPriceBeenFound;
        return 0;
    }
    return 1
    })
    recalculateTotal(orderArray)

    const duplicate = this.parentElement
    ModifyDuplicate(this.parentElement, null, true)
}


function recalculateTotal(orderArray){   
    totalPrice.textContent = `$${orderArray.reduce( 
        (total, price) =>  total + price)}`
}

checkOutBtn.addEventListener("click", 
    function() {
        document.getElementById("modal").classList.toggle("hidden")
        this.disabled = !this.disabled
        document.body.scrollTop = document.documentElement.scrollTop = 0
});




modalForm.addEventListener("submit", function(e){
        e.preventDefault()
        modalForm.parentElement.classList.toggle("hidden")
        orderFooter.classList.toggle("hidden")
        afterpayMessage.classList.toggle("hidden")
        window.scrollTo(0, document.body.scrollHeight);
        checkOutBtn.disabled = !checkOutBtn.disabled

        for(let button of document.getElementsByClassName("add-btn"))
            button.disabled = !button.disabled
})


