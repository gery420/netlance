
exports.GetUser = async (req, res) => {

    try {

        let user = req.user;

        let newUser;

        if (user.type === "buyer") {
            newUser = {
                username: user.username,
                email: user.email,
                phonenumber: user.phonenumber,
                country: user.country,
                desc: user.desc,
                profilePicture: user.profilePicture,
                type: user.type,
            }
        } else {
            newUser = {
                username: user.username,
                email: user.email,
                phonenumber: user.phonenumber,
                country: user.country,
                desc: user.desc,
                profilePicture: user.profilePicture,
                type: user.type,
            }
        }

        return res.status(200).json({
            success: true,
            message: "User fetched successfully",
            data: {
                newUser,
            }
        });

    } catch (err) {
        console.error("Error fetching user:", err);
        return res.status(400).json({
            success: false,
            message: "Get User failed",
        });
    }
}
