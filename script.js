/* =====================================
   MES COTES BOOSTEES
   SCRIPT V1.2 STABLE
===================================== */


let bets = [];
let filteredBets = [];



/* =====================================
   CHARGEMENT GOOGLE SHEETS
===================================== */


async function loadBets(){


try {


console.log("Appel Google en cours");

const response =
await fetch(CONFIG.API_URL);

console.log("Réponse Google :", response);


const data =
await response.json();


console.log(
"Données reçues :",
data
);



let headerIndex = -1;



data.forEach((row,index)=>{


let ligne =
row.join(" ")
.toLowerCase();



if(
ligne.includes("sport")
&&
ligne.includes("bookmaker")
){

headerIndex = index;

}


});



if(headerIndex === -1){

console.error(
"Impossible de trouver les colonnes"
);

return;

}




bets = [];



data
.slice(headerIndex + 1)
.forEach(row=>{


if(row.length < 8)
return;



let bet = {


sport:
formatSport(row[0]),


date:
formatDate(row[1]),


bookmaker:
clean(row[2]),


motif:
clean(row[3]),


cote:
Number(row[4])
||0,


mise:
Number(row[5])
||0,


benefice:
parseBenefice(row[6]),


resultat:
clean(row[7])


};




if(
bet.bookmaker
&&
bet.motif
){

bets.push(bet);

}



});



console.log(
"Paris chargés :",
bets
);



filteredBets =
[...bets];



createFilters();

displayBets();

updateStats();

displayLastBet();



}

catch(error){


console.error(
"Erreur API :",
error
);


}



}





/* =====================================
   OUTILS
===================================== */


function clean(value){


if(!value)
return "";


return value
.toString()
.trim();


}




function parseBenefice(value){


if(!value)
return 0;



return Number(

value
.toString()
.replace("+","")
.replace("€","")
.replace(",", ".")

)

||0;


}






/* =====================================
   SPORTS
===================================== */


function formatSport(value){


let sport =
clean(value)
.toLowerCase();



if(
sport.includes("foot")
||
sport.includes("football")
)

return "⚽ Football";



if(
sport.includes("basket")
)

return "🏀 Basket";



if(
sport.includes("tennis")
)

return "🎾 Tennis";



if(
sport.includes("combat")
||
sport.includes("mma")
||
sport.includes("boxe")
)

return "🥊 Combat";



if(
sport.includes("hockey")
)

return "🏒 Hockey";



if(
sport.includes("baseball")
)

return "⚾ Baseball";



return value || "🏆 Autre";


}






/* =====================================
   DATE
===================================== */


function formatDate(value){


if(!value)
return "";



let date =
new Date(value);



if(!isNaN(date)){


let jour =
String(date.getDate())
.padStart(2,"0");



let mois =
String(date.getMonth()+1)
.padStart(2,"0");



let annee =
date.getFullYear();



return `${jour}/${mois}/${annee}`;


}



return value
.toString()
.split(" ")[0];


}




function getMonth(date){


let p =
date.split("/");



if(p.length === 3){


return p[1]+"/"+p[2];


}


return "";


}

/* =====================================
   STATUT DES PARIS
===================================== */


function getStatus(resultat){


let r =
resultat
.toLowerCase();



if(
r.includes("gagn")
){

return "win";

}



if(
r.includes("rembours")
||
r.includes("push")
||
r.includes("nul")
||
r.includes("annul")
){

return "refund";

}



return "loss";


}






/* =====================================
   AFFICHAGE DES CARTES
===================================== */


function displayBets(){


const container =
document.getElementById(
"bets-container"
);



container.innerHTML = "";



[...filteredBets]
.reverse()
.forEach(bet=>{


let status =
getStatus(
bet.resultat
);



let texteStatus = "";



if(status==="win")
texteStatus="🟢 GAGNÉ";


if(status==="refund")
texteStatus="🟡 REMBOURSÉ";


if(status==="loss")
texteStatus="🔴 PERDU";




let card =
document.createElement(
"div"
);



card.className =
"bet-card";



card.innerHTML = `


<div class="bet-header">


<div class="sport">

${sportName(bet.sport)}

</div>


<div class="bookmaker">

${bet.bookmaker}

</div>


</div>



<div class="bet-motif">

${bet.motif}

</div>




<div class="bet-info">


<div>
📅 ${bet.date}
</div>


<div>
🎯 Cote : ${bet.cote}
</div>


<div>
💶 Mise : ${bet.mise} €
</div>



<div class="${status}">


${texteStatus}


<br>


${
bet.benefice >= 0
?
"+"
:
""
}

${bet.benefice.toFixed(2)} €


</div>



</div>


`;



container.appendChild(card);



});



}







