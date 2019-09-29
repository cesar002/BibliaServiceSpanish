# BIBLIA SERVICE SPANISH
_Paquete sencillo de NPM para consulta de la biblia en sus versiones en español_

## INSTRUCCIONES

### Instalacion
```
    npm install biblia-service-spanish
```

### Uso
```
    import bibliaService from 'biblia-service-spanish'
```
Ó
```
    const bibliaService = require('biblia-service-spanish')
```

---

## Metodos

### `getVersiones()`
Retorna un arreglo con las versiones disponibles de la biblia

_EJEMPLO_
```
    import bibliaService from 'biblia-service-spanish'

    bibliaService.getVersiones()
    .then(res => {
        console.log(res)
    })
    .catch(err =>{
        console.log(err)
    })
```

_Internamente el arreglo devuelto se contruye de:_
| Nombre    | Tipo   | Descripción                 |
| --------- | ------ | --------------------------- |
| value     | String | identificador de la versión |
| nombre    | String | nombre de la versión        |

---

### `getLibros()`
Retorna un arreglo con los libros de la biblia

_EJEMPLO_
```
    import bibliaService from 'biblia-service-spanish'

    bibliaService.getLibros()
    .then(res => {
        console.log(res)
    })
    .catch(err => {
        console.log(err)
    })

```

_Internamente el arreglo devuelto se contruye de:_
| Nombre    | Tipo   | Descripción              |
| --------- | ------ | ------------------------ |
| value     | String | identificador del libro  |
| --------- | ------ | ------------------------ |
| nombre    | String | nombre del libro         |

---

### `getCapitulos()`
Retorna un arreglo con todos los capitulos con los que cuenta el libro.

_PARAMETROS_

| Nombre     | Tipo   | Descripción                                        |
| ---------- | ------ | -------------------------------------------------- |
| claveLibro | String | clave del libro del cual se buscaran los capitulos |

_EJEMPLO_
```
    import bibliaService from 'biblia-service-spanish'

    bibliaService.getCapitulos('hechos')
    .then(res => {
        console.log(res)
    })
    .catch(err => {
        console.log(err)
    })
```

_El arreglo retornado es una secuencia de numeros, desde el primer capitulo, hasta el ultimo_

---

### `buscar()`
Retorna un objeto con la información de la busqueda

_PARAMETROS_

| Nombre     | Tipo   | Descripción         |
| ---------- | ------ | ------------------- |
| version    | String | clave de la versión |
| libro      | String | clave del libro     |
| capitulo   | number | número del capitulo |

_EJEMPLO_
```
    import bibliaService from 'biblia-service-spanish'

    bibliaService.buscar('Nueva-version-internacional-1984','mateo', 5)
    .then(res => {
        console.log(res)
    })
    .catch(err => {
        console.log(err)
    })
```

_El objeto retornado esta contruido por:_
| Nombre    | Tipo   | Descripción                 |
| --------- | ------ | --------------------------- |
| version   | String | clave de la versión         |
| libro     | String | clave del libro             |
| capitulo  | Number | número del capitulo         |
| contenido | Array  | arreglo con los versiculos  |

_La propiedad contenido esta contruido por:_
| Nombre      | Tipo   | Descripción                 |
| ----------- | ------ | --------------------------- |
| NoVersiculo | Number | Numero del versiculo        |
| versiculo   | String | Texto del versiculo         |

---

### `buscarIntervaloCapitulos()`
Retorna un objeto con la información de la busqueda Entre dos capitulos

_PARAMETROS_

| Nombre           | Tipo   | Descripción                                        |
| ---------------- | ------ | -------------------------------------------------- |
| version          | String | clave de la versión                                |
| libro            | String | clave del libro                                    |
| capituloInicio   | number | número del capitulo en el que inicia la busqueda   |
| capituloFin      | number | número del capitulo en el que finaliza la busqueda |

_EJEMPLO_
```
    import bibliaService from 'biblia-service-spanish'

    bibliaService.buscarIntervaloCapitulos('Nueva-version-internacional-1984','mateo', 5, 10)
    .then(res => {
        console.log(res)
    })
    .catch(err => {
        console.log(err)
    })
```

_El objeto retornado esta contruido por:_
| Nombre     | Tipo   | Descripción                 |
| ---------- | ------ | --------------------------- |
| version    | String | clave de la versión         |
| libro      | String | clave del libro             |
| capitulos  | Array  | arreglo de capitulos        |

_la propiedad capitulos está construido por:_
| Nombre      | Tipo   | Descripción                                                           |
| ----------- | ------ | --------------------------------------------------------------------- |
| capitulo    | Number | Numero del capitulo                                                   |
| versiculos  | Array  | Array de versiculos similar al array de contenido del metodo buscar() |

---

### `buscarIntervaloVersiculos()`
Retorna un objeto con la información de la busqueda entre un rango de versiculos

_PARAMETROS_

| Nombre           | Tipo   | Descripción                                        |
| ---------------- | ------ | -------------------------------------------------- |
| version          | String | clave de la versión                                |
| libro            | String | clave del libro                                    |
| capitulo         | number | número del capitulo                                |
| versiculoInicio  | number | número del versiculo en el que inicia la busqueda  |
| versiculoFin     | number | número del versiculo en el que finaliza la busqueda|

_EJEMPLO_
```
    import bibliaService from 'biblia-service-spanish'

    bibliaService.buscarIntervaloVersiculos('Nueva-version-internacional-1984','salmos', 1, 5, 10)
    .then(res => {
        console.log(res)
    })
    .catch(err => {
        console.log(err)
    })
```

_El objeto retornado esta contruido por:_
| Nombre    | Tipo   | Descripción                 |
| --------- | ------ | --------------------------- |
| version   | String | clave de la versión         |
| libro     | String | clave del libro             |
| capitulo  | Number | número del capitulo         |
| contenido | Array  | arreglo con los versiculos  |

_La propiedad contenido esta contruido por:_
| Nombre      | Tipo   | Descripción                 |
| ----------- | ------ | --------------------------- |
| NoVersiculo | Number | Numero del versiculo        |
| versiculo   | String | Texto del versiculo         |

---

### `busquedaCoincidencia()`
Retorna un objeto con la información de una busqueda por texto

_PARAMETROS_

| Nombre           | Tipo            | Descripción                                           |
| ---------------- | --------------- | ----------------------------------------------------- |
| textoBusqueda    | String          | texto de busqueda, conformada por libro y el capitulo |
| versión          | String/Opcional | clave de la versión                                   |

_El objeto retornado esta contruido por:_
| Nombre     | Tipo   | Descripción                 |
| ---------- | ------ | --------------------------- |
| version    | String | clave de la versión         |
| busqueda   | String | texto a buscar              |
| versiculos | Array  | Arraglo de versiculos       |