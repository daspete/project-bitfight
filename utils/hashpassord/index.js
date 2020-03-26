import bcrypt from 'bcrypt'

export default async (password, rounds = 10) => {
    return await bcrypt.hash(password, rounds)
}
