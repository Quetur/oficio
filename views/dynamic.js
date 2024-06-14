console.log("hola")
var cars={
    sedan:['Honda cyty','sedan1','sedan3' ],
    suv:['suv1','suv2','suv3' ],
    hatchback:['hatch1','hatch2','hatch3']
}

//leer select prinipal y submain
console.log("pasa")
var main = document.getElementById('main_menu');
var sub = document.getElementById('sub_menu');


// captura los eventos cuando main menu cambia
main.addEventListener('change',function(){
    var selected_option = cars[this.value] //leo valor seleccionado
    //
    while(sub.option.lenght > 0){
        sub.option.remove(0)
    }


Array.from(selected_option).forEach(function(el){

    let option = new Option(el,el);

    // crear los hijos del sub menu

    sub.appendChild(option);

})

})