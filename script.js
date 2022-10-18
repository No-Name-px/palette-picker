const cols = document.querySelectorAll(".col");

document.addEventListener("keydown", (e) => {
    if(e.code == "Space"){
        setRandomColors();
    }
});

document.addEventListener("click", (e) => {
    const type = e.target.dataset.type;
    switch(type){
        case "lock":
            let item = e.target.tagName.toLowerCase() == 'i' 
                ? e.target 
                : e.target.children[0] ;
            changeLock(item);
            break;
        case "copy":
            CopyToClickboard(e.target.innerHTML);
            break;
    }
});

function setRandomColors(isFirstCall){
    let colors = isFirstCall ? getColorsFromHash() : [];
    
    cols.forEach((col, index) => {
        const lockButton = col.querySelector("i");
        const isLocked = lockButton.classList.contains("fa-lock");
        const text = col.querySelector("h2");

        if(isLocked){
            colors.push(text.innerHTML);
            return;
        }
        let newColor = isFirstCall 
            ? colors[index] 
                ? colors[index]
                : generateRandomColor()
            : generateRandomColor();
        if(!isFirstCall){
            colors.push(newColor);
        }

        col.style.backgroundColor = newColor;
        text.innerHTML = newColor;

        setTextColor(text, newColor);
        setTextColor(lockButton, newColor);
    })
    updateColorHash(colors);
}
function generateRandomColor(){
    const values = "0123456789ABCDEF";
    let result = "#";
    for(let i = 0; i < 6; i++){
        result += values[Math.floor(Math.random() * values.length)];
    }
    return result;
}

function setTextColor(item, color){
    let luminance = chroma(color).luminance();
    item.style.color = luminance < 0.5 ? "white" : "black";
}
function changeLock(item){
    if(item.classList.contains("fa-unlock")){
        item.classList.remove("fa-unlock");
        item.classList.add("fa-lock");
    }
    else{
        item.classList.add("fa-unlock");
        item.classList.remove("fa-lock");
    }
}
function CopyToClickboard(text){
    return navigator.clipboard.writeText(text);
}

function updateColorHash(colors = []){
    document.location.hash = colors.map(color => {
        return color.slice(1);
    }).join("-");
}

function getColorsFromHash(){
    if (document.location.hash.length > 1){
        let colors = document.location.hash.substring(1).split("-").map(color =>{
            return "#" + color;
        })
        return colors;
    }
    return [];
}
setRandomColors(true);