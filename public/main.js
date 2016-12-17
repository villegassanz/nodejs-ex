var socket = io.connect('http://nodejs-proyectov15.44fs.preview.openshiftapps.com', { 'forceNew': true });

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
	eje:document.getElementById('ejemplo').value
  };

  socket.emit('new-message', message);
  return false;
}
