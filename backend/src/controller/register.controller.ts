import { prisma } from "../../prisma/client";
import { ReferralCode } from "../utils/referalgenerator";
import { Request, Response } from "express";
export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, role, referral_code } = req.body;

    // 1. cek user sudah ada
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ message: "Email sudah terdaftar" });
    }

    // 2. generate kode referral untuk user baru
    const myReferralCode = ReferralCode();

    let referrer = null;

    // 3. cek referral code (kalau ada)
    if (referral_code) {
      referrer = await prisma.user.findUnique({
        where: { referral_code },
      });

      if (!referrer) {
        return res.status(400).json({ message: "Kode referral tidak valid" });
      }
    }

    // 🔥 4. TRANSACTION (WAJIB)
    const newUser = await prisma.$transaction(async (tx) => {
      // buat user baru
      const user = await tx.user.create({
        data: {
          email,
          password,
          role,
          referral_code: myReferralCode,
        },
      });

      // kalau pakai referral
      if (referrer) {
        // tambah poin ke referrer
        await tx.user.update({
          where: { id: referrer.id },
          data: {
            points: {
              increment: 10000,
            },
          },
        });

        // simpan ke table referral
        await tx.referral.create({
          data: {
            referrer_id: referrer.id,
            referred_id: user.id,
            points_earned: 10000,
            expired_at: new Date(
              Date.now() + 90 * 24 * 60 * 60 * 1000, // 3 bulan
            ),
          },
        });
      }

      return user;
    });

    res.json({
      message: "Register berhasil",
      user: newUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error register" });
  }
};
