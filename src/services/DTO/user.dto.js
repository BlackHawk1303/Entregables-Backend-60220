export default class userDTO {
    constructor(user) {
        this.fullname = `${user.first_name} ${user.last_name}`
        this.email = user.email
        this.age = user.age
        this.password = user.password
        this.loggedMethod = user.loggedMethod
        this.role = user.role
    }
}