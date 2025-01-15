import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import argon2 from "argon2";
import { sendVerificationEmail} from '../services/emailService.js'

export const Login = async (req, res) => {
    const { email, password } = req.body;

    try {

        if (!email || !password) {
            return res.status(400).json({ msg: "Email dan password wajib diisi" });
        }

        
        const user = await User.findOne({ where: { email } });
        if (!user) {
          return res.status(401).json({ msg: "Email atau Password salah" });
        }
        
        const isPasswordValid = await argon2.verify(user.password, password);
        if (!isPasswordValid) {
          return res.status(401).json({ msg: "Email atau Password salah" });
        }
        
        if (!user.isVerified) {
          return res.status(400).json({ message: 'Please verify your email before logging in' });
        }
        
        const token = jwt.sign(
            { uuid: user.uuid, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ msg: "Login berhasil", token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Terjadi kesalahan server" });
    }
};

export const Me = async (req, res) => {
    try {
        const user = await User.findOne({ where: { uuid: req.userId } });
        if (!user) {
            return res.status(404).json({ msg: "User tidak ditemukan" });
        }
        res.json({ name: user.name, email: user.email, role: user.role });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Terjadi kesalahan server" });
    }
};

export const logOut = (req, res) => {
    res.status(200).json({ msg: "Anda telah logout" });
};

export const register = async (req, res) => {
    try {
      const { name, email, password } = req.body;
  
      // Cek apakah email sudah terdaftar
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) return res.status(400).json({ message: 'Email already registered' });

      const hashedPassword = await argon2.hash(password);
      // Buat user baru
      const newUser = await User.create({ 
        name, 
        email, 
        password: hashedPassword,
        isVerified: false,
    });
  
      // Buat token verifikasi
      const token = jwt.sign(
        {id: newUser.id },
        process.env.JWT_SECRET,
        { expiresIn: '1h' });
  
      // Kirim email verifikasi
      const emailSent = await sendVerificationEmail(email, token);
      if(!emailSent){
        return res.status(500).json({message: 'Failed to send verification email.'})
      }
  
      res.status(201).json({ message: 'Registration successful! Please verify your email.' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  export const verifyEmail = async (req, res) => {
    try {
      const { token } = req.params;
  
      // Verifikasi token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findByPk(decoded.id);
  
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      if (user.isVerified) return res.status(400).json({ message: 'Email already verified' });
  
      // Update status verifikasi
      user.isVerified = true;
      await user.save();
  
      res.status(200).json({ message: 'Email verified successfully!' });
    } catch (error) {
      res.status(500).json({ message: 'Invalid or expired token' });
    }
  };
  