export default function user(data) {

    let _user = {}
        _user.username = data.username;
        _user.timestamp = data.timestamp;
        _user.grants = data.grants;

    return _user;
}