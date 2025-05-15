$(document).ready(function(){
    $("#update-menu").on("submit", async function(e){
        e.preventDefault();
        const formData = new FormData(this);

        const res = await fetch('/menuAdmin', {
            method: 'POST',
            body: formData
        });

        if (res.ok) {
            // Mostrar mensaje de éxito y recargar
            alert('Menú actualizado correctamente');
            window.location.reload();
        } else {
            throw new Error(res.statusMessage || 'Error al subir el archivo');
        }
    });
})