const admin = (req, res) => {
    res.render('propiedades/admin', {
        page: 'Mis Propiedades',
        barra: true
    })
}

const crear = (req, res) => {
    res.render('propiedades/crear', {
        page: 'Crear Propiedad',
        barra: true
    })
}

export {
    admin,
    crear
}