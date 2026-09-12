function Login() {
  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light">

      <div className="card shadow border-0 p-4" style={{ maxWidth: "420px", width: "100%" }}>

        <div className="text-center mb-4">
          <h2 className="fw-bold">Safe Handover</h2>
          <p className="text-muted">
            Your Trust Matters.
          </p>
        </div>

        <div className="mb-3">
          <label className="form-label">Email / Mobile</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter your email or mobile"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            placeholder="Enter password"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Login as</label>

          <select className="form-select">
            <option>Parent</option>
            <option>Guardian</option>
            <option>Staff</option>
          </select>
        </div>

        <button className="btn btn-primary w-100">
          Login
        </button>

      </div>

    </div>
  );
}

export default Login;