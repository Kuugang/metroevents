export default function Users({ users, handleUpdateUserPrivilege }) {
  return (
    <div className="">
      {users && users.length > 0 && (
        <div className="w-full flex flex-col items-center">
          <h1 className="font-bold mb-2 text-2xl">Users</h1>
          {users.map((u) => {
            return (
              <form
                onSubmit={(event) => handleUpdateUserPrivilege(event, u.id)}
                key={u.id}
                id={u.id}
                className="border border-white flex flex-row justify-between w-[60%]"
              >
                <div className="flex flex-row items-gap-2 justify-between w-[30%]">
                  <div className="flex flex-col items-start justify-end">
                    <div className="flex flex-row gap-2">
                      <h1 className="text-sm font-thin">Name: </h1>
                      <h1 className="text-sm font-normal">{u.firstname}</h1>
                      <h1 className="text-sm font-normal">{u.lastname}</h1>
                    </div>
                  </div>

                  <div className="flex flex-col items-start justify-end">
                    <div className="flex flex-row gap-2">
                      <h1 className="text-sm font-thin">Username: </h1>
                      <h1 className="text-sm font-normal">{u.username}</h1>
                    </div>
                  </div>
                </div>

                <div>
                  <select name="privilege" className="text-black">
                    <option value="user" selected={u.privilege === "user"}>
                      User
                    </option>
                    <option
                      value="organizer"
                      selected={u.privilege === "organizer"}
                    >
                      Organizer
                    </option>
                  </select>

                  <button>Save</button>
                </div>
              </form>
            );
          })}
        </div>
      )}
    </div>
  );
}
