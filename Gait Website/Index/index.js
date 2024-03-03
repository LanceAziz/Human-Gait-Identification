
// to make nav bar active with scroll

// const li =document.querySelectorAll(".link") ;
// const sec =document.querySelectorAll("section") ;


// function activemenu(){
//   let len=sec.length
//   while(--len&& window.scrollY +100< sec[len].offsetTop ){}
//   li.forEach(ltx => ltx.classList.remove("nav_act"));
//   li[len].classList.add("nav_act");
// }
// activemenu();
// window.addEventListener("scroll",activemenu);

// to make predict button active
let button_1 = document.querySelector('.button_1')
document.querySelector('#btn1').onclick=()=>{
    button_1.classList.add('act_btn')
     button_2.classList.remove('act_btn')
}

let button_2 = document.querySelector('.button_2')
document.querySelector('#btn2').onclick=()=>{
    button_2.classList.add('act_btn')
    button_1.classList.remove('act_btn')
}
// moving in pages
function bili(){
    var m =document.getElementById("home_page")
    var x =document.getElementById("predict_page")
    var r =document.getElementById("logs_page")
    var y =document.getElementById("guide_page")
    var t =document.getElementById("h")
    
    m.style.display="block";
    x.style.display="none";
    r.style.display="none";
    y.style.display="none";
    t.classList.add('nav_act')


}
function noti(){
    var m =document.getElementById("home_page")
    var x =document.getElementById("predict_page")
    var r =document.getElementById("logs_page")
    var y =document.getElementById("guide_page")
    m.style.display="none";
    x.style.display="block";
    r.style.display="none";
    y.style.display="none";
    

}

function profile(){
    var m =document.getElementById("home_page")
    var x =document.getElementById("predict_page")
    var r =document.getElementById("logs_page")
    var y =document.getElementById("guide_page")
    m.style.display="none";
    x.style.display="none";
    r.style.display="block";
    y.style.display="none";
    

}
function security(){
    var m =document.getElementById("home_page")
    var x =document.getElementById("predict_page")
    var r =document.getElementById("logs_page")
    var y =document.getElementById("guide_page")
    m.style.display="none";
    x.style.display="none";
    r.style.display="none";
    y.style.display="block";
    

}
