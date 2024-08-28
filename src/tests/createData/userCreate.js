const User = require("../../models/User")

const userCreate = async () => {

    const user = {
        firstName: "Cesar",
        lastName: "Serna",
        email: "cesar@gmail.com",
        password: "cesar1234",
        phone: "+573104420918"
    }

    await User.create(user)
}

module.exports = userCreate