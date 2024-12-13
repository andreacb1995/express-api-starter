document.addEventListener("DOMContentLoaded", function() {

  const resultadoDiv = document.getElementById('mostrarusuario');

  const activeTab = document.querySelector('.nav-link.active'); // Seleccionar la pestaña activa
  if (activeTab) {
    mostrarSeccion('tarjetasUsuarios');
    cargarUsuarios()
}

  document.getElementById('listarUsuarios').addEventListener('click', function(event) {
      event.preventDefault();
      resultadoDiv.style.display = 'none';
      mostrarSeccion('tarjetasUsuarios');
      cargarUsuarios()
    });

  document.getElementById('addUsuario').addEventListener('click', function(event) {
      event.preventDefault();
      formUsuario.reset();
      resultadoDiv.style.display = 'none';
      mostrarSeccion('CrearUsuario');
  });

  document.getElementById('buscarId').addEventListener('click', function(event) {
      event.preventDefault();
      document.getElementById('usuarioId').value = '';
      resultadoDiv.style.display = 'none';
      mostrarSeccion('BuscarUsuario');
  });

    // Seleccionar todas las pestañas
    const tabs = document.querySelectorAll('.nav-link');

    // Añadir evento de clic a cada pestaña
    tabs.forEach(tab => {
        tab.addEventListener('click', function(event) {
            event.preventDefault(); // Prevenir comportamiento por defecto del enlace
            
            // Remover la clase 'active' de todas las pestañas
            tabs.forEach(t => t.classList.remove('active'));

            // Añadir la clase 'active' solo a la pestaña seleccionada
            this.classList.add('active');
            
            // Cambiar el contenido de acuerdo con la pestaña seleccionada (opcional)
            const sectionId = this.id;
        });
    });

  // Seleccionar el formulario y el botón
  const formUsuario = document.getElementById('formCrearUsuario');
  // Cuando el formulario se envía
  formUsuario.addEventListener('submit', function(event) {
    event.preventDefault();  // Evitar que el formulario se envíe y recargue la página
    
     // Obtener los valores de los campos del formulario
     const username = document.getElementById('username').value;
     const clave = document.getElementById('clave').value;
 
     // Validar el campo antes de enviar
     if (!username || !clave) {
       alert("Por favor, completa todos los campos.");
       return;
     }
 
     // Crear el objeto de datos a enviar
     const usuario = {
       username: username,
       password: clave
     };
 
     // Enviar los datos al servidor usando Fetch API
     fetch('http://localhost:5000/crearusuario', {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json'
       },
       body: JSON.stringify(usuario)
     })
     .then(response => response.json())
     
     .then(data => {
          console.log('Usuario guardado:', data);
          mostrarMensajeExito('Usuario guardado exitosamente.');
        
      })
     .catch(error => {
       console.error('Error al guardar el usuario:', error);
       mostrarMensajeError('Error al guardar el usuario');          
    });

  });

    // Cuando se hace click en el botón de buscar
    const buscarForm = document.querySelector('#BuscarUsuario form');
        buscarForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Evitar el comportamiento por defecto del formulario
        
        // Obtener el ID de usuario ingresado
        const usuarioId = document.getElementById('usuarioId').value;
        
        // Verificar que el campo no esté vacío
        if (!usuarioId) {
            mostrarMensajeError('Por favor, ingrese un ID para buscar.');
            return;
        }

        // Hacer la solicitud al backend para buscar el usuario por ID
        fetch(`http://localhost:5000/usuarios/${usuarioId}`, {
            method: 'GET',
        })
        .then(response => {
            if (!response.ok) {
            throw new Error('Usuario no encontrado');
            }
            return response.json();
        })
        .then(data => {
            if (data) {
                mostrarDatosUsuario(data);  // Mostrar los datos del usuario
            } else {
                mostrarMensajeError('Usuario no encontrado.');
            }
        })
        .catch(error => {
            console.error('Error al buscar el usuario:', error);
            mostrarMensajeError('Hubo un problema al buscar el usuario.');
        });
    });
});

// Función para cambiar de sección
function mostrarSeccion(seccion) {
    // Ocultar todas las secciones
    document.getElementById("tarjetasUsuarios").style.display = "none";
    document.getElementById("CrearUsuario").style.display = "none";
    document.getElementById("BuscarUsuario").style.display = "none";

    // Mostrar la sección seleccionada
    document.getElementById(seccion).style.display = "block";
}

  // Función para cargar usuarios
  function cargarUsuarios() {
    fetch('http://localhost:5000/usuarios', {
      method: 'GET'
    })
    .then(response => response.json())
    .then(usuarios => {
      mostrarUsuario(usuarios);
    })
    .catch(error => console.error('Error:', error));
  }

  // Función para mostrar las cards de los usuarios
function mostrarUsuario(usuarios) {
    const cardsContainer = document.getElementById('tarjetasUsuarios');
    cardsContainer.innerHTML = ''; 
  
    // Crear un grupo de tarjetas (card-group)
    const row = document.createElement('div');
    row.classList.add('row', 'mx-n1'); // Usar mx-0 para margen en el contenedor
  
    usuarios.forEach(usuario => {
        const col = document.createElement('div');
        col.classList.add('col-md-3', 'mb-4'); // Ajustar el tamaño de la columna para tarjetas en 4 partes (col-md-3)
        
        const card = crearTarjetaAlumno(usuario);
        col.appendChild(card); // Agregar la tarjeta a la columna
        row.appendChild(col); // Agregar la columna a la fila
    });
  
    cardsContainer.appendChild(row); // Agregar el grupo de tarjetas al contenedor principal
  }
  
  // Función para crear la tarjeta de cada usuario
  function crearTarjetaAlumno(usuario) {
    const card = document.createElement('div');
    card.classList.add('card', 'h-100'); // Agregar clases Bootstrap para la tarjeta
  
    // Definir el contenido de la tarjeta con la estructura que mencionaste
    card.innerHTML = `
      <div class="card-body">
        <h5 class="card-title text-primary font-weight-bold">${usuario.username}</h5>
        <h6 class="card-subtitle text-muted mb-2">ID: ${usuario.id}</h6>
      </div>
    `;
    
    return card;
  }

  // Función para mostrar los datos del usuario
  function mostrarDatosUsuario(usuario) {
    const resultadoDiv = document.getElementById('mostrarusuario');
    resultadoDiv.style.display = 'flex';
    resultadoDiv.innerHTML = `
    <div class="card-body">
        <h4>Datos del Usuario:</h4>
        <p><strong>Nombre de Usuario:</strong> ${usuario.username}</p>
        <p><strong>ID:</strong> ${usuario.id}</p>
    </div>
    `;
  }
  
  // Función para mostrar el mensaje de error
  function mostrarMensajeError(mensaje) {
    const resultadoDiv = document.getElementById('resultadoBusqueda');
    resultadoDiv.innerHTML = `<p style="color: red;">${mensaje}</p>`;
    resultadoDiv.style.display = 'flex';
    // Ocultar el mensaje después de 3 segundos
    setTimeout(() => {
        resultadoDiv.style.display = 'none';
    }, 3000);
  }

  // Función para mostrar el mensaje de éxito
  function mostrarMensajeExito(mensaje) {
    const resultadoDiv = document.getElementById('resultadoBusqueda');
    resultadoDiv.style.display = 'flex';
    resultadoDiv.innerHTML = `<p style="color: green;">${mensaje}</p>`;

    // Ocultar el mensaje después de 3 segundos
    setTimeout(() => {
        resultadoDiv.style.display = 'none';
    }, 3000);
  }

