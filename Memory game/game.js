const cardColors = ["red", "red", "green", "green", "blue", "blue", "brown", "brown", "yellow", "yellow", "gray", "gray", "cadetblue", "cadetblue", "violet", "violet", "lightgreen", "lightgreen"];


let cards = document.querySelectorAll("div");   //Nodelist
//console.log(cards); // Nodelist
//console.log(cards instanceof Array);    // false

cards = [...cards]; // Nodelist to Array
//cards = [div,div,div,div]
//console.log(cards); // array
//console.log(cards instanceof Array);    // true

const startTime = new Date().getTime();

let activeCard = "";    //clicked card
const activeCards = [];

const gamePairs = cards.length/2;
let gameResult = 0;





const clickCard = function() {
    /* Mini Game - two clicks */
    activeCard = this;  //card which was clicked
    
    if(activeCard == activeCards[0]) return;    // clicking in the same card finishes function
    
    activeCard.classList.remove("hidden");
    
    //Is it a 1st click?
    if(activeCards.length === 0) {
        activeCards[0] = activeCard;
        console.log("1");
        return;
    }
    
    //Is it a 2nd click?
    else {
        // remove possibility of clicking
        console.log('2');
        cards.forEach(card => card.removeEventListener("click", clickCard));
        activeCards[1] = activeCard;
        console.log(activeCards);
        
        setTimeout(function(){
            if(activeCards[0].className === activeCards[1].className) {
                console.log('wygrana');
                activeCards.forEach(card => card.classList.add("off"));
                gameResult++;
                // removing quessed cards from the array
                cards = cards.filter(card => !card.classList.contains("off"));  // if !card.classList.contains("off") = "false" then the element(card) is removed from the array
                
                if(gameResult == gamePairs) {
                    console.log("WYGRANA GRA");
                    const endTime = new Date().getTime();
                    const gameTime = (endTime - startTime)/1000;
                    alert(`WINNER! Your score is: ${gameTime} seconds.`);
                    location.reload();  // refresh the page and start the game 
                }
                
            } else {
                console.log('przegrana');
                activeCards.forEach(card => card.classList.add("hidden"));
            }
            activeCard = "";
            activeCards.length = 0;
            cards.forEach(card => card.addEventListener("click", clickCard));
        },500);
        
    }
    
    
};


const init = function() {
    cards.forEach(card => {
        const position = Math.floor(Math.random() * cardColors.length); //0,1,2,3...17
        card.classList.add(cardColors[position]);   // adding color to the card
        cardColors.splice(position, 1); //delete choosed index from the array 
    })
    
    setTimeout(function() {
        cards.forEach(card => {
            card.classList.add("hidden");
            card.addEventListener("click", clickCard);
        })
    }, 2000)
}

init();

































