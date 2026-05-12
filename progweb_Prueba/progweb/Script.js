// Mostrar año actual en footer
document.getElementById('year').textContent = new Date().getFullYear();

// Cargar datos desde JSON
fetch('data.json')
  .then(response => response.json())
  .then(data => {
    const tbody = document.getElementById('tablaDatos');
    data.forEach(item => {
      const fila = document.createElement('tr');
      fila.innerHTML = `
        <td>${item.funcion}</td>
        <td>${item.derivada}</td>
        <td>${item.aplicacion}</td>
      `;
      tbody.appendChild(fila);
    });
  });

// Validación visual del formulario
document.getElementById('formulario').addEventListener('submit', e => {
  e.preventDefault();
  alert('Formulario enviado correctamente ✅');
});