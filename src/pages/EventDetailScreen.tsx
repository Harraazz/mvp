import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const API_URL = "https://nuttliyzeznbhsecuver.supabase.co/rest/v1/events";
const API_KEY = "sb_publishable_YIYNiS4DtzsmzgRkYeTFjQ_Bxre6pSi";

interface Event {
  id: string;
  name: string;
  description: string;
  location: string;
  price: number;
  date: string;
  available_seats: number;
}

export default function EventDetailScreen() {
  const { id } = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState(false); // 🔥 TAMBAHAN

  const fetchEventDetail = async () => {
    try {
      const response = await fetch(`${API_URL}?id=eq.${id}`, {
        headers: {
          apikey: API_KEY,
          Authorization: `Bearer ${API_KEY}`,
        },
      });

      const data = await response.json();

      if (Array.isArray(data) && data.length > 0) {
        setEvent(data[0]);
      }
    } catch (error) {
      console.log("ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventDetail();
  }, [id]);

  // 🔥 HANDLE BUY TIKET
  const handleBuy = async () => {
    if (!event) return;

    try {
      setBuying(true);

      const response = await fetch(
        "https://nuttliyzeznbhsecuver.supabase.co/rest/v1/rpc/buy_ticket",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: API_KEY,
            Authorization: `Bearer ${API_KEY}`,
          },
          body: JSON.stringify({
            p_event_id: event.id,
            p_quantity: 1,
            p_user_id: "11111111-1111-1111-1111-111111111111"
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gagal beli tiket");
      }

      alert("Tiket berhasil dibeli!");

      // 🔄 refresh data biar seat update
      fetchEventDetail();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setBuying(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!event) return <p>Event tidak ditemukan</p>;

  return (
    <div style={styles.container}>
      <h2>{event.name}</h2>

      <p><b>Tanggal:</b> {event.date}</p>
      <p><b>Lokasi:</b> {event.location}</p>
      <p><b>Harga:</b> Rp {event.price}</p>
      <p><b>Sisa Kursi:</b> {event.available_seats}</p>

      <p style={{ marginTop: 10 }}>
        <b>Deskripsi:</b> {event.description}
      </p>

      {/* 🎟️ BUTTON BELI */}
      <button
        style={styles.button}
        onClick={handleBuy} // 🔥 INI YANG DITAMBAH
        disabled={buying}
      >
        {buying ? "Processing..." : "Beli Tiket"}
      </button>
    </div>
  );
}

const styles = {
  container: {
    padding: 20,
  },
  button: {
    marginTop: 20,
    padding: 12,
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
  },
};