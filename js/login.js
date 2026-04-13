var part2 = "irest.gaecti.com/api";
var acceso = false; 
var email = "";
var pass = "";
var nombre = "";
var roles =  "";
var part1 = "https://ap";  
document.getElementById('btnIngresar').addEventListener('submit', (e) => {
  e.preventDefault();
  email = document.getElementById("txtemail").value;
  pass = document.getElementById("txtpassword").value;

            $.get(part1+part2+"/login/getusuarioExiste/"+email +"/"+pass+"") //hacemos el llamado de la web api
            .done(function (response) { //cuando se ejecute va aobtener una respuesta response
              // console.log(response);
              if (response[0].length>0) {
               
                console.log(response[0])
              $.each(response[0], function (id_usuario, fila) {
                
                if (fila.roles.includes("CONTROLINTERNOIA") || fila.roles.includes("ADMIN")) {
nombre = fila.nombre;
roles = fila.roles;
                  guardarUser()
                  .then(redireccionar);

                }else{
                    alert("USTED NO CUENTA CON ACCESO A LA APP, SOLICITE ACCESO AL DEP. TI (departamentoti@grupoelcerezo.com")
                }

                    
    
            })

            }
         else{
                alert("Usuario Y/O Contraseña invalidos")
            
        }

    })

})

async function guardarUser(){
  localStorage.setItem('emailActivo', email);
  localStorage.setItem('nombre', nombre);
  localStorage.setItem('rol', roles);
}

function redireccionar(){
  Swal.fire({
    position: 'top-center',
    icon: 'success',
    title: "BIENVENID@ "+localStorage.getItem('nombre'),
    showConfirmButton: true,
    timer: 4000
  })

    setTimeout(() => {
      window.location.href = 'index.html';
      acceso = true;
    },2000)
}