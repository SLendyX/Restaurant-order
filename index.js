import { menuArray } from "./data.js"

const menuList = document.getElementById("list-element");

function generateMenu(){
    let listItem = ``

    menuArray.forEach(menuItem => { 
        listItem+=`
        <li>
        <div class="menu-item-container">
            <i>${menuItem.emoji}</i>
            <div>
                <span class="title-span">${menuItem.name}</span>
                <p>${menuItem.ingredients.join(", ")}</p>
                <span class="price-span">$${menuItem.price}</span>
            </div>
        </div>
        <button class="add-btn">+</button>
        </li>`
    })

    menuList.innerHTML = listItem;



/*
`
<li>
<div class="menu-item-container">
    <i>ITEM EMOJI</i>
    <div>
        <span class="title-span">ITEM NAME</span>
        <p>INGREDIENT LIST</p>
        <span class="price-span">$PRICE</span>
    </div>
</div>
<button class="add-btn">+</button>
</li>`
*/
}




generateMenu()