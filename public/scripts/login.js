$(document).ready(function() {
    $("#loginForm").on('submit', async function (e) {
        e.preventDefault();

        const formData = {
            correo: $('[name="email"]').val(),
            contrasena: $('[name="password"]').val()
        };

        try {
            if (!formData.correo || !formData.contrasena) {
                throw new Error("Todos los campos son obligatorios");
            }

            const res = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(formData)
            });


            const resJson = await res.json();

            console.log("Respuesta del backend:", resJson); // ✅ DEBUG

            if (!res.ok) {
                throw new Error(resJson.error || "Error en el login");
            }

            // ✅ Aquí va la redirección
            if (resJson.redirect) {
                window.location.href = resJson.redirect;
            } else {
                alert("Login exitoso, pero sin redirección");
            }

        } catch (error) {
            console.error('Error:', error);
            alert(error.message);
        }
    });
});
