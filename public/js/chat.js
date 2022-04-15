const url = ( window.location.hostname.includes('localhost') )
    ? 'http://localhost:3000/api/auth/'
    : 'https://server-node-crdv.herokuapp.com/api/auth/';


let user = null;
let socket = null;

const txtUid = document.querySelector('#txtUid');
const txtMsg = document.querySelector('#txtMsg');
const ulUser = document.querySelector('#ulUser');
const ulMsg = document.querySelector('#ulMsg');
const btnOut = document.querySelector('#btnOut');

const validateJWT = async () => {
    const token = localStorage.getItem('token') || '';

    if( token.length <= 10 ){
        window.location = 'index.html';
        throw new Error('No Token');
    }

    const resp = await fetch( url, { headers: { 'x-token' : token } } );
    const { authUser , token: tokenDB } = await resp.json();

    localStorage.setItem('token', tokenDB);
    user = authUser;
    document.title = authUser.name;

    await connectSocket();
}

const connectSocket = async () => {
    socket = io({
        'extraHeaders': {
            'x-token': localStorage.getItem('token')
        }
    });

    socket.on('connect', () => {
        console.log('SOCKET ONLINE');
    });
    socket.on('disconnect', () => {
        console.log('SOCKET OFFLINE');
    });

    socket.on('receive-msg', drawMsg );
    socket.on('user-online', drawUser );

    socket.on('private-msg', ( payload ) => {
        console.log('PRIVATE', payload );
    });
}

const drawUser = ( users = [] ) => {
    let usersHtml = '';

    users.forEach( ({ name, uid }) => {
        usersHtml +=
        `<li>
            <p>
                <h5 class="text-success"> ${ name } </h5>
                <span class="fs-6 text-muted"> ${ uid } </span>
            </p>
        </li>`;
    });

    ulUser.innerHTML = usersHtml;
}
const drawMsg = ( msgs = [] ) => {
    let msgHtml = '';

    msgs.forEach( ({ msg, name }) => {
        msgHtml +=
        `<li>
            <p>
                <span class="text-primary"> ${ name } </span>
                <span> ${ msg } </span>
            </p>
        </li>`;
    });

    ulMsg.innerHTML = msgHtml;
}


txtMsg.addEventListener('keyup', ( { keyCode } ) => {
    const msg = txtMsg.value.trim();
    const uid = txtUid.value;

    if( keyCode !== 13 ) return;
    if( msg.length === 0) return;

    socket.emit('send-msg', { msg, uid });
    
    txtMsg.value = '';
    // txtUid.value = '';
});

const main = async () => {
    
    await validateJWT();
    
};

main();
