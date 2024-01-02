import { axiosFetch } from "./axios";
import { useContext, useEffect, useState } from "react";
import { MyContext } from "./Context";
import { v4 as uuidv4 } from "uuid";

export function checkMissingInputs(inputs) {
  for (const key in inputs) {
    if (!inputs[key]) {
      throw new Error("Please fill out all fields!");
    }
  }
}

export async function useFetchAllEvents(
  page = undefined,
  eventId = undefined,
  userId = undefined
) {
  const { setEvents } = useContext(MyContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let url;

        url = `/getEvents`;

        if (userId) {
          url = `getEvents?userId=${userId}`;
        }

        if (eventId) {
          url = `getEvents?event_id=${eventId}`;
        }

        if (page) {
          url = `getEvents?page=${page}`;
        }

        let data = (await axiosFetch(url)).data["events"];

        const getImages = data.map(async (d) => {
          const response = await fetch(d.image);
          const imageData = await response.text();
          d.image = imageData;
          return d;
        });

        const updatedData = await Promise.all(getImages);
        setEvents(updatedData);
      } catch (error) {
        throw new Error(error.message);
      }
    };
    fetchData();
  }, []);
}

export const useFetchEventsByPage = (page) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const url = `getEvents?page=${page}`;
        let data = await axiosFetch(url);
        setEvents(data.events);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching events:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [page]);

  return { events, loading };
};

export async function getUsers() {
  return new Promise((resolve, reject) => {
    let url = `/admin/users`;
    axiosFetch(url)
      .then(async (response) => {
        const data = response.data;
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export async function getUser(username) {
  return new Promise((resolve, reject) => {
    let url = `/user?username=${username}`;
    axiosFetch(url)
      .then(async (response) => {
        const data = response.data;
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export async function getUserRequests() {
  return new Promise((resolve, reject) => {
    let url = `/admin/users/requests`;
    axiosFetch(url)
      .then(async (response) => {
        const data = response.data;
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export async function getUserEvents(id) {
  return new Promise((resolve, reject) => {
    let url = `/getEvents?user_id=${id}`;
    axiosFetch(url)
      .then(async (response) => {
        const data = response.data;

        const getImages = data.map(async (d) => {
          const response = await fetch(d.image);
          const imageData = await response.text();
          d.image = imageData;
          return d;
        });

        const updatedData = await Promise.all(getImages);
        resolve(updatedData);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export async function getEventById(id) {
  return new Promise((resolve, reject) => {
    let url = `/getEvents?event_id=${id}`;
    axiosFetch(url)
      .then(async (response) => {
        const data = response.data;
        const imageData = await fetch(data.event.image);
        data.event.image = await imageData.text();
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export async function useFetchEventTypes() {
  const { userData, setEventTypes } = useContext(MyContext);
  useEffect(() => {
    async function fetchData() {
      if (userData.privilege != "organizer" && userData.privilege != "admin")
        return;
      try {
        let url =
          userData.privilege == "admin" ? "/admin/event" : "/organizer/event";
        const data = (await axiosFetch(url)).data;
        setEventTypes(data);
      } catch (error) {
        throw new Error(error.message);
      }
    }
    fetchData();
  }, [userData]);
}

export function logout() {
  return new Promise((resolve, reject) => {
    axiosFetch
      .post("/user/logout")
      .then((response) => {
        if (response.status == 200) {
          localStorage.removeItem("userDetails");
          localStorage.removeItem("token");
          resolve(true);
        } else {
          reject(new Error("Logout request failed."));
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}

function uploadToGitHub(pasteCode, filename) {
  return new Promise((resolve, reject) => {
    const owner = "Kuugang";
    const repo = "metroevents-images";
    const filePath = `${filename}.txt`;
    const commitMessage = "Upload image";
    const branch = "main";

    const fileContent = pasteCode;

    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;

    const requestData = {
      message: commitMessage,
      content: btoa(fileContent),
      branch: branch,
    };

    fetch(apiUrl, {
      method: "PUT",
      headers: {
        Authorization: `token ${process.env.REACT_APP_GITHUB_AUTH}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok.");
        }
        return response.json();
      })
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        console.error("Error uploading file:", error);
        reject(error);
      });
  });
}

export function uploadImage(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64data = reader.result;
      let filename = uuidv4();
      let link = `https://raw.githubusercontent.com/Kuugang/metroevents/main/images/${filename}.txt`;

      try {
        await uploadToGitHub(base64data, filename);
        resolve(link);
      } catch (error) {
        console.error("Error uploading to PasteBin:", error);
        resolve(null);
      }
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  });
}

export async function joinEvent(event_id) {
  return new Promise((resolve, reject) => {
    axiosFetch
      .post(`/event/joinEvent?event_id=${event_id}`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export async function leaveEvent(event_id) {
  return new Promise((resolve, reject) => {
    axiosFetch
      .post(`/event/leaveEvent?event_id=${event_id}`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function parseJwt(token) {
  if (!token) return false;
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );
  return JSON.parse(jsonPayload);
}

export function getCookie(cookieName) {
  const cookies = document.cookie.split(";").map((cookie) => cookie.trim());
  for (const cookie of cookies) {
    const [name, value] = cookie.split("=");
    if (name === cookieName) {
      return decodeURIComponent(value);
    }
  }
  return null;
}