/* =====================================
   STATISTIQUES
===================================== */


function updateStats(){


let profit = 0;

let mise = 0;

let gagne = 0;

let perdu = 0;



filteredBets.forEach(bet=>{


profit += bet.benefice;


mise += bet.mise;



let status =
getStatus(
bet.resultat
);



if(status==="win")
gagne++;



if(status==="loss")
perdu++;



});



let total =
filteredBets.length;



let joues =
gagne + perdu;



let taux =

joues
?
(gagne / joues) * 100
:
0;



let roi =

mise
?
(profit / mise) * 100
:
0;




document
.getElementById("profit")
.textContent =

(profit>=0 ? "+" : "")
+
profit.toFixed(2)
+
" €";



document
.getElementById("bets")
.textContent =
total;



document
.getElementById("success")
.textContent =
taux.toFixed(0)
+
"%";



document
.getElementById("roi")
.textContent =
roi.toFixed(1)
+
"%";



}







/* =====================================
   FILTRES
===================================== */


function createFilters(){


fillSelect(
    "sportFilter",
    [
        ...new Set(
            bets.map(
                b => b.sport
            )
        )
    ]
);



fillSelect(
    "bookmakerFilter",
    [
        ...new Set(
            bets.map(
                b => b.bookmaker
            )
        )
    ]
);



fillSelect(
    "monthFilter",
    [
        ...new Set(
            bets
            .map(
                b => getMonth(b.date)
            )
            .filter(
                m => m
            )
        )
    ]
);


}





function fillSelect(id,values){


let select =
document.getElementById(id);



values.forEach(value=>{


let option =
document.createElement(
"option"
);



option.value =
value;



option.textContent =
value;



select.appendChild(option);



});


}







/* =====================================
   APPLICATION FILTRES
===================================== */


function applyFilters(){


let recherche =
document
.getElementById("search")
.value
.toLowerCase();



let sport =
document
.getElementById("sportFilter")
.value;



let bookmaker =
document
.getElementById("bookmakerFilter")
.value;



let mois =
document
.getElementById("monthFilter")
.value;




filteredBets =
bets.filter(bet=>{


return (


bet.motif
.toLowerCase()
.includes(recherche)



&&



(
!sport
||
bet.sport===sport
)



&&



(
!bookmaker
||
bet.bookmaker===bookmaker
)



&&



(
!mois
||
getMonth(bet.date)===mois
)



);


});



displayBets();

updateStats();



}






/* =====================================
   DERNIER PARI
===================================== */


function displayLastBet(){


if(!bets.length)
return;



let bet =
bets[bets.length-1];



document
.getElementById("lastBet")
.innerHTML = `


<div class="bet-card">


<h2>
🔥 Dernière cote boostée
</h2>


<p>
${bet.sport}
-
${bet.bookmaker}
</p>


<p>
${bet.motif}
</p>


<h3>
🎯 Cote ${bet.cote}
</h3>


</div>


`;



}







/* =====================================
   EVENEMENTS
===================================== */


document
.getElementById("search")
.addEventListener(
"input",
applyFilters
);



document
.getElementById("sportFilter")
.addEventListener(
"change",
applyFilters
);



document
.getElementById("bookmakerFilter")
.addEventListener(
"change",
applyFilters
);



document
.getElementById("monthFilter")
.addEventListener(
"change",
applyFilters
);

function sportName(symbol){

    const sports = {

        "⚽": "Football",
        "🏀": "Basket",
        "🎾": "Tennis",
        "🥊": "Combat",
        "🏒": "Hockey",
        "⚾": "Baseball",
        "🏎️": "Formule 1",
        "🏉": "Rugby",
        "🏌️": "Golf",
        "🏓": "Tennis de table",
        "🏐": "Volley"

    };


    return sports[symbol]
    ? symbol + " " + sports[symbol]
    : symbol;

}




/* =====================================
   LANCEMENT
===================================== */

loadBets();
