import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [full_name, setName] = useState("");

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
    });

    if (profileError) {
      alert(`Profile gagal disimpan: ${profileError.message}`);
      return;
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

        <button
          onClick={handleRegister}
          className="w-full bg-blue-500 text-white p-2 rounded">
          Register
        </button>
      </div>
    </div>
  );
}
