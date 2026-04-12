import { Router } from "express";
import prisma from "../prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = Router();

function generateReferralCode(){
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}

router.post("/register", async (req, res) => {
  try {
    const { email, password, role, referral_code } = req.body;

    // ❗ VALIDASI
    if (!email || !password) {
      return res.status(400).json({ message: "Email & password wajib" });
    }

    // 🔍 CEK EMAIL
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ message: "Email sudah dipakai" });
    }

    //HASH PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);

    //GENERATE REFERRAL CODE
    const refCode = generateReferralCode();

    //CREATE USER
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role,
        referral_code: refCode,
      },
    });

    //REFERRAL LOGIC
    if (referral_code) {
      const referrer = await prisma.user.findUnique({
        where: { referral_code },
      });

      if (referrer) {
        // 💰 TAMBAH POINT KE REFERRER
        await prisma.user.update({
          where: { id: referrer.id },
          data: {
            points: {
              increment: 10000,
            },
          },
        });

        //SIMPAN HISTORY REFERRAL
        await prisma.referral.create({
          data: {
            referrer_id: referrer.id,
            referred_id: user.id,
            points_earned: 10000,
            expired_at: new Date(
              Date.now() + 90 * 24 * 60 * 60 * 1000 // 3 bulan
            ),
          },
        });
      }
    }

    res.json({
      message: "Register sukses 🔥",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;