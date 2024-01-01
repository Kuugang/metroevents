export default function OrganizerRequests({ handleAcceptOrganizerRequst, handleRejectOrganizerRequest, organizerRequests }) {
  return (
    <div className="w-full">
      <h1 className="text-center font-bold text-xl">Organizer Requests</h1>

      {(organizerRequests && organizerRequests.length > 0) ?(
        <div>
          {organizerRequests.map((r) => {
            return (
              <div
                id={r.id}
                key={r.id}
                className="flex flex-row gap-5 items-end w-full border items-center justify-center p-4"
              >
                <div className="flex flex-row items-start gap-3 justify-between">
                  <div className="flex flex-col items-start justify-end">
                    <div className="flex flex-row gap-2">
                      <h1 className="text-sm font-thin">Name: </h1>
                      <h1 className="text-sm font-normal">{r.firstname}</h1>
                      <h1 className="text-sm font-normal">{r.lastname}</h1>
                    </div>
                  </div>

                  <div className="flex flex-col items-start justify-end">
                    <div className="flex flex-row gap-2">
                      <h1 className="text-sm font-thin">Username: </h1>
                      <h1 className="text-sm font-normal">{r.username}</h1>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-start justify-end">
                  <div className="flex flex-row gap-2 items-end">
                    <h1 className="text-sm font-thin">Message: </h1>
                    <h1 className="text-sm font-normal">{r.message}</h1>
                  </div>
                </div>

                <div className="flex flex-row">
                  <button onClick={() => handleAcceptOrganizerRequst(r)}>Accept</button>
                  <button onClick={() => handleRejectOrganizerRequest(r)}>Reject</button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-center">Nothing here yet</p>
      )}
    </div>
  );
}
