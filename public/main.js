var socket = io.connect('http://nodejs1-proyectov9.44fs.preview.openshiftapps.com:8080', { 'forcew': true });

socket.on('messages', function(data) {  
  console.log(data);
  render(data);
})
//agregar los datos al html
function render (data) {  
  var html = data.map(function(elem, index) {
    return(`<div>
              <strong>${elem.id_autobus}</strong>:
              <strong>${elem.rfc}</strong>
			  <strong>${elem.ruta}</strong>
            </div>`);
  }).join(" ");

  document.getElementById('messages').innerHTML = html;
}

function addMessage(e) {  
  var message = {
    id_autobus: document.getElementById('id_autobus').value,
    rfc: document.getElementById('rfc').value,
	ruta: document.getElementById('ruta').value,
	eje:document.getElementById('ejemplo').value,
	//lat:document.getElementById('latitud').value,
	//lon:doc.getElementById('longitud').value,
	//fecha:doc.getElementById('fecha').value,
	//horai:doc.getElementById('hora inicio').value,
	//horaf:doc.getElementById('hora fin').value
  };

  socket.emit('new-message', message);
  return false;
}