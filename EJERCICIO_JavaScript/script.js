const gastos = [
    { descripcion: "Compra de zapatos", monto: 120, categoria: "personal" },
    { descripcion: "Recarga de internet", monto: 65, categoria: "servicios" },
    { descripcion: "Pasajes de bus", monto: 25, categoria: "transporte" },
    { descripcion: "Materiales de estudio", monto: 85, categoria: "educacion" },
    { descripcion: "Compra de cuadernos", monto: 35, categoria: "educacion" },
    { descripcion: "Pago de electricidad", monto: 110, categoria: "servicios" }
];

const esGastoAlto = (monto) => {
    return typeof monto === "number" && monto >= 100;
};

function calcularTotal(gastos) {
    let total = 0;

    for (let i = 0; i < gastos.length; i++) {

        if (typeof gastos[i].monto !== "number") {
            throw new Error(
                "El monto del gasto '" + gastos[i].descripcion +
                "' debe ser un número."
            );
        }

        total += gastos[i].monto;
    }

    return total;
}

function calcularPromedio(gastos) {

    if (gastos.length === 0) {
        throw new Error("No se puede calcular el promedio de un arreglo vacío.");
    }

    let total = calcularTotal(gastos);

    return total / gastos.length;
}

function filtrarPorCategoria(gastos, categoria) {

    const resultado = [];

    for (let i = 0; i < gastos.length; i++) {

        if (gastos[i].categoria === categoria) {
            resultado[resultado.length] = gastos[i];
        }
    }

    return resultado;
}

function obtenerMayorGasto(gastos) {

    if (gastos.length === 0) {
        return null;
    }

    let mayor = gastos[0];

    for (let i = 1; i < gastos.length; i++) {

        if (gastos[i].monto > mayor.monto) {
            mayor = gastos[i];
        }
    }

    return mayor;
}

function clasificarGasto(monto) {

    if (monto >= 100) {
        return "Alto";

    } else if (monto >= 50 && monto < 100) {
        return "Medio";

    } else {
        return "Bajo";
    }
}

function describirCategoria(categoria) {

    switch (categoria) {

        case "personal":
            return "Gastos personales";

        case "servicios":
            return "Pagos de servicios básicos";

        case "transporte":
            return "Gastos de movilización";

        case "educacion":
            return "Gastos relacionados con los estudios";

        default:
            return "Categoría no identificada";
    }
}

function crearContadorDeAltos() {

    let contador = 0;

    return function() {
        contador++;
        return contador;
    };
}

try {

    const contarGastosAltos = crearContadorDeAltos();

    // Crear el arreglo
    const gastosClasificados = [];

    for (let i = 0; i < gastos.length; i++) {

        const nivel = clasificarGasto(gastos[i].monto);

        const gastoClasificado = {
            descripcion: gastos[i].descripcion,
            monto: gastos[i].monto,
            categoria: gastos[i].categoria,
            nivel: nivel,
            descripcionCategoria: describirCategoria(gastos[i].categoria)
        };

        gastosClasificados[gastosClasificados.length] = gastoClasificado;

        // Contar los gastos altos
        if (esGastoAlto(gastos[i].monto)) {
            contarGastosAltos();
        }
    }

    const cantidadAltos = contarGastosAltos();

    const total = calcularTotal(gastos);
    const promedio = calcularPromedio(gastos);

    const mayorGasto = obtenerMayorGasto(gastos);

    console.log("===== TABLA DE GASTOS CLASIFICADOS =====");
    console.table(gastosClasificados);

    console.log("===== RESUMEN GENERAL =====");
    console.log("Total gastado: $" + total.toFixed(2));
    console.log("Promedio de gastos: $" + promedio.toFixed(2));

    console.log("===== GASTO DE MAYOR MONTO =====");

    if (mayorGasto !== null) {
        console.log("Descripción: " + mayorGasto.descripcion);
        console.log("Monto: $" + mayorGasto.monto.toFixed(2));
        console.log("Categoría: " + mayorGasto.categoria);
    } else {
        console.log("No existen gastos registrados.");
    }

    console.log("Cantidad de gastos altos: " + cantidadAltos);

    // Filtrar los gastos por categoría
    const categoriaElegida = "educacion";
    const gastosFiltrados = filtrarPorCategoria(gastos, categoriaElegida);

    console.log("===== GASTOS DE LA CATEGORÍA: " + categoriaElegida + " =====");
    console.table(gastosFiltrados);

    const resumenPorCategoria = {};

    for (let i = 0; i < gastos.length; i++) {

        const categoria = gastos[i].categoria;

        if (resumenPorCategoria[categoria] === undefined) {
            resumenPorCategoria[categoria] = 0;
        }

        resumenPorCategoria[categoria] += gastos[i].monto;
    }

    // Informe final
    const informe = {
        total: total,
        promedio: promedio,
        cantidadAltos: cantidadAltos,
        mayorGasto: mayorGasto,
        resumenPorCategoria: resumenPorCategoria
    };

    console.log("===== INFORME FINAL =====");
    console.log(JSON.stringify(informe, null, 2));

} catch (error) {

    console.error("Error durante el procesamiento: " + error.message);

}

try {

    console.log("===== PRUEBA DE ERROR CONTROLADO =====");

    calcularPromedio([]);

} catch (error) {

    console.error("Error capturado correctamente: " + error.message);
}
