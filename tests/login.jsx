<?php
  if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST["username"];
    $password = $_POST["password"];

    if ($username === "admin" && $password === "password") {
      setcookie("userLogin", $username, time() + (86400 * 30), "/");
      
      header("Location: " . $_SERVER["PHP_SELF"]);
      exit();
    } else {
      $error = "Invalid username or password";
    }
  }
?>

export default function Todo() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const cookies = document.cookie.split(";");
    for (let cookie of cookies) {
      const [name, value] = cookie.trim().split("=");
      if (name === "userLogin") {
        setIsLoggedIn(true);
        break;
      }
    }
  }, []);

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        margin: 0,
        padding: 0,
        minHeight: "100vh",
      }}
    >
      {isLoggedIn ? <Dashboard /> : <Login />}
    </div>
  );
}

function Login() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "linear-gradient(135deg, #6e8efb, #a777e3)",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "10px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
          padding: "40px",
          width: "400px",
          maxWidth: "90%",
        }}
      >
        <h1
          style={{
            color: "#333",
            textAlign: "center",
            marginBottom: "30px",
            fontSize: "28px",
          }}
        >
          Dashboard Login
        </h1>

        <form
          method="POST"
          style={{ display: "flex", flexDirection: "column" }}
        >
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                color: "#555",
                fontSize: "14px",
                fontWeight: "bold",
              }}
            >
              Username
            </label>
            <input
              type="text"
              name="username"
              required
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "16px",
              }}
            />
          </div>

          <div style={{ marginBottom: "30px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                color: "#555",
                fontSize: "14px",
                fontWeight: "bold",
              }}
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "16px",
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              backgroundColor: "#6e8efb",
              color: "white",
              padding: "14px",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "bold",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 6px rgba(50, 50, 93, 0.11)",
            }}
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}

function Dashboard() {
  return (
    <div
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      {/* Header */}
      <header
        style={{
          backgroundColor: "#3a4b5c",
          color: "white",
          padding: "15px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
        }}
      >
        <h1 style={{ margin: 0, fontSize: "24px" }}>Admin Dashboard</h1>
        <button
          style={{
            backgroundColor: "transparent",
            color: "white",
            border: "1px solid white",
            padding: "8px 16px",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </header>

      <div style={{ display: "flex", flex: 1 }}>
        {/* Sidebar */}
        <aside
          style={{
            width: "220px",
            backgroundColor: "#2c3e50",
            color: "white",
            padding: "20px 0",
          }}
        >
          <nav>
            <ul style={{ listStyleType: "none", padding: 0, margin: 0 }}>
              <li
                style={{
                  padding: "12px 20px",
                  borderBottom: "1px solid #34495e",
                  cursor: "pointer",
                }}
              >
                Dashboard
              </li>
              <li
                style={{
                  padding: "12px 20px",
                  borderBottom: "1px solid #34495e",
                  cursor: "pointer",
                }}
              >
                Analytics
              </li>
              <li
                style={{
                  padding: "12px 20px",
                  borderBottom: "1px solid #34495e",
                  cursor: "pointer",
                }}
              >
                Users
              </li>
              <li
                style={{
                  padding: "12px 20px",
                  borderBottom: "1px solid #34495e",
                  cursor: "pointer",
                }}
              >
                Settings
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main style={{ flex: 1, padding: "30px", backgroundColor: "#f5f7fa" }}>
          <h2 style={{ color: "#2c3e50", marginTop: 0, marginBottom: "25px" }}>
            Dashboard Overview
          </h2>

          {/* Stat Cards */}
          <div
            style={{
              display: "flex",
              gap: "20px",
              marginBottom: "30px",
              flexWrap: "wrap",
            }}
          >
            {["Users", "Revenue", "Orders", "Visits"].map((item, index) => (
              <div
                key={index}
                style={{
                  flex: "1 1 200px",
                  backgroundColor: "white",
                  borderRadius: "8px",
                  padding: "20px",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
                }}
              >
                <h3 style={{ color: "#3a4b5c", marginTop: 0 }}>{item}</h3>
                <p
                  style={{
                    fontSize: "28px",
                    fontWeight: "bold",
                    margin: "10px 0",
                  }}
                >
                  {index === 0
                    ? "1,234"
                    : index === 1
                    ? "₹8,765"
                    : index === 2
                    ? "432"
                    : "5,310"}
                </p>
              </div>
            ))}
          </div>

          {/* Recent Activity Table */}
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "8px",
              padding: "20px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
            }}
          >
            <h3 style={{ color: "#3a4b5c", marginTop: 0 }}>Recent Activity</h3>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#f8f9fa" }}>
                  <th
                    style={{
                      textAlign: "left",
                      padding: "12px 15px",
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    User
                  </th>
                  <th
                    style={{
                      textAlign: "left",
                      padding: "12px 15px",
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    Activity
                  </th>
                  <th
                    style={{
                      textAlign: "left",
                      padding: "12px 15px",
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    Time
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    user: "Shrehan Raj Singh",
                    activity: "Created a new order",
                    time: "2 minutes ago",
                  },
                  {
                    user: "Shrehan Raj Singh",
                    activity: "Updated profile",
                    time: "15 minutes ago",
                  },
                  {
                    user: "Harsh Raj Dubey",
                    activity: "Completed payment",
                    time: "1 hour ago",
                  },
                ].map((row, index) => (
                  <tr key={index}>
                    <td
                      style={{
                        padding: "12px 15px",
                        borderBottom: "1px solid #eee",
                      }}
                    >
                      {row.user}
                    </td>
                    <td
                      style={{
                        padding: "12px 15px",
                        borderBottom: "1px solid #eee",
                      }}
                    >
                      {row.activity}
                    </td>
                    <td
                      style={{
                        padding: "12px 15px",
                        borderBottom: "1px solid #eee",
                      }}
                    >
                      {row.time}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      <footer
        style={{
          backgroundColor: "#3a4b5c",
          color: "white",
          padding: "15px",
          textAlign: "center",
        }}
      >
        <p style={{ margin: 0 }}>© 2025 Dashboard. All rights reserved.</p>
      </footer>
    </div>
  );
}
