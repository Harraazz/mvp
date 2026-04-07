import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";

const API_URL = "https://nuttliyzeznbhsecuver.supabase.co/rest/v1/events";
const API_KEY = "sb_publishable_YIYNiS4DtzsmzgRkYeTFjQ_Bxre6pSi";
const SUPABASE_URL = "https://nuttliyzeznbhsecuver.supabase.co";

const supabase = createClient(SUPABASE_URL, API_KEY);

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
  const [buying, setBuying] = useState(false);

  const [user, setUser] = useState<any>(null);

  // 🔥 REVIEW STATE
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchUser = async () => {
    const { data } = await supabase.auth.getUser();
    setUser(data.user);
  };

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
    fetchUser();
  }, [id]);

  // 🔥 BELI TIKET
  const handleBuy = async () => {
    if (!event) return;

    if (!user) {
      alert("Kamu harus login dulu");
      return;
    }

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
            p_user_id: user.id,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gagal beli tiket");
      }

      alert("Tiket berhasil dibeli!");
      fetchEventDetail();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setBuying(false);
    }
  };

  // 🔥 SUBMIT REVIEW
  const handleSubmitReview = async () => {
    if (!event) return;

    if (!user) {
      alert("Harus login dulu");
      return;
    }

    try {
      setSubmitting(true);

      const response = await fetch(
        "https://nuttliyzeznbhsecuver.supabase.co/rest/v1/reviews",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: API_KEY,
            Authorization: `Bearer ${API_KEY}`,
            Prefer: "return=minimal",
          },
          body: JSON.stringify({
            user_id: user.id,
            event_id: event.id,
            rating,
            comment,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Gagal kirim review");
      }

      alert("Review berhasil dikirim!");
      setRating(5);
      setComment("");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!event) return <p>Event tidak ditemukan</p>;

  // 🔥 CEK EVENT SUDAH SELESAI
  const isEventFinished = new Date(event.date) < new Date();

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

      {/* 🎟️ BELI */}
      <button
        style={styles.button}
        onClick={handleBuy}
        disabled={buying}
      >
        {buying ? "Processing..." : "Beli Tiket"}
      </button>

      {/* ⭐ REVIEW */}
      {isEventFinished && (
        <>
          <hr style={{ marginTop: 30 }} />

          <h3>Kasih Review</h3>

          <input
            type="number"
            min="1"
            max="5"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            style={styles.input}
          />

          <textarea
            placeholder="Tulis komentar..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            style={styles.input}
          />

          <button onClick={handleSubmitReview} disabled={submitting}>
            {submitting ? "Mengirim..." : "Kirim Review"}
          </button>
        </>
      )}
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
  input: {
    padding: 10,
    width: "100%",
    marginBottom: 10,
    borderRadius: 8,
    border: "1px solid #ccc",
  },
};