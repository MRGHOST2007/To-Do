const themeSwitch = document.getElementById("theme-switcher");
const bodyTag = document.querySelector("body");
const dayNight = document.getElementById("icon-day-night");
const inputText = document.getElementById("inputText");
const addBtn = document.getElementById("add-btn");
const ul = document.querySelector(".todos");
const filter = document.querySelector(".filter");
const filterRemoveBtn = document.getElementById("clear-completed");

function main() {

    themeSwitch.addEventListener("click", () => {

        bodyTag.classList.toggle("light");

        dayNight.setAttribute("src",
            dayNight.getAttribute("src") === "./images/icon-sun.svg" ? "./images/icon-moon.svg" : "./images/icon-sun.svg");

    });

    makeToDoCard(JSON.parse(localStorage.getItem("todos")));

    ul.addEventListener("dragover", (e) => {
        if (e.target.classList.contains("card") && !e.target.classList.contains("dragging")) {
            const draggingCard = document.querySelector(".dragging");
            const cards = [...ul.querySelectorAll(".card")];
            const currentPosition = cards.indexOf(draggingCard);
            const newPosition = cards.indexOf(e.target);
            if (currentPosition > newPosition) {
                ul.insertBefore(draggingCard, e.target);
            } else if (currentPosition < newPosition) {
                ul.insertBefore(e.target, draggingCard);
            }
            const todos = JSON.parse(localStorage.getItem("todos"));
            const removed = todos.splice(currentPosition, 1);
            todos.splice(newPosition, 0, removed[0]);

            localStorage.setItem("todos", JSON.stringify(todos));
        }
    });

    addBtn.addEventListener("click", () => {
        const item = inputText.value.trim();
        if (item) {
            inputText.value = "";
            const todos = !localStorage.getItem("todos") ? [] : JSON.parse(localStorage.getItem("todos"));

            const currentItem = {
                item: item,
                isCompleted: false
            };

            todos.push(currentItem);
            localStorage.setItem("todos", JSON.stringify(todos));
            makeToDoCard([currentItem]);
        }
    });

    filter.addEventListener("click", (e) => {
        const id = e.target.id;
        if (id) {
            document.querySelector(".on").classList.remove("on");
            document.getElementById(id).classList.add("on");
            document.querySelector(".todos").className = `todos ${id}`
        }
    });

    inputText.addEventListener('keydown', (e) => {
        if (e.key == 'Enter') {
            addBtn.click();
        }
    });

    filterRemoveBtn.addEventListener('click', () => {
        var deleteIndexes = [];
        document.querySelectorAll(".card.checked").forEach((card) => {
            deleteIndexes.push([...document.querySelectorAll(".todos .card")].indexOf(card));
            card.classList.add("fall");
            card.addEventListener('animationend', () => {
                card.remove();
            });

        });
        removeSome(deleteIndexes);
    });

}

function removeToDo(index) {
    const todos = JSON.parse(localStorage.getItem("todos"));
    todos.splice(index, 1);
    localStorage.setItem("todos", JSON.stringify(todos));
}

function stateToDo(index, isCompleted) {
    const todos = JSON.parse(localStorage.getItem("todos"));
    todos[index].isCompleted = isCompleted;
    localStorage.setItem("todos", JSON.stringify(todos));
}

function makeToDoCard(todoArray) {
    if (!todoArray) {
        return null;
    }

    const itemsLeft = document.querySelector("#items-left");

    todoArray.forEach(element => {

        //Create HTML Elements
        const card = document.createElement("li");
        const cbContainer = document.createElement("div");
        const cbInput = document.createElement("input");
        const checkSpan = document.createElement("span");
        const item = document.createElement("p");
        const clearBtn = document.createElement("button");
        const image = document.createElement("img");

        //Give Elements Classes
        card.classList.add("card");
        cbContainer.classList.add("cb-container");
        cbInput.classList.add("cb-input");
        checkSpan.classList.add("check");
        item.classList.add("item");
        clearBtn.classList.add("clear");

        //Give Elements Attributes
        card.setAttribute("draggable", true);
        cbInput.setAttribute("type", "checkbox");
        image.setAttribute("src", "./images/icon-cross.svg");
        image.setAttribute("alt", "CLear");
        item.textContent = element.item;

        // Sort Elements
        cbContainer.appendChild(cbInput);
        cbContainer.appendChild(checkSpan);
        clearBtn.appendChild(image);
        card.appendChild(cbContainer);
        card.appendChild(item);
        card.appendChild(clearBtn);
        document.querySelector(".todos").appendChild(card);

        if (element.isCompleted) {
            card.classList.add("checked")
            cbInput.setAttribute("checked", "checked")
        }

        //Add EventListener
        card.addEventListener("dragstart", () => {
            card.classList.add("dragging");
        });

        card.addEventListener("dragend", () => {
            card.classList.remove("dragging");
        });

        clearBtn.addEventListener("click", () => {
            const currentItem = clearBtn.parentElement;
            currentItem.classList.add("fall");
            const indexOfCurrentCard = [...document.querySelectorAll(".todos .card")].indexOf(currentItem);
            removeToDo(indexOfCurrentCard);

            currentItem.addEventListener('animationend', () => {
                setTimeout(() => {
                    currentItem.remove();
                    itemsLeft.textContent = document.querySelectorAll(".todos .card:not(.checked)").length;
                }, 100);
            });
        });

        cbInput.addEventListener("click", () => {
            const currentItem = cbInput.parentElement.parentElement;
            const checked = cbInput.checked;
            const currentItemIndex = [...document.querySelectorAll(".todos .card")].indexOf(currentItem);
            stateToDo(currentItemIndex, checked);

            checked ? currentItem.classList.add("checked") : currentItem.classList.remove("checked");

            itemsLeft.textContent = document.querySelectorAll(".todos .card:not(.checked)").length;
        });

    });

    itemsLeft.textContent = document.querySelectorAll(".todos .card:not(.checked)").length;

}

function removeSome(indexes) {
    var todos = JSON.parse(localStorage.getItem("todos"));
    todos = todos.filter((todo, index) => {
        return !indexes.includes(index);
    });

    localStorage.setItem("todos" , JSON.stringify(todos));
}

document.addEventListener("DOMContentLoaded", main);