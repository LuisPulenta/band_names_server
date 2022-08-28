const {io} =require('../index');
const Band = require('../models/band');
const Bands =require('../models/bands');

const bands = new Bands();

bands.addBand(new Band('Queen'));
bands.addBand(new Band('Kiss'));
bands.addBand(new Band('Charly García'));
bands.addBand(new Band('Phil Collins'));
bands.addBand(new Band('Soda Stereo'));
bands.addBand(new Band('Virus'));
bands.addBand(new Band('Sui Géneris'));

//console.log(bands);

//Mensajes de Sockets
io.on('connection', client => {
    console.log('Cliente conectado');
    client.emit('active-bands',bands.getBands());

    client.on('disconnect',() => {
        console.log('Cliente desconectado')
    });

     client.on('mensaje',(payload)=>{
         console.log('Mensaje',payload);
         io.emit('mensaje',{admin:'Nuevo mensaje'});
     });

    //  client.on('emitir-mensaje',(payload)=>{
    //     console.log(payload);
    //     //io.emit('nuevo-mensaje',payload); //emite a todos
    //     client.broadcast.emit('nuevo-mensaje',payload); //emite a todos menos al cliente que generó el mensaje
    // });


    client.on('vote-band',(payload)=>{
        bands.voteBand(payload.id);
        io.emit('active-bands',bands.getBands());
    })

    client.on('add-band',(payload)=>{
        const newBand =new Band(payload.name);
        bands.addBand(newBand);
        io.emit('active-bands',bands.getBands());
    })

    client.on('delete-band',(payload)=>{
        bands.deleteBand(payload.id);
        io.emit('active-bands',bands.getBands());
    })

    
  });