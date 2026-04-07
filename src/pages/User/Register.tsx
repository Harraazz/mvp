import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [full_name, setName] = useState("");
  const [referral_code, setReferralCode] = useState("");

  const handleRegister = async () => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    const userId = data?.user?.id ?? data?.session?.user?.id;
    if (!userId) {
      alert(
        "Register berhasil, tetapi user belum tersedia. Silakan cek email konfirmasi Anda.",
      );
      return;
    }

    const { error: profileError } = await supabase.from("profiles").insert({
      id: userId,
      full_name,
      role: "customer",
      referral_code: Math.random().toString(36).substring(2, 8).toUpperCase(),
    });

    if (profileError) {
      alert(`Profile gagal disimpan: ${profileError.message}`);
      return;
    }

    if (referral_code) {
      // cari user yang punya kode itu
      const { data: refUser, error: refError } = await supabase
        .from("profiles")
        .select("id")
        .eq("referral_code", referral_code)
        .single();

      if (refError || !refUser) {
        alert("Referral code tidak valid");
        return;
      }

      // simpan ke table referrals
      const { error: insertRefError } = await supabase
        .from("referrals")
        .insert({
          referrer_id: refUser.id, // yang ngajak
          referee_id: userId, // yang daftar
          points_earned: 10000, // bebas (logic kamu)
          expires_at: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // contoh 90 hari
        });

      if (refUser.id === userId) {
        alert("Anda tidak bisa menggunakan kode referral sendiri");
      }

      if (insertRefError) {
        alert("Gagal simpan referral");
        return;
      }
    }

    alert("Register sukses!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Register</h1>

        <input
          type="text"
          placeholder="Name"
          className="w-full border p-2 rounded mb-3"
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 rounded mb-3"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 rounded mb-4"
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="referral_code"
          placeholder="Referral Code"
          className="w-full border p-2 rounded mb-4"
          onChange={(e) => setReferralCode(e.target.value)}
        />

        <button
          onClick={handleRegister}
          className="w-full bg-blue-500 text-white p-2 rounded">
          Register
        </button>
      </div>
    </div>
  );
}
