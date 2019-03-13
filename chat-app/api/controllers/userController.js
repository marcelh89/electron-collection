//FAke data:
users = [{ username: "user1", password: "user1"}]

exports.loginController = (req, res) => {

    if(req.body.username == users[0].username && req.body.password == users[0].password) {
        res.json({status: "success"});
    } else{
        res.json({status: "error"});
    }

};