import { Link, useNavigate } from "react-router-dom";
import { MyContext } from "../utils/Context";
import { useContext, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { getCookie } from "../utils/helper";

export default function Dashboard() {
  const navigate = useNavigate();
  const { isLoggedIn, setIsLoggedIn, setUserDetails, events } = useContext(MyContext);

  useEffect(() => {
    try {
      if (
        jwtDecode(getCookie("auth")).privilege != null &&
        isLoggedIn == false
      ) {
        setIsLoggedIn(true)
        setUserDetails(JSON.parse(localStorage.getItem("userDetails")));
      }
    } catch (error) {
      navigate("/");
    }
  }, [isLoggedIn]);


  return (
    <div className="w-full">
      {(events.length > 0) ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {events.map((event) => {
            return (
              <Link
                key={event.id}
                id={event.id}
                to={`/event/${event.id}`}
                className="cursor-pointer flex flex-col border bg-black rounded justify-center h-[200px] w-[300px] whitespace-normal p-3"
              >
                <div className="h-[85%]">
                  <img
                    loading="lazy"
                    className="object-contain w-full h-full rounded"
                    src={event.image}
                    alt="Event Image"
                  />
                </div>

                <div
                  className={`${
                    event.is_cancelled ? "line-through text-red-500" : ""
                  } text-center`}
                >
                  <h1 className="font-bold text-md">{event.title}</h1>
                  <h1 className="font-light text-base">{event.type} event</h1>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="w-screen h-screen flex justify-center items-center">
          <p>Getting Events</p>
        </div>
      )}
    </div>
  );
}
