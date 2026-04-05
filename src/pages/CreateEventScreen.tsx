import { useState } from "react";

const API_URL = "https://nuttliyzeznbhsecuver.supabase.co/rest/v1/events";
const API_KEY = "sb_publishable_YIYNiS4DtzsmzgRkYeTFjQ_Bxre6pSi";

export default function CreateEventScreen() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [seat, setSeat] = useState(0);
  const [isFree, setIsFree] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name || !date || !location) {
      alert("Nama, tanggal, dan lokasi wajib diisi");
      return;
    }

    if (isFree) {
      setPrice(0);
    } else if (price <= 0) {
      alert("Harga harus lebih dari 0 untuk event berbayar");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: API_KEY,
          Authorization: `Bearer ${API_KEY}`,
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          name,
          price: isFree ? 0 : price,
          date,
          location,
          description,
          available_seats: seat, // 🔥 SUDAH FIX DI SINI
        }),
      });

if (!response.ok) {
  const text = await response.text();
  console.log("ERROR DETAIL:", text); // 🔥 INI PENTING
  throw new Error("Gagal create event");
}

      alert("Event berhasil dibuat!");

      // RESET FORM
      setName("");
      setPrice(0);
      setDate("");
      setLocation("");
      setDescription("");
      setSeat(0);
      setIsFree(true);
    } catch (err) {
      console.log(err);
      alert("Terjadi error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 16 }}>
      <h2>Buat Event</h2>

      <input
        placeholder="Nama Event"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={styles.input}
      />

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        style={styles.input}
      />

      <input
        placeholder="Lokasi"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        style={styles.input}
      />

      <textarea
        placeholder="Deskripsi"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        style={styles.input}
      />

      <input
        type="number"
        placeholder="Jumlah Seat"
        value={seat}
        onChange={(e) => setSeat(Number(e.target.value))}
        style={styles.input}
      />

      <label>
        <input
          type="checkbox"
          checked={isFree}
          onChange={() => setIsFree(!isFree)}
        />
        Free Event
      </label>

      {!isFree && (
        <input
          type="number"
          placeholder="Harga"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          style={styles.input}
        />
      )}

      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Loading..." : "Create Event"}
      </button>
    </div>
  );
}

const styles = {
  input: {
    padding: 10,
    width: "100%",
    marginBottom: 10,
    borderRadius: 8,
    border: "1px solid #ccc",
  },
};