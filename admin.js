async function addBet(){


let data = new FormData();


data.append(
"sport",
document.getElementById("sport").value
);


data.append(
"date",
document.getElementById("date").value
);


data.append(
"bookmaker",
document.getElementById("bookmaker").value
);


data.append(
"motif",
document.getElementById("motif").value
);


data.append(
"cote",
document.getElementById("cote").value
);


data.append(
"mise",
document.getElementById("mise").value
);


data.append(
"benefice",
0
);


data.append(
"resultat",
document.getElementById("resultat").value
);



try {


await fetch(

"https://script.google.com/macros/s/AKfycbxJRxBw-wkDqXYnEoXmHgLYA1il4TVW6HwEMnqhq52Gkx5WO-Jcf1EeXgRK6hEhxBgJOA/exec",

{
method:"POST",
mode:"no-cors",
body:data
}

);



document
.getElementById("message")
.textContent =
"✅ Pari ajouté dans Google Sheets";



}

catch(error){

document
.getElementById("message")
.textContent =
"❌ " + error.message;

console.error(error);

}


}
