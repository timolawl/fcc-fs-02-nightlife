export default () => {
    const host = 'timolawl-nightlife.herokuapp.com';
    if ((host == location.host) && (location.protocol != 'https:'))
        location.protocol = 'https';
}
