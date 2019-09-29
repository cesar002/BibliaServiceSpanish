const Utils = (function(){
    return{
        quitarAsentos,
        limpiarNumeroVersiculo,
        limpiarVersiculo,
        convertirABusqueda,
    }

    function quitarAsentos(texto){
        let newTexto = texto.toLowerCase();
        newTexto = newTexto.replace(new RegExp(/\s/g),"");
        newTexto = newTexto.replace(new RegExp(/[àáâãäå]/g),"a");
        newTexto = newTexto.replace(new RegExp(/[èéêë]/g),"e");
        newTexto = newTexto.replace(new RegExp(/[ìíîï]/g),"i");
        newTexto = newTexto.replace(new RegExp(/ñ/g),"n");                
        newTexto = newTexto.replace(new RegExp(/[òóôõö]/g),"o");
        newTexto = newTexto.replace(new RegExp(/[ùúûü]/g),"u");

        return newTexto;
    }

    function limpiarVersiculo(versiculo){
        let newVersiculo =  versiculo.replace("\n", "").replace(/^[0-9]+(.)/, "").trim()
        return newVersiculo
    }

    function limpiarNumeroVersiculo(numeroVersiculo){
        let newNumero = parseInt(numeroVersiculo.replace(".","").trim(), 10)
        return newNumero
    }

    function convertirABusqueda(texto){
        let busqueda = texto.split(" ").join("+")
        return busqueda
    }

})()

module.exports = Utils