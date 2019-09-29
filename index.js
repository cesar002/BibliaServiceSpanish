const cheerio = require('cheerio')
const request = require('request-promise')

const Utils = require('./utils')

const {HOME_PAGE, CAPITULOS, BUSQUEDA_CONCORDANCIA} = require('./routes')



const bibliaService = (function(){
    return{
        getVersiones,
        getLibros,
        getCapitulos,
        buscar,
        buscarIntervaloCapitulos,
        buscarIntervaloVersiculos,
        busquedaCoincidencia,
    }

    /**
     * Retorna un objeto con las versiones de la biblia
     * 
     * @return objeto con un listado de versiones
     */
    function getVersiones(){
        return new Promise(async (resolve, reject) =>{
            const $ = await request({
                uri: HOME_PAGE,
                transform: body => cheerio.load(body)
            })

            try{
                let versiones = []
                const result = $('.off-canvas-wrapper .off-canvas-wrapper-inner .off-canvas-content .row').next().next();
                if(!result.html()){
                    return reject("No se encontraron versiones")
                }
                result.find('#versiones').find('option').each((i, element) =>{
                    if(i > 0){
                        versiones.push({
                            value: $(element).val(),
                            nombre: $(element).text().trim(),
                        })
                    }
                })
    
                return resolve(versiones)
            }catch(error){
                return reject(error)
            }
        })
    }

    /**
     * Retorna los libros de la biblia
     * 
     * @return objeto con un listado de libros
     */
    function getLibros(){
        return new Promise(async (resolve, reject) =>{
            const $ = await request({
                uri: HOME_PAGE,
                transform: body => cheerio.load(body)
            })

            try{
                let libros = []
                const result = $('.off-canvas-wrapper .off-canvas-wrapper-inner .off-canvas-content .row').next().next();
                if(!result.html()){
                    return reject("Libros no encontrados")
                }
                result.find('#libros').find('option').each((i, element) =>{
                    if(i > 0){
                        libros.push({
                            value: Utils.quitarAsentos($(element).val()),
                            nombre: $(element).text().trim(),
                        })
                    }
                })
    
                return resolve(libros)
            }catch(error){
                return reject(error)
            }
        })
    }

    /**
     * Retorna el numero de capitulos que se encuentra en un libro
     * 
     * @param {string}claveLibros
     * 
     * @returns objeto con un listado de capitulos
     */
    function getCapitulos(claveLibro){
        return new Promise(async (resolve, reject) =>{
            const $ = await request({
                method: 'POST',
                uri: CAPITULOS,
                form: {
                    nombre: claveLibro,
                    lang: 'es',
                },
                transform: body => cheerio.load(body)
            })

            if(!$('body').html()){
                return reject(null)
            }

            try{
                let capituos = []
                let totalCapitulos = $('body').text()
                for (let index = 1; index <= totalCapitulos; index++) {
                    capituos.push(index)
                }
                return resolve(capituos)
            }catch(error){
                return reject(error)
            }
        })
    }

    /**
     * Busca una cita de la biblia dado una version, un libro y el capitulo a consultar
     * 
     * @param {string}version
     * codigo de la versión
     * 
     * @param {string}libro
     * codigo del libro a buscar
     * 
     * @param {number}capitulo
     * número del capitulo a buscar
     * 
     * @return objeto con un listado de la cita que se está buscando
     * 
     */
    function buscar(version, libro, capitulo){
        return new Promise(async (resolve, reject) =>{
            const $ = await request({
                uri: `${HOME_PAGE}/${version}/${libro}-${capitulo}`,
                transform: body => cheerio.load(body),
            })
            try{
                const cita = {
                    version,
                    libro,
                    capitulo,
                    contenido: []
                }
                const element = $('#imprimible')
                if(!element.html()){
                    return resolve("Imposible realizar la busqueda")
                }
        
                element.find('p').each((i, el) =>{
                    cita.contenido.push({
                        NoVersiculo: Utils.limpiarNumeroVersiculo($(el).find('strong').text()),
                        versiculo: Utils.limpiarVersiculo($(el).text()),
                    })
                })

                return resolve(cita)
            }catch(error){
                return reject(error)
            }
        })
    }

    /**
     * busca un conjunto de capitulo dados, versión de la biblia y el libro.
     * 
     * @param {string}version
     * codigo de versión de la biblia
     * 
     * @param {string}libro
     * codigo del libro
     * 
     * @param {number}capituloInicio
     * inicio del capitulo a buscar
     * 
     * @param {number}capituloFin
     * fin del capitulo a buscar
     * 
     * @returns objeto con los datos buscados
     * 
     */
    function buscarIntervaloCapitulos(version, libro, capituloInicio, capituloFin){
        return new Promise(async (resolve, reject) =>{
            let _$ = await request({
                method: 'POST',
                uri: CAPITULOS,
                form: {
                    nombre: libro,
                    lang: 'es',
                },
                transform: body => cheerio.load(body)
            })

            let totalCapitulos = parseInt(_$('body').text(), 10)

            if(capituloFin > totalCapitulos){
                return reject("El libro no cuenta con los capitulos a buscar")
            }

            if(capituloFin < capituloInicio){
                return reject("El capitulo de inicio de busqueda es incorrecto")
            }

            const cita = {
                version,
                libro,
            }
            let capitulos = []
            for(;capituloInicio <= capituloFin; capituloInicio++){
                let $ = await request({
                    uri: `${HOME_PAGE}/${version}/${libro}-${capituloInicio}`,
                    transform: body => cheerio.load(body),
                })
                let element = $('#imprimible')

                if(!element.html()){
                    return resolve("Imposible realizar la busqueda")
                }

                let contenidoCapitulos = []
                element.find('p').each((i, el) =>{
                    contenidoCapitulos.push({
                        NoVersiculo: Utils.limpiarNumeroVersiculo($(el).find('strong').text()),
                        versiculo: Utils.limpiarVersiculo($(el).text())
                    })
                })

                capitulos.push({
                    capitulo: capituloInicio,
                    versiculos: contenidoCapitulos,
                })
            }

            cita.capitulos = capitulos
            return resolve(cita)
        })    

    }

    /**
     * 
     * busca en un capitulo un conjunto de versiculos dados
     * 
     * @param {string} version 
     * codigo de versión de la biblia
     * @param {string} libro 
     * codigo del libro
     * @param {number} capitulo 
     * número de capitulo
     * @param {number} versiculoInicio 
     * numero de versiculo de inicio
     * @param {number} versiculoFin 
     * numero de versiculo final
     * 
     * @returns objeto con la cita a buscar
     * 
     */
    function buscarIntervaloVersiculos(version, libro, capitulo, versiculoInicio, versiculoFin){
        return new Promise((resolve, reject) =>{
            buscar(version, libro, capitulo)
            .then(res =>{
                if(res.contenido.length == 0){
                    resolve(res)
                }

                if(versiculoFin > res.contenido.length){
                    reject("se ha superado el limite de versiculos del capitulo")
                }

                if(versiculoInicio > versiculoFin){
                    reject("Error al buscar los versiculos")
                }

                res = {
                    ...res,
                    contenido: res.contenido.slice((versiculoInicio-1), versiculoFin)
                }

                resolve(res)
            })
            .catch(error =>{
                reject(error)
            })
        })
    }

    /**
     * 
     * busca un texto construido por el nombre del libro y capitulo en una versión de la biblia determinada
     * 
     * @param {string} textoBusqueda 
     * texto de capitulo a buscar
     * @param {string} version
     * nombre de la versión con el que se realizará la busqueda. OPCIONAL
     * 
     * @returns objeto con la cita especifica buscada
     */
    function busquedaCoincidencia(textoBusqueda, version = 'concordancia-biblica'){
        return new Promise(async (resolve, reject) =>{
            const $ = await request({
                uri: `${BUSQUEDA_CONCORDANCIA}${Utils.convertirABusqueda(textoBusqueda)}&t=${version}&ant=tb`,
                transform: body => cheerio.load(body)
            })

            const cita = {
                version,
                busqueda: textoBusqueda,
            }

            const result = $('.off-canvas-wrapper .off-canvas-wrapper-inner .off-canvas-content .row').next().next()
            if(!result.html()){
                return reject('Error al realizar la busqueda')
            }
            const element = result.find('.large-9.columns .row .large-12.columns .row .large-12.medium-12.small-12.columns')
            if(!element.html()){
                return reject('Error al realizar la busqueda')
            }
            let consulta = []
            element.find('article .large-12.columns').find('p').each((i, el) =>{
                consulta.push({
                    versiculo: $(el).text().replace('\n', " ").trim()
                })
            })

            cita.versiculos = consulta
            return resolve(cita)

        })
    }

})()

module.exports = bibliaService;