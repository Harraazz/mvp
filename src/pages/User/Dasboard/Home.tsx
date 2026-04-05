import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserData = async () => {
      // ambil user auth
      const { data: userData } = await supabase.auth.getUser();
      const currentUser = userData.user;

      if (!currentUser) {
        window.location.href = "/login";
        return;
      }

      setUser(currentUser);

      // ambil profile dari database
      const { data: profileData, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", currentUser.id)
        .single();

      if (error) {
        console.log("PROFILE ERROR:", error.message);
      }

      setProfile(profileData);
      setLoading(false);
    };

    getUserData();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Home</h1>

      {/* USER DATA */}
      <div className="mb-4">
        <h2 className="font-semibold">User:</h2>
        <p>ID: {user?.id}</p>
        <p>Email: {user?.email}</p>
      </div>

      {/* PROFILE DATA */}
      <div>
        <h2 className="font-semibold">Profile:</h2>
        <p>Nama: {profile?.full_name}</p>
        <p>Role: {profile?.role}</p>
      </div>
    </div>
  );
}
