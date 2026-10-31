function calcularTabla() {

    // Obtener el número ingresado
    let numero = Number(document.getElementById("numero").value);

    // Arreglo vacío
    let resultados = [];

    // Recorrer del 1 al 10
    for (let i = 1; i <= 10; i++) {

        resultados.push(numero * i);

    }

    document.getElementById("resultado").textContent =
        JSON.stringify(resultados);
}
