const e = require("cors");
const { Socket } = require("socket.io");
const { checkJWT } = require("../helpers");
const { ChatMsg } = require('../models')

const chatMsg = new ChatMsg();

const socektController = async ( socket = new Socket, io ) =>{

    //UserDb
    const user = await checkJWT( socket.handshake.headers['x-token'] );

    if( !user ){
        return socket.disconnect();


    }else{
        
        chatMsg.connectUser( user );
        io.emit('user-online', chatMsg.UsersArr );
        socket.emit('receive-msg', chatMsg.latest );

        //RoomID
        socket.join( user.id );

        // Clean
        socket.on('disconnect', () => {
            chatMsg.disconnectUser( user.id );
            io.emit('user-online', chatMsg.UsersArr );
        });

        //Send
        socket.on('send-msg', ( { uid, msg } ) => {

            if( uid ){
                socket.to( uid ).emit( 'private-msg', { de: user.name,  msg } );
            }else{
                chatMsg.sendMsg( user.id, user.name, msg );
                io.emit('receive-msg', chatMsg.latest );
            }

        });
    }

}

module.exports = {
    socektController
}