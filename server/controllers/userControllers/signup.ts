import { Request, Response } from "express";
import User from "../../models/User";
import bcrypt from "bcryptjs"
import Otp from "../../models/Otp";
import { randomUUID } from "crypto";

const signup = async (req: Request, res: Response) => {
    console.log("signup")

    const { name, email, password, otp } = req.body
    const uuid: String = randomUUID();

    let existingUser: any
    try {
        existingUser = await User.findOne({ email: email }).exec()
    } catch (err) {
        return res
            .status(500)
            .json({ message: "Internal error occurred!, user finding" })
    }

    if (existingUser) {
        return res
            .status(409)
            .json({ message: "An account with this email already exists!" })
    }

    const hashedPassword = bcrypt.hashSync(password, 5)

    let otpmodel: any
    try {
        otpmodel = await Otp.findOne({ email: email }).exec()
    } catch (err) {
        return res
            .status(500)
            .json({ message: "Internal error occurred!, otp not found in db" })
    }

    if (!otpmodel) {
        return res
            .status(404)
            .json({ message: "Otp not found for this user!" })
    }

    const otpDB = otpmodel.otp
    if (otp !== otpDB) {
        return res
            .status(400)
            .json({ message: "Wrong otp entered!" })
    }

    const user = new User({
        name,
        email,
        password: hashedPassword,
        verified: true,
    })

    try {
        await user.save()
    } catch (err) {
        return res
            .status(500)
            .json({ message: "Internal error occurred, saving!" })
    }

    return res
        .status(201)
        .json({ message: "User signed up successfully!" })

}

export default signup