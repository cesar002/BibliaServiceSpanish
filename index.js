const cheerio = require('cheerio')
const request = require('request-promise')
const axios = require('axios').default;
const FormData = require('form-data');

const {HOME_PAGE} = require('./routes')
const {CAPITULOS} = require('./routes')


const bibliaService = (function(){
    return{
        getVersiones,
        getLibros,
        getCapitulos,
    }

    async function getVersiones(){
        const $ = await request({
            uri: HOME_PAGE,
            transform: body => cheerio.load(body)
        })
        return new Promise((resolve, reject) =>{
            try{
                let versiones = []
                const result = $('.off-canvas-wrapper .off-canvas-wrapper-inner .off-canvas-content .row').next().next();
                result.find('#versiones').find('option').each((i, element) =>{
                    if(i > 0){
                        versiones.push({
                            value: $(element).val(),
                            nombre: $(element).text().trim(),
                        })
                    }
                })
    
                resolve(versiones)
            }catch(error){
                reject(error)
            }
        })
    }

    async function getLibros(){
        const $ = await request({
            uri: HOME_PAGE,
            transform: body => cheerio.load(body)
        })
        return new Promise((resolve, reject) =>{
            try{
                let libros = []
                const result = $('.off-canvas-wrapper .off-canvas-wrapper-inner .off-canvas-content .row').next().next();
                result.find('#libros').find('option').each((i, element) =>{
                    if(i > 0){
                        libros.push({
                            value: $(element).val(),
                            nombre: $(element).text().trim(),
                        })
                    }
                })
    
                resolve(libros)
            }catch(error){
                reject(error)
            }
        })
    }

    function getCapitulos(claveLibro){
        return new Promise((resolve, reject) =>{
            let formData = new FormData();
            formData.append('nombre', claveLibro);
            formData.append('lang', 'es');

            axios.post(CAPITULOS, formData)
            .then(response =>{
                // let capitulos = []
                // for(i = 1; i <= response.data; i++){
                //     capitulos.push(i)
                // }
                let wea = cheerio.load(response.data)
                resolve(wea.html())
            }).catch(error =>{
                reject(error)
            })
        })
    }
})()

bibliaService.getCapitulos('1 Crónicas')
.then(res =>{
    console.log(res)
})
.catch(err =>{
    console.log(err)
})