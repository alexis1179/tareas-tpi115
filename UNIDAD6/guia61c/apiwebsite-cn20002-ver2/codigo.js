var fila="<tr><td class='id'></td><td class='foto'></td><td class='price'></td><td class='title'></td><td class='description'></td><td class='category'></td><td class='accion'></tr>";
var productos=null;

  function codigoCat(catstr) {
	var code="null";
	switch(catstr) {
		case "electronicos":code="c1";break;
	    case "joyeria":code="c2";break;
		case "caballeros":code="c3";break;
		case "damas":code="c4";break;
	}
	return code;
}   
	  var orden=0;
	  
	  
	function listarProductos(productos) {
	  var precio=document.getElementById("price"); 
	  precio.setAttribute("onclick", "orden*=-1;listarProductos(productos);");
	  var num=productos.length;
	  var listado=document.getElementById("listado");
	  var ids,titles,prices,descriptions,categories,fotos,acciones;
	  var tbody=document.getElementById("tbody"),nfila=0;
	  tbody.innerHTML="";
	  var catcode;
	  for(i=0;i<num;i++) tbody.innerHTML+=fila;
	  var tr; 
	  ids=document.getElementsByClassName("id");
	  titles=document.getElementsByClassName("title");
	  descriptions=document.getElementsByClassName("description");
	  categories=document.getElementsByClassName("category");   
	  fotos=document.getElementsByClassName("foto");   
	  prices=document.getElementsByClassName("price");
	  acciones = document.getElementsByClassName("accion");   
	  if(orden===0) {orden=-1;precio.innerHTML="Precio"}
	  else
	     if(orden==1) {ordenarAsc(productos,"price");precio.innerHTML="Precio A";precio.style.color="darkgreen"}
	     else 
	       if(orden==-1) {ordenarDesc(productos,"price");precio.innerHTML="Precio D";precio.style.color="blue"}
	
		  
	  	  listado.style.display="block";
	  for(nfila=0;nfila<num;nfila++) {
        ids[nfila].innerHTML=productos[nfila].id;
		titles[nfila].innerHTML=productos[nfila].title;
		descriptions[nfila].innerHTML=productos[nfila].description;
		categories[nfila].innerHTML=productos[nfila].category;
		catcode=codigoCat(productos[nfila].category);
		tr=categories[nfila].parentElement;
		tr.setAttribute("class",catcode);
		prices[nfila].innerHTML="$"+productos[nfila].price;
		fotos[nfila].innerHTML="<img src='"+productos[nfila].image+"'>";
		fotos[nfila].firstChild.setAttribute("onclick","window.open('"+productos[nfila].image+"');" );
		acciones[nfila].innerHTML = "<button>Eliminar</button>";
		acciones[nfila].firstChild.setAttribute("type", "submit");
		acciones[nfila].firstChild.setAttribute("onclick", "eliminarProd(event)");
		}
	}

function obtenerProductos() {
	  fetch('https://retoolapi.dev/KUYr7p/productos')
            .then(res=>res.json())
            .then(data=>{
				productos=data;
				productos.forEach(producto => {
					producto.price = parseFloat(producto.price);
				});
				listarProductos(data)})
}

function ordenarDesc(p_array_json, p_key) {
   p_array_json.sort(function (a, b) {
      if(a[p_key] > b[p_key]) return -1;
if(a[p_key] < b[p_key]) return 1;
return 0;
   });
}

function ordenarAsc(p_array_json, p_key) {
   p_array_json.sort(function (a, b) {
      if(a[p_key] > b[p_key]) return 1;
if(a[p_key] < b[p_key]) return -1;
return 0;
   });
}

function enviarForm(){
	var img = document.getElementById("image").value;
	var title = document.getElementById("title").value;
	var desc = document.getElementById("description").value;
	var price = document.getElementById("price").value;
	var category = document.getElementById("category").value;
	
	data = {image: img, title: title, description: desc, price: price, category: category};
	fetch("https://retoolapi.dev/KUYr7p/productos", {
		method:"POST",
		headers:{'Content-Type': 'application/json',},
		body: JSON.stringify(data)})
	.then(response => response.json())
	.then(data => {
		console.log("Producto agregado", data);
		obtenerProductos();
	});
}


function eliminarProd(event){
	var fila = event.target.parentNode.parentNode;
	var id = fila.children[0].innerHTML;

	fetch("https://retoolapi.dev/KUYr7p/productos/"+id,{
		method:"DELETE"})
	.then(response => response.json())
	.then(data => {
		console.log("Producto eliminado", data);
		obtenerProductos();
	}).catch(error => console.log(error));
}