import { useState } from "react";

function ParentDashboard() {

  const [requestStatus, setRequestStatus] = useState("pending");

  const pickupRequest = {
    guardian: "Rahul Sharma",
    relation: "Uncle",
    child: "Aarav Sharma",
    className: "4-B",
    requestedAt: "3:42 PM"
  };

  const handleAccept = () => {
    setRequestStatus("accepted");
  };

  const handleReject = () => {
    setRequestStatus("rejected");
  };

  return (
    <div className="container-fluid bg-light min-vh-100">

      {/* Navbar */}
      <nav className="navbar bg-white shadow-sm px-4">

        <span className="navbar-brand fw-bold">
          🛡️ Safe Handover
        </span>

        <span className="text-muted">
          Parent Dashboard
        </span>

      </nav>


      {/* Main Content */}
      <div className="container py-5">

        <div className="mb-4">
          <h2 className="fw-bold">
            Good afternoon, Mrs. Sharma 👋
          </h2>

          <p className="text-muted">
            Here's what's happening with your child's pickup.
          </p>
        </div>


        {/* Child Card */}
        <div className="card border-0 shadow-sm mb-4">

          <div className="card-body">

            <h5 className="fw-bold">
              👦 Your Child
            </h5>

            <div className="d-flex justify-content-between align-items-center mt-3">

              <div>
                <h5 className="mb-1">
                  Aarav Sharma
                </h5>

                <p className="text-muted mb-0">
                  Class 4-B
                </p>
              </div>

              <span className="badge bg-success">
                Safe
              </span>

            </div>

          </div>

        </div>


        {/* Pickup Request */}
        <div className="card border-0 shadow-sm">

          <div className="card-body">

            <div className="d-flex justify-content-between align-items-center">

              <h5 className="fw-bold mb-0">
                Pickup Request
              </h5>

              {requestStatus === "pending" && (
                <span className="badge bg-warning text-dark">
                  Pending
                </span>
              )}

              {requestStatus === "accepted" && (
                <span className="badge bg-success">
                  Accepted
                </span>
              )}

              {requestStatus === "rejected" && (
                <span className="badge bg-danger">
                  Rejected
                </span>
              )}

            </div>


            <hr />


            <div className="row">

              <div className="col-md-6">

                <p className="mb-2">
                  <strong>Guardian:</strong>{" "}
                  {pickupRequest.guardian}
                </p>

                <p className="mb-2">
                  <strong>Relation:</strong>{" "}
                  {pickupRequest.relation}
                </p>

              </div>


              <div className="col-md-6">

                <p className="mb-2">
                  <strong>Child:</strong>{" "}
                  {pickupRequest.child}
                </p>

                <p className="mb-2">
                  <strong>Requested at:</strong>{" "}
                  {pickupRequest.requestedAt}
                </p>

              </div>

            </div>


            {/* Buttons */}
            {requestStatus === "pending" && (

              <div className="mt-4">

                <button
                  className="btn btn-success me-2 px-4"
                  onClick={handleAccept}
                >
                  ✓ Accept
                </button>

                <button
                  className="btn btn-outline-danger px-4"
                  onClick={handleReject}
                >
                  ✕ Reject
                </button>

              </div>

            )}


            {/* Accepted Message */}
            {requestStatus === "accepted" && (

              <div className="alert alert-success mt-4 mb-0">

                <strong>Pickup approved ✓</strong>

                <br />

                An OTP has been sent to the registered guardian.
              </div>

            )}


            {/* Rejected Message */}
            {requestStatus === "rejected" && (

              <div className="alert alert-danger mt-4 mb-0">

                <strong>Pickup request rejected.</strong>

                <br />

                The guardian has been notified.

              </div>

            )}

          </div>

        </div>

      </div>

    </div>
  );
}

export default ParentDashboard;