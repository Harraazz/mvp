import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "https://nuttliyzeznbhsecuver.supabase.co/rest/v1/events";
const API_KEY = "sb_publishable_YIYNiS4DtzsmzgRkYeTFjQ_Bxre6pSi";

interface Event {
  id: string;
  name: string;
  location: string;
  price: number;
  category?: string;
}

export default function EventListScreen() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");

  const [page, setPage] = useState(0);
  const limit = 5;
  const [hasMore, setHasMore] = useState(true);

  const navigate = useNavigate();

  const fetchEvents = async (reset = false) => {
    try {
      setLoading(true);

      let url = `${API_URL}?limit=${limit}&offset=${page * limit}`;

      if (search) {
        url += `&name=ilike.*${search}*`;
      }

      if (location) {
        url += `&location=ilike.*${location}*`;
      }

      if (category) {
        url += `&category=eq.${category}`;
      }

      const response = await fetch(url, {
        headers: {
          apikey: API_KEY,
          Authorization: `Bearer ${API_KEY}`,
        },
      });

      const data = await response.json();

      if (Array.isArray(data)) {
        if (reset) {
          setEvents(data);
        } else {
          setEvents((prev) => [...prev, ...data]);
        }

        if (data.length < limit) {
          setHasMore(false);
        }
      } else {
        setEvents([]);
      }
    } catch (error) {
      console.log("ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      setPage(0);
      setHasMore(true);
      fetchEvents(true);
    }, 500);

    return () => clearTimeout(delay);
  }, [search, location, category]);

  useEffect(() => {
    if (page === 0) return;
    fetchEvents();
  }, [page]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 100 &&
        !loading &&
        hasMore
      ) {
        setPage((prev) => prev + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore]);

  return (
    <div style={{ padding: 16 }}>

      {/* 🔥 BUTTON CREATE EVENT */}
      <button
        onClick={() => navigate("/create")}
        style={styles.createButton}
      >
        + Buat Event
      </button>

      {/* 🔍 SEARCH */}
      <input
        type="text"
        placeholder="Cari event..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={styles.input}
      />

      {/* 📍 FILTER LOCATION */}
      <input
        type="text"
        placeholder="Filter lokasi..."
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        style={styles.input}
      />

      {/* 🏷️ FILTER CATEGORY */}
      <input
        type="text"
        placeholder="Filter kategori..."
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        style={styles.input}
      />

      {/* 🔄 Loading */}
      {loading && <p>Loading...</p>}

      {/* ❌ Empty */}
      {!loading && events.length === 0 && (
        <p>Event tidak ditemukan</p>
      )}

      {/* 📋 List */}
      {events.map((item) => (
        <div
          key={item.id}
          style={styles.card}
          onClick={() => navigate(`/event/${item.id}`)}
        >
          <h3 style={styles.title}>{item.name}</h3>
          <p>{item.location}</p>
          <p>Rp {item.price}</p>
        </div>
      ))}

      {/* 🔽 Loading more */}
      {loading && page > 0 && <p>Loading more...</p>}
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
  card: {
    padding: 16,
    marginBottom: 12,
    backgroundColor: "#fff",
    borderRadius: 10,
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    cursor: "pointer",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },

  // 🔥 STYLE BUTTON
  createButton: {
    padding: 12,
    width: "100%",
    marginBottom: 16,
    borderRadius: 10,
    border: "none",
    backgroundColor: "#4CAF50",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
  },
 
};