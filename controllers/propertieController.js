const admin = (req, res) => {
    res.render('propiedades/admin', {
        page: 'Mis Propiedades',
        barra: true
    })
}

export {
    admin
}