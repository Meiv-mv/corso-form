const inputBar = document.getElementById("hobbies-bar");
const hobbiesExpBar = document.getElementById("hobbies-exp-bar");
const hobbiesBtn = document.getElementById("hobbies-btn");
const hobbiesContainer = document.getElementById("hobbies-container");
let hobbiesList = [];



hobbiesBtn.addEventListener("click", (e) => {
    let expValue = "";
    let x = hobbiesExpBar.value;
    switch (true) {
        case (x < 5):
            expValue = "Zero Esperienza";
            break;
        case (x < 20):
            expValue = "Bassa";
            break;
        case (x < 40):
            expValue = "Base";
            break;
        case (x < 60):
            expValue = "Buona";
            break;
        case(x < 75):
            expValue = "Ottima";
            break;
        case (x <= 90):
            expValue = "Eccellente";
            break;
        case (x > 90):
            expValue = "Esperto";
            break;
        default:
            expValue = "none";
    }

    // console.log(expValue);

    let hobby = {
        name: inputBar.value,
        exp: `${expValue}`
    }

    hobbiesList.push(hobby);
    inputBar.value = "";
    hobbiesExpBar.value = 50;
    // console.log(hobbiesList);

    hobbiesContainer.innerHTML = "";

    hobbiesList.forEach(item => {
        let liEl = document.createElement("li");
        liEl.setAttribute("class", "hobby-item");
        let pEl = document.createElement("p");
        pEl.textContent = item.name;
        let deleteBtnEl = document.createElement("button");
        deleteBtnEl.setAttribute("class", "delete-btn");
        deleteBtnEl.textContent = "x";
        let changeBtnEl = document.createElement("button");
        changeBtnEl.setAttribute("class", "change-btn");
        changeBtnEl.innerHTML = `<img src="/img/pencil-svgrepo-com.svg" alt="tasto di modifica">`;
        let expEl = document.createElement("p");
        expEl.innerHTML = `-${item.exp}`;

        liEl.appendChild(deleteBtnEl);
        liEl.appendChild(changeBtnEl);
        liEl.appendChild(pEl);
        liEl.appendChild(expEl);
        hobbiesContainer.appendChild(liEl);
    })

    const deleteHobbiesBtn = document.querySelectorAll(".delete-btn")
    for (let i= 0; i < deleteHobbiesBtn.length; i++) {
        deleteHobbiesBtn[i].addEventListener("click", (e) => {
            e.preventDefault();
            e.target.closest("li").remove();
        })
    }

    const changeHobbiesEl = document.querySelectorAll(".change-btn");
    for (let i = 0; i < changeHobbiesEl.length; i++) {
        changeHobbiesEl[i].addEventListener("click", (e) => {
            e.preventDefault();

        })
    }
})



