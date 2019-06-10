const hbs = require('hbs');
const fs = require('fs');
const path = require('path');
const archivoCursosJSON = path.join(__dirname, './listadoCursos.json');
const archivoEstudiantesJSON = path.join(__dirname, './listaEstudiantes.json');

listaCursos = []
listaEstudiantes = []

hbs.registerHelper('registrarCurso', (id, nombre, descripcion, valor) => {
    listaCursos = require(archivoCursosJSON);
    
    if(!listaCursos.find(curso => curso.id == parseInt(id))) {
        let curso={id:id, nombre:nombre, descripcion:descripcion, valor:valor, estado:'Disponible'}
        listaCursos.push(curso);
        guardarCursos();
        return `El curso de ${nombre} se ha creado exitosamente.`;
    } else
        return 'El id del curso ya se encuentra registrado :(';
})

hbs.registerHelper('registrarInscripcion', ( idCurso, documento, nombre, correo, telefono) => {
    listaEstudiantes = require(archivoEstudiantesJSON);

    var existe = listaEstudiantes.filter(curso => curso.idCurso === idCurso && curso.documento === parseInt(documento));
        
    if(existe.length <= 0) {
        let estudiante = {idCurso:idCurso, documento:parseInt(documento), nombre:nombre, correo:correo, telefono:telefono}
        listaEstudiantes.push(estudiante);
        guardarInscripciones();
        return `El estudiante con el número de documento ${documento} se ha registrado exitosamente.`;
    }else
        return `La persona con número de documento ${documento} ya se encuentra registrada en este curso.`;

})

const guardarInscripciones=()=>{
    let datos=JSON.stringify(listaEstudiantes);
    
    fs.writeFile(archivoEstudiantesJSON,datos,(err)=>{
        if(err) throw (err);
        console.log('Archivo creado con exito');
    })
}

const guardarCursos=()=>{
    let datos=JSON.stringify(listaCursos);
    
    fs.writeFile(archivoCursosJSON, datos, (err) => {
        if(err) throw (err);
        console.log('Archivo creado con exito');
    })
}

hbs.registerHelper('listarCursosCoordinador', () => {
    listaCursos = require(archivoCursosJSON);
    let texto = '';
    listaCursos.forEach(curso => {
        texto = texto + 
            `<div class="col-sm-12">
                <div class="card">
                    <div class="card-body">
                    <h5 class="card-title">${curso.id}. ${curso.nombre}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">Valor: $${curso.valor}</h6>
                    <p class="card-text">${curso.descripcion}</p>
                    <a href="/cerrarCurso?id=${curso.id}">Cerrar Curso</a>
                    <a href="/estudiantesInscritos?id=${curso.id}" class="btn btn-secondary">Ver Inscritos</a>
                    </div>
                </div>
            </div>`
    });
    return texto;
})

hbs.registerHelper('cerrarCurso', idCurso => {
    listaCursos = require(archivoCursosJSON);

    var registro = listaCursos.find(curso => curso.id === idCurso);
    registro.estado='Cerrado';
    guardarCursos();
    return 'Curso cerrado.';
})

hbs.registerHelper('estudiantesInscritos', idCurso => {
    listaEstudiantes = JSON.parse(fs.readFileSync(archivoEstudiantesJSON));
    let texto = '';
    listaEstudiantes.forEach(estudiante => {
        if(estudiante.idCurso === idCurso) {
            texto = texto + 
                `<div class="col-sm-12">
                    <div class="card">
                        <div class="card-body">
                        <h5 class="card-title">${estudiante.nombre}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">${estudiante.documento}</h6>
                        <p class="card-text">E-mail: ${estudiante.correo}</p>
                        <p class="card-text">Tel: ${estudiante.telefono}</p>
                        <a href="/estudianteEliminado?documento=${estudiante.documento}&id=${idCurso}" class="btn btn-danger">Eliminar estudiante</a>
                        </div>
                    </div>
                </div>`
        }
    });
    return texto;
})

hbs.registerHelper('estudianteEliminado', (documento, id) => {
    listaEstudiantes = require(archivoEstudiantesJSON);
    let nuevaLista = listaEstudiantes.filter(estudiante => estudiante.idCurso !== id & estudiante.documento !== parseInt(documento))
    listaEstudiantes = nuevaLista;
    guardarInscripciones();
    return id;
})

hbs.registerHelper('listarCursosInscribir', () => {
    listaCursos = require(archivoCursosJSON);
    let texto = '';
    listaCursos.forEach(curso => {
        if(curso.estado == 'Disponible') {
            texto = texto + 
                `<div class="col-sm-12">
                    <div class="card">
                        <div class="card-body">
                        <h5 class="card-title">${curso.id}. ${curso.nombre}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">Valor: $${curso.valor}</h6>
                        <p class="card-text">${curso.descripcion}</p>
                        <a href="/inscribir?id=${curso.id}" class="btn btn-primary">Inscribirse</a>
                        </div>
                    </div>
                </div>`
        }
    });
    return texto;
})

hbs.registerHelper('inscribir', id => {
    listaCursos = require(archivoCursosJSON);
    let texto = '';
    listaCursos.forEach(curso => {
        if(curso.id == id) {
            texto = texto +
            `<div class="col-sm-12">
                <div class="card">
                    <div class="card-body">
                    <h5 class="card-title">${curso.id}. ${curso.nombre}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">Valor: $${curso.valor}</h6>
                    <p class="card-text">${curso.descripcion}</p>
                    </div>
                </div>
            </div>`
        }
    })
    return texto;
}) 

hbs.registerHelper('listarCursosInteresado', () => {
    listaCursos = require(archivoCursosJSON);
    let texto = '';
    listaCursos.forEach(curso => {
        if(curso.estado == 'Disponible') {
            texto = texto + 
                `<div class="col-sm-12">
                    <div class="card">
                        <div class="card-body">
                        <h5 class="card-title">${curso.id}. ${curso.nombre}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">Valor: $${curso.valor}</h6>
                        <p class="card-text">${curso.descripcion}</p>
                        </div>
                    </div>
                </div>`
        }
    });
    return texto;
})